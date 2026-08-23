import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import {
  battleParticipantsTable,
  battlesTable,
  battleVotesTable,
  db,
  paymentsTable,
  productsTable,
  usersTable,
  votesTable,
  webhookEventsTable,
} from "@workspace/db";
import {
  CreateBattleCheckoutBody,
  CreateBattleCheckoutResponse,
  CreateBattleBody,
  CreateBattleResponse,
  CreateCheckoutBody,
  CreateCheckoutResponse,
  CreateProductBody,
  CreateProductResponse,
  GetCreatorDashboardResponse,
  GetBattleParams,
  GetBattleResponse,
  GetPaymentParams,
  GetPaymentResponse,
  GetProductParams,
  GetProductResponse,
  GetRankingsResponse,
  ListProductsQueryParams,
  ListProductsResponse,
  ListBattlesResponse,
  ListTransactionsResponse,
  UpdateProductStatusBody,
  UpdateProductStatusParams,
} from "@workspace/api-zod";
import { getUncachableStripeClient } from "../stripeClient";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const DISCLOSURE =
  "This $0.99 community rating is non-refundable. It is not investment advice, an endorsement, a securities transaction, or a guarantee of a company's performance.";
const BATTLE_DISCLOSURE =
  "This $0.99 community battle vote is non-refundable. It records a community opinion only; it is not investment advice, a YC endorsement, a securities transaction, or a performance guarantee.";
const battlePaymentsEnabled = process.env.ENABLE_BATTLE_PAYMENTS === "true";
const voteLimits = new Map<string, { count: number; resetAt: number }>();
const ratingAverage = sql`CASE WHEN ${productsTable.ratingCount} > 0 THEN ${productsTable.ratingSum}::numeric / ${productsTable.ratingCount} ELSE 0 END`;

type AuthedRequest = Request & { userId?: string };

function currentUserId(req: Request): string | null {
  const auth = getAuth(req);
  return auth?.userId ?? null;
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const userId = currentUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Sign in required." });
    return;
  }
  (req as AuthedRequest).userId = userId;
  next();
}

function rateLimit(req: Request, res: Response, next: NextFunction): void {
  const key = `${currentUserId(req) ?? req.ip ?? "unknown"}:${req.path}`;
  const now = Date.now();
  const record = voteLimits.get(key);
  if (!record || record.resetAt < now) {
    voteLimits.set(key, { count: 1, resetAt: now + 60_000 });
    next();
    return;
  }
  if (record.count >= 12) {
    res.status(429).json({ error: "Please wait a moment before trying again." });
    return;
  }
  record.count += 1;
  next();
}

function toProduct(row: typeof productsTable.$inferSelect) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.shortDescription,
    description: row.description,
    imageUrl: row.imageUrl,
    category: row.category,
    ycBatch: row.ycBatch,
    websiteUrl: row.websiteUrl,
    location: row.location,
    creatorName: row.creatorName,
    creatorId: row.creatorId,
    voteCount: row.ratingCount,
    ratingAverage: row.ratingCount > 0 ? Number((row.ratingSum / row.ratingCount).toFixed(1)) : 0,
    totalRaised: Number(row.totalRaised),
    status: row.status,
    featured: row.featured,
    createdAt: row.createdAt,
  };
}

async function ensureUser(userId: string) {
  const [user] = await db
    .insert(usersTable)
    .values({ id: userId })
    .onConflictDoUpdate({ target: usersTable.id, set: { id: userId } })
    .returning();
  return user;
}

function toBattleParticipant(row: typeof battleParticipantsTable.$inferSelect) {
  return {
    id: row.id,
    productId: row.productId,
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    description: row.description,
    imageUrl: row.imageUrl,
    websiteUrl: row.websiteUrl,
    ycBatch: row.ycBatch,
    category: row.category,
    location: row.location,
    isYcCompany: row.isYcCompany,
  };
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

async function getPublicBattleViews() {
  const [battleRows, participantRows, voteRows] = await Promise.all([
    db.select().from(battlesTable).orderBy(desc(battlesTable.createdAt)),
    db.select().from(battleParticipantsTable),
    db.select({ battleId: battleVotesTable.battleId, participantId: battleVotesTable.participantId }).from(battleVotesTable),
  ]);
  const participants = new Map(participantRows.map((participant) => [participant.id, participant]));
  const counts = new Map<string, number>();
  for (const vote of voteRows) {
    const key = `${vote.battleId}:${vote.participantId}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return battleRows.flatMap((battle) => {
    if (battle.status !== "active" && battle.status !== "completed") {
      return [];
    }
    const participantA = participants.get(battle.participantAId);
    const participantB = participants.get(battle.participantBId);
    if (!participantA || !participantB) {
      logger.warn({ battleId: battle.id }, "Battle has missing participant data");
      return [];
    }
    const participantAVotes = counts.get(`${battle.id}:${participantA.id}`) ?? 0;
    const participantBVotes = counts.get(`${battle.id}:${participantB.id}`) ?? 0;
    const totalVotes = participantAVotes + participantBVotes;
    return [
      {
        id: battle.id,
        slug: battle.slug,
        title: battle.title,
        description: battle.description,
        category: battle.category,
        participantA: toBattleParticipant(participantA),
        participantB: toBattleParticipant(participantB),
        participantAVotes,
        participantBVotes,
        totalVotes,
        participantAPercentage: totalVotes ? Math.round((participantAVotes / totalVotes) * 100) : 50,
        participantBPercentage: totalVotes ? Math.round((participantBVotes / totalVotes) * 100) : 50,
        status: battle.status,
        winnerParticipantId: battle.winnerParticipantId,
        createdAt: battle.createdAt,
      },
    ];
  });
}

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, category, sort } = parsed.data;
  const filters = [eq(productsTable.status, "published")];
  if (category && category !== "all") filters.push(eq(productsTable.category, category));
  if (search) {
    filters.push(
      or(
        ilike(productsTable.title, `%${search}%`),
        ilike(productsTable.shortDescription, `%${search}%`),
        ilike(productsTable.ycBatch, `%${search}%`),
        ilike(productsTable.location, `%${search}%`),
      )!,
    );
  }
  const orderBy =
    sort === "newest"
      ? desc(productsTable.createdAt)
        : sort === "community"
          ? desc(productsTable.ratingCount)
          : desc(sql`${productsTable.ratingCount} * 0.7 + ${productsTable.totalRaised} * 0.3`);
  const rows = await db.select().from(productsTable).where(and(...filters)).orderBy(orderBy);
  res.json(ListProductsResponse.parse(rows.map(toProduct)));
});

router.post("/products", requireAuth, rateLimit, async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const userId = (req as AuthedRequest).userId!;
  await ensureUser(userId);
  const slug = `${parsed.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
  const [row] = await db
    .insert(productsTable)
    .values({
      id: crypto.randomUUID(),
      slug,
      ...parsed.data,
      creatorId: userId,
      creatorName: "New creator",
    })
    .returning();
  res.status(201).json(CreateProductResponse.parse(toProduct(row)));
});

router.get("/products/:slug", async (req, res): Promise<void> => {
  const parsed = GetProductParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(productsTable)
    .where(and(eq(productsTable.slug, parsed.data.slug), eq(productsTable.status, "published")));
  if (!row) {
    res.status(404).json({ error: "Company not found." });
    return;
  }
  res.json(GetProductResponse.parse(toProduct(row)));
});

router.patch("/products/:id/status", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateProductStatusParams.safeParse(req.params);
  const body = UpdateProductStatusBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid status update." });
    return;
  }
  const userId = (req as AuthedRequest).userId!;
  const [existing] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!existing || existing.creatorId !== userId) {
    res.status(403).json({ error: "You can only manage your own company profiles." });
    return;
  }
  if (existing.status === "pending") {
    res.status(409).json({ error: "This company profile is awaiting moderation and cannot be changed yet." });
    return;
  }
  if (existing.status === "published" && body.data.status !== "paused") {
    res.status(409).json({ error: "Published profiles can only be paused by their owner." });
    return;
  }
  if (existing.status === "paused" && body.data.status !== "pending") {
    res.status(409).json({ error: "Paused profiles can only be returned for review." });
    return;
  }
  const [row] = await db
    .update(productsTable)
    .set({ status: body.data.status })
    .where(eq(productsTable.id, params.data.id))
    .returning();
  res.json(GetProductResponse.parse(toProduct(row)));
});

router.get("/rankings", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.status, "published"))
    .orderBy(desc(ratingAverage), desc(productsTable.ratingCount))
    .limit(5);
  res.json(GetRankingsResponse.parse(rows.map((product, index) => ({ rank: index + 1, product: toProduct(product) }))));
});

router.get("/creator/dashboard", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as AuthedRequest).userId!;
  const rows = await db.select().from(productsTable).where(eq(productsTable.creatorId, userId)).orderBy(desc(productsTable.createdAt));
  const totalVotes = rows.reduce((sum, row) => sum + row.ratingCount, 0);
  const totalRaised = rows.reduce((sum, row) => sum + Number(row.totalRaised), 0);
  res.json(
    GetCreatorDashboardResponse.parse({
      totalVotes,
      totalRaised,
      publishedCount: rows.filter((row) => row.status === "published").length,
      pendingCount: rows.filter((row) => row.status === "pending").length,
      products: rows.map(toProduct),
    }),
  );
});

router.get("/transactions", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as AuthedRequest).userId!;
  const rows = await db
    .select({
      payment: paymentsTable,
      productTitle: productsTable.title,
      battleTitle: battlesTable.title,
      selectedParticipantName: battleParticipantsTable.name,
    })
    .from(paymentsTable)
    .leftJoin(productsTable, eq(paymentsTable.productId, productsTable.id))
    .leftJoin(battlesTable, eq(paymentsTable.battleId, battlesTable.id))
    .leftJoin(battleParticipantsTable, eq(paymentsTable.selectedParticipantId, battleParticipantsTable.id))
    .where(eq(paymentsTable.userId, userId))
    .orderBy(desc(paymentsTable.createdAt));
  res.json(
    ListTransactionsResponse.parse(
      rows.map(({ payment, productTitle, battleTitle, selectedParticipantName }) => ({
        id: payment.id,
        productId: payment.productId,
        productTitle: productTitle ?? null,
        amount: Number(payment.amount),
        rating: payment.rating > 0 ? payment.rating : null,
        status: payment.status,
        disclosure: payment.disclosure,
        receiptUrl: payment.receiptUrl,
        createdAt: payment.createdAt,
        kind: payment.battleId ? "battle" : "rating",
        battleId: payment.battleId,
        battleTitle: battleTitle ?? null,
        selectedParticipantName: selectedParticipantName ?? null,
      })),
    ),
  );
});

router.get("/battles", async (_req, res): Promise<void> => {
  const battles = await getPublicBattleViews();
  res.json(ListBattlesResponse.parse(battles));
});

router.post("/battles", requireAuth, rateLimit, async (req, res): Promise<void> => {
  const parsed = CreateBattleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = (req as AuthedRequest).userId!;
  await ensureUser(userId);

  const { description, participantA, participantB } = parsed.data;
  const battleId = crypto.randomUUID();
  const participantAId = crypto.randomUUID();
  const participantBId = crypto.randomUUID();
  const timestamp = Date.now().toString(36);
  const battleSlug = `${slugify(`${participantA.name}-vs-${participantB.name}`)}-${timestamp}`;

  await db.transaction(async (tx) => {
    await tx.insert(battleParticipantsTable).values([
      {
        id: participantAId,
        slug: `${slugify(participantA.name)}-${timestamp}-a`,
        name: participantA.name,
        shortDescription: participantA.shortDescription,
        description: participantA.description,
        websiteUrl: participantA.websiteUrl,
        ycBatch: participantA.ycBatch ?? null,
        category: participantA.category,
        location: participantA.location,
        isYcCompany: participantA.isYcCompany,
      },
      {
        id: participantBId,
        slug: `${slugify(participantB.name)}-${timestamp}-b`,
        name: participantB.name,
        shortDescription: participantB.shortDescription,
        description: participantB.description,
        websiteUrl: participantB.websiteUrl,
        ycBatch: participantB.ycBatch ?? null,
        category: participantB.category,
        location: participantB.location,
        isYcCompany: participantB.isYcCompany,
      },
    ]);
    await tx.insert(battlesTable).values({
      id: battleId,
      slug: battleSlug,
      title: `${participantA.name} vs. ${participantB.name}`,
      description,
        category: participantA.category,
      participantAId,
      participantBId,
      status: "pending",
    });
  });

  res.status(201).json(
    CreateBattleResponse.parse({
      id: battleId,
      slug: battleSlug,
      title: `${participantA.name} vs. ${participantB.name}`,
      status: "pending",
      createdAt: new Date(),
    }),
  );
});

router.get("/battles/:slug", async (req, res): Promise<void> => {
  const params = GetBattleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const battles = await getPublicBattleViews();
  const battle = battles.find((item) => item.slug === params.data.slug);
  if (!battle) {
    res.status(404).json({ error: "Battle not found." });
    return;
  }
  res.json(GetBattleResponse.parse(battle));
});

router.post("/battle-checkout", rateLimit, async (req, res): Promise<void> => {
  if (!battlePaymentsEnabled) {
    res.status(503).json({ error: "Battle voting is not open yet." });
    return;
  }
  const parsed = CreateBattleCheckoutBody.safeParse(req.body);
  if (!parsed.success || parsed.data.disclosureAccepted !== true) {
    res.status(400).json({ error: "You must accept the battle vote disclosure before checkout." });
    return;
  }
  const userId = currentUserId(req);
  const [battle] = await db
    .select()
    .from(battlesTable)
    .where(and(eq(battlesTable.id, parsed.data.battleId), eq(battlesTable.status, "active")));
  if (!battle) {
    res.status(404).json({ error: "Active battle not found." });
    return;
  }
  const participantRows = await db
    .select()
    .from(battleParticipantsTable)
    .where(or(eq(battleParticipantsTable.id, battle.participantAId), eq(battleParticipantsTable.id, battle.participantBId)));
  const selectedParticipant = participantRows.find((participant) => participant.id === parsed.data.participantId);
  const linkedProductId = participantRows.find((participant) => participant.productId)?.productId ?? null;
  if (!selectedParticipant) {
    res.status(400).json({ error: "That side is not available for this battle." });
    return;
  }
  if (userId) await ensureUser(userId);
  const [existingReservation] = userId
    ? await db
        .select()
        .from(paymentsTable)
        .where(
          and(
            eq(paymentsTable.userId, userId),
            eq(paymentsTable.battleId, battle.id),
            eq(paymentsTable.status, "pending"),
          ),
        )
    : [];
  if (existingReservation) {
    const reservationAgeMs = Date.now() - existingReservation.createdAt.getTime();
    if (reservationAgeMs < 31 * 60 * 1000 || !existingReservation.stripeCheckoutSessionId) {
      res.status(409).json({ error: "You already have a battle vote checkout in progress." });
      return;
    }
    try {
      const stripe = await getUncachableStripeClient();
      const existingSession = await stripe.checkout.sessions.retrieve(existingReservation.stripeCheckoutSessionId);
      if (existingSession.status !== "expired") {
        res.status(409).json({ error: "Your existing battle checkout is still being processed." });
        return;
      }
      await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.id, existingReservation.id));
    } catch (error) {
      logger.error({ err: error, paymentId: existingReservation.id }, "Unable to reconcile an expired battle Checkout reservation");
      res.status(503).json({ error: "We could not verify your previous checkout. Please try again shortly." });
      return;
    }
  }
  const paymentId = crypto.randomUUID();
  const [pendingPayment] = await db
    .insert(paymentsTable)
    .values({
      id: paymentId,
      userId,
      productId: linkedProductId,
      battleId: battle.id,
      selectedParticipantId: selectedParticipant.id,
      amount: "0.99",
      rating: 0,
      status: "pending",
      disclosure: BATTLE_DISCLOSURE,
    })
    .onConflictDoNothing()
    .returning({ id: paymentsTable.id });
  if (!pendingPayment) {
    res.status(409).json({ error: "You already have a battle vote checkout in progress." });
    return;
  }
  const publicAppOrigin = process.env.APP_ORIGIN ?? (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : undefined);
  if (!publicAppOrigin) {
    await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.id, paymentId));
    res.status(503).json({ error: "Checkout is not configured with a trusted application origin." });
    return;
  }
  let session;
  try {
    const stripe = await getUncachableStripeClient();
    const existing = await stripe.products.search({ query: "name:'YC Battle Vote' AND active:'true'" });
    const stripeProduct =
      existing.data[0] ??
      (await stripe.products.create({
        name: "YC Battle Vote",
        description: "One paid community vote in a YC company battle. Non-refundable; not investment advice.",
      }));
    const prices = await stripe.prices.list({ product: stripeProduct.id, active: true, limit: 10 });
    const price =
      prices.data.find((item) => item.unit_amount === 99 && item.currency === "usd" && !item.recurring) ??
      (await stripe.prices.create({ product: stripeProduct.id, unit_amount: 99, currency: "usd" }));
    const metadata: Record<string, string> = {
      paymentId,
      battleId: battle.id,
      participantId: selectedParticipant.id,
      type: "battle",
    };
    if (linkedProductId) metadata.productId = linkedProductId;
    if (userId) metadata.userId = userId;
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: price.id, quantity: 1 }],
      customer_creation: "always",
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      success_url: `${publicAppOrigin}/payment/success?payment_id=${paymentId}&type=battle&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${publicAppOrigin}/payment/cancel?payment_id=${paymentId}&type=battle`,
      client_reference_id: paymentId,
      metadata,
      payment_intent_data: { metadata },
      custom_text: { submit: { message: BATTLE_DISCLOSURE } },
    });
  } catch (error) {
    await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.id, paymentId));
    logger.error({ err: error }, "Unable to create Battle Checkout session");
    res.status(503).json({ error: "Unable to start checkout. Please try again." });
    return;
  }
  await db.update(paymentsTable).set({ stripeCheckoutSessionId: session.id }).where(eq(paymentsTable.id, paymentId));
  if (!session.url) {
    await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.id, paymentId));
    res.status(503).json({ error: "Stripe did not return a checkout URL." });
    return;
  }
  res.status(201).json(
    CreateBattleCheckoutResponse.parse({ paymentId, checkoutUrl: session.url, amount: 0.99, disclosure: BATTLE_DISCLOSURE }),
  );
});

router.post("/checkout", requireAuth, rateLimit, async (req, res): Promise<void> => {
  const parsed = CreateCheckoutBody.safeParse(req.body);
  if (!parsed.success || parsed.data.disclosureAccepted !== true) {
    res.status(400).json({ error: "You must accept the rating disclosure before checkout." });
    return;
  }
  const userId = (req as AuthedRequest).userId!;
  const [product] = await db
    .select()
    .from(productsTable)
    .where(and(eq(productsTable.id, parsed.data.productId), eq(productsTable.status, "published")));
  if (!product) {
    res.status(404).json({ error: "Company not found." });
    return;
  }
  await ensureUser(userId);
  const [previousRating] = await db
    .select({ id: votesTable.id })
    .from(votesTable)
    .where(and(eq(votesTable.userId, userId), eq(votesTable.productId, product.id)));
  if (previousRating) {
    res.status(409).json({ error: "You have already rated this company." });
    return;
  }
  const [existingReservation] = await db
    .select()
    .from(paymentsTable)
    .where(
      and(
        eq(paymentsTable.userId, userId),
        eq(paymentsTable.productId, product.id),
        eq(paymentsTable.status, "pending"),
      ),
    );
  if (existingReservation) {
    const reservationAgeMs = Date.now() - existingReservation.createdAt.getTime();
    if (reservationAgeMs < 31 * 60 * 1000 || !existingReservation.stripeCheckoutSessionId) {
      res.status(409).json({ error: "You already have a rating checkout in progress for this company." });
      return;
    }
    try {
      const stripe = await getUncachableStripeClient();
      const existingSession = await stripe.checkout.sessions.retrieve(existingReservation.stripeCheckoutSessionId);
      if (existingSession.status !== "expired") {
        res.status(409).json({ error: "Your existing rating checkout is still being processed." });
        return;
      }
      await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.id, existingReservation.id));
    } catch (error) {
      logger.error({ err: error, paymentId: existingReservation.id }, "Unable to reconcile an expired Checkout reservation");
      res.status(503).json({ error: "We could not verify your previous checkout. Please try again shortly." });
      return;
    }
  }
  const paymentId = crypto.randomUUID();
  const [pendingPayment] = await db
    .insert(paymentsTable)
    .values({
      id: paymentId,
      userId,
      productId: product.id,
      amount: "0.99",
      rating: parsed.data.rating,
      status: "pending",
      disclosure: DISCLOSURE,
    })
    .onConflictDoNothing()
    .returning({ id: paymentsTable.id });
  if (!pendingPayment) {
    res.status(409).json({ error: "You already have a rating checkout in progress for this company." });
    return;
  }
  const publicAppOrigin = process.env.APP_ORIGIN ?? (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : undefined);
  if (!publicAppOrigin) {
    await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.id, paymentId));
    res.status(503).json({ error: "Checkout is not configured with a trusted application origin." });
    return;
  }
  let session;
  try {
    const stripe = await getUncachableStripeClient();
    const existing = await stripe.products.search({ query: "name:'Signal Market Company Rating' AND active:'true'" });
    const stripeProduct =
      existing.data[0] ??
      (await stripe.products.create({
        name: "Signal Market Company Rating",
        description: "One paid community rating for a YC company. Non-refundable; not investment advice.",
      }));
    const prices = await stripe.prices.list({ product: stripeProduct.id, active: true, limit: 10 });
    const price =
      prices.data.find((item) => item.unit_amount === 99 && item.currency === "usd" && !item.recurring) ??
      (await stripe.prices.create({ product: stripeProduct.id, unit_amount: 99, currency: "usd" }));
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: price.id, quantity: 1 }],
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      success_url: `${publicAppOrigin}/payment/success?payment_id=${paymentId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${publicAppOrigin}/payment/cancel?payment_id=${paymentId}`,
      client_reference_id: paymentId,
      metadata: { paymentId, productId: product.id, userId, rating: String(parsed.data.rating) },
      payment_intent_data: { metadata: { paymentId, productId: product.id, userId, rating: String(parsed.data.rating) } },
      custom_text: { submit: { message: DISCLOSURE } },
    });
  } catch (error) {
    await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.id, paymentId));
    logger.error({ err: error }, "Unable to create Stripe Checkout session");
    res.status(503).json({ error: "Unable to start checkout. Please try again." });
    return;
  }
  await db.update(paymentsTable).set({ stripeCheckoutSessionId: session.id }).where(eq(paymentsTable.id, paymentId));
  if (!session.url) {
    await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.id, paymentId));
    res.status(503).json({ error: "Stripe did not return a checkout URL." });
    return;
  }
  res.status(201).json(
    CreateCheckoutResponse.parse({ paymentId, checkoutUrl: session.url, amount: 0.99, disclosure: DISCLOSURE }),
  );
});

router.get("/payments/:id", async (req, res): Promise<void> => {
  const params = GetPaymentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const userId = currentUserId(req);
  const [row] = await db
    .select({
      payment: paymentsTable,
      productTitle: productsTable.title,
      battleTitle: battlesTable.title,
      selectedParticipantName: battleParticipantsTable.name,
    })
    .from(paymentsTable)
    .leftJoin(productsTable, eq(paymentsTable.productId, productsTable.id))
    .leftJoin(battlesTable, eq(paymentsTable.battleId, battlesTable.id))
    .leftJoin(battleParticipantsTable, eq(paymentsTable.selectedParticipantId, battleParticipantsTable.id))
    .where(eq(paymentsTable.id, params.data.id));
  if (!row || (!row.payment.battleId && !userId) || (userId && row.payment.userId !== userId)) {
    res.status(404).json({ error: "Payment not found." });
    return;
  }
  res.json(
    GetPaymentResponse.parse({
      id: row.payment.id,
      productId: row.payment.productId,
      productTitle: row.productTitle ?? null,
      amount: Number(row.payment.amount),
        rating: row.payment.rating > 0 ? row.payment.rating : null,
      status: row.payment.status,
      disclosure: row.payment.disclosure,
      receiptUrl: row.payment.receiptUrl,
      createdAt: row.payment.createdAt,
        kind: row.payment.battleId ? "battle" : "rating",
        battleId: row.payment.battleId,
        battleTitle: row.battleTitle ?? null,
        selectedParticipantName: row.selectedParticipantName ?? null,
    }),
  );
});

export async function handlePaidCheckout(event: { id: string; type: string; data: { object: unknown } }): Promise<void> {
  if (event.type !== "checkout.session.completed") return;
  const session = event.data.object as {
    payment_status?: string;
    id?: string;
    payment_intent?: string;
    metadata?: { paymentId?: string; productId?: string; userId?: string; rating?: string; battleId?: string; participantId?: string; type?: string };
  };
  const metadata = session.metadata;
  if (session.payment_status !== "paid" || !metadata?.paymentId) return;
  const paymentId = metadata.paymentId;
  const productId = metadata.productId;
  const userId = metadata.userId ?? null;
  if (metadata.type === "battle" && metadata.battleId && metadata.participantId) {
    const closedBattlePayment = await db.transaction(async (tx) => {
      const [payment] = await tx
        .select()
        .from(paymentsTable)
        .where(
          and(
            eq(paymentsTable.id, metadata.paymentId!),
            userId ? eq(paymentsTable.userId, userId) : sql`${paymentsTable.userId} IS NULL`,
            eq(paymentsTable.battleId, metadata.battleId!),
            eq(paymentsTable.selectedParticipantId, metadata.participantId!),
            eq(paymentsTable.stripeCheckoutSessionId, session.id ?? ""),
          ),
        );
      if (!payment || payment.status === "paid" || payment.status === "refunded") return;
      const [eventRecord] = await tx
        .insert(webhookEventsTable)
        .values({ id: event.id, type: event.type })
        .onConflictDoNothing()
        .returning({ id: webhookEventsTable.id });
      if (!eventRecord) return;
      const [battle] = await tx
        .select()
        .from(battlesTable)
        .where(eq(battlesTable.id, metadata.battleId!))
        .for("update");
      const participantIsInBattle =
        battle &&
        (metadata.participantId === battle.participantAId || metadata.participantId === battle.participantBId);
      if (!battle || battle.status !== "active" || !participantIsInBattle) {
        await tx
          .update(paymentsTable)
          .set({ status: "requires_refund", stripePaymentIntentId: session.payment_intent })
          .where(eq(paymentsTable.id, metadata.paymentId!));
        logger.warn(
          { paymentId: metadata.paymentId, battleId: metadata.battleId, battleStatus: battle?.status },
          "Paid battle checkout arrived after the battle was unavailable",
        );
        return session.payment_intent
          ? { paymentId: metadata.paymentId!, paymentIntentId: session.payment_intent }
          : null;
      }
      const [recordedVote] = await tx
        .insert(battleVotesTable)
        .values({
          id: crypto.randomUUID(),
          battleId: metadata.battleId!,
          userId,
          participantId: metadata.participantId!,
          paymentId: metadata.paymentId!,
          stripeEventId: event.id,
          amount: "0.99",
        })
        .onConflictDoNothing()
        .returning({ id: battleVotesTable.id });
      await tx
        .update(paymentsTable)
        .set({ status: "paid", stripePaymentIntentId: session.payment_intent })
        .where(eq(paymentsTable.id, metadata.paymentId!));
      if (!recordedVote) {
        logger.warn({ paymentId: metadata.paymentId, battleId: metadata.battleId }, "Battle checkout was paid after a previous vote");
      }
      return null;
    });
    if (closedBattlePayment) {
      try {
        const stripe = await getUncachableStripeClient();
        await stripe.refunds.create(
          { payment_intent: closedBattlePayment.paymentIntentId, reason: "requested_by_customer" },
          { idempotencyKey: `closed-battle-${closedBattlePayment.paymentId}` },
        );
        await db
          .update(paymentsTable)
          .set({ status: "refunded" })
          .where(and(eq(paymentsTable.id, closedBattlePayment.paymentId), eq(paymentsTable.status, "requires_refund")));
        logger.info({ paymentId: closedBattlePayment.paymentId }, "Refunded payment for closed battle");
      } catch (error) {
        logger.error({ err: error, paymentId: closedBattlePayment.paymentId }, "Closed battle payment requires manual refund review");
      }
    }
    return;
  }
  if (!userId || !productId) return;
  const rating = Number(metadata.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return;
  await db.transaction(async (tx) => {
    const [payment] = await tx
      .select()
      .from(paymentsTable)
        .where(
          and(
            eq(paymentsTable.id, paymentId),
            eq(paymentsTable.userId, userId),
            eq(paymentsTable.productId, productId),
            eq(paymentsTable.stripeCheckoutSessionId, session.id ?? ""),
          ),
        );
    if (!payment || payment.rating !== rating || payment.status === "paid" || payment.status === "refunded") return;
    const [eventRecord] = await tx
      .insert(webhookEventsTable)
      .values({ id: event.id, type: event.type })
      .onConflictDoNothing()
      .returning({ id: webhookEventsTable.id });
    if (!eventRecord) return;
    const [recordedRating] = await tx
      .insert(votesTable)
      .values({
        id: crypto.randomUUID(),
        userId,
        productId,
        paymentId,
        stripeEventId: event.id,
        amount: "0.99",
        rating,
      })
      .onConflictDoNothing()
      .returning({ id: votesTable.id });
    await tx
      .update(paymentsTable)
      .set({ status: "paid", stripePaymentIntentId: session.payment_intent })
      .where(eq(paymentsTable.id, paymentId));
    if (!recordedRating) return;
    await tx
      .update(productsTable)
      .set({
        ratingCount: sql`${productsTable.ratingCount} + 1`,
        ratingSum: sql`${productsTable.ratingSum} + ${rating}`,
        totalRaised: sql`${productsTable.totalRaised} + 0.99`,
      })
      .where(eq(productsTable.id, productId));
  });
}

export async function handleFailedPayment(event: { id: string; type: string; data: { object: unknown } }): Promise<void> {
  if (event.type !== "payment_intent.payment_failed") return;
  const intent = event.data.object as { metadata?: { paymentId?: string } };
  if (!intent.metadata?.paymentId) return;
  logger.info({ paymentId: intent.metadata.paymentId }, "Stripe payment attempt failed; keeping Checkout reservation open for retry");
}

export default router;
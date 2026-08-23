import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import {
  db,
  paymentsTable,
  productsTable,
  usersTable,
  votesTable,
  webhookEventsTable,
} from "@workspace/db";
import {
  CreateCheckoutBody,
  CreateCheckoutResponse,
  CreateProductBody,
  CreateProductResponse,
  GetCreatorDashboardResponse,
  GetPaymentParams,
  GetPaymentResponse,
  GetProductParams,
  GetProductResponse,
  GetRankingsResponse,
  ListProductsQueryParams,
  ListProductsResponse,
  ListTransactionsResponse,
  UpdateProductStatusBody,
  UpdateProductStatusParams,
} from "@workspace/api-zod";
import { getUncachableStripeClient } from "../stripeClient";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const DISCLOSURE =
  "This $0.99 community rating is non-refundable. It is not investment advice, an endorsement, a securities transaction, or a guarantee of a company's performance.";
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
    source: (row.source === "external" ? "external" : "yc") as "yc" | "external",
    tags: row.tags ?? [],
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

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, category, sort } = parsed.data;
  const tag = typeof req.query.tag === "string" ? req.query.tag : undefined;
  const source = typeof req.query.source === "string" ? req.query.source : undefined;
  const filters = [eq(productsTable.status, "published")];
  if (category && category !== "all") filters.push(eq(productsTable.category, category));
  if (source === "yc" || source === "external") filters.push(eq(productsTable.source, source));
  if (tag) filters.push(sql`${tag} = ANY(${productsTable.tags})`);
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
    .select({ payment: paymentsTable, productTitle: productsTable.title })
    .from(paymentsTable)
    .leftJoin(productsTable, eq(paymentsTable.productId, productsTable.id))
    .where(eq(paymentsTable.userId, userId))
    .orderBy(desc(paymentsTable.createdAt));
  res.json(
    ListTransactionsResponse.parse(
      rows.map(({ payment, productTitle }) => ({
        id: payment.id,
        productId: payment.productId ?? payment.battleId ?? "",
        productTitle: productTitle ?? (payment.kind === "battle" ? "Battle pick" : "Payment"),
        amount: Number(payment.amount),
        rating: payment.rating > 0 ? payment.rating : null,
        status: payment.status,
        disclosure: payment.disclosure,
        receiptUrl: payment.receiptUrl,
        createdAt: payment.createdAt,
      })),
    ),
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
      kind: "rating",
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
      metadata: { paymentId, productId: product.id, userId, rating: String(parsed.data.rating), kind: "rating" },
      payment_intent_data: { metadata: { paymentId, productId: product.id, userId, rating: String(parsed.data.rating), kind: "rating" } },
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

router.get("/payments/:id", requireAuth, async (req, res): Promise<void> => {
  const params = GetPaymentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const userId = (req as AuthedRequest).userId!;
  const [row] = await db
    .select({ payment: paymentsTable, productTitle: productsTable.title })
    .from(paymentsTable)
    .leftJoin(productsTable, eq(paymentsTable.productId, productsTable.id))
    .where(and(eq(paymentsTable.id, params.data.id), eq(paymentsTable.userId, userId)));
  if (!row) {
    res.status(404).json({ error: "Payment not found." });
    return;
  }
  res.json(
    GetPaymentResponse.parse({
      id: row.payment.id,
      productId: row.payment.productId ?? row.payment.battleId ?? "",
      productTitle: row.productTitle ?? (row.payment.kind === "battle" ? "Battle pick" : "Payment"),
      amount: Number(row.payment.amount),
        rating: row.payment.rating > 0 ? row.payment.rating : null,
      status: row.payment.status,
      disclosure: row.payment.disclosure,
      receiptUrl: row.payment.receiptUrl,
      createdAt: row.payment.createdAt,
    }),
  );
});

export async function handlePaidCheckout(event: { id: string; type: string; data: { object: unknown } }): Promise<void> {
  if (event.type !== "checkout.session.completed") return;
  const session = event.data.object as {
    payment_status?: string;
    id?: string;
    payment_intent?: string;
    metadata?: { paymentId?: string; productId?: string; userId?: string; rating?: string; kind?: string };
  };
  const metadata = session.metadata;
  if (metadata?.kind === "battle") return;
  if (session.payment_status !== "paid" || !metadata?.paymentId || !metadata.productId || !metadata.userId) return;
  const paymentId = metadata.paymentId;
  const productId = metadata.productId;
  const userId = metadata.userId;
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
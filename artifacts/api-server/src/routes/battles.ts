import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { and, desc, eq, sql } from "drizzle-orm";
import {
  battleVotesTable,
  battlesTable,
  db,
  paymentsTable,
  productsTable,
  usersTable,
  webhookEventsTable,
} from "@workspace/db";
import { getUncachableStripeClient } from "../stripeClient";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const DISCLOSURE =
  "This $0.99 community battle pick is non-refundable. It is not investment advice, an endorsement, a securities transaction, or a guarantee of either company's performance.";

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
    source: row.source === "external" ? "external" : "yc",
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

async function loadBattle(slugOrId: { slug?: string; id?: string }) {
  const [battle] = slugOrId.slug
    ? await db.select().from(battlesTable).where(and(eq(battlesTable.slug, slugOrId.slug), eq(battlesTable.status, "published")))
    : await db.select().from(battlesTable).where(and(eq(battlesTable.id, slugOrId.id!), eq(battlesTable.status, "published")));
  if (!battle) return null;
  const [left] = await db.select().from(productsTable).where(eq(productsTable.id, battle.leftProductId));
  const [right] = await db.select().from(productsTable).where(eq(productsTable.id, battle.rightProductId));
  if (!left || !right) return null;
  return {
    id: battle.id,
    slug: battle.slug,
    title: battle.title,
    space: battle.space,
    description: battle.description,
    left: toProduct(left),
    right: toProduct(right),
    leftArgument: battle.leftArgument,
    rightArgument: battle.rightArgument,
    leftVoteCount: battle.leftVoteCount,
    rightVoteCount: battle.rightVoteCount,
    status: battle.status,
    featured: battle.featured,
    createdAt: battle.createdAt,
  };
}

router.get("/battles", async (req, res): Promise<void> => {
  const space = typeof req.query.space === "string" ? req.query.space : undefined;
  const filters = [eq(battlesTable.status, "published")];
  if (space) filters.push(eq(battlesTable.space, space));
  const rows = await db
    .select()
    .from(battlesTable)
    .where(and(...filters))
    .orderBy(desc(battlesTable.featured), desc(sql`${battlesTable.leftVoteCount} + ${battlesTable.rightVoteCount}`));
  const battles = [];
  for (const row of rows) {
    const detail = await loadBattle({ id: row.id });
    if (detail) battles.push(detail);
  }
  res.json(battles);
});

router.post("/battles/checkout", requireAuth, async (req, res): Promise<void> => {
  const battleId = req.body?.battleId;
  const side = req.body?.side;
  const disclosureAccepted = req.body?.disclosureAccepted === true;
  if (!battleId || (side !== "left" && side !== "right") || !disclosureAccepted) {
    res.status(400).json({ error: "You must accept the disclosure and pick a side." });
    return;
  }
  const userId = (req as AuthedRequest).userId!;
  const [battle] = await db
    .select()
    .from(battlesTable)
    .where(and(eq(battlesTable.id, battleId), eq(battlesTable.status, "published")));
  if (!battle) {
    res.status(404).json({ error: "Battle not found." });
    return;
  }
  await db
    .insert(usersTable)
    .values({ id: userId })
    .onConflictDoUpdate({ target: usersTable.id, set: { id: userId } });

  const [previous] = await db
    .select({ id: battleVotesTable.id })
    .from(battleVotesTable)
    .where(and(eq(battleVotesTable.userId, userId), eq(battleVotesTable.battleId, battleId)));
  if (previous) {
    res.status(409).json({ error: "You have already picked a side in this battle." });
    return;
  }

  const paymentId = crypto.randomUUID();
  const [pendingPayment] = await db
    .insert(paymentsTable)
    .values({
      id: paymentId,
      userId,
      productId: null,
      battleId,
      battleSide: side,
      kind: "battle",
      amount: "0.99",
      rating: 0,
      status: "pending",
      disclosure: DISCLOSURE,
    })
    .onConflictDoNothing()
    .returning({ id: paymentsTable.id });
  if (!pendingPayment) {
    res.status(409).json({ error: "You already have a battle checkout in progress." });
    return;
  }

  const publicAppOrigin =
    process.env.APP_ORIGIN ??
    (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : undefined);
  if (!publicAppOrigin) {
    await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.id, paymentId));
    res.status(503).json({ error: "Checkout is not configured with a trusted application origin." });
    return;
  }

  let session;
  try {
    const stripe = await getUncachableStripeClient();
    const existing = await stripe.products.search({
      query: "name:'Signal Market Battle Pick' AND active:'true'",
    });
    const stripeProduct =
      existing.data[0] ??
      (await stripe.products.create({
        name: "Signal Market Battle Pick",
        description: "One paid head-to-head pick. Non-refundable; not investment advice.",
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
      cancel_url: `${publicAppOrigin}/battles/${battle.slug}?cancelled=1`,
      client_reference_id: paymentId,
      metadata: { paymentId, battleId, userId, side, kind: "battle" },
      payment_intent_data: { metadata: { paymentId, battleId, userId, side, kind: "battle" } },
      custom_text: { submit: { message: DISCLOSURE } },
    });
  } catch (error) {
    await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.id, paymentId));
    logger.error({ err: error }, "Unable to create battle Checkout session");
    res.status(503).json({ error: "Unable to start checkout. Please try again." });
    return;
  }

  await db
    .update(paymentsTable)
    .set({ stripeCheckoutSessionId: session.id })
    .where(eq(paymentsTable.id, paymentId));
  if (!session.url) {
    await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.id, paymentId));
    res.status(503).json({ error: "Stripe did not return a checkout URL." });
    return;
  }
  res.status(201).json({
    paymentId,
    checkoutUrl: session.url,
    amount: 0.99,
    disclosure: DISCLOSURE,
  });
});

router.get("/battles/:slug", async (req, res): Promise<void> => {
  const detail = await loadBattle({ slug: req.params.slug });
  if (!detail) {
    res.status(404).json({ error: "Battle not found." });
    return;
  }
  res.json(detail);
});

export async function handlePaidBattleCheckout(event: {
  id: string;
  type: string;
  data: { object: unknown };
}): Promise<void> {
  if (event.type !== "checkout.session.completed") return;
  const session = event.data.object as {
    payment_status?: string;
    id?: string;
    payment_intent?: string;
    metadata?: { paymentId?: string; battleId?: string; userId?: string; side?: string; kind?: string };
  };
  const metadata = session.metadata;
  if (metadata?.kind !== "battle") return;
  if (session.payment_status !== "paid" || !metadata.paymentId || !metadata.battleId || !metadata.userId) return;
  if (metadata.side !== "left" && metadata.side !== "right") return;

  await db.transaction(async (tx) => {
    const [payment] = await tx
      .select()
      .from(paymentsTable)
      .where(
        and(
          eq(paymentsTable.id, metadata.paymentId!),
          eq(paymentsTable.userId, metadata.userId!),
          eq(paymentsTable.battleId, metadata.battleId!),
          eq(paymentsTable.kind, "battle"),
        ),
      );
    if (!payment || payment.status === "paid" || payment.status === "refunded") return;
    const [eventRecord] = await tx
      .insert(webhookEventsTable)
      .values({ id: event.id, type: event.type })
      .onConflictDoNothing()
      .returning({ id: webhookEventsTable.id });
    if (!eventRecord) return;

    const [recorded] = await tx
      .insert(battleVotesTable)
      .values({
        id: crypto.randomUUID(),
        battleId: metadata.battleId!,
        userId: metadata.userId!,
        paymentId: metadata.paymentId!,
        side: metadata.side!,
        stripeEventId: event.id,
        amount: "0.99",
      })
      .onConflictDoNothing()
      .returning({ id: battleVotesTable.id });

    await tx
      .update(paymentsTable)
      .set({ status: "paid", stripePaymentIntentId: session.payment_intent })
      .where(eq(paymentsTable.id, metadata.paymentId!));

    if (!recorded) return;
    if (metadata.side === "left") {
      await tx
        .update(battlesTable)
        .set({ leftVoteCount: sql`${battlesTable.leftVoteCount} + 1` })
        .where(eq(battlesTable.id, metadata.battleId!));
    } else {
      await tx
        .update(battlesTable)
        .set({ rightVoteCount: sql`${battlesTable.rightVoteCount} + 1` })
        .where(eq(battlesTable.id, metadata.battleId!));
    }
  });
}

export default router;

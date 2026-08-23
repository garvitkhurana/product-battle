import { createHash, randomBytes } from "node:crypto";
import { and, desc, eq, gt, inArray, lt, sql } from "drizzle-orm";
import {
  battleParticipantsTable,
  battlesTable,
  db,
  perceptionAxesTable,
  perceptionComparisonsTable,
  perceptionSessionWindowsTable,
  perceptionSessionsTable,
  perceptionSignalsTable,
  perceptionWordsTable,
} from "@workspace/db";
import {
  CURATED_BATTLE_ORDER,
  HOUSEHOLD_BATTLE_SLUGS,
  PERCEPTION_EXPANDED_BATCH_SIZE,
} from "./battleSeed";

export const AXIS_LABELS: Record<string, string> = {
  "infra-consumer": "Infrastructure ↔ Consumer",
  "challenger-incumbent": "Challenger ↔ Incumbent",
  "craft-scale": "Craft ↔ Scale",
  "batch-era": "Earlier batch ↔ Newer batch",
  "regulated-software": "Regulated ↔ Pure software",
};

const AXIS_KEYS = Object.keys(AXIS_LABELS);
const SESSION_LIFETIME_DAYS = 30;
const MAX_SWIPES_PER_MINUTE = 30;
const MAX_SESSIONS_PER_MINUTE = 30;
const MIN_SWIPES_FOR_WORDS = 10;
const MIN_WORD_COUNT = 5;
const BLOCKED_WORDS = new Set(["test", "asdf", "qwerty", "fuck", "shit", "bitch", "asshole"]);

function expandedBattleSlugsForCount(comparisonCount: number): Set<string> {
  if (comparisonCount < HOUSEHOLD_BATTLE_SLUGS.length) return new Set();
  const start = HOUSEHOLD_BATTLE_SLUGS.length +
    Math.floor((comparisonCount - HOUSEHOLD_BATTLE_SLUGS.length) / PERCEPTION_EXPANDED_BATCH_SIZE) *
      PERCEPTION_EXPANDED_BATCH_SIZE;
  return new Set(CURATED_BATTLE_ORDER.slice(start, start + PERCEPTION_EXPANDED_BATCH_SIZE));
}

export async function getNextPerceptionBatchForSession(sessionId: string) {
  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(perceptionComparisonsTable)
    .where(eq(perceptionComparisonsTable.sessionId, sessionId));
  const comparisonCount = Number(countRow?.count ?? 0);
  const start =
    HOUSEHOLD_BATTLE_SLUGS.length +
    Math.floor(Math.max(0, comparisonCount - HOUSEHOLD_BATTLE_SLUGS.length) / PERCEPTION_EXPANDED_BATCH_SIZE) *
      PERCEPTION_EXPANDED_BATCH_SIZE;
  const slugs = CURATED_BATTLE_ORDER.slice(start, start + PERCEPTION_EXPANDED_BATCH_SIZE);
  return {
    comparisonCount,
    batchNumber: Math.floor(start / PERCEPTION_EXPANDED_BATCH_SIZE) + 1,
    slugs,
    hasMore: start + slugs.length < CURATED_BATTLE_ORDER.length,
  };
}

export class PerceptionError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function confidenceFor(comparisonCount: number): number {
  return Math.min(100, Math.round((comparisonCount / 20) * 100));
}

function toAxis(key: string, score: number, confidence: number) {
  return { key, label: AXIS_LABELS[key] ?? key, score, confidence };
}

function toParticipant(row: typeof battleParticipantsTable.$inferSelect) {
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

export function hashPrivacyAbuseSignal(value: string): string {
  const pepper = process.env.SESSION_SECRET ?? "yc-battle-development-pepper";
  return createHash("sha256").update(`${pepper}:${value}`).digest("hex");
}

export async function createPerceptionSession(
  userId: string | null,
  abuseHash: string,
  stableClientHash: string | null = null,
) {
  // A browser-provided identifier is local to the browser and never stored in raw
  // form. Deriving the opaque token lets concurrent preview remounts reuse the
  // same private session rather than minting enough sessions to hit the limiter.
  const sessionToken = stableClientHash
    ? `client-${hashPrivacyAbuseSignal(`perception-session:${stableClientHash}`)}`
    : `${crypto.randomUUID()}-${randomBytes(24).toString("hex")}`;
  const tokenHash = hashToken(sessionToken);
  const expiresAt = new Date(Date.now() + SESSION_LIFETIME_DAYS * 24 * 60 * 60 * 1000);
  const windowStartedAt = new Date(Math.floor(Date.now() / 60_000) * 60_000);
  const windowId = `${abuseHash}:${windowStartedAt.toISOString()}`;
  const activeExpiresAt = await db.transaction(async (tx) => {
    if (stableClientHash) {
      const [existingSession] = await tx
        .select({ expiresAt: perceptionSessionsTable.expiresAt })
        .from(perceptionSessionsTable)
        .where(and(eq(perceptionSessionsTable.tokenHash, tokenHash), gt(perceptionSessionsTable.expiresAt, new Date())));
      if (existingSession) return existingSession.expiresAt;
    }

    const [window] = await tx
      .insert(perceptionSessionWindowsTable)
      .values({ id: windowId, abuseHash, windowStartedAt, sessionCount: 1 })
      .onConflictDoUpdate({
        target: perceptionSessionWindowsTable.id,
        set: { sessionCount: sql`${perceptionSessionWindowsTable.sessionCount} + 1` },
        where: lt(perceptionSessionWindowsTable.sessionCount, MAX_SESSIONS_PER_MINUTE),
      })
      .returning({ sessionCount: perceptionSessionWindowsTable.sessionCount });
    if (!window) {
      throw new PerceptionError(429, "Please wait a moment before starting another comparison session.");
    }
    const [createdSession] = await tx
      .insert(perceptionSessionsTable)
      .values({
        id: crypto.randomUUID(),
        tokenHash,
        abuseHash,
        userId,
        expiresAt,
      })
      .onConflictDoNothing({ target: perceptionSessionsTable.tokenHash })
      .returning({ expiresAt: perceptionSessionsTable.expiresAt });

    if (createdSession) return createdSession.expiresAt;

    const [existingSession] = await tx
      .select({ expiresAt: perceptionSessionsTable.expiresAt })
      .from(perceptionSessionsTable)
      .where(and(eq(perceptionSessionsTable.tokenHash, tokenHash), gt(perceptionSessionsTable.expiresAt, new Date())));
    if (existingSession) return existingSession.expiresAt;

    throw new PerceptionError(503, "Unable to start a private comparison session. Please try again.");
  });
  return { sessionToken, expiresAt: activeExpiresAt };
}

export async function requirePerceptionSession(sessionToken: string) {
  const [session] = await db
    .select()
    .from(perceptionSessionsTable)
    .where(
      and(
        eq(perceptionSessionsTable.tokenHash, hashToken(sessionToken)),
        gt(perceptionSessionsTable.expiresAt, new Date()),
      ),
    );
  if (!session) throw new PerceptionError(404, "This private session has expired. Start a new one to continue.");
  await db
    .update(perceptionSessionsTable)
    .set({ lastSeenAt: new Date() })
    .where(eq(perceptionSessionsTable.id, session.id));
  return session;
}

async function getSignal(participantId: string) {
  const [signal] = await db
    .select()
    .from(perceptionSignalsTable)
    .where(eq(perceptionSignalsTable.participantId, participantId));
  return signal ?? { participantId, rating: 1500, comparisonCount: 0, winCount: 0, lossCount: 0 };
}

async function getAxes(participantId: string, confidence: number) {
  const rows = await db
    .select()
    .from(perceptionAxesTable)
    .where(eq(perceptionAxesTable.participantId, participantId));
  const scoreByKey = new Map(rows.map((row) => [row.axisKey, row.score]));
  return AXIS_KEYS.map((key) => toAxis(key, scoreByKey.get(key) ?? 3, confidence));
}

export async function getTasteDnaForSession(sessionId: string) {
  const events = await db
    .select({
      battleId: perceptionComparisonsTable.battleId,
      winnerParticipantId: perceptionComparisonsTable.winnerParticipantId,
    })
    .from(perceptionComparisonsTable)
    .where(eq(perceptionComparisonsTable.sessionId, sessionId));
  const comparisonCount = events.length;
  const confidence = confidenceFor(comparisonCount);
  const winnerIds = events.map((event) => event.winnerParticipantId);
  if (!winnerIds.length) {
    return {
      comparisonCount,
      confidence,
      canShare: false,
      headline: "Your taste DNA is still taking shape.",
      axes: AXIS_KEYS.map((key) => toAxis(key, 3, confidence)),
      closestCompanies: [],
      completedBattleIds: [],
    };
  }

  const axisRows = await db.select().from(perceptionAxesTable).where(inArray(perceptionAxesTable.participantId, winnerIds));
  const scoresByKey = new Map<string, number[]>();
  for (const axis of axisRows) {
    const scores = scoresByKey.get(axis.axisKey) ?? [];
    scores.push(axis.score);
    scoresByKey.set(axis.axisKey, scores);
  }
  const axes = AXIS_KEYS.map((key) => {
    const scores = scoresByKey.get(key) ?? [3];
    return toAxis(key, Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length), confidence);
  });
  const strongest = [...axes].sort((a, b) => Math.abs(b.score - 3) - Math.abs(a.score - 3))[0];
  const headline =
    comparisonCount < 5
      ? "Keep swiping—your signal is beginning to emerge."
      : `You lean ${strongest.score <= 2 ? "toward" : "away from"} ${strongest.label.split(" ↔ ")[0].toLowerCase()}.`;

  const [participants, allAxisRows] = await Promise.all([
    db.select().from(battleParticipantsTable),
    db.select().from(perceptionAxesTable),
  ]);
  const axisByParticipant = new Map<string, Map<string, number>>();
  for (const axis of allAxisRows) {
    const values = axisByParticipant.get(axis.participantId) ?? new Map<string, number>();
    values.set(axis.axisKey, axis.score);
    axisByParticipant.set(axis.participantId, values);
  }
  const selected = new Set(winnerIds);
  const closestCompanies = participants
    .filter((participant) => !selected.has(participant.id))
    .map((participant) => {
      const values = axisByParticipant.get(participant.id);
      const distance = axes.reduce((total, axis) => total + Math.abs(axis.score - (values?.get(axis.key) ?? 3)), 0);
      return { name: participant.name, distance };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map((item) => item.name);

  return {
    comparisonCount,
    confidence,
    canShare: comparisonCount >= 20,
    headline,
    axes,
    closestCompanies,
    completedBattleIds: events.map((event) => event.battleId),
  };
}

export async function recordPerceptionSwipe(input: {
  sessionToken: string;
  battleId: string;
  winnerParticipantId: string;
  requestId: string;
}) {
  const session = await requirePerceptionSession(input.sessionToken);
  const [battle] = await db
    .select()
    .from(battlesTable)
    .where(eq(battlesTable.id, input.battleId));
  if (!battle) throw new PerceptionError(404, "This comparison is not in the current launch set.");
  if (battle.status !== "active" || !battle.isLaunch) {
    const [countRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(perceptionComparisonsTable)
      .where(eq(perceptionComparisonsTable.sessionId, session.id));
    const expandedSlugs = expandedBattleSlugsForCount(Number(countRow?.count ?? 0));
    if (!expandedSlugs.has(battle.slug)) {
      throw new PerceptionError(404, "This comparison is not available in your current private queue.");
    }
  }
  if (input.winnerParticipantId !== battle.participantAId && input.winnerParticipantId !== battle.participantBId) {
    throw new PerceptionError(400, "Choose one of the two companies in this comparison.");
  }
  const loserParticipantId =
    input.winnerParticipantId === battle.participantAId ? battle.participantBId : battle.participantAId;
  const [existing] = await db
    .select({ id: perceptionComparisonsTable.id })
    .from(perceptionComparisonsTable)
    .where(
      and(
        eq(perceptionComparisonsTable.sessionId, session.id),
        eq(perceptionComparisonsTable.battleId, battle.id),
      ),
    );
  if (existing) throw new PerceptionError(409, "That swipe was already recorded.");

  const now = new Date();
  const windowIsFresh = now.getTime() - session.rateLimitWindowStartedAt.getTime() > 60_000;
  if (!windowIsFresh && session.swipesInWindow >= MAX_SWIPES_PER_MINUTE) {
    throw new PerceptionError(429, "Please pause briefly before adding more signals.");
  }

  const result = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(perceptionComparisonsTable)
      .values({
        id: crypto.randomUUID(),
        sessionId: session.id,
        battleId: battle.id,
        winnerParticipantId: input.winnerParticipantId,
        loserParticipantId,
        requestId: input.requestId,
      })
      .onConflictDoNothing()
      .returning({ id: perceptionComparisonsTable.id });
    if (!created) throw new PerceptionError(409, "That swipe was already recorded.");

    await tx
      .update(perceptionSessionsTable)
      .set(
        windowIsFresh
          ? { rateLimitWindowStartedAt: now, swipesInWindow: 1, lastSeenAt: now }
          : { swipesInWindow: sql`${perceptionSessionsTable.swipesInWindow} + 1`, lastSeenAt: now },
      )
      .where(eq(perceptionSessionsTable.id, session.id));
    await tx
      .insert(perceptionSignalsTable)
      .values([
        { participantId: input.winnerParticipantId },
        { participantId: loserParticipantId },
      ])
      .onConflictDoNothing();
    const signalRows = await tx
      .select()
      .from(perceptionSignalsTable)
      .where(inArray(perceptionSignalsTable.participantId, [input.winnerParticipantId, loserParticipantId]));
    const winner = signalRows.find((signal) => signal.participantId === input.winnerParticipantId)!;
    const loser = signalRows.find((signal) => signal.participantId === loserParticipantId)!;
    const expectedWinner = 1 / (1 + 10 ** ((loser.rating - winner.rating) / 400));
    const delta = Math.max(4, Math.round(32 * (1 - expectedWinner)));
    const [updatedWinner] = await tx
      .update(perceptionSignalsTable)
      .set({
        rating: winner.rating + delta,
        comparisonCount: sql`${perceptionSignalsTable.comparisonCount} + 1`,
        winCount: sql`${perceptionSignalsTable.winCount} + 1`,
        updatedAt: now,
      })
      .where(eq(perceptionSignalsTable.participantId, winner.participantId))
      .returning();
    const [updatedLoser] = await tx
      .update(perceptionSignalsTable)
      .set({
        rating: loser.rating - delta,
        comparisonCount: sql`${perceptionSignalsTable.comparisonCount} + 1`,
        lossCount: sql`${perceptionSignalsTable.lossCount} + 1`,
        updatedAt: now,
      })
      .where(eq(perceptionSignalsTable.participantId, loser.participantId))
      .returning();
    return { updatedWinner, updatedLoser };
  });

  const tasteDna = await getTasteDnaForSession(session.id);
  const winnerIsA = input.winnerParticipantId === battle.participantAId;
  return {
    comparisonCount: tasteDna.comparisonCount,
    participantARating: winnerIsA ? result.updatedWinner.rating : result.updatedLoser.rating,
    participantBRating: winnerIsA ? result.updatedLoser.rating : result.updatedWinner.rating,
    participantAConfidence: confidenceFor(winnerIsA ? result.updatedWinner.comparisonCount : result.updatedLoser.comparisonCount),
    participantBConfidence: confidenceFor(winnerIsA ? result.updatedLoser.comparisonCount : result.updatedWinner.comparisonCount),
    tasteDna,
  };
}

export async function getCompanyPerceptionBySlug(slug: string) {
  const [participant] = await db.select().from(battleParticipantsTable).where(eq(battleParticipantsTable.slug, slug));
  if (!participant) throw new PerceptionError(404, "Company not found.");
  const signal = await getSignal(participant.id);
  const confidence = confidenceFor(signal.comparisonCount);
  const [axes, wordRows, events] = await Promise.all([
    getAxes(participant.id, confidence),
    db
      .select({ word: perceptionWordsTable.word, count: sql<number>`count(*)::int` })
      .from(perceptionWordsTable)
      .where(eq(perceptionWordsTable.participantId, participant.id))
      .groupBy(perceptionWordsTable.word)
      .having(sql`count(*) >= ${MIN_WORD_COUNT}`)
      .orderBy(desc(sql`count(*)`))
      .limit(12),
    db.select().from(perceptionComparisonsTable),
  ]);
  const sessionsThatPreferred = new Set(
    events.filter((event) => event.winnerParticipantId === participant.id).map((event) => event.sessionId),
  );
  const participantIds = [...new Set(events.filter((event) => sessionsThatPreferred.has(event.sessionId)).map((event) => event.winnerParticipantId))]
    .filter((id) => id !== participant.id);
  const affinityCounts = new Map<string, number>();
  for (const id of participantIds) affinityCounts.set(id, (affinityCounts.get(id) ?? 0) + 1);
  const affinityParticipants = participantIds.length
    ? await db.select().from(battleParticipantsTable).where(inArray(battleParticipantsTable.id, participantIds))
    : [];
  const names = new Map(affinityParticipants.map((row) => [row.id, row.name]));
  const affinities = [...affinityCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => names.get(id))
    .filter((name): name is string => Boolean(name));
  return {
    participant: toParticipant(participant),
    rating: signal.rating,
    comparisonCount: signal.comparisonCount,
    confidence,
    axes,
    words: wordRows.map((row) => ({ word: row.word, count: Number(row.count) })),
    affinities,
    profileStatus: signal.comparisonCount >= MIN_WORD_COUNT ? "emerging" : "collecting",
  };
}

export async function createPerceptionWord(input: { sessionToken: string; participantId: string; word: string }) {
  const session = await requirePerceptionSession(input.sessionToken);
  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(perceptionComparisonsTable)
    .where(eq(perceptionComparisonsTable.sessionId, session.id));
  if (Number(countRow?.count ?? 0) < MIN_SWIPES_FOR_WORDS) {
    throw new PerceptionError(400, `Add ${MIN_SWIPES_FOR_WORDS} comparisons before adding a one-word reaction.`);
  }
  const word = input.word.trim().toLowerCase();
  if (!/^[a-z][a-z-]{1,31}$/.test(word) || BLOCKED_WORDS.has(word)) {
    throw new PerceptionError(400, "Use one useful, family-friendly word.");
  }
  const [participant] = await db
    .select({ id: battleParticipantsTable.id })
    .from(battleParticipantsTable)
    .where(eq(battleParticipantsTable.id, input.participantId));
  if (!participant) throw new PerceptionError(404, "Company not found.");
  await db
    .insert(perceptionWordsTable)
    .values({ id: crypto.randomUUID(), sessionId: session.id, participantId: input.participantId, word })
    .onConflictDoNothing();
  const [countRowAfter] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(perceptionWordsTable)
    .where(and(eq(perceptionWordsTable.participantId, input.participantId), eq(perceptionWordsTable.word, word)));
  return { word, count: Number(countRowAfter?.count ?? 0) };
}

export async function getPerceptionMapPoints() {
  const launchBattles = await db
    .select()
    .from(battlesTable)
    .where(and(eq(battlesTable.isLaunch, true), eq(battlesTable.status, "active")));
  const participantIds = [...new Set(launchBattles.flatMap((battle) => [battle.participantAId, battle.participantBId]))];
  if (!participantIds.length) return [];
  const [participants, axes, signals] = await Promise.all([
    db.select().from(battleParticipantsTable).where(inArray(battleParticipantsTable.id, participantIds)),
    db.select().from(perceptionAxesTable).where(inArray(perceptionAxesTable.participantId, participantIds)),
    db.select().from(perceptionSignalsTable).where(inArray(perceptionSignalsTable.participantId, participantIds)),
  ]);
  const axisByParticipant = new Map<string, Map<string, number>>();
  for (const axis of axes) {
    const values = axisByParticipant.get(axis.participantId) ?? new Map<string, number>();
    values.set(axis.axisKey, axis.score);
    axisByParticipant.set(axis.participantId, values);
  }
  const signalByParticipant = new Map(signals.map((signal) => [signal.participantId, signal]));
  return participants.map((participant) => {
    const values = axisByParticipant.get(participant.id);
    const signal = signalByParticipant.get(participant.id);
    return {
      participant: toParticipant(participant),
      x: ((values?.get("infra-consumer") ?? 3) - 3) * 50,
      y: ((values?.get("challenger-incumbent") ?? 3) - 3) * -50,
      cluster: participant.category,
      confidence: confidenceFor(signal?.comparisonCount ?? 0),
    };
  });
}
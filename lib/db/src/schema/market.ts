import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  integer,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  displayName: text("display_name").notNull().default("YC Battle member"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const productsTable = pgTable("market_products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  ycBatch: text("yc_batch").notNull().default("Unknown"),
  websiteUrl: text("website_url").notNull().default(""),
  location: text("location").notNull().default(""),
  creatorId: text("creator_id").notNull(),
  creatorName: text("creator_name").notNull(),
  status: text("status").notNull().default("pending"),
  featured: boolean("featured").notNull().default(false),
  voteCount: integer("vote_count").notNull().default(0),
  ratingCount: integer("rating_count").notNull().default(0),
  ratingSum: integer("rating_sum").notNull().default(0),
  totalRaised: numeric("total_raised", { precision: 12, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const paymentsTable = pgTable("payments", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  productId: text("product_id"),
  stripeCheckoutSessionId: text("stripe_checkout_session_id").unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  battleId: text("battle_id"),
  selectedParticipantId: text("selected_participant_id"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull().default("0.99"),
  rating: integer("rating").notNull().default(0),
  status: text("status").notNull().default("pending"),
  disclosure: text("disclosure").notNull(),
  receiptUrl: text("receipt_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  pendingRatingUserProductIdx: uniqueIndex("payments_pending_rating_user_product_idx")
    .on(table.userId, table.productId)
    .where(sql`${table.status} = 'pending' AND ${table.battleId} IS NULL`),
  pendingBattleUserIdx: uniqueIndex("payments_pending_battle_user_idx")
    .on(table.userId, table.battleId)
    .where(sql`${table.status} = 'pending' AND ${table.battleId} IS NOT NULL`),
}));

export const votesTable = pgTable(
  "votes",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    productId: text("product_id").notNull(),
    paymentId: text("payment_id").notNull().unique(),
    stripeEventId: text("stripe_event_id").unique(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull().default("0.99"),
    rating: integer("rating").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userProductIdx: uniqueIndex("votes_user_product_idx").on(table.userId, table.productId),
  }),
);

export const battleParticipantsTable = pgTable("battle_participants", {
  id: text("id").primaryKey(),
  productId: text("product_id"),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  websiteUrl: text("website_url").notNull().default(""),
  ycBatch: text("yc_batch"),
  category: text("category").notNull().default(""),
  location: text("location").notNull().default(""),
  isYcCompany: boolean("is_yc_company").notNull().default(false),
});

export const battlesTable = pgTable("battles", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("Community matchup"),
  participantAId: text("participant_a_id").notNull(),
  participantBId: text("participant_b_id").notNull(),
  status: text("status").notNull().default("active"),
  isLaunch: boolean("is_launch").notNull().default(false),
  winnerParticipantId: text("winner_participant_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const battleVotesTable = pgTable(
  "battle_votes",
  {
    id: text("id").primaryKey(),
    battleId: text("battle_id").notNull(),
    userId: text("user_id"),
    participantId: text("participant_id").notNull(),
    paymentId: text("payment_id").notNull().unique(),
    stripeEventId: text("stripe_event_id").unique(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull().default("0.99"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
);

export const webhookEventsTable = pgTable("webhook_events", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const perceptionSessionsTable = pgTable(
  "perception_sessions",
  {
    id: text("id").primaryKey(),
    tokenHash: text("token_hash").notNull().unique(),
    abuseHash: text("abuse_hash").notNull().default("legacy"),
    userId: text("user_id"),
    rateLimitWindowStartedAt: timestamp("rate_limit_window_started_at", { withTimezone: true }).notNull().defaultNow(),
    swipesInWindow: integer("swipes_in_window").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => ({
    expiryIdx: index("perception_sessions_expiry_idx").on(table.expiresAt),
  }),
);

export const perceptionSessionWindowsTable = pgTable("perception_session_windows", {
  id: text("id").primaryKey(),
  abuseHash: text("abuse_hash").notNull(),
  windowStartedAt: timestamp("window_started_at", { withTimezone: true }).notNull(),
  sessionCount: integer("session_count").notNull().default(0),
});

export const perceptionSignalsTable = pgTable("perception_signals", {
  participantId: text("participant_id").primaryKey(),
  rating: integer("rating").notNull().default(1500),
  comparisonCount: integer("comparison_count").notNull().default(0),
  winCount: integer("win_count").notNull().default(0),
  lossCount: integer("loss_count").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const perceptionComparisonsTable = pgTable(
  "perception_comparisons",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    battleId: text("battle_id").notNull(),
    winnerParticipantId: text("winner_participant_id").notNull(),
    loserParticipantId: text("loser_participant_id").notNull(),
    requestId: text("request_id").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    sessionIdx: index("perception_comparisons_session_idx").on(table.sessionId),
    battleIdx: index("perception_comparisons_battle_idx").on(table.battleId),
    participantIdx: index("perception_comparisons_winner_idx").on(table.winnerParticipantId),
    sessionBattleIdx: uniqueIndex("perception_comparisons_session_battle_idx").on(table.sessionId, table.battleId),
  }),
);

export const perceptionAxesTable = pgTable(
  "perception_axes",
  {
    id: text("id").primaryKey(),
    participantId: text("participant_id").notNull(),
    axisKey: text("axis_key").notNull(),
    score: integer("score").notNull(),
    source: text("source").notNull(),
    version: text("version").notNull().default("v1"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    participantAxisIdx: uniqueIndex("perception_axes_participant_axis_idx").on(table.participantId, table.axisKey),
  }),
);

export const perceptionWordsTable = pgTable(
  "perception_words",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    participantId: text("participant_id").notNull(),
    word: text("word").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    sessionParticipantWordIdx: uniqueIndex("perception_words_session_participant_word_idx").on(
      table.sessionId,
      table.participantId,
      table.word,
    ),
    participantIdx: index("perception_words_participant_idx").on(table.participantId),
  }),
);

export const companyClaimsTable = pgTable(
  "company_claims",
  {
    id: text("id").primaryKey(),
    participantId: text("participant_id").notNull(),
    userId: text("user_id").notNull(),
    message: text("message").notNull(),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pendingClaimIdx: uniqueIndex("company_claims_pending_user_participant_idx")
      .on(table.userId, table.participantId)
      .where(sql`${table.status} = 'pending'`),
  }),
);

export const insertProductSchema = createInsertSchema(productsTable).omit({
  id: true,
  creatorId: true,
  creatorName: true,
  status: true,
  featured: true,
  voteCount: true,
  ratingCount: true,
  ratingSum: true,
  totalRaised: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
export type Payment = typeof paymentsTable.$inferSelect;
export type BattleParticipant = typeof battleParticipantsTable.$inferSelect;
export type Battle = typeof battlesTable.$inferSelect;
export type BattleVote = typeof battleVotesTable.$inferSelect;
export type PerceptionSession = typeof perceptionSessionsTable.$inferSelect;
export type PerceptionComparison = typeof perceptionComparisonsTable.$inferSelect;
import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  integer,
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
  displayName: text("display_name").notNull().default("Signal member"),
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
  userId: text("user_id").notNull(),
  productId: text("product_id").notNull(),
  stripeCheckoutSessionId: text("stripe_checkout_session_id").unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull().default("0.99"),
  rating: integer("rating").notNull().default(0),
  status: text("status").notNull().default("pending"),
  disclosure: text("disclosure").notNull(),
  receiptUrl: text("receipt_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  pendingUserProductIdx: uniqueIndex("payments_pending_user_product_idx")
    .on(table.userId, table.productId)
    .where(sql`${table.status} = 'pending'`),
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

export const webhookEventsTable = pgTable("webhook_events", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }).notNull().defaultNow(),
});

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
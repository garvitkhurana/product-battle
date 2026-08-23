import app from "./app";
import { logger } from "./lib/logger";
import { runMigrations } from "stripe-replit-sync";
import { getStripeSync } from "./stripeClient";
import { seedBattleMatchups } from "./lib/battleSeed";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function initStripe(): Promise<void> {
  if (!process.env.DATABASE_URL || !process.env.REPLIT_DOMAINS) {
    logger.warn("Stripe sync skipped because runtime configuration is incomplete");
    return;
  }
  await runMigrations({ databaseUrl: process.env.DATABASE_URL });
  const stripeSync = await getStripeSync();
  const baseUrl = `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`;
  await stripeSync.findOrCreateManagedWebhook(`${baseUrl}/api/stripe/webhook`);
  await stripeSync.syncBackfill();
  logger.info("Stripe sync initialized");
}

try {
  await seedBattleMatchups();
  logger.info("Battle matchups provisioned");
} catch (error) {
  logger.error({ err: error }, "Battle matchup provisioning failed");
  process.exit(1);
}

try {
  await initStripe();
} catch (error) {
  logger.error({ err: error }, "Stripe sync initialization failed; checkout will retry on demand");
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});

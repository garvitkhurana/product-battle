import Stripe from "stripe";
import { StripeSync } from "stripe-replit-sync";

async function getStripeCredentials(): Promise<{ secretKey: string; webhookSecret?: string }> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const identity = process.env.REPL_IDENTITY
    ? `repl ${process.env.REPL_IDENTITY}`
    : process.env.WEB_REPL_RENEWAL
      ? `depl ${process.env.WEB_REPL_RENEWAL}`
      : null;

  if (!hostname || !identity) {
    throw new Error("Stripe integration environment is unavailable.");
  }

  const response = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=stripe`,
    {
      headers: { Accept: "application/json", X_REPLIT_TOKEN: identity },
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!response.ok) {
    throw new Error(`Stripe credentials request failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    items?: Array<{ settings?: { secret?: string; webhook_secret?: string } }>;
  };
  const settings = data.items?.[0]?.settings;
  if (!settings?.secret) {
    throw new Error("Stripe payment credentials are unavailable.");
  }
  return { secretKey: settings.secret, webhookSecret: settings.webhook_secret };
}

export async function getUncachableStripeClient(): Promise<Stripe> {
  const { secretKey } = await getStripeCredentials();
  return new Stripe(secretKey);
}

export async function getStripeSync(): Promise<StripeSync> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required for Stripe sync.");
  const { secretKey, webhookSecret } = await getStripeCredentials();
  return new StripeSync({
    poolConfig: { connectionString: databaseUrl },
    stripeSecretKey: secretKey,
    stripeWebhookSecret: webhookSecret ?? "",
  });
}

/**
 * StripeSync verifies the signature before this is called. The managed webhook
 * secret lives in StripeSync's private database table, so parsing happens only
 * after that verification succeeds.
 */
export function parseVerifiedStripeEvent(payload: Buffer): Stripe.Event {
  if (!Buffer.isBuffer(payload)) {
    throw new Error("Stripe webhook payload must be a raw Buffer.");
  }
  return JSON.parse(payload.toString("utf8")) as Stripe.Event;
}
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import { WebhookHandlers } from "./webhookHandlers";
import { parseVerifiedStripeEvent } from "./stripeClient";
import { handleFailedPayment, handlePaidCheckout } from "./routes/market";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res): Promise<void> => {
    const signature = req.headers["stripe-signature"];
    if (!signature || Array.isArray(signature)) {
      res.status(400).json({ error: "Missing stripe-signature." });
      return;
    }
    try {
      await WebhookHandlers.processWebhook(req.body as Buffer, signature);
      const event = parseVerifiedStripeEvent(req.body as Buffer);
      await handlePaidCheckout(event);
      await handleFailedPayment(event);
      res.status(200).json({ received: true });
    } catch (error) {
      logger.error({ err: error }, "Stripe webhook processing failed");
      res.status(400).json({ error: "Webhook processing error." });
    }
  },
);
// Keep the deployment probe independent from Clerk's host-based key resolution.
// Replit's health checker may omit the Host header while the app is starting.
app.get("/api/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use(cors({ credentials: true, origin: true }));
app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(getClerkProxyHost(req) ?? "", process.env.CLERK_PUBLISHABLE_KEY),
  })),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;

# YC Signal

YC Signal is a community directory for rating Y Combinator companies with a paid $0.99, 1–5 rating. A rating is always disclosed as **non-refundable** and **not investment advice, an endorsement, a securities transaction, or a performance guarantee**. It is not affiliated with Y Combinator.

## What is included

- Public YC company discovery, search, category filters, batch labels, featured profiles, and rating rankings
- Company profile pages with website, location, rating averages, and a mandatory disclosure acknowledgement before checkout
- Company profile submission, dashboard metrics, and owner-managed moderation/status controls
- Clerk sign-in and sign-up
- Stripe Checkout, payment records, rating receipts/history, webhook records, and duplicate-delivery protection
- Persistent PostgreSQL records for users, company profiles, payments, ratings, and webhook events
- Demo data and bundled artwork for a ready-to-browse first run

Legacy demand signals are not treated as 1–5 ratings. The directory uses dedicated rating totals, so pre-pivot signals and receipts are isolated from rating averages rather than being assigned a made-up score.

## Local development

Start the managed API and web workflows from the workspace. The API is served under `/api` and the web app is served at `/`.

Useful checks:

```bash
pnpm run typecheck
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-spec run codegen
```

## Authentication setup

Clerk is provisioned for this workspace. Its development secrets are managed automatically:

- `CLERK_SECRET_KEY`
- `CLERK_PUBLISHABLE_KEY`
- `VITE_CLERK_PUBLISHABLE_KEY`

Do not hardcode or copy these values into source control. Development and production use separate Clerk user stores.

## Stripe setup

Stripe is connected through the workspace integration, so the server reads credentials from the managed connection rather than raw environment variables. No `STRIPE_SECRET_KEY` or webhook secret should be added to source control.

For published deployments, set the non-secret `APP_ORIGIN` environment variable to the trusted public app URL. Checkout redirects are deliberately built from this allowlisted origin rather than request headers.

For a working local/payment test:

1. Ensure the Stripe integration remains connected.
2. Start the API workflow; it creates/synchronizes Stripe's managed schema and registers the webhook route at `/api/stripe/webhook`.
3. Sign in, open a published company profile, choose a 1–5 rating, acknowledge the rating disclosure, and continue to Stripe Checkout.

The checkout creates or reuses a dedicated $0.99 one-time Stripe price. The server stores a pending payment before redirecting. On a signed `checkout.session.completed` webhook, it records the webhook event, marks the payment paid, creates exactly one rating for that payment, and updates the company rating totals. Duplicate webhook deliveries are ignored safely.

## Production checklist

Before publishing, verify that the connected Stripe account is the intended live account and test the full checkout flow in the deployment environment. Do not present an unpaid/pending checkout as a counted rating. The user-facing receipt and company pages must retain the non-refundable, non-advice disclosure and the statement that YC Signal is not affiliated with Y Combinator.
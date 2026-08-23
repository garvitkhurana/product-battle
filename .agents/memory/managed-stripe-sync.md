---
name: Managed Stripe sync
description: Replit managed Stripe integration compatibility notes for webhook and migration startup.
---

Use the managed Stripe connection's current `secret` credential field rather than assuming the older `secret_key` field. Keep `stripe-replit-sync` external to the API bundle so its packaged SQL migrations remain available at runtime.

**Why:** Bundling Stripe Sync relocates its runtime module context and prevents it from finding its migration directory, leaving its managed-webhook tables uncreated. The integration response shape can also differ from older templates.

**How to apply:** When Stripe Sync is initialized by a bundled server, externalize the package in the server build. Let Stripe Sync verify managed webhook signatures, then only parse the already-verified webhook payload for application-specific settlement.
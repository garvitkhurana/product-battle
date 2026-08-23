---
name: Guest battle backing
description: Product rule for anonymous paid votes in YC Battle.
---

YC Battle allows a guest to pay and back a side without creating an app account. Each successfully settled Stripe payment records one battle vote; guest payments are intentionally not deduplicated by an account or email.

**Why:** The product prioritizes low-friction paid participation. A payment, rather than a user profile, is the voting unit for guests.

**How to apply:** Keep battle totals public. Preserve Stripe webhook verification and payment-id idempotency so one Checkout payment cannot settle more than once. Account-based duplicate checks continue to apply only when a voter is signed in.
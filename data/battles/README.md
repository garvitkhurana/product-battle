# Battles & non-YC rivals

Curated **YC vs non-YC** head-to-head matchups. Users pay **$0.99** to pick a side.

Not affiliated with Y Combinator. Picks are opinions, not investment advice.

## Files

| File | Purpose |
| --- | --- |
| `rivalries.json` | Non-YC competitor profiles + battle pairings (portable for other projects) |

## Import

```bash
# After YC companies are in Postgres:
pnpm --filter @workspace/scripts run import-yc-companies
pnpm --filter @workspace/scripts run import-battles
```

## Product surface

- `/battles` — list
- `/battles/:slug` — pick a side + Stripe checkout
- API: `GET /api/battles`, `GET /api/battles/:slug`, `POST /api/battles/checkout`

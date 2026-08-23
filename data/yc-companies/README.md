# YC companies dataset

Portable snapshot of publicly listed Y Combinator companies for local apps and experiments.

**Not affiliated with Y Combinator.** Data is public directory info only.

## Source

- Upstream: [yc-oss/api](https://github.com/yc-oss/api) — daily mirror of YC’s public Algolia company index (`ycombinator.com/companies`)
- No HTML scraping. Refresh by cloning that repo and replacing the files here.

## Files

| File | Purpose |
| --- | --- |
| `meta.json` | Provenance + company count + fetch timestamp |
| `directory.json` | Normalized records (stable fields for apps) |
| `all.json` | Full upstream records from yc-oss |

## Refresh

```bash
rm -rf /tmp/yc-oss-api
git clone --depth 1 --filter=blob:none --sparse https://github.com/yc-oss/api.git /tmp/yc-oss-api
git -C /tmp/yc-oss-api sparse-checkout set companies
cp /tmp/yc-oss-api/companies/all.json data/yc-companies/all.json
# Then regenerate directory.json + meta.json via scripts/sync-yc-companies.mjs
node scripts/sync-yc-companies.mjs
```

## Import into Signal Market Postgres

Requires `DATABASE_URL` and a pushed Drizzle schema:

```bash
pnpm --filter @workspace/db run push
pnpm exec tsx scripts/src/import-yc-companies.ts
```

By default this upserts **published** `market_products` rows from `directory.json` (idempotent on `slug`).

# YC Battle

Independent company perception on [ycbattle.com](https://ycbattle.com). Free pairwise comparisons build a private Taste DNA and public, confidence-aware context. Not affiliated with Y Combinator.

## What it does

- Continuous Mode (`/swipe`) and head-to-head battles (`/battles/:slug`)
- Taste DNA (`/dna`) with gated Aligned Entities from co-voting
- Company profiles (`/companies/:slug`) with thresholded word clouds (5+ independent submissions)
- Territory map (`/map`) clustered by co-voting / word overlap
- Dynamic share cards + OG PNGs under `/api/card/*` and `/api/og/*`

## Local development

```bash
pnpm install
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/signal-market run dev
```

Useful checks:

```bash
pnpm run typecheck
pnpm --filter @workspace/api-spec run codegen
```

## Share / OG endpoints

| Path | Purpose |
|------|---------|
| `/api/og/battle/:slug.png` | Live split card |
| `/api/og/company/:slug.png` | Top community words |
| `/api/og/map.png` | Territory snapshot |
| `/api/card/battle/:slug` | HTML meta + redirect for crawlers |
| `/api/card/company/:slug` | HTML meta + redirect |
| `/api/card/map` | HTML meta + redirect |

## Contact

`hello@ycbattle.com`

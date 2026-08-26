# YC Battle

Independent company perception on [ycbattle.com](https://ycbattle.com). Free,
unlimited pairwise comparisons build a private Taste DNA profile and public,
confidence-aware perception data. Not affiliated with Y Combinator.

## What it does

- **Continuous Mode** (`/swipe`) — rapid free-form pairwise comparisons, no
  account required. Queue extends in curated batches; axis-covering pairings
  ensure every Taste DNA dimension gets exercised across the comparison set.
- **Head-to-head battles** (`/battles/:slug`) — individual comparisons,
  browsable directly. Shows a live community split after voting.
- **Taste DNA** (`/dna`) — private per-session profile across 4 axes
  (Infrastructure↔Consumer, Challenger↔Incumbent, Craft↔Scale,
  Regulated↔Pure software). Confidence is proportional to both axis
  coverage and per-axis certainty — a partially-filled profile cannot report
  100% confidence. Aligned Entities are gated on independent co-voting signals,
  never mirrored from the user's own picks.
- **Company profiles** (`/companies/:slug`) — thresholded word clouds (a word
  only appears after 5+ independent submissions). One-word prompts are shown to
  a small, randomized sample of users (~1 in 50 sessions) rather than after
  every vote, keeping the core swipe loop frictionless.
- **Territory map** (`/map`) — companies cluster by co-voting affinity and word
  overlap into named territories (e.g. B2B Territory, Consumer Lowlands,
  Payments Bay, Health Range, Ops Ridge). Collision-aware layout keeps markers
  legible even in dense clusters; region set grows as new comparison
  categories are added.
- **Dynamic share cards + OG PNGs** under `/api/card/*` and `/api/og/*` — every
  shared link (site, battle, Taste DNA, company, map) renders a real preview image rather
  than a generic fallback.

## Model

Entirely free. No paid votes, no pay-to-win mechanics. Company-facing
monetization (perception dashboards, sponsored brackets, data licensing) is a
future consideration, not part of the current product.

## Local development

```
pnpm install
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/signal-market run dev
```

Useful checks:

```
pnpm run typecheck
pnpm --filter @workspace/api-spec run codegen
```

## Share / OG endpoints

| Path                        | Purpose                           |
| --------------------------- | --------------------------------- |
| `/api/og/battle/:slug.png`  | Live split card                   |
| `/api/og/dna.png`           | Shareable Taste DNA summary       |
| `/api/og/company/:slug.png` | Top community words               |
| `/api/og/map.png`           | Territory snapshot                |
| `/api/card/battle/:slug`    | HTML meta + redirect for crawlers |
| `/api/card/dna`             | Taste DNA meta + redirect         |
| `/api/card/company/:slug`   | HTML meta + redirect              |
| `/api/card/map`             | HTML meta + redirect              |

## Contact

`hello@ycbattle.com`

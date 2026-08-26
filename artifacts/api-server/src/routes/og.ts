import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  battleParticipantsTable,
  battlesTable,
  db,
  perceptionComparisonsTable,
} from "@workspace/db";
import { logger } from "../lib/logger";
import {
  getCompanyPerceptionBySlug,
  getMapOgPayload,
  PerceptionError,
} from "../lib/perception";
import {
  renderBattleOgPng,
  renderCompanyOgPng,
  renderDnaOgPng,
  renderMapOgPng,
} from "../lib/ogPng";

const router: IRouter = Router();
const SITE = "https://ycbattle.com";
const DNA_SHARE_VERSION = "2";
const DNA_SOCIAL_IMAGE =
  "https://raw.githubusercontent.com/garvitkhurana/product-battle/main/artifacts/signal-market/public/og.png?v=2";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function shareHtml(input: {
  title: string;
  description: string;
  imagePath: string;
  canonicalPath: string;
  sharePath?: string;
  redirectPath?: string;
  socialImageUrl?: string;
  autoRedirect?: boolean;
  bodyImageUrl?: string;
  ctaLabel?: string;
}): string {
  const pageUrl = `${SITE}${input.sharePath ?? input.canonicalPath}`;
  const canonicalUrl = `${SITE}${input.canonicalPath}`;
  const redirectUrl = `${SITE}${input.redirectPath ?? input.canonicalPath}`;
  const imageUrl = input.socialImageUrl ?? `${SITE}${input.imagePath}`;
  const ctaLabel = input.ctaLabel ?? "Continue to YC Battle";
  // When a visible card image is supplied, let the person actually see it —
  // no instant meta-refresh yanking them away before they can look at it.
  const body = input.bodyImageUrl
    ? `<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f6e5d2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;width:100%;padding:24px;text-align:center;">
    <img src="${escapeHtml(input.bodyImageUrl)}" alt="${escapeHtml(input.title)}" style="width:100%;height:auto;border:2px solid #181513;display:block;" />
    <a href="${escapeHtml(redirectUrl)}" style="display:inline-block;margin-top:24px;padding:16px 32px;background:#181513;color:#fff8ef;text-decoration:none;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;font-size:13px;">${escapeHtml(ctaLabel)}</a>
  </div>
</body>`
    : `<body>
  <p><a href="${escapeHtml(redirectUrl)}">${escapeHtml(ctaLabel)}</a></p>
</body>`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(input.title)}</title>
  <meta name="description" content="${escapeHtml(input.description)}" />
  <meta property="og:title" content="${escapeHtml(input.title)}" />
  <meta property="og:description" content="${escapeHtml(input.description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${escapeHtml(pageUrl)}" />
  <meta property="og:site_name" content="YC Battle" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeHtml(input.title)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(input.title)}" />
  <meta name="twitter:description" content="${escapeHtml(input.description)}" />
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
  <meta name="twitter:image:src" content="${escapeHtml(imageUrl)}" />
  <meta name="twitter:image:alt" content="${escapeHtml(input.title)}" />
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
  ${input.autoRedirect === false || input.bodyImageUrl ? "" : `<meta http-equiv="refresh" content="0;url=${escapeHtml(redirectUrl)}" />`}
</head>
${body}
</html>`;
}

function sendPng(
  res: import("express").Response,
  png: Buffer,
  cacheControl = "public, max-age=300",
) {
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", cacheControl);
  // Bypass Express's automatic ETag/freshness handling so crawlers always
  // receive a complete PNG rather than an empty conditional 304 response.
  res.statusCode = 200;
  res.end(png);
}

function isSocialCrawler(userAgent: string | undefined): boolean {
  return /Twitterbot|facebookexternalhit|WhatsApp|Slackbot|Discordbot|LinkedInBot/i.test(
    userAgent ?? "",
  );
}

function queryText(
  value: unknown,
  fallback: string,
  maxLength: number,
): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" && raw.trim()
    ? raw.trim().slice(0, maxLength)
    : fallback;
}

function dnaSharePayload(query: import("express").Request["query"]) {
  return {
    archetype: queryText(query.archetype, "TASTE DNA", 48),
    headline: queryText(
      query.headline,
      "My preferences are taking shape.",
      120,
    ),
    tendency: queryText(query.tendency, "", 64) || undefined,
  };
}

function dnaShareParams(
  payload: ReturnType<typeof dnaSharePayload>,
): URLSearchParams {
  const params = new URLSearchParams({
    archetype: payload.archetype,
    headline: payload.headline,
    v: DNA_SHARE_VERSION,
  });
  if (payload.tendency) params.set("tendency", payload.tendency);
  return params;
}

function dnaImagePath(payload: ReturnType<typeof dnaSharePayload>): string {
  return `/api/og/dna.png?${dnaShareParams(payload).toString()}`;
}

function dnaCardPath(payload: ReturnType<typeof dnaSharePayload>): string {
  return `/api/card/dna?${dnaShareParams(payload).toString()}`;
}

router.get("/og/battle/:slug.png", async (req, res): Promise<void> => {
  try {
    const slug = String(req.params.slug ?? "");
    const [battle] = await db
      .select()
      .from(battlesTable)
      .where(eq(battlesTable.slug, slug));
    if (!battle) {
      res.status(404).send("Not found");
      return;
    }
    const [participantA, participantB, comparisons] = await Promise.all([
      db
        .select()
        .from(battleParticipantsTable)
        .where(eq(battleParticipantsTable.id, battle.participantAId))
        .then((rows) => rows[0]),
      db
        .select()
        .from(battleParticipantsTable)
        .where(eq(battleParticipantsTable.id, battle.participantBId))
        .then((rows) => rows[0]),
      db
        .select()
        .from(perceptionComparisonsTable)
        .where(eq(perceptionComparisonsTable.battleId, battle.id)),
    ]);
    if (!participantA || !participantB) {
      res.status(404).send("Not found");
      return;
    }
    const winsA = comparisons.filter(
      (row) => row.winnerParticipantId === participantA.id,
    ).length;
    const winsB = comparisons.filter(
      (row) => row.winnerParticipantId === participantB.id,
    ).length;
    const total = winsA + winsB;
    const pctA = total > 0 ? Math.round((winsA / total) * 100) : 50;
    const pctB = total > 0 ? 100 - pctA : 50;
    sendPng(
      res,
      renderBattleOgPng({
        nameA: participantA.name,
        nameB: participantB.name,
        pctA,
        pctB,
        category: battle.category ?? undefined,
      }),
    );
  } catch (error) {
    logger.error({ err: error }, "Unable to render battle OG image");
    res.status(503).send("Unavailable");
  }
});

router.get("/og/dna.png", (req, res): void => {
  const payload = dnaSharePayload(req.query);
  sendPng(
    res,
    renderDnaOgPng(payload),
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
  );
});

router.get("/og/company/:slug.png", async (req, res): Promise<void> => {
  try {
    const profile = await getCompanyPerceptionBySlug(
      String(req.params.slug ?? ""),
    );
    sendPng(
      res,
      renderCompanyOgPng({
        name: profile.participant.name,
        words: profile.words.map((word) => word.word),
      }),
    );
  } catch (error) {
    if (error instanceof PerceptionError) {
      res.status(error.status).send(error.message);
      return;
    }
    logger.error({ err: error }, "Unable to render company OG image");
    res.status(503).send("Unavailable");
  }
});

router.get("/og/map.png", async (_req, res): Promise<void> => {
  try {
    const payload = await getMapOgPayload();
    sendPng(res, renderMapOgPng(payload));
  } catch (error) {
    logger.error({ err: error }, "Unable to render map OG image");
    res.status(503).send("Unavailable");
  }
});

router.get("/card/battle/:slug", async (req, res): Promise<void> => {
  try {
    const slug = String(req.params.slug ?? "");
    const [battle] = await db
      .select()
      .from(battlesTable)
      .where(eq(battlesTable.slug, slug));
    if (!battle) {
      res.status(404).send("Not found");
      return;
    }
    const [participantA, participantB] = await Promise.all([
      db
        .select()
        .from(battleParticipantsTable)
        .where(eq(battleParticipantsTable.id, battle.participantAId))
        .then((rows) => rows[0]),
      db
        .select()
        .from(battleParticipantsTable)
        .where(eq(battleParticipantsTable.id, battle.participantBId))
        .then((rows) => rows[0]),
    ]);
    if (!participantA || !participantB) {
      res.status(404).send("Not found");
      return;
    }
    res
      .status(200)
      .type("html")
      .send(
        shareHtml({
          title: `${participantA.name} vs ${participantB.name} — YC Battle`,
          description: `Who earns your signal in ${battle.category}? Live community perception on YC Battle.`,
          imagePath: `/api/og/battle/${encodeURIComponent(slug)}.png`,
          canonicalPath: `/battles/${encodeURIComponent(slug)}`,
        }),
      );
  } catch (error) {
    logger.error({ err: error }, "Unable to render battle share card");
    res.status(503).send("Unavailable");
  }
});

router.get("/card/dna", (req, res): void => {
  const payload = dnaSharePayload(req.query);
  res
    .status(200)
    .set(
      "Cache-Control",
      "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    )
    .type("html")
    .send(
      shareHtml({
        title: `${payload.archetype} — YC Battle Taste DNA`,
        description: `${payload.headline} What's your startup taste?`,
        imagePath: dnaImagePath(payload),
        canonicalPath: "/dna",
        redirectPath: "/swipe",
        sharePath: dnaCardPath(payload),
        socialImageUrl: DNA_SOCIAL_IMAGE,
        autoRedirect: !isSocialCrawler(req.get("user-agent")),
        bodyImageUrl: `${SITE}${dnaImagePath(payload)}`,
        ctaLabel: "Find your own Taste DNA",
      }),
    );
});

router.get("/card/company/:slug", async (req, res): Promise<void> => {
  try {
    const slug = String(req.params.slug ?? "");
    const profile = await getCompanyPerceptionBySlug(slug);
    const topWords = profile.words
      .slice(0, 5)
      .map((word) => word.word)
      .join(", ");
    res
      .status(200)
      .type("html")
      .send(
        shareHtml({
          title: `${profile.participant.name} — community perception`,
          description: topWords
            ? `Community perception, unverified: ${topWords}`
            : `Community perception for ${profile.participant.name} on YC Battle.`,
          imagePath: `/api/og/company/${encodeURIComponent(slug)}.png`,
          canonicalPath: `/companies/${encodeURIComponent(slug)}`,
        }),
      );
  } catch (error) {
    if (error instanceof PerceptionError) {
      res.status(error.status).send(error.message);
      return;
    }
    logger.error({ err: error }, "Unable to render company share card");
    res.status(503).send("Unavailable");
  }
});

router.get("/card/map", async (_req, res): Promise<void> => {
  try {
    const payload = await getMapOgPayload();
    const regionLine = payload.regions
      .slice(0, 3)
      .map((region) => region.name)
      .join(", ");
    res
      .status(200)
      .type("html")
      .send(
        shareHtml({
          title: "YC Battle — ecosystem territory map",
          description: regionLine
            ? `Data-backed map of YC ecosystem territories: ${regionLine}.`
            : "Data-backed map of YC ecosystem territories from community comparisons.",
          imagePath: "/api/og/map.png",
          canonicalPath: "/map",
        }),
      );
  } catch (error) {
    logger.error({ err: error }, "Unable to render map share card");
    res.status(503).send("Unavailable");
  }
});

export default router;

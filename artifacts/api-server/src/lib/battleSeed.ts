import { and, eq, inArray, sql } from "drizzle-orm";
import { battleParticipantsTable, battlesTable, db, perceptionAxesTable, productsTable } from "@workspace/db";
import {
  curatedBattles,
  curatedCompanies,
  curatedCompetitors,
} from "./curatedBattleData";

const CURATED_CREATOR_ID = "yc-battle-directory";
const CURATED_CREATOR_NAME = "YC Battle directory";
const LEGACY_DEMO_BATTLE_SLUGS = [
  "airbnb-vs-booking",
  "brex-vs-ramp",
  "rippling-vs-gusto",
];
export const HOUSEHOLD_BATTLE_SLUGS = [
  "airbnb-vs-vrbo",
  "doordash-vs-uber-eats",
  "twitch-vs-youtube",
  "stripe-vs-adyen",
  "coinbase-vs-binance",
  "instacart-vs-amazon-fresh",
  "dropbox-vs-google-drive",
  "gitlab-vs-github",
  "whatnot-vs-tiktok-shop",
  "goat-vs-stockx",
  "gusto-vs-adp",
  "brex-vs-amex",
  "honeylove-vs-skims",
  "zepto-vs-blinkit",
  "scribd-vs-kindle-unlimited",
] as const;

export const LAUNCH_BATTLE_SLUGS = new Set<string>(HOUSEHOLD_BATTLE_SLUGS);
export const CURATED_BATTLE_ORDER = [
  ...new Set([...HOUSEHOLD_BATTLE_SLUGS, ...curatedBattles.map((battle) => battle.slug)]),
];
export const PERCEPTION_EXPANDED_BATCH_SIZE = 10;

function usableImageUrl(url: string | null | undefined): string {
  return url?.startsWith("https://") ? url : "";
}

function participantIdForYcCompany(slug: string): string {
  return `yc-battle-${slug}`;
}

function participantIdForRival(id: string): string {
  return `rival-battle-${id}`;
}

export async function seedBattleMatchups(): Promise<void> {
  const featuredCompanySlugs = new Set(
    curatedBattles.filter((battle) => battle.featured).map((battle) => battle.yc_slug),
  );
  const referencedRivalIds = new Set(curatedBattles.map((battle) => battle.rival_id));

  await db
    .insert(productsTable)
    .values(
      curatedCompanies.map((company) => ({
        id: `yc-${company.slug}`,
        slug: company.slug,
        title: company.name,
        shortDescription:
          company.one_liner?.trim() || `YC company in ${company.industry ?? "technology"}.`,
        description:
          company.long_description?.trim() ||
          `${company.name} is a YC company in ${company.industry ?? "technology"}.`,
        imageUrl: usableImageUrl(company.logo_url),
        category: company.industry ?? "YC company",
        ycBatch: company.batch ?? "Unknown",
        websiteUrl: company.website ?? "",
        location: company.location ?? "",
        creatorId: CURATED_CREATOR_ID,
        creatorName: CURATED_CREATOR_NAME,
        status: "published",
        featured: featuredCompanySlugs.has(company.slug),
      })),
    )
    .onConflictDoNothing();

  const productRows = await db
    .select({ id: productsTable.id, slug: productsTable.slug })
    .from(productsTable);
  const productIdsBySlug = new Map(productRows.map((product) => [product.slug, product.id]));

  const ycParticipants = curatedCompanies.map((company) => ({
    id: participantIdForYcCompany(company.slug),
    productId: productIdsBySlug.get(company.slug) ?? null,
    slug: `yc-${company.slug}`,
    name: company.name,
    shortDescription:
      company.one_liner?.trim() || `YC company in ${company.industry ?? "technology"}.`,
    description:
      company.long_description?.trim() ||
      `${company.name} is a YC company in ${company.industry ?? "technology"}.`,
    imageUrl: usableImageUrl(company.logo_url),
    websiteUrl: company.website ?? "",
    ycBatch: company.batch ?? null,
    category: company.industry ?? "YC company",
    location: company.location ?? "",
    isYcCompany: true,
  }));
  const rivalParticipants = curatedCompetitors
    .filter((competitor) => referencedRivalIds.has(competitor.id))
    .map((competitor) => ({
      id: participantIdForRival(competitor.id),
      productId: null,
      slug: `rival-${competitor.slug}`,
      name: competitor.name,
      shortDescription: competitor.one_liner,
      description: competitor.description,
      imageUrl: usableImageUrl(competitor.logo_url),
      websiteUrl: competitor.website,
      ycBatch: null,
      category: competitor.category,
      location: competitor.location,
      isYcCompany: false,
    }));

  await db
    .insert(battleParticipantsTable)
    .values([...ycParticipants, ...rivalParticipants])
    .onConflictDoUpdate({
      target: battleParticipantsTable.slug,
      set: {
        productId: sql`excluded.product_id`,
        name: sql`excluded.name`,
        shortDescription: sql`excluded.short_description`,
        description: sql`excluded.description`,
        imageUrl: sql`excluded.image_url`,
        websiteUrl: sql`excluded.website_url`,
        ycBatch: sql`excluded.yc_batch`,
        category: sql`excluded.category`,
        location: sql`excluded.location`,
        isYcCompany: sql`excluded.is_yc_company`,
      },
    });

  const participantIdsBySlug = new Map(
    (
      await db
        .select({ id: battleParticipantsTable.id, slug: battleParticipantsTable.slug })
        .from(battleParticipantsTable)
    ).map((participant) => [participant.slug, participant.id]),
  );

  await db
    .insert(battlesTable)
    .values(
      curatedBattles.map((battle) => ({
        id: battle.id,
        slug: battle.slug,
        title: battle.title,
        description: `${battle.space}: ${battle.left_argument} ${battle.right_argument}`,
        category: battle.space,
        participantAId:
          participantIdsBySlug.get(`yc-${battle.yc_slug}`) ??
          participantIdForYcCompany(battle.yc_slug),
        participantBId:
          participantIdsBySlug.get(
            `rival-${curatedCompetitors.find((rival) => rival.id === battle.rival_id)?.slug ?? battle.rival_id}`,
          ) ?? participantIdForRival(battle.rival_id),
        status: LAUNCH_BATTLE_SLUGS.has(battle.slug) ? "active" : "archived",
        isLaunch: LAUNCH_BATTLE_SLUGS.has(battle.slug),
      })),
    )
    .onConflictDoUpdate({
      target: battlesTable.slug,
      set: {
        title: sql`excluded.title`,
        description: sql`excluded.description`,
        category: sql`excluded.category`,
        participantAId: sql`excluded.participant_a_id`,
        participantBId: sql`excluded.participant_b_id`,
        status: sql`excluded.status`,
        isLaunch: sql`excluded.is_launch`,
      },
    });

  await db
    .update(battlesTable)
    .set({ status: "archived", isLaunch: false })
    .where(inArray(battlesTable.slug, LEGACY_DEMO_BATTLE_SLUGS));

  const launchBattles = await db
    .select()
    .from(battlesTable)
    .where(and(eq(battlesTable.isLaunch, true), eq(battlesTable.status, "active")));
  const launchParticipantIds = [...new Set(launchBattles.flatMap((battle) => [battle.participantAId, battle.participantBId]))];
  const launchParticipants = launchParticipantIds.length
    ? await db.select().from(battleParticipantsTable).where(inArray(battleParticipantsTable.id, launchParticipantIds))
    : [];
  const axisScores = (participant: typeof battleParticipantsTable.$inferSelect) => {
    const category = participant.category.toLowerCase();
    const regulated = /fintech|health|insurance|legal|government|energy/.test(category) ? 1 : 4;
    const consumer = /consumer|travel|food|marketplace|media|retail/.test(category) ? 5 : 2;
    const scale = participant.isYcCompany ? 2 : 5;
    const batchYear = Number(participant.ycBatch?.match(/(19|20)\d{2}/)?.[0] ?? "2020");
    return {
      "infra-consumer": consumer,
      "challenger-incumbent": participant.isYcCompany ? 1 : 5,
      "craft-scale": scale,
      "batch-era": batchYear >= 2020 ? 4 : batchYear >= 2015 ? 3 : 2,
      "regulated-software": regulated,
    };
  };
  const axisRows = launchParticipants.flatMap((participant) =>
    Object.entries(axisScores(participant)).map(([axisKey, score]) => ({
      id: `launch-axis-${participant.id}-${axisKey}`,
      participantId: participant.id,
      axisKey,
      score,
      source: "Curated from public company descriptions",
      version: "launch-rubric-v1",
    })),
  );
  if (axisRows.length) {
    await db
      .insert(perceptionAxesTable)
      .values(axisRows)
      .onConflictDoUpdate({
        target: [perceptionAxesTable.participantId, perceptionAxesTable.axisKey],
        set: { score: sql`excluded.score`, source: sql`excluded.source`, version: sql`excluded.version` },
      });
  }
}
/**
 * Import curated non-YC competitors + battles from data/battles/rivalries.json
 * Requires YC companies already imported (matched by yc_slug).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { eq } from "drizzle-orm";
import { battlesTable, db, productsTable, usersTable } from "@workspace/db";

type RivalriesFile = {
  competitors: Array<{
    id: string;
    slug: string;
    name: string;
    one_liner: string;
    description: string;
    website: string;
    category: string;
    tags: string[];
    location: string;
    logo_url: string;
  }>;
  battles: Array<{
    id: string;
    slug: string;
    title: string;
    space: string;
    yc_slug: string;
    rival_id: string;
    left_argument: string;
    right_argument: string;
    featured: boolean;
  }>;
};

const SYSTEM_USER_ID = "yc-directory";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const rivalriesPath = path.join(root, "data", "battles", "rivalries.json");

async function main() {
  const data = JSON.parse(fs.readFileSync(rivalriesPath, "utf8")) as RivalriesFile;

  await db
    .insert(usersTable)
    .values({ id: SYSTEM_USER_ID, displayName: "YC Directory" })
    .onConflictDoUpdate({
      target: usersTable.id,
      set: { displayName: "YC Directory" },
    });

  let competitorsUpserted = 0;
  for (const c of data.competitors) {
    const values = {
      id: c.id,
      slug: c.slug,
      title: c.name,
      shortDescription: c.one_liner,
      description: c.description,
      imageUrl: c.logo_url,
      category: c.category,
      ycBatch: "Non-YC",
      websiteUrl: c.website,
      location: c.location,
      source: "external",
      tags: c.tags,
      creatorId: SYSTEM_USER_ID,
      creatorName: "Rival Directory",
      status: "published",
      featured: false,
    };
    const [existing] = await db.select({ id: productsTable.id }).from(productsTable).where(eq(productsTable.id, c.id));
    if (existing) {
      await db.update(productsTable).set(values).where(eq(productsTable.id, c.id));
    } else {
      await db.insert(productsTable).values(values);
    }
    competitorsUpserted += 1;
  }

  let battlesUpserted = 0;
  let skipped = 0;
  for (const b of data.battles) {
    const [yc] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, b.yc_slug));
    if (!yc) {
      console.warn(`Skipping battle ${b.slug}: missing YC company slug=${b.yc_slug}`);
      skipped += 1;
      continue;
    }
    const values = {
      id: b.id,
      slug: b.slug,
      title: b.title,
      space: b.space,
      description: `${b.title}: paid community pick in ${b.space}. Not investment advice.`,
      leftProductId: yc.id,
      rightProductId: b.rival_id,
      leftArgument: b.left_argument,
      rightArgument: b.right_argument,
      status: "published",
      featured: b.featured,
    };
    const [existing] = await db.select({ id: battlesTable.id }).from(battlesTable).where(eq(battlesTable.id, b.id));
    if (existing) {
      await db.update(battlesTable).set(values).where(eq(battlesTable.id, b.id));
    } else {
      await db.insert(battlesTable).values(values);
    }
    battlesUpserted += 1;
  }

  console.log(JSON.stringify({ competitorsUpserted, battlesUpserted, skipped }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Import data/yc-companies/directory.json into market_products.
 *
 * Env:
 *   DATABASE_URL (required)
 *   YC_IMPORT_LIMIT (optional) — max rows (useful for smoke tests)
 *   YC_IMPORT_STATUS (optional) — filter by YC status, default: all
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { eq } from "drizzle-orm";
import { db, productsTable, usersTable } from "@workspace/db";

type DirectoryCompany = {
  id: number;
  name: string;
  slug: string;
  website: string;
  one_liner: string;
  long_description: string;
  batch: string;
  status: string;
  industry: string;
  location: string;
  logo_url: string;
  top_company: boolean;
  tags?: string[];
};

const SYSTEM_USER_ID = "yc-directory";
const PLACEHOLDER_IMAGE =
  "https://www.ycombinator.com/favicon.ico";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const directoryPath = path.join(root, "data", "yc-companies", "directory.json");

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function main() {
  if (!fs.existsSync(directoryPath)) {
    throw new Error(`Missing ${directoryPath}. Run scripts/sync-yc-companies.mjs first.`);
  }

  const companies = JSON.parse(fs.readFileSync(directoryPath, "utf8")) as DirectoryCompany[];
  const statusFilter = process.env.YC_IMPORT_STATUS?.trim();
  const limit = Number(process.env.YC_IMPORT_LIMIT || "0");

  let rows = statusFilter
    ? companies.filter((c) => c.status.toLowerCase() === statusFilter.toLowerCase())
    : companies;
  if (limit > 0) rows = rows.slice(0, limit);

  await db
    .insert(usersTable)
    .values({ id: SYSTEM_USER_ID, displayName: "YC Directory" })
    .onConflictDoUpdate({
      target: usersTable.id,
      set: { displayName: "YC Directory" },
    });

  let inserted = 0;
  let updated = 0;
  const seenSlugs = new Set<string>();

  for (const company of rows) {
    const baseSlug = slugify(company.slug || company.name) || `yc-${company.id}`;
    let slug = baseSlug;
    let n = 2;
    while (seenSlugs.has(slug)) {
      slug = `${baseSlug}-${n++}`;
    }
    seenSlugs.add(slug);

    const values = {
      id: `yc-${company.id}`,
      slug,
      title: company.name || slug,
      shortDescription: company.one_liner || company.name || "YC company",
      description:
        company.long_description ||
        company.one_liner ||
        `${company.name} is a Y Combinator company.`,
      imageUrl: company.logo_url || PLACEHOLDER_IMAGE,
      category: company.industry || "Other",
      ycBatch: company.batch || "Unknown",
      websiteUrl: company.website || "",
      location: company.location || "",
      source: "yc",
      tags: company.tags ?? [],
      creatorId: SYSTEM_USER_ID,
      creatorName: "YC Directory",
      status: "published" as const,
      featured: Boolean(company.top_company),
    };

    const [existing] = await db
      .select({ id: productsTable.id })
      .from(productsTable)
      .where(eq(productsTable.id, values.id));

    if (existing) {
      await db
        .update(productsTable)
        .set({
          slug: values.slug,
          title: values.title,
          shortDescription: values.shortDescription,
          description: values.description,
          imageUrl: values.imageUrl,
          category: values.category,
          ycBatch: values.ycBatch,
          websiteUrl: values.websiteUrl,
          location: values.location,
          source: values.source,
          tags: values.tags,
          featured: values.featured,
          status: values.status,
        })
        .where(eq(productsTable.id, values.id));
      updated += 1;
    } else {
      await db.insert(productsTable).values(values);
      inserted += 1;
    }
  }

  console.log(
    JSON.stringify(
      {
        source: directoryPath,
        considered: rows.length,
        inserted,
        updated,
        statusFilter: statusFilter || null,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

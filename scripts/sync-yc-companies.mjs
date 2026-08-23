#!/usr/bin/env node
/**
 * Rebuild data/yc-companies/directory.json + meta.json from all.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "data", "yc-companies");
const allPath = path.join(dir, "all.json");

const all = JSON.parse(fs.readFileSync(allPath, "utf8"));
if (!Array.isArray(all)) {
  throw new Error(`Expected array in ${allPath}`);
}

const slim = all.map((c) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  website: c.website || "",
  one_liner: c.one_liner || "",
  long_description: c.long_description || "",
  batch: c.batch || "",
  status: c.status || "",
  industry: c.industry || "",
  subindustry: c.subindustry || "",
  tags: c.tags || [],
  industries: c.industries || [],
  location: c.all_locations || "",
  team_size: c.team_size ?? null,
  logo_url: c.small_logo_thumb_url || "",
  yc_url: c.url || `https://www.ycombinator.com/companies/${c.slug}`,
  top_company: Boolean(c.top_company),
  is_hiring: Boolean(c.isHiring),
  launched_at: c.launched_at ?? null,
}));

fs.writeFileSync(path.join(dir, "directory.json"), JSON.stringify(slim));
fs.writeFileSync(
  path.join(dir, "meta.json"),
  JSON.stringify(
    {
      source: "https://github.com/yc-oss/api",
      source_note:
        "Unofficial daily mirror of YC public Algolia directory (ycombinator.com/companies). Not affiliated with Y Combinator.",
      fetched_at: new Date().toISOString(),
      company_count: slim.length,
      files: {
        "all.json": "Full yc-oss company records",
        "directory.json": "Normalized fields for apps/import (stable schema)",
      },
    },
    null,
    2,
  ),
);

console.log(`Synced ${slim.length} companies into data/yc-companies/`);

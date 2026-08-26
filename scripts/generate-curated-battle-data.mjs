import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const companiesSource = JSON.parse(
  await readFile(
    path.join(root, "data", "yc-companies", "referenced.json"),
    "utf8",
  ),
);
const rivalriesSource = JSON.parse(
  await readFile(path.join(root, "data", "battles", "rivalries.json"), "utf8"),
);

const output = `// Generated from the curated source snapshots in /data. Keep data changes in JSON; this module keeps the API deployment self-contained.

export type CuratedCompany = {
  [key: string]: unknown;
  batch: string | null;
  category?: string;
  industry: string | null;
  location: string | null;
  logo_url: string | null;
  long_description: string | null;
  name: string;
  one_liner: string | null;
  slug: string;
  website: string | null;
};

export type CuratedCompetitor = {
  [key: string]: unknown;
  id: string;
  slug: string;
  name: string;
  one_liner: string;
  description: string;
  website: string;
  category: string;
  location: string;
  logo_url: string;
};

export type CuratedBattle = {
  [key: string]: unknown;
  id: string;
  slug: string;
  title: string;
  space: string;
  yc_slug: string;
  rival_id?: string;
  rival_yc_slug?: string;
  left_argument: string;
  right_argument: string;
  featured: boolean;
};

export const curatedCompanies: CuratedCompany[] = ${JSON.stringify(companiesSource.companies, null, 2)};

export const curatedCompetitors: CuratedCompetitor[] = ${JSON.stringify(rivalriesSource.competitors, null, 2)};

export const curatedBattles: CuratedBattle[] = ${JSON.stringify(rivalriesSource.battles, null, 2)};
`;

await writeFile(
  path.join(
    root,
    "artifacts",
    "api-server",
    "src",
    "lib",
    "curatedBattleData.ts",
  ),
  output,
);

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const artifactDir = path.resolve(scriptDir, '..');
const workspaceDir = path.resolve(artifactDir, '..', '..');
const publicDir = path.join(artifactDir, 'dist', 'public');
const shellPath = path.join(publicDir, 'index.html');
const shellHtml = fs.readFileSync(shellPath, 'utf8');
const site = 'https://ycbattle.com';

const rivalryData = JSON.parse(
  fs.readFileSync(path.join(workspaceDir, 'data', 'battles', 'rivalries.json'), 'utf8'),
);
const companyData = JSON.parse(
  fs.readFileSync(path.join(workspaceDir, 'data', 'yc-companies', 'referenced.json'), 'utf8'),
);
const battleSeed = fs.readFileSync(
  path.join(workspaceDir, 'artifacts', 'api-server', 'src', 'lib', 'battleSeed.ts'),
  'utf8',
);

function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function tag(attribute, key, content) {
  return `<meta ${attribute}="${escapeAttribute(key)}" content="${escapeAttribute(content)}" />`;
}

function routeHtml({ title, description, route, image = '/og.png', noindex = false, bodyHtml, structuredData }) {
  let html = shellHtml;
  const canonical = `${site}${route}`;
  const imageUrl = image.startsWith('http') ? image : `${site}${image}`;
  const metadata = [
    `<title>${escapeAttribute(title)}</title>`,
    tag('name', 'description', description),
    tag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow'),
    tag('property', 'og:title', title),
    tag('property', 'og:description', description),
    tag('property', 'og:type', 'website'),
    tag('property', 'og:url', canonical),
    tag('property', 'og:site_name', 'YC Battle'),
    tag('property', 'og:image', imageUrl),
    tag('property', 'og:image:width', '1200'),
    tag('property', 'og:image:height', '630'),
    tag('name', 'twitter:card', 'summary_large_image'),
    tag('name', 'twitter:title', title),
    tag('name', 'twitter:description', description),
    tag('name', 'twitter:image', imageUrl),
    `<link rel="canonical" href="${escapeAttribute(canonical)}" />`,
  ].join('\n    ');
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, metadata.match(/<title>[\s\S]*?<\/title>/)[0])
    .replace(/<meta name="description"[^>]*\/>/, metadata.match(/<meta name="description"[^>]*\/>/)[0])
    .replace(/<meta name="robots"[^>]*\/>/, metadata.match(/<meta name="robots"[^>]*\/>/)[0])
    .replace(/<meta property="og:title"[^>]*\/>/, metadata.match(/<meta property="og:title"[^>]*\/>/)[0])
    .replace(/<meta property="og:description"[^>]*\/>/, metadata.match(/<meta property="og:description"[^>]*\/>/)[0])
    .replace(/<meta property="og:type"[^>]*\/>/, metadata.match(/<meta property="og:type"[^>]*\/>/)[0])
    .replace(/<meta property="og:url"[^>]*\/>/, metadata.match(/<meta property="og:url"[^>]*\/>/)[0])
    .replace(/<meta property="og:site_name"[^>]*\/>/, metadata.match(/<meta property="og:site_name"[^>]*\/>/)[0])
    .replace(/<meta property="og:image"[^>]*\/>/, metadata.match(/<meta property="og:image"[^>]*\/>/)[0])
    .replace(/<meta property="og:image:width"[^>]*\/>/, metadata.match(/<meta property="og:image:width"[^>]*\/>/)[0])
    .replace(/<meta property="og:image:height"[^>]*\/>/, metadata.match(/<meta property="og:image:height"[^>]*\/>/)[0])
    .replace(/<meta name="twitter:card"[^>]*\/>/, metadata.match(/<meta name="twitter:card"[^>]*\/>/)[0])
    .replace(/<meta name="twitter:title"[^>]*\/>/, metadata.match(/<meta name="twitter:title"[^>]*\/>/)[0])
    .replace(/<meta name="twitter:description"[^>]*\/>/, metadata.match(/<meta name="twitter:description"[^>]*\/>/)[0])
    .replace(/<meta name="twitter:image"[^>]*\/>/, metadata.match(/<meta name="twitter:image"[^>]*\/>/)[0])
    .replace(/<link rel="canonical"[^>]*\/>/, metadata.match(/<link rel="canonical"[^>]*\/>/)[0]);
  const jsonLd = `<script type="application/ld+json" data-seo-jsonld>${JSON.stringify(structuredData ?? siteGraph)}</script>`;
  html = html.replace(
    /<script type="application\/ld\+json" data-seo-jsonld>[\s\S]*?<\/script>/,
    jsonLd,
  );
  if (!html.includes('data-seo-jsonld')) html = html.replace('</head>', `    ${jsonLd}\n  </head>`);
  const fallbackBody = `<main><h1>${escapeAttribute(title)}</h1><p>${escapeAttribute(description)}</p></main>`;
  return html.replace('<div id="root"></div>', `<div id="root">${bodyHtml ?? fallbackBody}</div>`);
}

function writeRoute(route, metadata) {
  const routeDir = path.join(publicDir, route.replace(/^\/|\/$/g, ''));
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml({ route, ...metadata }));
}

const activeSlugs = new Set(
  [...battleSeed.matchAll(/"([^"]+)"(?:,|$)/gm)].map((match) => match[1]),
);
const companiesBySlug = new Map(companyData.companies.map((company) => [company.slug, company]));
const competitorsById = new Map(rivalryData.competitors.map((competitor) => [competitor.id, competitor]));

const publicBattles = rivalryData.battles.filter(
  (battle) => !activeSlugs.size || activeSlugs.has(battle.slug),
);
const publicCompanyLinks = [
  ...companyData.companies.map((company) => ({
    slug: `yc-${company.slug}`,
    name: company.name,
  })),
  ...publicBattles
    .map((battle) => competitorsById.get(battle.rival_id))
    .filter(Boolean)
    .map((competitor) => ({
      slug: `rival-${competitor.slug}`,
      name: competitor.name,
    })),
];
const siteGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': `${site}/#website`, name: 'YC Battle', url: `${site}/` },
    { '@type': 'Organization', '@id': `${site}/#organization`, name: 'YC Battle', url: `${site}/` },
  ],
};
const withPage = (page) => ({
  '@context': 'https://schema.org',
  '@graph': [...siteGraph['@graph'], page],
});

writeRoute('/', {
  title: 'YC Battle — Independent company perception',
  description: 'Make fast, free pairwise choices and explore a confidence-aware map of how the community perceives YC companies.',
  bodyHtml: `<main><h1>Compare YC startups through community perception signals.</h1><p>Make fast, free pairwise choices and explore a confidence-aware map of how the community perceives YC companies.</p><nav><a href="/battles">Browse comparisons</a> <a href="/map">Explore the ecosystem map</a></nav></main>`,
  structuredData: siteGraph,
});
writeRoute('/battles', {
  title: 'YC Company Comparisons — YC Battle',
  description: 'Browse live YC company comparisons and make private pairwise choices that reveal community perception.',
  bodyHtml: `<main><h1>YC Company Comparisons</h1><p>Browse live YC company comparisons and make private pairwise choices that reveal community perception.</p><ul>${publicBattles
    .map((battle) => `<li><a href="/battles/${encodeURIComponent(battle.slug)}">${escapeAttribute(battle.title)}</a></li>`)
    .join('')}</ul></main>`,
  structuredData: withPage({
    '@type': 'CollectionPage',
    name: 'YC Company Comparisons',
    url: `${site}/battles`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: publicBattles.map((battle, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${site}/battles/${encodeURIComponent(battle.slug)}`,
        name: battle.title,
      })),
    },
  }),
});
writeRoute('/map', {
  title: 'YC Ecosystem Map — Company Perception | YC Battle',
  description: 'Explore how YC companies cluster by co-voting affinity and word overlap in the YC Battle ecosystem map.',
  image: '/api/og/map.png',
  bodyHtml: `<main><h1>YC Ecosystem Map</h1><p>Explore how YC companies cluster by co-voting affinity and word overlap in the YC Battle ecosystem map.</p><a href="/battles">Browse comparisons</a><h2>Company profiles</h2><ul>${publicCompanyLinks
    .map((company) => `<li><a href="/companies/${encodeURIComponent(company.slug)}">${escapeAttribute(company.name)}</a></li>`)
    .join('')}</ul></main>`,
  structuredData: withPage({
    '@type': 'CollectionPage',
    name: 'YC Ecosystem Map',
    url: `${site}/map`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: publicCompanyLinks.map((company, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${site}/companies/${encodeURIComponent(company.slug)}`,
        name: company.name,
      })),
    },
  }),
});
writeRoute('/legal', {
  title: 'Independence & Privacy — YC Battle',
  description: "Read YC Battle's independence, privacy, anonymous session, and community perception policies.",
  bodyHtml: '<main><h1>Independence &amp; Privacy</h1><p>Read YC Battle’s independence, privacy, anonymous session, and community perception policies.</p></main>',
  structuredData: withPage({
    '@type': 'WebPage',
    name: 'Independence & Privacy',
    url: `${site}/legal`,
  }),
});

for (const battle of publicBattles) {
  const company = companiesBySlug.get(battle.yc_slug);
  const competitor = competitorsById.get(battle.rival_id);
  const leftName = company?.name ?? battle.title.split(' vs ')[0];
  const rightName = competitor?.name ?? battle.title.split(' vs ')[1];
  writeRoute(`/battles/${battle.slug}`, {
    title: `${leftName} vs ${rightName} — YC Battle`,
    description: `Compare ${leftName} and ${rightName} in a private, pairwise perception study on YC Battle.`,
    image: `/api/og/battle/${encodeURIComponent(battle.slug)}.png`,
    bodyHtml: `<main><h1>${escapeAttribute(leftName)} vs ${escapeAttribute(rightName)}</h1><p>${escapeAttribute(battle.left_argument)} ${escapeAttribute(battle.right_argument)}</p><p>Choose the company you associate more strongly with this category. Your choice is private and contributes to aggregate community perception.</p><nav><a href="/battles">All comparisons</a> <a href="/companies/yc-${encodeURIComponent(battle.yc_slug)}">${escapeAttribute(leftName)} company profile</a> <a href="/companies/rival-${encodeURIComponent(competitor?.slug ?? battle.rival_id)}">${escapeAttribute(rightName)} company profile</a></nav></main>`,
    structuredData: withPage({
      '@type': 'WebPage',
      name: `${leftName} vs ${rightName} — YC Battle`,
      url: `${site}/battles/${encodeURIComponent(battle.slug)}`,
      about: [
        { '@type': 'Organization', name: leftName, description: company?.one_liner },
        { '@type': 'Organization', name: rightName, description: competitor?.one_liner },
      ],
    }),
  });
}

for (const company of companyData.companies) {
  writeRoute(`/companies/yc-${company.slug}`, {
    title: `${company.name} — Company Perception | YC Battle`,
    description: `${company.one_liner ?? `Explore ${company.name} on YC Battle.`} Explore community perception signals for ${company.name} on YC Battle.`,
    image: `/api/og/company/yc-${encodeURIComponent(company.slug)}.png`,
    bodyHtml: `<main><h1>${escapeAttribute(company.name)}</h1><p>${escapeAttribute(company.one_liner ?? '')}</p><p>Explore community-derived, unverified perception signals for ${escapeAttribute(company.name)}.</p><a href="/battles">Browse comparisons</a></main>`,
    structuredData: withPage({
      '@type': 'Organization',
      '@id': `${site}/companies/yc-${encodeURIComponent(company.slug)}#organization`,
      name: company.name,
      description: company.long_description || company.one_liner,
      url: company.website || undefined,
      knowsAbout: company.industry || undefined,
    }),
  });
}

for (const battle of publicBattles) {
  const competitor = competitorsById.get(battle.rival_id);
  if (!competitor) continue;
  writeRoute(`/companies/rival-${competitor.slug}`, {
    title: `${competitor.name} — Company Perception | YC Battle`,
    description: `${competitor.one_liner} Explore community perception signals for ${competitor.name} on YC Battle.`,
    image: `/api/og/company/rival-${encodeURIComponent(competitor.slug)}.png`,
    bodyHtml: `<main><h1>${escapeAttribute(competitor.name)}</h1><p>${escapeAttribute(competitor.one_liner ?? '')}</p><p>Explore community-derived, unverified perception signals for ${escapeAttribute(competitor.name)}.</p><a href="/battles">Browse comparisons</a></main>`,
    structuredData: withPage({
      '@type': 'Organization',
      '@id': `${site}/companies/rival-${encodeURIComponent(competitor.slug)}#organization`,
      name: competitor.name,
      description: competitor.description || competitor.one_liner,
      url: competitor.website || undefined,
      knowsAbout: competitor.category || undefined,
    }),
  });
}

for (const route of ['/swipe', '/dna', '/transactions', '/submit', '/sign-in', '/sign-up', '/ecosystem']) {
  writeRoute(route, {
    title: 'Private tools — YC Battle',
    description: 'Private YC Battle tools for comparing companies and reviewing your perception profile.',
    noindex: true,
  });
}

const sitemapRoutes = [
  '/',
  '/battles',
  '/map',
  '/legal',
  ...publicBattles.map((battle) => `/battles/${battle.slug}`),
  ...companyData.companies.map((company) => `/companies/yc-${company.slug}`),
  ...publicBattles
    .map((battle) => competitorsById.get(battle.rival_id)?.slug)
    .filter(Boolean)
    .map((slug) => `/companies/rival-${slug}`),
];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes
  .map((route) => `  <url><loc>${site}${route}</loc></url>`)
  .join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);

console.log(`Generated SEO documents in ${publicDir}`);
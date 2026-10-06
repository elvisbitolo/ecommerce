#!/usr/bin/env node
/**
 * Catalog importer — pulls the full United Tools Ltd public catalog into Supabase.
 *
 * Sources (public WordPress/WooCommerce REST APIs):
 *   - wp/v2/product_cat   -> Category tree (slug, parent, counts)
 *   - wp/v2/product_tag   -> Tag / industry terms
 *   - wp/v2/pwb-brand     -> Brand terms
 *   - wp/v2/product       -> per-product brand lookup (store API omits brands)
 *   - wc/store/v1/products-> products: name, slug, sku, prices, stock, images,
 *                            categories, tags, descriptions, attributes
 *
 * Idempotent: upserts by sourceId, re-running refreshes existing rows.
 * Images are stored as remote URLs (hotlinked from utl.co.ke); mirroring to
 * Supabase Storage is a separate, later step.
 *
 * Usage: node scripts/pull-wc.mjs
 */

import fs from "node:fs";
import { PrismaClient } from "@prisma/client";

const BASE = "https://utl.co.ke/wp-json";
const USER_AGENT = "itl-storefront-importer/1.0 (research/eval)";
const PAGE_SIZE = 100; // max allowed by the store API
const CONCURRENCY = 10;
const CHUNK = 25;

const env = fs.readFileSync(".env", "utf8");
const match = env.match(/^DATABASE_URL="?([^"\n]+)"?/m);
if (!match) {
  console.error("DATABASE_URL not found in .env");
  process.exit(1);
}
process.env.DATABASE_URL = match[1];

const prisma = new PrismaClient();

async function fetchJson(path, retries = 4) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE}${path}`, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        signal: AbortSignal.timeout(45000),
      });
      if (res.ok) return await res.json();
      lastError = new Error(`${path} -> HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }
    if (attempt < retries) await new Promise((r) => setTimeout(r, 800 * attempt));
  }
  throw lastError;
}

async function fetchAll(fragment, fields, pages) {
  const out = [];
  for (let page = 1; ; page++) {
    const rows = await fetchJson(
      `${fragment}?per_page=${PAGE_SIZE}&page=${page}&_fields=${fields}`
    );
    if (!Array.isArray(rows) || rows.length === 0) break;
    out.push(...rows);
    if (pages && page >= pages) break;
    if (rows.length < PAGE_SIZE) break;
  }
  return out;
}

function decodeEntities(str) {
  if (!str) return str;
  return str.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

function toSlug(str) {
  return (str || "")
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function priceToNumber(raw) {
  if (raw == null || raw === "" || raw === "0") return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run(chunk, fn) {
  const results = [];
  for (let i = 0; i < chunk.length; i += CHUNK) {
    const slice = chunk.slice(i, i + CHUNK);
    results.push(...(await Promise.all(slice.map(fn))));
    await delay(60); // be polite to the source
  }
  return results;
}

const sections = (name) => {
  const line = `\n── ${name} ${"─".repeat(Math.max(0, 62 - name.length))}`;
  console.log(line);
};
const tick = () => process.stdout.write(".");

console.log(`IMPORTING UTL CATALOG → ${process.env.DATABASE_URL.split("@")[1]}`);

// ── 1. Categories ────────────────────────────────────────────────
sections("1/6 Categories");
const catRows = await fetchAll(
  "/wp/v2/product_cat",
  "id,slug,name,parent,count"
);
console.log(`  fetched ${catRows.length} category terms`);
const catIdToSlug = new Map(catRows.map((c) => [c.id, c.slug]));
for (const c of catRows) {
  await prisma.category.upsert({
    where: { slug: c.slug },
    create: {
      slug: c.slug,
      name: decodeEntities(c.name),
      parentId: null, // resolved in phase 1b
      count: c.count,
    },
    update: { count: c.count },
  });
}
// resolve parents once all rows exist
const catsById = new Map(
  (await prisma.category.findMany()).map((c) => [c.slug, c.id])
);
for (const c of catRows) {
  if (!c.parent) continue;
  const parentSlug = catIdToSlug.get(c.parent);
  const parentId = parentSlug ? catsById.get(parentSlug) : null;
  const id = catsById.get(c.slug);
  if (id && parentId && id !== parentId) {
    await prisma.category.update({ where: { id }, data: { parentId } });
  }
}
tick();

// ── 2. Tags / industries ─────────────────────────────────────────
sections("2/6 Tags & industries");
const tagRows = await fetchAll(
  "/wp/v2/product_tag",
  "id,slug,name,count"
);
console.log(`  fetched ${tagRows.length} tag terms`);
const tagIdToSlug = new Map(tagRows.map((t) => [t.id, t.slug]));
for (const t of tagRows) {
  const kind = t.slug.startsWith("market-") ? "industry" : "tag";
  await prisma.tag.upsert({
    where: { slug: t.slug },
    create: { slug: t.slug, name: decodeEntities(t.name), kind },
    update: { name: decodeEntities(t.name), kind },
  });
}
tick();

// ── 3. Brands ────────────────────────────────────────────────────
sections("3/6 Brands");
const brandRows = await fetchAll(
  "/wp/v2/pwb-brand",
  "id,slug,name,count"
);
console.log(`  fetched ${brandRows.length} brand terms`);
for (const b of brandRows) {
  await prisma.brand.upsert({
    where: { slug: b.slug },
    create: { slug: b.slug, name: decodeEntities(b.name), count: b.count, 
              updatedAt: new Date() },
    update: { name: decodeEntities(b.name), count: b.count },
  });
}
tick();

// ── 4. Brand lookup per product (wp/v2) ──────────────────────────
sections("4/6 Product → brand map");
const brandIdBySlug = new Map(
  (await prisma.brand.findMany()).map((b) => [b.slug, b.id])
);
const productBrands = [];
for (let page = 1; ; page++) {
  const rows = await fetchJson(
    `/wp/v2/product?per_page=${PAGE_SIZE}&page=${page}&_fields=id,brands`
  );
  if (!Array.isArray(rows) || rows.length === 0) break;
  for (const p of rows) {
    const b = (p.brands || [])[0];
    if (b && brandIdBySlug.get(b.slug)) {
      productBrands.push([p.id, brandIdBySlug.get(b.slug)]);
    }
  }
  if (rows.length < PAGE_SIZE) break;
  await delay(200);
}
const brandByProductId = new Map(productBrands);
console.log(`  mapped ${productBrands.length} products to a brand`);

// ── 5. Products ──────────────────────────────────────────────────
sections("5/6 Products (store API)");
const catBySlug = new Map(
  (await prisma.category.findMany()).map((c) => [c.slug, c.id])
);
const tagBySlug = new Map(
  (await prisma.tag.findMany()).map((t) => [t.slug, t.id])
);

let processed = 0;
const categoryLinks = [];
const tagLinks = [];
const seenLinks = new Set();

async function importProduct(raw) {
  const images = (raw.images || []).map((i) => i.src).filter(Boolean);
  const price = priceToNumber(raw.prices?.price);
  const regular = priceToNumber(raw.prices?.regular_price);

  const result = await prisma.product.upsert({
    where: { sourceId: raw.id },
    create: {
      sourceId: raw.id,
      slug: raw.slug,
      name: decodeEntities(raw.name),
      sku: raw.sku ?? null,
      brandId: brandByProductId.get(raw.id) ?? null,
      price,
      regularPrice: regular,
      onSale: !!raw.on_sale,
      inStock: raw.is_in_stock !== false,
      shortDescription: raw.short_description || null,
      description: raw.description || null,
      images,
    },
    update: {
      name: decodeEntities(raw.name),
      sku: raw.sku ?? null,
      brandId: brandByProductId.get(raw.id) ?? null,
      price,
      regularPrice: regular,
      onSale: !!raw.on_sale,
      inStock: raw.is_in_stock !== false,
      shortDescription: raw.short_description || null,
      description: raw.description || null,
      images,
    },
  });

  // resolve product id for links
  let prodId = result.id;
  let prodSlug = result.slug;
  const linkKey = prodId;

  for (const c of raw.categories || []) {
    const catId = catBySlug.get(c.slug);
    if (!catId) continue;
    const key = `${catId}:${linkKey}`;
    if (seenLinks.has(key)) continue;
    seenLinks.add(key);
    categoryLinks.push({ A: catId, B: prodId });
  }
  for (const t of raw.tags || []) {
    const tagId = tagBySlug.get(t.slug);
    if (!tagId) continue;
    const key = `${tagId}:${linkKey}`;
    if (seenLinks.has(key)) continue;
    seenLinks.add(key);
    tagLinks.push({ A: prodId, B: tagId });
  }
  return null;
}

const storePages = 27;
for (let page = 1; page <= storePages; page++) {
  const rows = await fetchJson(
    `/wc/store/v1/products?per_page=${PAGE_SIZE}&page=${page}`
  );
  if (!Array.isArray(rows) || rows.length === 0) break;
  const before = processed;
  await run(rows, importProduct);
  processed += rows.length;
  console.log(`  page ${page}/${storePages}: ${rows.length} products (${processed - before} on this page)`);
}
console.log(`  processed ${processed} products (${seenLinks.size} category/tag links buffered)`);

// ── 6. Flush many-to-many links + recount ───────────────────────
sections("6/6 Many-to-many links & counts");
if (categoryLinks.length) {
  for (let i = 0; i < categoryLinks.length; i += 5000) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "_CategoryToProduct" ("A","B") SELECT * FROM JSONB_TO_RECORDSET($1::jsonb) AS t("A" text,"B" text) ON CONFLICT DO NOTHING`,
      JSON.stringify(categoryLinks.slice(i, i + 5000))
    );
  }
}
if (tagLinks.length) {
  for (let i = 0; i < tagLinks.length; i += 5000) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "_ProductToTag" ("A","B") SELECT * FROM JSONB_TO_RECORDSET($1::jsonb) AS t("A" text,"B" text) ON CONFLICT DO NOTHING`,
      JSON.stringify(tagLinks.slice(i, i + 5000))
    );
  }
}

// recount live product counts per category/brand
const [byCat, byBrand] = await Promise.all([
  prisma.$queryRawUnsafe(`
    SELECT c.slug, count(*)::int AS n FROM products p
    JOIN "_CategoryToProduct" l ON l."B" = p.id
    JOIN categories c ON c.id = l."A"
    WHERE p."isPublished" = true GROUP BY c.slug`),
  prisma.$queryRawUnsafe(`
    SELECT b.slug, count(*)::int AS n FROM products p
    JOIN brands b ON b.id = p."brandId"
    WHERE p."isPublished" = true GROUP BY b.slug`),
]);
await run(byCat, async ({ slug, n }) => {
  await prisma.category.update({ where: { slug }, data: { count: n } });
});
await run(byBrand, async ({ slug, n }) => {
  await prisma.brand.update({ where: { slug }, data: { count: n } });
});

const totals = await prisma.$transaction([
  prisma.product.count(),
  prisma.category.count(),
  prisma.brand.count(),
  prisma.tag.count(),
]);
const [productsCount, categoriesCount, brandsCount, tagsCount] = totals;
console.log(
  `\nDONE: ${productsCount} products · ${categoriesCount} categories · ${brandsCount} brands · ${tagsCount} tags`
);
await prisma.$disconnect();
import { prisma } from "./prisma";

const catalogSelect = {
  id: true,
  slug: true,
  name: true,
  sku: true,
  brand: { select: { slug: true, name: true } },
  categories: { select: { slug: true, name: true } },
  shortDescription: true,
  description: true,
  images: true,
  inStock: true,
};

const NAMED_ENTITIES = {
  nbsp: " ",
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  times: "×",
  divide: "÷",
  deg: "°",
  bull: "•",
  middot: "·",
  trade: "™",
  reg: "®",
  copy: "©",
  sup1: "¹",
  sup2: "²",
  sup3: "³",
  frac12: "½",
  frac14: "¼",
  frac34: "¾",
  le: "≤",
  ge: "≥",
  ne: "≠",
  plusmn: "±",
  micro: "µ",
  euro: "€",
  pound: "£",
  yen: "¥",
  cent: "¢",
  sect: "§",
};

function safeCodePoint(code, fallback) {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return fallback;
  try {
    return String.fromCodePoint(code);
  } catch {
    return fallback;
  }
}

function decodeEntities(text) {
  let out = String(text);
  for (let pass = 0; pass < 2; pass++) {
    const next = out.replace(
      /&(?:#x([0-9a-f]+)|#(\d+)|([a-z][a-z0-9]+));/gi,
      (match, hex, dec, name) => {
        if (hex) return safeCodePoint(parseInt(hex, 16), match);
        if (dec) return safeCodePoint(Number(dec), match);
        const key = name.toLowerCase();
        return Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, key) ? NAMED_ENTITIES[key] : match;
      }
    );
    if (next === out) return out;
    out = next;
  }
  return out;
}

export function toPlainText(value) {
  if (!value) return "";
  const stripped = String(value)
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/(p|div|h[1-6]|ul|ol|tr)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  return decodeEntities(stripped)
    .replace(/ /g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function cleanText(value) {
  return toPlainText(value).replace(/\s+/g, " ").trim();
}

function mapProduct(row) {
  const category = row.categories?.[0];
  const detail = cleanText(row.shortDescription ?? row.description);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    sku: row.sku ?? "",
    brand: row.brand?.name ?? "",
    category: category?.name ?? "",
    categorySlug: category?.slug ?? "",
    detail,
    image: row.images?.[0] ?? "",
    inStock: row.inStock,
  };
}

function dedupeProducts(rows) {
  const seen = new Set();
  const unique = [];
  for (const row of rows) {
    const key = `${row.brand?.name ?? ""}|${row.name}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(row);
  }
  return unique;
}

export async function getCatalogProducts() {
  const rows = await prisma.product.findMany({
    select: catalogSelect,
    orderBy: { position: "asc" },
    take: 160,
  });
  return dedupeProducts(rows).map(mapProduct);
}

export async function getShopProducts(take = 160) {
  const rows = await prisma.product.findMany({
    where: { isPublished: true },
    select: catalogSelect,
    orderBy: { position: "asc" },
    take,
  });
  return dedupeProducts(rows).map(mapProduct);
}

export async function getCategoryProducts(slug, take = 160) {
  const rows = await prisma.product.findMany({
    where: { isPublished: true, categories: { some: { slug } } },
    select: catalogSelect,
    orderBy: { position: "asc" },
    take,
  });
  return dedupeProducts(rows).map(mapProduct);
}

export async function getCatalogProductBySlug(slug) {
  const row = await prisma.product.findFirst({
    where: { slug, isPublished: true },
    select: catalogSelect,
  });
  return row ? mapProduct(row) : null;
}

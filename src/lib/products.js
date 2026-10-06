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

function cleanText(value) {
  if (!value) return "";
  return String(value)
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/li>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
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
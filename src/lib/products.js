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

function mapProduct(row) {
  const category = row.categories?.[0];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    sku: row.sku ?? "",
    brand: row.brand?.name ?? "",
    category: category?.name ?? "",
    categorySlug: category?.slug ?? "",
    detail: row.shortDescription ?? row.description ?? "",
    image: row.images?.[0] ?? "",
    inStock: row.inStock,
  };
}

export async function getCatalogProducts() {
  const rows = await prisma.product.findMany({
    select: catalogSelect,
    orderBy: { position: "asc" },
    take: 160,
  });
  return rows.map(mapProduct);
}

export async function getShopProducts(take = 160) {
  const rows = await prisma.product.findMany({
    where: { isPublished: true },
    select: catalogSelect,
    orderBy: { position: "asc" },
    take,
  });
  return rows.map(mapProduct);
}

export async function getCategoryProducts(slug, take = 160) {
  const rows = await prisma.product.findMany({
    where: { isPublished: true, categories: { some: { slug } } },
    select: catalogSelect,
    orderBy: { position: "asc" },
    take,
  });
  return rows.map(mapProduct);
}

export async function getCatalogProductBySlug(slug) {
  const row = await prisma.product.findFirst({
    where: { slug, isPublished: true },
    select: catalogSelect,
  });
  return row ? mapProduct(row) : null;
}
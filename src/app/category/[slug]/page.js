import { notFound } from "next/navigation";
import CatalogView from "../../../components/CatalogView";
import { getCategoryProducts } from "../../../lib/products";
import { prisma } from "../../../lib/prisma";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug }, select: { name: true } });
  return { title: category?.name ? `${category.name} | United Tools Ltd` : "Category not found" };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const parent = category.parentId
    ? await prisma.category.findUnique({ where: { id: category.parentId }, select: { name: true } })
    : null;

  const products = await getCategoryProducts(slug);
  const childCount = await prisma.category.count({ where: { parentId: category.id, isPublished: true } });

  return (
    <CatalogView
      category={{
        name: category.name,
        detail: (parent ? `${parent.name} · ` : "") + (category.imageUrl ? "Browse the range and enquire for current pricing and availability." : "Browse the range and enquire for current pricing and availability."),
        slug,
        childCount,
      }}
      products={products}
    />
  );
}
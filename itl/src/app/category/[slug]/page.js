import { notFound } from "next/navigation";
import CatalogView from "../../../components/CatalogView";
import { categories, products } from "../../../data/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  if (!category) return { title: "Category not found" };

  return {
    title: category.name,
    description: `${category.detail}. Browse tools from United Tools Ltd and enquire about current availability.`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const categoryProducts = products.filter((product) => product.categorySlug === slug);

  return (
    <CatalogView
      category={{ name: category.name, detail: category.detail, slug: category.slug }}
      products={categoryProducts}
    />
  );
}

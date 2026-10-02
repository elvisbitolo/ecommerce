import { notFound } from "next/navigation";
import ProductDetails from "../../../components/ProductDetails";
import { products } from "../../../data/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: `${product.name} from ${product.brand}. Enquire about current price and availability from United Tools Ltd.`,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  const relatedProducts = products
    .filter((item) => item.categorySlug === product.categorySlug && item.id !== product.id)
    .slice(0, 4);

  return <ProductDetails product={product} relatedProducts={relatedProducts} />;
}

import CatalogView from "../../components/CatalogView";
import { getCatalogProducts } from "../../lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop All Products",
  description: "Browse the United Tools Ltd industrial tools, abrasives and workshop supplies catalog.",
};

export default async function ShopPage() {
  const products = await getCatalogProducts();

  return (
    <CatalogView
      category={{
        name: "All products",
        detail: "Browse industrial tools, abrasives, measuring equipment and workshop essentials.",
        slug: "all-products",
      }}
      products={products}
    />
  );
}

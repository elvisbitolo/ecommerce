import CatalogView from "../../components/CatalogView";
import { getShopProducts } from "../../lib/products";

export const revalidate = 3600;

export const metadata = {
  title: "Shop All Products | United Tools Ltd",
  description: "Browse industrial tools, abrasives, measuring equipment and workshop essentials. Delivery across Kenya and East Africa.",
};

export default async function ShopPage() {
  const products = await getShopProducts(160);

  return (
    <CatalogView
      category={{
        name: "All products",
        detail: "Browse industrial tools, abrasives, measuring equipment and workshop essentials.",
        slug: "all-products",
        childCount: 0,
      }}
      products={products}
    />
  );
}
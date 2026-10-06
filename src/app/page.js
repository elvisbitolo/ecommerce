import Storefront from "./storefront";
import { getCatalogProducts } from "../lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Precision Measuring Tools & Engineering Equipment Kenya | United Tools Ltd",
  description: "Shop precision measuring tools, engineering equipment, power tools, abrasives, automotive service tools, adhesives, safety gear, and workshop supplies. Delivery across Kenya and East Africa.",
};

export default async function Home() {
  const products = await getCatalogProducts();
  return <Storefront products={products} />;
}

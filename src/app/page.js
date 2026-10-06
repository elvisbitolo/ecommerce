import Storefront from "./storefront";
import { getHomeData } from "../lib/home";

export const revalidate = 3600;

export const metadata = {
  title: "Industrial Tools & Engineering Equipment Kenya | United Tools Ltd",
  description: "Shop precision measuring tools, engineering equipment, power tools, abrasives, automotive service tools, adhesives, safety gear, and workshop supplies. Delivery across Kenya and East Africa.",
};

export default async function Home() {
  const data = await getHomeData();
  return <Storefront data={data} />;
}
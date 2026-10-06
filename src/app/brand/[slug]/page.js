import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import styles from "./brand.module.css";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brand = await prisma.brand.findUnique({ where: { slug }, select: { name: true } });
  if (!brand) return { title: "Brand not found | United Tools Ltd" };
  return { title: `${brand.name} — Tools & Equipment | United Tools Ltd`, description: `Shop ${brand.name} tools and equipment in Kenya. Delivery across East Africa.` };
}

export default async function BrandPage({ params }) {
  const { slug } = await params;
  const brand = await prisma.brand.findUnique({ where: { slug }, select: { name: true, logoUrl: true } });
  if (!brand) notFound();

  const rows = await prisma.product.findMany({
    where: { isPublished: true, brand: { slug } },
    select: { id: true, slug: true, name: true, sku: true, brand: { select: { name: true } }, images: true },
    orderBy: { position: "asc" },
    take: 96,
  });
  const seen = new Set();
  const products = [];
  for (const product of rows) {
    const key = `${product.name}|${product.brand?.name ?? ""}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    products.push(product);
  }

  return (
    <main style={{ maxWidth: 1320, marginInline: "auto", paddingInline: 15, paddingBlock: "36px 70px", minHeight: "70vh" }}>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#768088" }}>Brand catalogue</p>
      <h1 style={{ margin: "10px 0 0", fontSize: "clamp(24px,3vw,40px)", fontWeight: 800 }}>{brand.name}</h1>
      {brand.logoUrl && <img src={brand.logoUrl} alt={brand.name} style={{ marginTop: 18, height: 56, width: "auto" }} />}
      <p style={{ margin: "6px 0 0", color: "#768088", fontSize: 14 }}>{products.length} products available — prices confirmed on request.</p>

      <div className={styles.grid}>
        {products.map((product) => (
          <article key={product.id} className={styles.card}>
            <Link href={`/product/${product.slug}`} className={styles.thumb}>
              {product.images?.[0] ? <Image src={product.images[0]} alt="" fill sizes="300px" style={{ objectFit: "cover" }} /> : null}
            </Link>
            <div style={{ padding: "12px 14px 16px" }}>
              <p style={{ margin: 0, fontSize: 11.5, fontWeight: 700, color: "#004798", textTransform: "uppercase", letterSpacing: "0.08em" }}>{brand.name}</p>
              <h2 style={{ margin: "6px 0 0", fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}><Link href={`/product/${product.slug}`} style={{ color: "inherit" }}>{product.name}</Link></h2>
              <span style={{ display: "inline-flex", marginTop: 10, padding: "6px 12px", fontSize: 12.5, fontWeight: 700, color: "#25a55f", background: "rgba(37,165,95,0.1)", borderRadius: 999 }}>Price on request</span>
            </div>
          </article>
        ))}
      </div>

      {!products.length && <p style={{ marginTop: 30, color: "#768088" }}>No products are currently listed for this brand.</p>}
    </main>
  );
}
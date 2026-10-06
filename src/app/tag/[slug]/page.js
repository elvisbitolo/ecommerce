import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug }, select: { name: true } });
  return { title: `${tag?.name ?? "Category"} | United Tools Ltd` };
}

export default async function TagPage({ params }) {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug }, select: { id: true, name: true } });
  if (!tag) notFound();

  const products = await prisma.product.findMany({
    where: { isPublished: true, tags: { some: { slug } } },
    select: { id: true, slug: true, name: true, sku: true, brand: { select: { name: true } }, images: true },
    orderBy: { position: "asc" },
    take: 96,
  });

  return (
    <main style={{ maxWidth: 1320, marginInline: "auto", paddingInline: 15, paddingBlock: "36px 70px", minHeight: "70vh" }}>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#768088" }}>Industries &amp; solutions</p>
      <h1 style={{ margin: "10px 0 0", fontSize: "clamp(24px,3vw,40px)", fontWeight: 800 }}>{tag.name}</h1>
      <p style={{ margin: "6px 0 0", color: "#768088", fontSize: 14 }}>{products.length} products — prices confirmed on request.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginTop: 26 }}>
        {products.map((product) => (
          <article key={product.id} style={{ border: "1px solid #eceef0", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
            <Link href={`/product/${product.slug}`} style={{ aspectRatio: "1/1", position: "relative", display: "block", background: "#f8f9fa" }}>
              {product.images?.[0] ? <Image src={product.images[0]} alt="" fill sizes="300px" style={{ objectFit: "cover" }} /> : null}
            </Link>
            <div style={{ padding: "12px 14px 16px" }}>
              {product.brand?.name && <p style={{ margin: 0, fontSize: 11.5, fontWeight: 700, color: "#004798", textTransform: "uppercase", letterSpacing: "0.08em" }}>{product.brand.name}</p>}
              <h2 style={{ margin: "6px 0 0", fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}><Link href={`/product/${product.slug}`} style={{ color: "inherit" }}>{product.name}</Link></h2>
              <span style={{ display: "inline-flex", marginTop: 10, padding: "6px 12px", fontSize: 12.5, fontWeight: 700, color: "#25a55f", background: "rgba(37,165,95,0.1)", borderRadius: 999 }}>Price on request</span>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
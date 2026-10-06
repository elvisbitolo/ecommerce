import Image from "next/image";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import styles from "./search.module.css";

export const metadata = { title: "Search Products | United Tools Ltd" };

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const q = (params?.q ?? "").toString().trim();

  const rows = q
    ? await prisma.product.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
            { shortDescription: { contains: q, mode: "insensitive" } },
            { brand: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
        select: {
          id: true,
          slug: true,
          name: true,
          sku: true,
          brand: { select: { name: true } },
          images: true,
        },
        orderBy: { position: "asc" },
        take: 60,
      })
    : [];
  const seen = new Set();
  const products = [];
  for (const product of rows) {
    const key = `${product.name}|${product.brand?.name ?? ""}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    products.push(product);
  }

  return (
    <main className={styles.page}>
      <div className="utl-container">
        <div className={styles.head}>
          <p className="utl-kicker">SEARCH THE CATALOGUE</p>
          <h1>Search results{q ? ` for “${q}”` : ""}</h1>
          <form className={styles.search} action="/search">
            <input name="q" type="search" defaultValue={q} placeholder="Search by product, brand or code" aria-label="Search the catalogue" />
            <button type="submit">Search</button>
          </form>
        </div>

        {q && (
          <>
            <p className={styles.count}>{products.length} product{products.length === 1 ? "" : "s"} found</p>
            {products.length ? (
              <div className={styles.grid}>
                {products.map((product) => (
                  <article key={product.id}>
                    <Link className={styles.thumb} href={`/product/${product.slug}`} aria-label={product.name}>
                      {product.images?.[0] ? <Image src={product.images[0]} alt="" fill sizes="220px" /> : null}
                    </Link>
                    <div>
                      {product.brand?.name && <p className={styles.brand}>{product.brand.name}</p>}
                      <h2><Link href={`/product/${product.slug}`}>{product.name}</Link></h2>
                      {product.sku && <small>SKU: {product.sku}</small>}
                      <span className={styles.priceTag}>Price on request</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <p>No products matched “{q}”.</p>
                <p className={styles.hint}>Try a different keyword, brand name or product code.</p>
                <Link href="/shop">Browse our full catalogue</Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
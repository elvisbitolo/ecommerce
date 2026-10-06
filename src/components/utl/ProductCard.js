import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const image = product.image || product.images?.[0] || "";
  return (
    <article className={styles.card}>
      <Link className={styles.visual} href={`/product/${product.slug}`} aria-label={product.name}>
        {image ? <Image src={image} alt={product.name} fill sizes="(max-width: 640px) 42vw, 20vw" /> : <span className={styles.placeholder} />}
      </Link>
      <div className={styles.info}>
        {product.brand && <p className={styles.brand}>{product.brand}</p>}
        <h3 className={styles.name}><Link href={`/product/${product.slug}`}>{product.name}</Link></h3>
        <div className={styles.foot}>
          <span className={styles.price}>Price on request</span>
          <a
            className={styles.ask}
            href={`https://wa.me/254774888373?text=${encodeURIComponent(`Hello, I would like to enquire about ${product.name} (${product.sku || ""}).`)}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`Ask about ${product.name}`}
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.35A10 10 0 1 0 12 2Zm5.4 14.15c-.22.62-1.3 1.2-1.82 1.23-.5.03-.97.23-3.27-.68-2.77-1.1-4.52-3.95-4.66-4.13-.13-.18-1.1-1.47-1.1-2.8 0-1.33.7-1.99.94-2.26.25-.27.53-.34.71-.34.18 0 .35 0 .5.01.16.01.38-.06.6.46.22.54.74 1.86.81 2 .07.13.11.28.02.46-.09.18-.13.29-.27.45-.13.16-.28.36-.4.48-.13.14-.27.29-.12.56.16.27.7 1.15 1.5 1.87 1.03.92 1.9 1.21 2.17 1.34.27.14.43.11.59-.07.15-.17.68-.8.86-1.07.18-.27.36-.22.6-.13.25.09 1.57.74 1.84.87.27.13.44.2.51.31.06.11.06.65-.16 1.27Z" />
            </svg>
            <span>Ask</span>
          </a>
        </div>
      </div>
    </article>
  );
}
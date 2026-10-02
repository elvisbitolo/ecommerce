"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Plus, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { addEnquiryProduct } from "../lib/enquiry";
import styles from "./product-details.module.css";

function ProductCard({ product }) {
  return (
    <article className={styles.relatedCard}>
      <Link className={styles.relatedImage} href={`/product/${product.slug}`}>
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 600px) 50vw, 25vw" />
      </Link>
      <p>{product.brand}</p>
      <Link className={styles.relatedName} href={`/product/${product.slug}`}>{product.name}</Link>
      <small>Price on request</small>
    </article>
  );
}

export default function ProductDetails({ product, relatedProducts }) {
  const [added, setAdded] = useState(false);
  const whatsappHref = `https://wa.me/254774888373?text=${encodeURIComponent(`Hello, I would like to enquire about ${product.name}.`)}`;

  function addToList() {
    addEnquiryProduct(product);
    setAdded(true);
  }

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>/</span>
        <Link href={`/category/${product.categorySlug}`}>{product.category}</Link><span>/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <section className={styles.productLayout}>
        <div className={styles.imagePanel}>
          <span>{product.category}</span>
          <Image src={product.image} alt={product.name} fill priority sizes="(max-width: 760px) 100vw, 55vw" />
        </div>
        <div className={styles.details}>
          <p className={styles.brand}>{product.brand}</p>
          <p className={styles.category}>{product.category}</p>
          <h1>{product.name}</h1>
          <p className={styles.spec}>{product.detail}</p>
          <div className={styles.priceBlock}><span>Price</span><strong>Price on request</strong><small>Contact us for current price and stock.</small></div>
          <div className={styles.actions}>
            <button className={styles.addButton} type="button" onClick={addToList}>{added ? <Check size={18} /> : <Plus size={18} />}{added ? "Added to enquiry list" : "Add to enquiry list"}</button>
            <a href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Ask about this product</a>
          </div>
          <p className={styles.liveNote} aria-live="polite">{added ? "Added. Continue browsing or review your enquiry list." : ""}</p>
          <div className={styles.promises}>
            <div><ShieldCheck size={18} /><span><strong>Product advice</strong><small>Talk with our tools team</small></span></div>
            <div><Truck size={18} /><span><strong>Delivery enquiry</strong><small>Kenya and East Africa</small></span></div>
          </div>
          <Link className={styles.returnLink} href={`/category/${product.categorySlug}`}><ArrowLeft size={15} /> Back to {product.category}</Link>
        </div>
      </section>
      <section className={styles.more} aria-labelledby="related-heading">
        <div className={styles.moreHeading}><div><p>KEEP EXPLORING</p><h2 id="related-heading">More from {product.category}</h2></div><Link href={`/category/${product.categorySlug}`}>View category <ArrowRight size={15} /></Link></div>
        <div className={styles.relatedGrid}>{relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}</div>
      </section>
      <p className={styles.disclaimer}>Sample frontend catalog. Confirm specifications, price and availability with United Tools Ltd.</p>
    </main>
  );
}

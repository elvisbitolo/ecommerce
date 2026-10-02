"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Plus, Search } from "lucide-react";
import { useState } from "react";
import { addEnquiryProduct } from "../lib/enquiry";
import styles from "./catalog-view.module.css";

function ProductCard({ product }) {
  const [added, setAdded] = useState(false);

  function addProduct() {
    addEnquiryProduct(product);
    setAdded(true);
  }

  return (
    <article className={styles.productCard}>
      <Link className={styles.productImage} href={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 600px) 50vw, (max-width: 940px) 33vw, 25vw" />
        <span>{product.category}</span>
      </Link>
      <div className={styles.productBody}>
        <p className={styles.brand}>{product.brand}</p>
        <h2><Link href={`/product/${product.slug}`}>{product.name}</Link></h2>
        <p className={styles.detail}>{product.detail}</p>
        <div className={styles.productFoot}>
          <strong>Price on request</strong>
          <button type="button" aria-label={`${added ? "Add another" : "Add"} ${product.name} to enquiry list`} onClick={addProduct}>
            {added ? <Check size={17} /> : <Plus size={17} />}
          </button>
        </div>
      </div>
      <span className={styles.visuallyHidden} aria-live="polite">{added ? `${product.name} added to enquiry list` : ""}</span>
    </article>
  );
}

export default function CatalogView({ category, products }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const filteredProducts = products
    .filter((product) => `${product.name} ${product.brand} ${product.detail}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((first, second) => {
      if (sort === "name") return first.name.localeCompare(second.name);
      if (sort === "brand") return first.brand.localeCompare(second.brand);
      return 0;
    });

  return (
    <main className={styles.page}>
      <div className={styles.topline}>
        <Link href="/"><ArrowLeft size={15} /> Back to home</Link>
        <Link href="/enquiry">Enquiry list <ArrowRight size={15} /></Link>
      </div>
      <header className={styles.intro}>
        <p className={styles.kicker}>UNITED TOOLS LTD · PRODUCT RANGE</p>
        <h1>{category.name}</h1>
        <p>{category.detail}. Browse the sample selection, or contact our team for the full range and current availability.</p>
      </header>
      <div className={styles.toolbar}>
        <label className={styles.search}>
          <Search size={17} />
          <span className={styles.visuallyHidden}>Search within {category.name}</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this category" />
        </label>
        <label className={styles.sort}>
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="name">Name A-Z</option>
            <option value="brand">Brand A-Z</option>
          </select>
        </label>
        <span className={styles.count}>{filteredProducts.length} sample {filteredProducts.length === 1 ? "product" : "products"}</span>
      </div>
      {filteredProducts.length ? (
        <div className={styles.grid}>{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      ) : (
        <section className={styles.empty}>
          <Search size={26} />
          <h2>{query ? "No matching products" : "Catalog selection in progress"}</h2>
          <p>{query ? "Try another search term." : "This category does not have sample items yet. Ask our team for the complete range."}</p>
          {query ? <button type="button" onClick={() => setQuery("")}>Clear search</button> : <a href="https://wa.me/254774888373" target="_blank" rel="noreferrer">Ask on WhatsApp <ArrowRight size={15} /></a>}
        </section>
      )}
      <p className={styles.dataNote}>Sample catalog only. Product descriptions, price and availability must be confirmed with United Tools Ltd.</p>
    </main>
  );
}

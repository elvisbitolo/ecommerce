"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import styles from "./FeaturedTabs.module.css";

export default function FeaturedTabs({ categories }) {
  const [active, setActive] = useState(categories[0]?.slug ?? null);
  const current = categories.find((c) => c.slug === active) ?? categories[0];

  return (
    <section className={styles.section} aria-labelledby="utl-featured-heading">
      <div className="utl-container">
        <div className="utl-row-head">
          <div>
            <p className="utl-kicker">HIGHLIGHTED PRODUCTS</p>
            <h2 id="utl-featured-heading">Best Sellers</h2>
          </div>
          <a className="utl-see-all" href={`/category/${current?.slug}`}>Shop {current?.name} <ArrowRight size={16} /></a>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Featured categories">
          {categories.map((category) => (
            <button
              key={category.slug}
              role="tab"
              aria-selected={category.slug === current?.slug}
              className={category.slug === current?.slug ? styles.tabActive : ""}
              onClick={() => setActive(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className={styles.grid} role="tabpanel">
          {current?.products?.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
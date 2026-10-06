"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./SeoAccordion.module.css";

export default function SeoAccordion({ heading, accordions = [] }) {
  if (!accordions?.filter((a) => a.body?.length).length) return null;
  return (
    <section className={styles.section}>
      <div className="utl-container">
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        {accordions.filter((a) => a.body?.length).map((acc) => (
          <details className={styles.item} key={acc.title}>
            <summary>
              <span>{acc.title}</span>
              <ChevronDown size={18} className={styles.caret} />
            </summary>
            <div className={styles.body}>
              {acc.body.map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
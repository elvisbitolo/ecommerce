"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./HeroSlider.module.css";

export default function HeroSlider({ slides = [] }) {
  const [index, setIndex] = useState(0);

  const count = slides.length;
  const prev = (index + count - 1) % count;
  const next = (index + 1) % count;

  useEffect(() => {
    if (count < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 9600);
    return () => clearInterval(timer);
  }, [count, index]);

  if (!count) return null;

  return (
    <section className={styles.hero} aria-label="Featured products" aria-roledescription="carousel">
      {slides.map((slide, i) => (
        <div className={`${styles.slide} ${i === index ? styles.active : ""}`} aria-hidden={i !== index} key={slide.id ?? `${slide.title}-${i}`}>
          <Image className={styles.bg} src={slide.imageUrl} alt="" fill priority={i === 0} sizes="100vw" />
          <div className={styles.veil} />
          <div className={`utl-container ${styles.content}`}>
            <div className={styles.copy}>
              {slide.eyebrow && <p className={styles.eyebrow}>{slide.eyebrow}</p>}
              <h2 className={styles.title}>{slide.title}</h2>
              {slide.copy && <p className={styles.excerpt}>{slide.copy}</p>}
              <Link className={styles.cta} href={slide.href}>
                {slide.ctaLabel || "Shop Now"}
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          {slide.badge && <span className={`${styles.badge} ${styles.badgeNew}`}>{slide.badge}</span>}
        </div>
      ))}

      {count > 1 && (
        <>
          <div className={styles.nav}>
            <button type="button" aria-label="Previous slide" onClick={() => setIndex(prev)}>
              <ChevronLeft size={22} />
            </button>
            <button type="button" aria-label="Next slide" onClick={() => setIndex(next)}>
              <ChevronRight size={22} />
            </button>
          </div>
          <div className={styles.dots}>
            {slides.map((slide, i) => (
              <button key={slide.id ?? i} type="button" aria-label={`Go to slide ${i + 1}`} className={i === index ? styles.dotActive : ""} onClick={() => setIndex(i)} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
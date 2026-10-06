"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Heart, Menu, Phone, Search, User, X } from "lucide-react";
import styles from "./Header.module.css";

const HOTLINE = "+254 774 888 373";
const HOTLINE_TEL = "+254774888373";
const LOGO = "https://utl.co.ke/wp-content/uploads/2024/03/logo-light.png";

function SearchBox({ className, autoFocus }) {
  return (
    <form className={className} action="/search" role="search">
      <Search size={18} aria-hidden="true" />
      <input name="q" type="search" autoComplete="off" placeholder="Search for products" aria-label="Search for products" autoFocus={autoFocus} />
      <button type="submit">Search</button>
    </form>
  );
}

function MegaMenu({ categories }) {
  return (
    <div className={styles.megaPanel}>
      <div className={styles.megaColumns}>
        {categories.map((category) => (
          <div className={styles.megaColumn} key={category.slug}>
            <Link className={styles.megaTitle} href={`/category/${category.slug}`}>{category.name}</Link>
            <ul className={styles.megaList}>
              {category.children.slice(0, 14).map((child) => (
                <li key={child.slug}><Link href={`/category/${child.slug}`}>{child.name}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Link className={styles.megaPromo} href="/shop">
        <Image src="https://utl.co.ke/wp-content/uploads/2025/07/grid-banner-3-spring-divider-inside-caliper.jpg" alt="View our full catalogue" width={240} height={160} />
        <strong>Explore the full catalogue</strong>
        <span>2,000+ industrial products in stock</span>
      </Link>
    </div>
  );
}

function MiniNav({ items, title }) {
  return (
    <div className={styles.miniPanel}>
      <strong className={styles.miniTitle}>{title}</strong>
      <ul className={styles.miniList}>
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={`/product/${item.slug}`}>
              {item.image ? <Image src={item.image} alt="" width={56} height={56} /> : <span className={styles.miniThumb} />}
              <span className={styles.miniText}><em>{item.brand}</em><b>{item.name}</b></span>
            </Link>
          </li>
        ))}
      </ul>
      <Link className={styles.miniMore} href="/shop">View all products</Link>
    </div>
  );
}

export default function Header({ categories = [], industries = [], arrivals = [], highlighted = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlay, setOverlay] = useState(null); // "search" | "mobile"
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = overlay ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [overlay]);

  const lockMenu = (open) => setMenuOpen(open);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.topbar}>
          <div className="utl-container utl-container--flex">
            <span className={styles.hotline}><Phone size={13} /> Office Hotline: Call/Whatsapp <a href={`tel:${HOTLINE_TEL}`}><u>{HOTLINE}</u></a></span>
            <nav className={styles.topLinks} aria-label="Account links">
              <Link href="/shop">Track Order</Link>
              <span className={styles.topDivider} />
              <Link href="/enquiry">Order or Inquire</Link>
            </nav>
          </div>
        </div>

        <div className={styles.main}>
          <div className="utl-container utl-container--flex">
            <button className={styles.burger} type="button" aria-label="Open menu" onClick={() => setOverlay("mobile")}>
              <Menu size={24} />
            </button>

            <Link className={styles.logo} href="/" aria-label="United Tools Ltd home">
              <Image src={LOGO} alt="United Tools Ltd" width={170} height={40} priority />
            </Link>

            <SearchBox className={styles.search} />

            <div className={styles.actions}>
              <button className={styles.actionBtn} type="button" aria-label="Search" onClick={() => setOverlay("search")}>
                <Search size={20} />
              </button>
              <Link className={styles.actionBtn} href="/enquiry" aria-label="My account">
                <User size={20} />
                <span className={styles.actionText}>Account</span>
              </Link>
              <Link className={styles.actionBtn} href="/wishlist" aria-label="Wishlist, 13 items">
                <span className={styles.iconWrap}><Heart size={20} /><b className={styles.badge}>13</b></span>
                <span className={styles.actionText}>Wishlist</span>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.nav} onMouseLeave={() => lockMenu(false)}>
          <div className={`utl-container ${styles.navInner}`}>
            <nav className={styles.navList} aria-label="Primary">
              <div className={styles.navItem}>
                <button type="button" className={styles.navBtn} aria-expanded={menuOpen === "all"} onMouseEnter={() => lockMenu("all")} onClick={() => lockMenu(menuOpen === "all" ? false : "all")}>
                  <span className={styles.gridIcon}><span /><span /><span /></span>
                  All Products
                  <Search size={14} className={styles.navCaret} />
                </button>
                {menuOpen === "all" && <MegaMenu categories={categories} />}
              </div>

              <div className={styles.navItem}>
                <button type="button" className={styles.navBtn} aria-expanded={menuOpen === "industries"} onMouseEnter={() => lockMenu("industries")} onMouseLeave={() => lockMenu(false)} onClick={() => lockMenu(menuOpen === "industries" ? false : "industries")}>
                  Industries &amp; Solutions
                </button>
                {menuOpen === "industries" && (
                  <div className={styles.industriesPanel}>
                    <strong>INDUSTRIES &amp; SOLUTIONS</strong>
                    <ul>
                      {industries.map((tag) => (
                        <li key={tag.slug}><Link href={`/tag/${tag.slug}`}>{tag.name}</Link></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className={styles.navItem}>
                <Link className={styles.navLink} href="/enquiry">Order or Inquire</Link>
              </div>

              <div className={styles.navItem}>
                <button type="button" className={styles.navBtn} aria-expanded={menuOpen === "new"} onMouseEnter={() => lockMenu("new")} onClick={() => lockMenu(menuOpen === "new" ? false : "new")}>
                  New Arrivals
                </button>
                {menuOpen === "new" && <MiniNav items={arrivals} title="What's New" />}
              </div>

              <div className={styles.navItem}>
                <button type="button" className={styles.navBtn} aria-expanded={menuOpen === "hot"} onMouseEnter={() => lockMenu("hot")} onClick={() => lockMenu(menuOpen === "hot" ? false : "hot")}>
                  Highlighted Products
                </button>
                {menuOpen === "hot" && <MiniNav items={highlighted} title="HIGHLIGHTED PRODUCTS" />}
              </div>
            </nav>
            <Link className={styles.shopNow} href="/shop">Shop All <Search size={13} /></Link>
          </div>
        </div>
      </header>

      {overlay === "search" && (
        <div className={styles.overlay} role="presentation">
          <button className={styles.overlayScrim} type="button" aria-label="Close search" onClick={() => setOverlay(null)} />
          <div className={styles.searchOverlay}>
            <button className={styles.overlayClose} type="button" aria-label="Close" onClick={() => setOverlay(null)}><X size={22} /></button>
            <div className="utl-container">
              <SearchBox className={styles.searchOverlayBox} autoFocus />
              <p className={styles.searchHints}>Try “drill bit”, “torque wrench”, “OZAR” or “abrasives”</p>
            </div>
          </div>
        </div>
      )}

      {overlay === "mobile" && (
        <div className={styles.overlay} role="presentation">
          <button className={styles.overlayScrim} type="button" aria-label="Close menu" onClick={() => setOverlay(null)} />
          <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="Menu">
            <div className={styles.drawerHead}>
              <Image src={LOGO} alt="United Tools Ltd" width={150} height={36} />
              <button type="button" aria-label="Close menu" onClick={() => setOverlay(null)}><X size={22} /></button>
            </div>
            <nav className={styles.drawerNav}>
              <Link href="/shop">Shop All Products</Link>
              <div className={styles.drawerGroup}>
                <strong>Industries &amp; Solutions</strong>
                {industries.map((tag) => <Link key={tag.slug} href={`/tag/${tag.slug}`}>{tag.name}</Link>)}
              </div>
              <div className={styles.drawerGroup}>
                <strong>Product Categories</strong>
                {categories.map((category) => <Link key={category.slug} href={`/category/${category.slug}`}>{category.name}</Link>)}
              </div>
              <Link href="/enquiry">Order or Inquire</Link>
              <Link href="/enquiry">Track Order</Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
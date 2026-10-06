import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, HandCoins, Handshake, Star, Truck } from "lucide-react";
import styles from "./Sections.module.css";

const WHATSAPP = "https://wa.me/254774888373";

export function ValueProps() {
  const items = [
    { icon: BadgeCheck, title: "Quality Products", copy: "Only trusted, proven brands." },
    { icon: HandCoins, title: "Competitive Pricing", copy: "Fair prices on every tool." },
    { icon: Handshake, title: "Dependable Team and Service", copy: "Support that shows up." },
    { icon: Truck, title: "Delivery All Over East Africa", copy: "To your site or workshop." },
    { icon: Star, title: "Your First Choice", copy: "Built on relationships." },
  ];
  return (
    <section className={styles.valueStrip} aria-label="Why choose United Tools">
      <div className="utl-container">
        {items.map((item) => (
          <div className={styles.valueItem} key={item.title}>
            <span className={styles.valueIcon}><item.icon size={22} strokeWidth={1.8} /></span>
            <div><strong>{item.title}</strong><small>{item.copy}</small></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CatalogTiles({ tiles = [] }) {
  if (!tiles.length) return null;
  return (
    <section className={styles.catalogTiles} aria-label="Shop by category">
      <div className="utl-container">
        <div className={styles.tileGrid}>
          {tiles.map((tile) => (
            <Link className={styles.tileCard} href={`/category/${tile.slug}`} key={tile.slug}>
              <span className={styles.tileImg}>
                {tile.imageUrl ? <Image src={tile.imageUrl} alt={tile.name} fill sizes="(max-width: 960px) 46vw, 23vw" /> : null}
                <span className={styles.tileShade} />
              </span>
              <span className={styles.tileLabel}>
                <strong>{tile.name}</strong>
                <small>{tile.count} products</small>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BrandCarousel({ brands = [] }) {
  if (!brands.length) return null;
  return (
    <section className={styles.brandSection} aria-label="Brands we stock">
      <div className="utl-container">
        <div className={styles.brandTrack}>
          {[...brands, ...brands].map((brand, i) => (
            <Link className={styles.brandTile} href={brand.slug ? `/brand/${brand.slug}` : "/shop"} key={`${brand.slug}-${i}`}>
              {brand.logoUrl ? <Image src={brand.logoUrl} alt={brand.name} width={150} height={70} /> : <strong>{brand.name}</strong>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PromoTriple({ blocks = [] }) {
  if (!blocks.length) return null;
  return (
    <section className={styles.promoTriple} aria-label="Promotions">
      <div className="utl-container">
        {blocks.map((block, i) => (
          <Link className={styles.promoTile} href={block.href || "/shop"} key={`${block.title}-${i}`}>
            <Image src={block.imageUrl} alt={block.title} fill sizes="(max-width: 900px) 94vw, 31vw" />
            <div className={styles.promoTileOverlay} />
            <div className={styles.promoTileText}>
              {block.eyebrow && <p className="utl-kicker">{block.eyebrow}</p>}
              {block.title && <h3>{block.title}</h3>}
              {block.copy && <span>{block.copy}</span>}
              {block.priceLabel && <em>{block.priceLabel} <ArrowRight size={14} /></em>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function FullBanner({ block, tone = "blue" }) {
  if (!block) return null;
  return (
    <section className={`${styles.fullBanner} ${styles[`tone${tone}`]}`}>
      <Image src={block.imageUrl} alt={block.title} fill priority={false} sizes="100vw" />
      <div className={styles.fullVeil} />
      <div className="utl-container">
        <div className={styles.fullText}>
          {block.eyebrow && <p className="utl-kicker">{block.eyebrow}</p>}
          {block.title && <h2>{block.title}</h2>}
          {block.copy && <p>{block.copy}</p>}
          <div className={styles.fullCta}>
            {block.href && <Link href={block.href}>{block.ctaLabel || "Shop Now"} <ArrowRight size={16} /></Link>}
            {block.priceLabel && <span className={styles.fullPrice}>{block.priceLabel} <b>{block.price}</b></span>}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductDeck({ deck: { title, href, banner, products } = {}, reverse = false }) {
  if (!products?.length) return null;
  return (
    <section className={styles.deck}>
      <div className="utl-container">
        <div className="utl-row-head">
          <div>
            <p className="utl-kicker">HIGHLIGHTED FOR YOU</p>
            <h2>{title}</h2>
          </div>
          {href && <Link className="utl-see-all" href={href}>Shop the range <ArrowRight size={16} /></Link>}
        </div>
        <div className={`${styles.deckGrid} ${reverse ? styles.deckReverse : ""}`}>
          {banner?.imageUrl && (
            <Link className={styles.deckBanner} href={banner.href || href}>
              <Image src={banner.imageUrl} alt={banner.title} fill sizes="(max-width: 1080px) 100vw, 320px" />
              <div className={styles.deckBannerVeil} />
              <div className={styles.deckBannerText}>
                {banner.eyebrow && <p className="utl-kicker">{banner.eyebrow}</p>}
                {banner.title && <h3>{banner.title}</h3>}
                {banner.copy && <span>{banner.copy}</span>}
                {(banner.price || banner.priceLabel) && <em>{banner.priceLabel} <b>{banner.price}</b></em>}
              </div>
            </Link>
          )}
          <div className={styles.deckProducts}>
            {products.map((product) => <ProductTile key={product.id} product={product} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductTile({ product }) {
  return (
    <Link className={styles.tile} href={`/product/${product.slug}`}>
      <span className={styles.tileImg}>
        {product.image ? <Image src={product.image} alt="" fill sizes="150px" /> : null}
      </span>
      <span className={styles.tileText}>
        <em>{product.brand}</em>
        <b>{product.name}</b>
        <small>Price on request</small>
      </span>
    </Link>
  );
}

export function TwoUp({ blocks = [] }) {
  if (!blocks.length) return null;
  return (
    <section className={styles.twoUp} aria-label="Product ranges">
      <div className="utl-container">
        {blocks.slice(0, 2).map((block, i) => (
          <Link className={styles.twoUpTile} href={block.href || "/shop"} key={`${block.title}-${i}`}>
            <Image src={block.imageUrl} alt={block.title} fill sizes="(max-width: 960px) 94vw, 47vw" />
            <div className={styles.twoUpVeil} />
            <div className={styles.twoUpText}>
              {block.eyebrow && <p className="utl-kicker">{block.eyebrow}</p>}
              {block.title && <h3>{block.title}</h3>}
              {block.copy && <span>{block.copy}</span>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Coupon({ code, title, note }) {
  return (
    <section className={styles.coupon} aria-label="New customer offer">
      <div className="utl-container">
        <div className={styles.couponInner}>
          <div className={styles.couponText}>
            <p className="utl-kicker">FIRST PURCHASE OFFER</p>
            <h2>{title}</h2>
            <p>{note}</p>
          </div>
          <div className={styles.couponCode} aria-label={`Discount code ${code}`}>
            <span>SAVE</span><strong>{code}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BlogRow({ posts = [] }) {
  if (!posts.length) return null;
  return (
    <section className={styles.blog} aria-labelledby="utl-blog-heading">
      <div className="utl-container">
        <div className="utl-row-head">
          <div>
            <p className="utl-kicker">IDEAS FROM OUR TEAM</p>
            <h2 id="utl-blog-heading">From the blog</h2>
          </div>
          <Link className="utl-see-all" href="/blog">More articles <ArrowRight size={16} /></Link>
        </div>
        <div className={styles.blogGrid}>
          {posts.map((post) => (
            <article className={styles.blogCard} key={post.id}>
              <Link href={`/blog/${post.slug}`}>
                <span className={styles.blogImg}>
                  {post.coverUrl ? <Image src={post.coverUrl} alt="" fill sizes="(max-width: 960px) 46vw, 23vw" /> : null}
                </span>
                <div className={styles.blogText}>
                  <em>{post.category || "Guides"}</em>
                  <h3>{post.title}</h3>
                  <small>{new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })} · by {post.author}</small>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer({ categories = [] }) {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer} key="utl-footer">
      <div className="utl-container">
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <Image src="https://utl.co.ke/wp-content/uploads/2024/03/logo.png" alt="United Tools Ltd" width={170} height={40} />
            <p>Tools, equipment and technical support for people who make, repair and build across East Africa.</p>
            <a href={WHATSAPP} target="_blank" rel="noreferrer"><span>Chat with us</span> +254 774 888 373</a>
          </div>
          <div className={styles.footerCol}>
            <strong>SHOP</strong>
            <Link href="/shop">All Products</Link>
            <Link href="/shop">New Arrivals</Link>
            <Link href="/shop">Highlighted Products</Link>
            {categories.slice(0, 3).map((c) => <Link key={c.slug} href={`/category/${c.slug}`}>{c.name}</Link>)}
          </div>
          <div className={styles.footerCol}>
            <strong>COMPANY</strong>
            <Link href="/about">About Us</Link>
            <Link href="/blog">Our Blog</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/shop">Wishlist</Link>
          </div>
          <div className={styles.footerCol}>
            <strong>GET IN TOUCH</strong>
            <span>20 Butere Rd, Industrial Area, Nairobi, Kenya</span>
            <a href="tel:+254774888373">+254 774 888 373</a>
            <a href="mailto:sales@utl.co.ke">sales@utl.co.ke</a>
            <span>Mon–Fri 08:00–16:30 · Sat 08:00–13:00</span>
          </div>
          <div className={styles.footerCol}>
            <strong>WHY UTL?</strong>
            <span>Quality products</span>
            <span>Competitive pricing</span>
            <span>Dependable service</span>
            <span>Delivery all over East Africa</span>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© {year} United Tools Ltd. All rights reserved.</span>
          <span>Prices, stock and delivery confirmed by the sales team.</span>
        </div>
      </div>
    </footer>
  );
}
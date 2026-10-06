"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  MessageCircle,
  Mail,
  Minus,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import {
  categories,
  categoryGroups,
  companyHighlights,
  footerLinkGroups,
  homepageArticles,
  homepageCollections,
  homepageIndustryContent,
  homepagePromotions,
  industries,
  isProductInCategory,
  newArrivalHighlights,
  products,
  slides,
} from "../data/catalog";
import styles from "./storefront.module.css";

const whatsappNumber = "254774888373";
const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Industries & Solutions", href: "#industries" },
  { label: "Order or Inquire", href: "/enquiry" },
];

function CategoryMenu({ category }) {
  const children = categories.filter((item) => item.parentSlug === category.slug);

  if (!children.length) {
    return <Link href={`/category/${category.slug}`}>{category.name}</Link>;
  }

  return (
    <div className={styles.categoryGroup}>
      <Link className={styles.categoryGroupLink} href={`/category/${category.slug}`}>{category.name}</Link>
      <details className={styles.categoryDisclosure}>
        <summary aria-label={`Show ${category.name} subcategories`}><ChevronDown size={13} /></summary>
        <div className={styles.categoryDropdown}>
          {children.map((child) => <CategoryMenu key={child.slug} category={child} />)}
        </div>
      </details>
    </div>
  );
}

function Brand({ light = false }) {
  return (
    <Link href="/" className={styles.brand} aria-label="United Tools Ltd home">
      <Image
        src={`https://utl.co.ke/wp-content/uploads/2024/03/logo${light ? "-light" : ""}.png`}
        alt="United Tools Ltd"
        width={156}
        height={35}
      />
    </Link>
  );
}

function askAboutUrl(name) {
  return `https://wa.me/254774888373?text=${encodeURIComponent(`Hello, I would like to enquire about ${name}.`)}`;
}

function HomepageCollection({ collection, products, index }) {
  const headingId = `collection-${collection.categorySlug}-${index}`;

  return (
    <section className={styles.collectionSection} aria-labelledby={headingId}>
      <div className={styles.collectionHeading}>
        <div><p className={styles.kicker}>{collection.eyebrow}</p><h2 id={headingId}>{collection.title}</h2></div>
        <Link href={`/category/${collection.categorySlug}`}>Shop this range <ArrowRight size={15} /></Link>
      </div>
      {collection.feature && (
        <div className={styles.collectionFeature}>
          <strong>{collection.feature}</strong>
          {collection.description && <p>{collection.description}</p>}
          {collection.price && <b>{collection.price}</b>}
        </div>
      )}
      <div className={styles.collectionProducts}>
        {collection.products.map((name) => {
          const product = products.find((item) => name.toLowerCase().includes(item.name.toLowerCase()));
          const href = product ? `/product/${product.slug}` : askAboutUrl(name);

          return (
            <Link href={href} target={product ? undefined : "_blank"} rel={product ? undefined : "noreferrer"} key={name}>
              <span>{product?.brand ?? collection.title}</span>
              <strong>{name}</strong>
              <small>{product ? "Price on request" : "Add to enquiry"}</small>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function Storefront({ products }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All products");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    let restoredCart = [];
    try {
      const storedCart = window.localStorage.getItem("itl-enquiry-list");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) restoredCart = parsedCart;
      }
    } catch {
      window.localStorage.removeItem("itl-enquiry-list");
    }
    startTransition(() => {
      setCart(restoredCart);
      setCartReady(true);
    });
  }, []);

  useEffect(() => {
    if (cartReady) window.localStorage.setItem("itl-enquiry-list", JSON.stringify(cart));
  }, [cart, cartReady]);

  const filteredProducts = products.filter((product) => {
    const selectedCategory = categories.find((item) => item.name === category);
    const matchesCategory = !selectedCategory || isProductInCategory(product, selectedCategory.slug);
    const text = `${product.name} ${product.brand} ${product.sku ?? ""} ${product.category} ${product.detail}`.toLowerCase();
    return matchesCategory && text.includes(search.trim().toLowerCase());
  });
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const message = cart.map((item) => `${item.quantity} x ${item.name}`).join("\n");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello, I would like to enquire about:\n${message}`)}`;
  const slide = slides[slideIndex];

  function selectCategory(nextCategory) {
    setCategory(nextCategory);
    setMenuOpen(false);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addProduct(product) {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      return existing
        ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function adjustQuantity(id, change) {
    setCart((items) => items
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0));
  }

  return (
    <main className={styles.page}>
      <div className={styles.announcement}>
        <span><Truck size={15} /> Delivery all over East Africa</span>
        <span className={styles.announcementNote}><Phone size={13} /> Mon–Fri 8:00am–4:30pm · Sat 8:00am–1:00pm <a href="tel:+254774888373">+254 774 888 373</a></span>
      </div>

      <header className={styles.header}>
        <div className={styles.headerMain}>
          <button className={styles.menuButton} type="button" aria-label={menuOpen ? "Close categories" : "Open categories"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Brand />
          <form className={styles.search} onSubmit={(event) => { event.preventDefault(); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}>
            <Search size={18} aria-hidden="true" />
            <input aria-label="Search tools and products" placeholder="Search by product, brand or category" value={search} onChange={(event) => setSearch(event.target.value)} />
            <button type="submit">Search</button>
          </form>
          <div className={styles.headerActions}>
            <nav className={styles.primaryNav} aria-label="Main navigation">
              {primaryLinks.map((link) => (
                <Link key={link.href} href={link.href} className={styles.primaryNavLink}>{link.label}</Link>
              ))}
            </nav>
            <a className={styles.helpLink} href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
              <MessageCircle size={19} /><span><small>Need a hand?</small><strong>Talk to our team</strong></span>
            </a>
            <button className={styles.bagButton} type="button" onClick={() => setCartOpen(true)} aria-label={`Open enquiry list, ${cartCount} items`}>
              <ShoppingBag size={21} /><span>Enquiry list</span><b>{cartCount}</b>
            </button>
          </div>
        </div>
        <nav className={`${styles.categoryNav} ${menuOpen ? styles.categoryNavOpen : ""}`} aria-label="Product categories">
          <button className={category === "All products" ? styles.navActive : ""} type="button" onClick={() => selectCategory("All products")}>All products</button>
          {categoryGroups.map((item) => <CategoryMenu key={item.slug} category={item} />)}
          <Link href="#industries">Industries &amp; Solutions</Link>
          <Link href="/enquiry">Order or Inquire</Link>
        </nav>
      </header>

      <div className={styles.content}>
        <section className={styles.hero} aria-label="Featured collection">
          <Image className={styles.heroImage} src={slide.image} alt="Professional industrial tools for machining and workshop work" fill priority sizes="(max-width: 760px) 100vw, 1280px" />
          <div className={styles.heroShade} />
          <div className={styles.heroCopy} key={slide.title}>
            <p className={styles.eyebrow}><span />{slide.eyebrow}</p>
            <h1>{slide.title}</h1>
            <p className={styles.heroDescription}>{slide.copy}</p>
              <Link className={styles.heroButton} href={`/category/${slide.categorySlug}`}>{slide.action}<ArrowRight size={17} /></Link>
          </div>
          <div className={styles.heroControls}>
            <span>0{slideIndex + 1} / 0{slides.length}</span>
            <div className={styles.slideDots}>
              {slides.map((item, index) => <button key={item.title} className={index === slideIndex ? styles.dotActive : ""} type="button" aria-label={`Show slide ${index + 1}`} onClick={() => setSlideIndex(index)} />)}
            </div>
            <div className={styles.slideArrows}>
              <button type="button" aria-label="Previous slide" onClick={() => setSlideIndex((slideIndex + slides.length - 1) % slides.length)}><ChevronLeft size={19} /></button>
              <button type="button" aria-label="Next slide" onClick={() => setSlideIndex((slideIndex + 1) % slides.length)}><ChevronRight size={19} /></button>
            </div>
          </div>
          <div className={styles.heroStamp}><span>TOOLS FOR</span><strong>THE WORK AHEAD</strong><ArrowUpRight size={20} /></div>
        </section>

        <section className={styles.serviceStrip} aria-label="Service commitments">
          <div><BadgeCheck /><span><strong>Quality products</strong><small>Trusted trade brands</small></span></div>
          <div><ShieldCheck /><span><strong>Practical support</strong><small>Help choosing the right tool</small></span></div>
          <div><Truck /><span><strong>Regional delivery</strong><small>Kenya and East Africa</small></span></div>
          <div><MessageCircle /><span><strong>Talk to a real person</strong><small>Quick WhatsApp assistance</small></span></div>
        </section>

        <section className={styles.section} aria-labelledby="category-heading">
          <div className={styles.sectionHeading}>
            <div><p className={styles.kicker}>FIND YOUR NEXT TOOL</p><h2 id="category-heading">Shop by category</h2></div>
            <button className={styles.textLink} type="button" onClick={() => selectCategory("All products")}>View all categories <ArrowRight size={16} /></button>
          </div>
          <div className={styles.categoryGrid}>
            {categoryGroups.map(({ name, detail, icon: Icon, slug }, index) => (
                <Link className={`${styles.categoryTile} ${styles[`tileTone${(index % 6) + 1}`]}`} href={`/category/${slug}`} key={name}>
                <span className={`${styles.categoryIcon} ${styles[`tone${(index % 6) + 1}`]}`}><Icon size={25} strokeWidth={1.6} /></span>
                <span className={styles.categoryText}><strong>{name}</strong><small>{detail}</small></span>
                <ArrowUpRight className={styles.categoryArrow} size={17} />
                </Link>
            ))}
          </div>
        </section>

        <section className={styles.arrivalsSection} aria-labelledby="arrivals-heading">
          <div className={styles.sectionHeading}>
            <div><p className={styles.kicker}>JUST IN</p><h2 id="arrivals-heading">New arrivals</h2></div>
            <Link className={styles.textLink} href="/shop">Shop all products <ArrowRight size={16} /></Link>
          </div>
          <div className={styles.arrivalGrid}>
            {newArrivalHighlights.map((item) => {
              const href = item.productSlug
                ? `/product/${item.productSlug}`
                : `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello, I would like to enquire about ${item.name}.`)}`;

              return (
                <Link href={href} target={item.productSlug ? undefined : "_blank"} rel={item.productSlug ? undefined : "noreferrer"} key={item.name}>
                  <span>NEW ARRIVAL</span><strong>{item.name}</strong><ArrowUpRight size={17} />
                </Link>
              );
            })}
          </div>
        </section>

        <section className={styles.promotionsSection} aria-labelledby="promotions-heading">
          <div className={styles.sectionHeading}>
            <div><p className={styles.kicker}>HIGHLIGHTED PRODUCTS</p><h2 id="promotions-heading">Made for the work ahead</h2></div>
          </div>
          <div className={styles.promotionGrid}>
            {homepagePromotions.map((promotion) => (
              <Link className={`${styles.promotionCard} ${styles[`promotion${promotion.tone}`]}`} href={`/category/${promotion.categorySlug}`} key={promotion.title}>
                <span>{promotion.eyebrow}</span><strong>{promotion.title}</strong><p>{promotion.copy}</p><b>Shop now <ArrowUpRight size={15} /></b>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.promiseSection} aria-labelledby="promise-heading">
          <div className={styles.sectionHeading}>
            <div><p className={styles.kicker}>HIGHLIGHTED PRODUCTS &amp; SERVICE</p><h2 id="promise-heading">Your first choice for the work ahead</h2></div>
          </div>
          <div className={styles.promiseGrid}>
            {["Quality Products", "Competitive Pricing", "Dependable Team and Service", "Delivery All Over East Africa", "Your First Choice"].map((item, index) => (
              <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>
            ))}
          </div>
        </section>

        <section className={styles.catalog} id="catalog" aria-labelledby="catalog-heading">
          <div className={styles.sectionHeading}>
            <div><p className={styles.kicker}>SELECTED FOR THE WORKSHOP</p><h2 id="catalog-heading">Featured products</h2></div>
            <label className={styles.categorySelect}>
              <span className={styles.visuallyHidden}>Filter products by category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>All products</option>{categories.map((item) => <option key={item.name}>{item.name}</option>)}
              </select><ChevronDown size={14} />
            </label>
          </div>
          {(search || category !== "All products") && <div className={styles.resultLine}><span>{filteredProducts.length} products{search ? ` matching “${search}”` : ` in ${category}`}</span><button type="button" onClick={() => { setSearch(""); setCategory("All products"); }}>Clear filters <X size={14} /></button></div>}
          {filteredProducts.length ? (
            <div className={styles.productGrid}>
              {filteredProducts.map((product, index) => (
                <article className={styles.productCard} key={product.id} style={{ "--item-order": index }}>
                  <div className={styles.productVisual}>
                    <button className={styles.productOpen} type="button" aria-label={`View ${product.name}`} onClick={() => setSelectedProduct(product)}>
                      <Image src={product.image} alt={product.name} fill sizes="(max-width: 580px) 50vw, (max-width: 920px) 33vw, 25vw" />
                    </button>
                    <span className={styles.productLabel}>{product.category}</span>
                  </div>
                  <div className={styles.productInfo}>
                    <p className={styles.brandLabel}>{product.brand}</p>
                    <h3><Link className={styles.productNameButton} href={`/product/${product.slug}`}>{product.name}</Link></h3>
                    <p className={styles.productDetail}>{product.detail}</p>
                    <div className={styles.productBottom}><strong>Price on request</strong><button type="button" aria-label={`Add ${product.name} to enquiry list`} onClick={() => addProduct(product)}><Plus size={17} /></button></div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}><Search size={24} /><h3>No tools found</h3><p>Try a different product, brand or category.</p><button type="button" onClick={() => { setSearch(""); setCategory("All products"); }}>Show all products</button></div>
          )}
        </section>

        <section className={styles.collectionsSection} aria-label="Browse featured product ranges">
          {homepageCollections.map((collection, index) => (
            <HomepageCollection collection={collection} products={products} index={index} key={collection.title} />
          ))}
        </section>

        <section className={styles.industriesSection} id="industries" aria-labelledby="industries-heading">
          <div className={styles.sectionHeading}>
            <div><p className={styles.kicker}>INDUSTRIES &amp; SOLUTIONS</p><h2 id="industries-heading">Tools for the industries that keep moving</h2></div>
          </div>
          <div className={styles.industryGrid}>
            {industries.map((industry) => (
              <Link href={`/industries/${industry.slug}`} key={industry.slug}>
                <span>INDUSTRY SOLUTIONS</span><strong>{industry.name}</strong><p>{industry.detail}</p><ArrowUpRight size={18} />
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.industryContentSection} aria-labelledby="range-detail-heading">
          <div className={styles.sectionHeading}>
            <div><p className={styles.kicker}>TOOLS, EQUIPMENT &amp; TECHNICAL SUPPORT</p><h2 id="range-detail-heading">Explore our product expertise</h2></div>
          </div>
          <div className={styles.industryContentGrid}>
            {homepageIndustryContent.map((item) => (
              <article key={item.title}>
                <Link href={`/category/${item.categorySlug}`}><h3>{item.title}</h3><ArrowUpRight size={16} /></Link>
                <p>{item.copy}</p>
                {item.items.length > 0 && <ul>{item.items.map((detail) => <li key={detail}>{detail}</li>)}</ul>}
              </article>
            ))}
          </div>
        </section>

        <section className={styles.whySection} aria-labelledby="why-heading">
          <div className={styles.whyIntro}>
            <p className={styles.kicker}>PROFESSIONAL ENGINEERING TOOLS &amp; EQUIPMENT ONLINE IN KENYA</p>
            <h2 id="why-heading">{companyHighlights.title}</h2>
            <strong>{companyHighlights.subtitle}</strong>
          </div>
          <div className={styles.whyCopy}>
            {companyHighlights.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p><strong>Trusted brands:</strong> {companyHighlights.brands}</p>
            <p><strong>Serving:</strong> {companyHighlights.destinations}</p>
          </div>
        </section>

        <section className={styles.promoBand} aria-label="New customer offer">
          <div><p className={styles.kicker}>FIRST PURCHASE OFFER</p><h2>Super discount for your first purchase</h2><p>Use discount code in the checkout.</p></div>
          <span><strong>UTL25NEW</strong><small>Checkout promotion shown on the reference site; this enquiry prototype does not validate it.</small></span>
        </section>

        <section className={styles.blogSection} aria-labelledby="blog-heading">
          <div className={styles.sectionHeading}>
            <div><p className={styles.kicker}>IDEAS FROM OUR TEAM</p><h2 id="blog-heading">From our blog</h2></div>
            <span className={styles.textLink}>Metalworking tips &amp; product news</span>
          </div>
          <div className={styles.blogGrid}>
            {homepageArticles.map((article, index) => (
              <article className={styles.blogCard} key={article.title}>
                <span className={styles.blogNumber}>0{index + 1}</span>
                <p>{article.category}</p>
                <h3>{article.title}</h3>
                <small>by {article.author} · {article.date}</small>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.newsletter} aria-labelledby="newsletter-heading">
          <div><p className={styles.kicker}>NEW ARRIVALS · OFFERS · PROMOS</p><h2 id="newsletter-heading">Sign up to our newsletter</h2><p>Register now to be the first to know about new arrivals, offers, and promos. Don’t worry, we will not spam you.</p></div>
          <div className={styles.newsletterAction}><a href={`mailto:sales@utl.co.ke?subject=${encodeURIComponent("Newsletter subscription")}`}><Mail size={17} /> Request updates by email</a><small>Email your request to sales@utl.co.ke. Subscription preferences are not stored on this demo site.</small></div>
          <p className={styles.newsletterTerms}>By subscribing you agree to our <Link href="/contact">Terms &amp; Conditions</Link> and <Link href="/contact">Privacy &amp; Cookies Policy</Link>.</p>
        </section>

        <section className={styles.supportBand}>
          <div className={styles.supportMark}><MessageCircle size={27} /></div>
          <div><p className={styles.kicker}>A BETTER TOOL FOR THE JOB?</p><h2>Let’s find it.</h2><p>Tell us what you’re working on. Our team can help with product selection and availability.</p></div>
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">Chat with our team <ArrowUpRight size={17} /></a>
        </section>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerMain}>
          <Brand light />
          <p>Tools and equipment for people who make, repair and build.</p>
          <div className={styles.footerLinks}>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/shop">Shop</Link>
            <Link href="#industries">Industries &amp; Solutions</Link>
          </div>
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer"><MessageCircle size={16} /> +254 774 888 373</a>
        </div>
        <div className={styles.footerDetails}>
          <div><strong>SHOP LOCATION</strong><span>20 Butere Rd, Industrial Area, Nairobi</span></div>
          <div><strong>CONTACT DETAILS</strong><a href="tel:+254774888373">+254 774 888 373</a><a href="mailto:sales@utl.co.ke">sales@utl.co.ke</a><span>Call anytime during office hours. We will gladly assist you in the shortest time possible.</span></div>
          <div><strong>OPERATING HOURS</strong><span>Mon–Fri · 08:00–16:30</span><span>Saturday · 08:00–13:00</span><span>Sundays &amp; public holidays · Closed</span></div>
        </div>
        <div className={styles.footerDirectory}>
          {footerLinkGroups.map((group) => (
            <div key={group.title}><strong>{group.title}</strong>{group.links.map((label) => {
              const href = label === "Chat With Us"
                ? `https://wa.me/${whatsappNumber}`
                : label === "How to Order" || label === "Delivery Options" || label === "Refund and Returns Policy" || label === "Privacy Policy" || label === "Terms and Conditions"
                  ? `mailto:sales@utl.co.ke?subject=${encodeURIComponent(label)}`
                  : label === "Contact Us" || label === "Want Us To Reach Out?"
                    ? "/contact"
                    : label === "About Us" || label === "Our Services" || label === "The UTL Difference"
                      ? "/about"
                      : `mailto:sales@utl.co.ke?subject=${encodeURIComponent(label)}`;
              const external = href.startsWith("https://");
              return <Link href={href} key={label} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{label}</Link>;
            })}</div>
          ))}
          <div className={styles.footerSocial}><strong>FOLLOW US</strong><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Chat with us on WhatsApp</a></div>
        </div>
        <div className={styles.footerBottom}><span>Copyright 2026 © United Tools Ltd. All rights reserved.</span><span>Prices, stock and delivery are confirmed by the sales team.</span></div>
      </footer>

      {selectedProduct && <div className={styles.modalLayer}>
        <button className={styles.modalScrim} type="button" aria-label="Close product details" onClick={() => setSelectedProduct(null)} />
        <section className={styles.productModal} role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
          <button className={styles.modalClose} type="button" aria-label="Close product details" onClick={() => setSelectedProduct(null)}><X size={20} /></button>
          <div className={styles.modalImage}><Image src={selectedProduct.image} alt={selectedProduct.name} fill sizes="(max-width: 680px) 90vw, 40vw" /></div>
          <div className={styles.modalDetails}>
            <p className={styles.brandLabel}>{selectedProduct.brand}</p>
            <p className={styles.kicker}>{selectedProduct.category}</p>
            <h2 id="product-modal-title">{selectedProduct.name}</h2>
            <p className={styles.productDetail}>{selectedProduct.detail}</p>
            <p className={styles.modalAvailability}><span /> Price and availability confirmed on enquiry</p>
            <div className={styles.modalActions}>
              <button type="button" onClick={() => { addProduct(selectedProduct); setSelectedProduct(null); }}><Plus size={17} /> Add to enquiry list</button>
              <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello, I would like to ask about ${selectedProduct.name}.`)}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Ask about this product</a>
            </div>
          </div>
        </section>
      </div>}

      {cartOpen && <div className={styles.drawerLayer}>
        <button className={styles.drawerScrim} type="button" aria-label="Close enquiry list" onClick={() => setCartOpen(false)} />
        <aside className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
          <div className={styles.drawerHeader}><div><p className={styles.kicker}>YOUR SELECTION</p><h2 id="drawer-title">Enquiry list <span>{cartCount}</span></h2></div><button type="button" aria-label="Close enquiry list" onClick={() => setCartOpen(false)}><X size={20} /></button></div>
          {cart.length ? <>
            <div className={styles.drawerItems}>{cart.map((item) => <div className={styles.drawerItem} key={item.id}>
              <Image src={item.image} alt="" width={70} height={70} />
              <div className={styles.drawerItemText}><strong>{item.name}</strong><small>{item.brand} · Price on request</small><div className={styles.quantity}><button type="button" aria-label={`Remove one ${item.name}`} onClick={() => adjustQuantity(item.id, -1)}><Minus size={13} /></button><span>{item.quantity}</span><button type="button" aria-label={`Add one ${item.name}`} onClick={() => adjustQuantity(item.id, 1)}><Plus size={13} /></button></div></div>
            </div>)}</div>
            <Link className={styles.whatsappCheckout} href="/enquiry"><ShoppingBag size={18} /> Continue to quotation <ArrowRight size={17} /></Link>
            <a className={styles.drawerQuickWhatsapp} href={whatsappLink} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Send this list directly in WhatsApp</a>
            <p className={styles.drawerNote}>We’ll confirm current pricing, availability and delivery with you.</p>
          </> : <div className={styles.emptyCart}><ShoppingBag size={30} /><h3>Your list is empty</h3><p>Add products to ask our team about price and availability.</p><button type="button" onClick={() => setCartOpen(false)}>Continue browsing</button></div>}
        </aside>
      </div>}
    </main>
  );
}

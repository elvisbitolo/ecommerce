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
  Drill,
  Gauge,
  HardHat,
  Hammer,
  Menu,
  MessageCircle,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import styles from "./storefront.module.css";

const categories = [
  { name: "Engineering & tooling", detail: "Cutting, drilling, milling", icon: Drill },
  { name: "Measuring tools", detail: "Calipers, gauges, levels", icon: Gauge },
  { name: "Tools & accessories", detail: "Hand, power & air tools", icon: Hammer },
  { name: "Abrasives", detail: "Wheels, discs, finishing", icon: BadgeCheck },
  { name: "Automotive tools", detail: "Garage & service tools", icon: Truck },
  { name: "Safety & site", detail: "PPE, ladders, essentials", icon: HardHat },
];

const products = [
  {
    id: "mitutoyo-7301a",
    name: "Mitutoyo 7301A Dial Thickness Gauge",
    brand: "MITUTOYO",
    category: "Measuring tools",
    detail: "0-10 mm · 0.01 mm graduation",
    image: "https://utl.co.ke/wp-content/uploads/2026/04/Mitutoyo-7301A-Dial-Thickness-Gauge-0-10mm-0.01mm-300x300.jpg",
  },
  {
    id: "moore-wright-caliper",
    name: "Moore & Wright Digital Caliper 300mm",
    brand: "MOORE & WRIGHT",
    category: "Measuring tools",
    detail: "12 in · Digital readout",
    image: "https://utl.co.ke/wp-content/uploads/2026/09/Moore-Wright-Digital-Caliper-300mm-12inch-300x300.jpg",
  },
  {
    id: "ozar-air-sander",
    name: "OZAR Air Sander 6 inch",
    brand: "OZAR",
    category: "Tools & accessories",
    detail: "Pneumatic · Workshop finish",
    image: "https://utl.co.ke/wp-content/uploads/2026/07/OZAR-Air-Sander-5inch-6Inch-without-Vacuum-ASA-9454-300x300.jpg",
  },
  {
    id: "sterling-cup-wheel",
    name: "Sterling White Straight Cup Wheel",
    brand: "STERLING ABRASIVES",
    category: "Abrasives",
    detail: "200 x 80 x 32 mm",
    image: "https://utl.co.ke/wp-content/uploads/2025/01/Sterling-Grinding-Wheel-White-Straight-Cup-1c-300x300.jpg",
  },
  {
    id: "casoman-impact-set",
    name: "CASOMAN 18-Piece Impact Drive Set",
    brand: "CASOMAN",
    category: "Tools & accessories",
    detail: "Impact drive tool accessories",
    image: "https://utl.co.ke/wp-content/uploads/2026/07/CASOMAN-18pcs-Impact-Drive-Tool-Accessory-Set-300x300.jpg",
  },
  {
    id: "draper-air-riveter",
    name: "Draper Air Riveter 16851",
    brand: "DRAPER",
    category: "Automotive tools",
    detail: "Pneumatic riveting tool",
    image: "https://utl.co.ke/wp-content/uploads/2026/07/Draper-Air-Riveter-16851_1__85795-300x300.jpg",
  },
  {
    id: "acl-flexigauge",
    name: "ACL Flexigauge 300mm Red",
    brand: "ACL",
    category: "Automotive tools",
    detail: "AR-1 · 0.051-0.152 mm",
    image: "https://utl.co.ke/wp-content/uploads/2026/07/ACL-Flexigauge-Red-AR-1-300x300.jpg",
  },
  {
    id: "plastic-welding-machine",
    name: "Plastic Welding Machine 150W",
    brand: "WORKSHOP TOOLS",
    category: "Tools & accessories",
    detail: "Repair and fabrication",
    image: "https://utl.co.ke/wp-content/uploads/2026/07/Plastic-Welding-Gun-150W-300x300.jpg",
  },
];

const slides = [
  {
    eyebrow: "MACHINING TOOLS",
    title: "Mill. Slot. Shape.",
    copy: "End mills and slot drills for the work that calls for precision.",
    image: "https://utl.co.ke/wp-content/uploads/2026/06/slider-33-end-mills-and-slot-drills-utl.jpg",
    category: "Engineering & tooling",
    action: "Explore engineering tools",
  },
  {
    eyebrow: "ABRASIVES RANGE",
    title: "Finish with confidence.",
    copy: "Cutting, grinding and finishing essentials for your workshop.",
    image: "https://utl.co.ke/wp-content/uploads/2026/05/slider-32-abrasives-range-utl.jpg",
    category: "Abrasives",
    action: "Explore abrasives",
  },
  {
    eyebrow: "PROFESSIONAL AIR TOOLS",
    title: "Power your workshop.",
    copy: "Dependable pneumatic tools for busy bays and production floors.",
    image: "https://utl.co.ke/wp-content/uploads/2025/11/slider-29-NEW-ARRIVALS-DENZEL-b-utl.jpg",
    category: "Tools & accessories",
    action: "Explore workshop tools",
  },
];

const whatsappNumber = "254774888373";

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

export default function Storefront() {
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
    const matchesCategory = category === "All products" || product.category === category;
    const text = `${product.name} ${product.brand} ${product.category} ${product.detail}`.toLowerCase();
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
        <span><Truck size={15} /> Delivery across Kenya & East Africa</span>
        <span className={styles.announcementNote}>Trade tools. Practical support. <ArrowUpRight size={14} /></span>
      </div>

      <header className={styles.header}>
        <div className={styles.headerMain}>
          <button className={styles.menuButton} type="button" aria-label={menuOpen ? "Close categories" : "Open categories"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Brand />
          <form className={styles.search} onSubmit={(event) => { event.preventDefault(); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}>
            <Search size={18} aria-hidden="true" />
            <input aria-label="Search tools and products" placeholder="Search by product, brand or SKU" value={search} onChange={(event) => setSearch(event.target.value)} />
            <button type="submit">Search</button>
          </form>
          <div className={styles.headerActions}>
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
          {categories.map((item) => (
            <button className={category === item.name ? styles.navActive : ""} key={item.name} type="button" onClick={() => selectCategory(item.name)}>{item.name}<ChevronDown size={13} /></button>
          ))}
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
            <button className={styles.heroButton} type="button" onClick={() => selectCategory(slide.category)}>{slide.action}<ArrowRight size={17} /></button>
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
            {categories.map(({ name, detail, icon: Icon }, index) => (
              <button className={styles.categoryTile} type="button" key={name} onClick={() => selectCategory(name)}>
                <span className={`${styles.categoryIcon} ${styles[`tone${index + 1}`]}`}><Icon size={25} strokeWidth={1.6} /></span>
                <span className={styles.categoryText}><strong>{name}</strong><small>{detail}</small></span>
                <ArrowUpRight className={styles.categoryArrow} size={17} />
              </button>
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
                    <h3><button className={styles.productNameButton} type="button" onClick={() => setSelectedProduct(product)}>{product.name}</button></h3>
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
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer"><MessageCircle size={16} /> +254 774 888 373</a>
        </div>
        <div className={styles.footerBottom}><span>© 2026 United Tools Ltd</span><span>Product availability and pricing confirmed on enquiry.</span></div>
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
            <a className={styles.whatsappCheckout} href={whatsappLink} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Send enquiry on WhatsApp <ArrowRight size={17} /></a>
            <p className={styles.drawerNote}>We’ll confirm current pricing, availability and delivery with you.</p>
          </> : <div className={styles.emptyCart}><ShoppingBag size={30} /><h3>Your list is empty</h3><p>Add products to ask our team about price and availability.</p><button type="button" onClick={() => setCartOpen(false)}>Continue browsing</button></div>}
        </aside>
      </div>}
    </main>
  );
}

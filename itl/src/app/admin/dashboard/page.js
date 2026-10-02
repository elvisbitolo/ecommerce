import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Box,
  ClipboardList,
  Gauge,
  Layers3,
  PackageSearch,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { products } from "../../../data/catalog";
import styles from "./dashboard.module.css";

export const metadata = {
  title: "Admin dashboard preview",
  robots: {
    index: false,
    follow: false,
  },
};

const sampleRequests = [
  { reference: "ENQ-DEMO-1042", contact: "Workshop sample", request: "Measuring tools", state: "Preview only" },
  { reference: "ENQ-DEMO-1041", contact: "Garage sample", request: "Automotive tools", state: "Preview only" },
  { reference: "ENQ-DEMO-1040", contact: "Fabrication sample", request: "Abrasives", state: "Preview only" },
];

const stats = [
  { label: "Sample products", value: products.length, change: "Local fixture data", icon: Box, tone: "blue" },
  { label: "Categories", value: "6", change: "Frontend navigation", icon: Layers3, tone: "teal" },
  { label: "Enquiries", value: "--", change: "No backend connected", icon: ClipboardList, tone: "orange" },
  { label: "Stock alerts", value: "--", change: "Inventory not connected", icon: Gauge, tone: "slate" },
];

export default function AdminDashboardPreview() {
  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link className={styles.brand} href="/admin"><span>UTL</span><strong>UNITED TOOLS LTD<small>STAFF PREVIEW</small></strong></Link>
        <nav aria-label="Admin preview navigation">
          <span className={styles.navLabel}>WORKSPACE</span>
          <span className={`${styles.navItem} ${styles.navActive}`}><Gauge size={17} /> Overview</span>
          <span className={styles.navItem}><Box size={17} /> Products <small>Preview</small></span>
          <span className={styles.navItem}><Layers3 size={17} /> Categories <small>Preview</small></span>
          <span className={styles.navItem}><ClipboardList size={17} /> Enquiries <small>Preview</small></span>
          <span className={styles.navItem}><Truck size={17} /> Delivery <small>Preview</small></span>
        </nav>
        <div className={styles.sidebarNotice}><ShieldCheck size={17} /><p>Design preview only. No admin data is stored here.</p></div>
        <Link className={styles.backLink} href="/">View storefront <ArrowUpRight size={15} /></Link>
      </aside>

      <section className={styles.main}>
        <header className={styles.topbar}>
          <div><p>ADMINISTRATION / OVERVIEW</p><h1>Store overview</h1></div>
          <Link href="/admin">Sign-in preview <ArrowDownRight size={15} /></Link>
        </header>
        <div className={styles.demoBanner}><ShieldCheck size={18} /><div><strong>Frontend preview · sample data only</strong><span>Authentication, catalog management, enquiries and stock are not connected. This route is not protected.</span></div></div>

        <section className={styles.stats} aria-label="Sample store metrics">
          {stats.map(({ label, value, change, icon: Icon, tone }) => <article className={styles.stat} key={label}>
            <div className={`${styles.statIcon} ${styles[tone]}`}><Icon size={18} /></div>
            <span>{label}</span><strong>{value}</strong><small>{change}</small>
          </article>)}
        </section>

        <section className={styles.panel} aria-labelledby="products-title">
          <div className={styles.panelHeading}><div><p>CATALOG PREVIEW</p><h2 id="products-title">Sample products</h2></div><button type="button" disabled><PackageSearch size={15} /> Catalog tools unavailable</button></div>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>PRODUCT</th><th>BRAND</th><th>PRICE</th><th>AVAILABILITY</th><th>EDIT</th></tr></thead>
              <tbody>{products.slice(0, 5).map((product) => <tr key={product.id}>
                <td><strong>{product.name}</strong><small>{product.category}</small></td>
                <td>{product.brand}</td><td>On request</td><td><span className={styles.sampleState}>Sample</span></td><td><button type="button" disabled aria-label={`Edit ${product.name}`}>Edit</button></td>
              </tr>)}</tbody>
            </table>
          </div>
          <p className={styles.tableNote}>This table uses local frontend fixtures. Changes cannot be saved.</p>
        </section>

        <section className={styles.panel} aria-labelledby="enquiries-title">
          <div className={styles.panelHeading}><div><p>RECENT ACTIVITY</p><h2 id="enquiries-title">Example enquiries</h2></div><button type="button" disabled>Enquiry management unavailable</button></div>
          <div className={styles.requestList}>{sampleRequests.map((request) => <div className={styles.request} key={request.reference}>
            <strong>{request.reference}</strong><span>{request.contact}</span><span>{request.request}</span><small>{request.state}</small>
          </div>)}</div>
        </section>
      </section>
    </main>
  );
}

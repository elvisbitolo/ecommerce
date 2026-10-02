import Link from "next/link";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import styles from "./admin.module.css";

export default function AdminSignIn() {
  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/">
        <ArrowLeft size={16} /> Back to storefront
      </Link>
      <section className={styles.panel} aria-labelledby="admin-title">
        <div className={styles.brandRow}>
          <span className={styles.brandMark}>ITL</span>
          <span>STAFF WORKSPACE</span>
        </div>
        <div className={styles.lockMark}><KeyRound size={23} /></div>
        <p className={styles.eyebrow}>ADMINISTRATION</p>
        <h1 id="admin-title">Sign in to your workspace</h1>
        <p className={styles.intro}>Manage the catalog, review enquiries and keep the store moving.</p>
        <div className={styles.notice} role="status">
          <ShieldCheck size={18} />
          <p>Staff authentication is not connected yet. This preview does not secure or grant access to admin data.</p>
        </div>
        <label className={styles.field}>
          <span>Email address</span>
          <input type="email" disabled placeholder="Available after authentication setup" />
        </label>
        <label className={styles.field}>
          <span>Password</span>
          <input type="password" disabled placeholder="Sign-in is not active" />
        </label>
        <button className={styles.submit} type="button" disabled>Sign-in will be enabled in the backend phase</button>
        <p className={styles.privacy}>This route is omitted from storefront navigation and marked no-index. A private URL is not a security control.</p>
      </section>
      <span className={styles.footerNote}>ITL · STAFF ACCESS</span>
    </main>
  );
}

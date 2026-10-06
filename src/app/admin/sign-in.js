"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { signInAction } from "./actions";
import styles from "./admin.module.css";

const initialState = { error: "" };

export default function AdminSignIn({ configured }) {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/">
        <ArrowLeft size={16} /> Back to storefront
      </Link>
      <section className={styles.panel} aria-labelledby="admin-title">
        <div className={styles.brandRow}>
          <span className={styles.brandMark}>UTL</span>
          <span>UNITED TOOLS LTD<br />SUPERADMIN WORKSPACE</span>
        </div>
        <div className={styles.lockMark}><KeyRound size={23} /></div>
        <p className={styles.eyebrow}>SECURE CATALOG ACCESS</p>
        <h1 id="admin-title">Sign in to manage products</h1>
        <p className={styles.intro}>Upload or capture product photos, update catalog details, and publish products to the storefront.</p>
        {!configured && <div className={styles.notice} role="status">
          <ShieldCheck size={18} />
          <p>Supabase is not configured yet. Add the public project URL and publishable key, run the catalog migration, and enable a superadmin account.</p>
        </div>}
        {!configured && <Link className={styles.previewLink} href="/admin/preview">Preview the admin screen</Link>}
        {state.error && <div className={styles.error} role="alert">{state.error}</div>}
        <form action={formAction}>
          <label className={styles.field}>
            <span>Email address</span>
            <input type="email" name="email" autoComplete="username" required />
          </label>
          <label className={styles.field}>
            <span>Password</span>
            <input type="password" name="password" autoComplete="current-password" required />
          </label>
          <button className={styles.submit} type="submit" disabled={!configured || pending}>
            {pending ? "Signing in…" : "Sign in securely"}
          </button>
        </form>
        <p className={styles.privacy}>Only Supabase accounts with the server-managed <code>app_metadata.role</code> set to <code>superadmin</code> can manage the catalog.</p>
      </section>
      <span className={styles.footerNote}>UTL · SUPERADMIN ACCESS</span>
    </main>
  );
}

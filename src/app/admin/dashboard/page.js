import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { categories, products as sampleProducts } from "../../../data/catalog";
import { getSupabaseConfig } from "../../../lib/supabase/config";
import { getSuperadminClient } from "../../../lib/supabase/admin";
import ProductManager from "../product-manager";
import { signOutAction } from "../actions";
import styles from "./admin-shell.module.css";

export const metadata = {
  title: "Product management",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const config = getSupabaseConfig();
  if (!config) {
    return (
      <main className={styles.setupPage}>
        <section className={styles.setupCard}>
          <ShieldCheck size={26} />
          <p>SUPERADMIN WORKSPACE</p>
          <h1>Connect Supabase to manage products</h1>
          <span>Add the Supabase public project URL and publishable key, apply the catalog migration, and grant your user the superadmin app metadata role.</span>
          <Link href="/admin"><ArrowLeft size={15} /> Back to sign in</Link>
        </section>
      </main>
    );
  }

  const access = await getSuperadminClient();
  if (!access) redirect("/admin");

  const { data, error } = await access.supabase
    .from("products")
    .select("id, slug, name, sku, brand, category_name, category_slug, detail, image_url, is_published")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`Could not load admin products: ${error.message}`);

  const savedProducts = data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    sku: row.sku ?? "",
    brand: row.brand,
    category: row.category_name,
    categorySlug: row.category_slug,
    detail: row.detail,
    image: row.image_url,
    isPublished: row.is_published,
  }));
  const savedIds = new Set(savedProducts.map((product) => product.id));
  const savedSlugs = new Set(savedProducts.map((product) => product.slug));
  const fixtureProducts = sampleProducts
    .filter((product) => !savedIds.has(product.id) && !savedSlugs.has(product.slug))
    .map((product) => ({ ...product, isPublished: true, sku: product.sku ?? "" }));
  const products = [...savedProducts, ...fixtureProducts];

  return (
    <main className={styles.adminShell}>
      <header className={styles.adminTopbar}>
        <Link className={styles.adminBrand} href="/"><span>UTL</span><strong>UNITED TOOLS LTD<small>SUPERADMIN</small></strong></Link>
        <div><Link href="/">View storefront <ArrowLeft size={14} /></Link><form action={signOutAction}><button type="submit">Sign out</button></form></div>
      </header>
      <div className={styles.adminContent}>
        <ProductManager
          categories={categories.map(({ name, slug, parentSlug }) => ({ name, slug, parentSlug }))}
          products={products}
          userEmail={access.user.email ?? "Superadmin"}
          showImportSamples={savedProducts.length === 0}
        />
      </div>
    </main>
  );
}

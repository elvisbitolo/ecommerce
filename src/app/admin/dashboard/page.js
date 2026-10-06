import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { prisma } from "../../../lib/prisma";
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

  const [productRows, categoryRows] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        sku: true,
        brand: { select: { name: true } },
        categories: { select: { slug: true, name: true } },
        shortDescription: true,
        images: true,
        isPublished: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 500,
    }),
    prisma.category.findMany({ orderBy: [{ menuOrder: "asc" }, { name: "asc" }] }),
  ]);

  const savedProducts = productRows.map((row) => {
    const category = row.categories?.[0];
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      sku: row.sku ?? "",
      brand: row.brand?.name ?? "",
      category: category?.name ?? "",
      categorySlug: category?.slug ?? "",
      detail: row.shortDescription ?? "",
      image: row.images?.[0] ?? "",
      isPublished: row.isPublished,
    };
  });

  const categories = categoryRows.map(({ id, name, slug, parentId }) => ({
    name,
    slug,
    parentSlug: parentId ? categoryRows.find((item) => item.id === parentId)?.slug : null,
  }));

  return (
    <main className={styles.adminShell}>
      <header className={styles.adminTopbar}>
        <Link className={styles.adminBrand} href="/"><span>UTL</span><strong>UNITED TOOLS LTD<small>SUPERADMIN</small></strong></Link>
        <div><Link href="/">View storefront <ArrowLeft size={14} /></Link><form action={signOutAction}><button type="submit">Sign out</button></form></div>
      </header>
      <div className={styles.adminContent}>
        <ProductManager
          categories={categories}
          products={savedProducts}
          userEmail={access.user.email ?? "Superadmin"}
          showImportSamples={false}
        />
      </div>
    </main>
  );
}

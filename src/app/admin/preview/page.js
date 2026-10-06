import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { categories, products as sampleProducts } from "../../../data/catalog";
import ProductManager from "../product-manager";
import styles from "../dashboard/admin-shell.module.css";

export const metadata = {
  title: "Admin screen preview",
  robots: { index: false, follow: false },
};

export default function AdminPreviewPage() {
  const products = sampleProducts.map((product) => ({
    ...product,
    sku: product.sku ?? "",
    isPublished: true,
  }));

  return (
    <main className={styles.adminShell}>
      <header className={styles.adminTopbar}>
        <Link className={styles.adminBrand} href="/"><span>UTL</span><strong>UNITED TOOLS LTD<small>ADMIN PREVIEW</small></strong></Link>
        <div><Link href="/admin"><ArrowLeft size={14} /> Back to admin sign in</Link></div>
      </header>
      <div className={styles.adminContent}>
        <ProductManager categories={categories.map(({ name, slug, parentSlug }) => ({ name, slug, parentSlug }))} products={products} userEmail="Demo preview" previewMode />
      </div>
    </main>
  );
}

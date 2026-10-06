"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { categories, products as sampleProducts } from "../../data/catalog";
import { getSuperadminClient } from "../../lib/supabase/admin";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export async function signInAction(_previousState, formData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Supabase is not configured. Follow the admin setup instructions first." };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Unable to sign in. Check your credentials and try again." };
  if (data.user.app_metadata?.role !== "superadmin") {
    await supabase.auth.signOut();
    return { error: "This account does not have superadmin access." };
  }

  redirect("/admin/dashboard");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(`Could not sign out: ${error.message}`);
  }

  redirect("/admin");
}

export async function saveProduct(product) {
  const access = await getSuperadminClient();
  if (!access) return { error: "Your session is no longer authorized. Sign in again." };

  const name = String(product.name ?? "").trim();
  const slug = String(product.slug ?? "").trim();
  const brand = String(product.brand ?? "").trim();
  const categorySlug = String(product.categorySlug ?? "");
  const detail = String(product.detail ?? "").trim();
  const sku = String(product.sku ?? "").trim();
  const imageUrl = String(product.imageUrl ?? "").trim();
  const category = categories.find((item) => item.slug === categorySlug);

  if (!name || !brand || !slug || !category || !imageUrl) {
    return { error: "Name, brand, slug, category, and product image are required." };
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "Use lowercase letters, numbers, and single hyphens for the product URL." };
  }
  try {
    if (new URL(imageUrl).protocol !== "https:") return { error: "Product image URLs must use HTTPS." };
  } catch {
    return { error: "Enter a valid product image URL or upload an image." };
  }

  const record = {
    id: String(product.id || randomUUID()),
    slug,
    name,
    sku: sku || null,
    brand,
    category_name: category.name,
    category_slug: category.slug,
    detail,
    image_url: imageUrl,
    is_published: product.isPublished === true,
    updated_at: new Date().toISOString(),
  };

  const { error } = await access.supabase.from("products").upsert(record, { onConflict: "id" });
  if (error) {
    if (error.code === "23505") return { error: "That product URL is already in use. Choose a different slug." };
    return { error: `Could not save this product: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/category/[slug]", "page");
  revalidatePath("/product/[slug]", "page");
  revalidatePath(`/product/${slug}`);
  return { saved: true };
}

export async function importSampleCatalog() {
  const access = await getSuperadminClient();
  if (!access) return { error: "Your session is no longer authorized. Sign in again." };

  const records = sampleProducts.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    sku: product.sku || null,
    brand: product.brand,
    category_name: product.category,
    category_slug: product.categorySlug,
    detail: product.detail,
    image_url: product.image,
    is_published: true,
  }));
  const { error } = await access.supabase.from("products").upsert(records, { onConflict: "id", ignoreDuplicates: true });
  if (error) return { error: `Could not import the starter catalog: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/category/[slug]", "page");
  return { imported: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
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
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });

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

  let brandRow = await prisma.brand.findFirst({ where: { name: { equals: brand, mode: "insensitive" } } });
  if (!brandRow) {
    const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    brandRow = await prisma.brand.upsert({
      where: { slug: brandSlug },
      update: { name: brand },
      create: { name: brand, slug: brandSlug },
    });
  }

  const record = {
    slug,
    name,
    sku: sku || null,
    brandId: brandRow.id,
    shortDescription: detail || null,
    images: [imageUrl],
    isPublished: product.isPublished === true,
  };

  try {
    await prisma.product.upsert({
      where: { slug },
      update: { ...record, categories: { set: [{ id: category.id }] } },
      create: { ...record, categories: { connect: [{ id: category.id }] } },
    });
  } catch (upsertError) {
    if (upsertError?.code === "P2002") return { error: "That product URL is already in use. Choose a different slug." };
    return { error: `Could not save this product: ${upsertError?.message ?? "unknown error"}` };
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

  const sampleProducts = await prisma.product.findMany({
    select: { id: true, slug: true },
    orderBy: { position: "asc" },
    take: 12,
  });
  const records = sampleProducts.map((product) => ({
    slug: product.slug,
    name: product.name,
    isPublished: true,
  }));
  if (!records.length) return { error: "The catalog is already populated." };

  for (const product of records) {
    await prisma.product.update({
      where: { slug: product.slug },
      data: { isPublished: true },
    });
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/category/[slug]", "page");
  return { imported: true };
}

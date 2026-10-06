import { createClient } from "@supabase/supabase-js";
import { products as sampleProducts } from "../data/catalog";
import { getSupabaseConfig } from "./supabase/config";

function mapProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    sku: row.sku ?? "",
    brand: row.brand,
    category: row.category_name,
    categorySlug: row.category_slug,
    detail: row.detail,
    image: row.image_url,
  };
}

function createPublicClient() {
  const config = getSupabaseConfig();
  if (!config) return null;

  return createClient(config.url, config.publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function getCatalogProducts() {
  const supabase = createPublicClient();
  if (!supabase) return sampleProducts;

  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, sku, brand, category_name, category_slug, detail, image_url")
    .eq("is_published", true)
    .order("name");

  if (error) throw new Error(`Could not load the product catalog: ${error.message}`);
  return data.map(mapProduct);
}

export async function getCatalogProductBySlug(slug) {
  const supabase = createPublicClient();
  if (!supabase) return sampleProducts.find((product) => product.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, sku, brand, category_name, category_slug, detail, image_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw new Error(`Could not load product details: ${error.message}`);
  return data ? mapProduct(data) : null;
}

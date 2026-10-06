import { createSupabaseServerClient } from "./server";

export async function getSuperadminClient() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || data.user.app_metadata?.role !== "superadmin") return null;

  return { supabase, user: data.user };
}

import AdminSignIn from "./sign-in";
import { redirect } from "next/navigation";
import { getSupabaseConfig } from "../../lib/supabase/config";
import { getSuperadminClient } from "../../lib/supabase/admin";

export const metadata = {
  title: "Admin sign in",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const access = await getSuperadminClient();
  if (access) redirect("/admin/dashboard");

  return <AdminSignIn configured={Boolean(getSupabaseConfig())} />;
}

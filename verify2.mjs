import { createServerClient } from "@supabase/ssr";
const url = "https://kcocnulozzvyxzbxdjaj.supabase.co";
const key = "sb_publishable_0HAlFr3hdmZZFVW3DBuhTQ__oCj4WTO";
let cookieHeader = "";
const supabase = createServerClient(url, key, {
  cookies: {
    getAll() { return []; },
    setAll(list) { cookieHeader = list.map(({ name, value }) => `${name}=${encodeURIComponent(value)}`).join("; "); },
  },
});
const { error } = await supabase.auth.signInWithPassword({ email: "elvisbitolo11@gmail.com", password: "Khanyanga2@" });
if (error) { console.log("signin failed", error.message); process.exit(1); }
const out = await fetch(`http://localhost:3122/admin/dashboard`, { headers: { cookie: cookieHeader } });
const text = await out.text();
console.log("status:", out.status);
console.log("has 'Manage products':", text.includes("Manage products"));
console.log("has 'Signed in as':", text.includes("Signed in as"));
console.log("snippet:", text.slice(0, 120).replace(/\s+/g, " "));

"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

let client;

export function createSupabaseBrowserClient() {
  const config = getSupabaseConfig();
  if (!config) return null;

  client ??= createBrowserClient(config.url, config.publishableKey);
  return client;
}

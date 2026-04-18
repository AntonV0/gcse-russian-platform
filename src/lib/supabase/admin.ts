import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "@/lib/supabase/env";

function getServiceRoleKey(): string {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!value) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return value;
}

export function createAdminClient() {
  return createClient(supabaseUrl, getServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

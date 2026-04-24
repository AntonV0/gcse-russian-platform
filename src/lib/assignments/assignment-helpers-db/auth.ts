import { createClient } from "@/lib/supabase/server";

export async function isCurrentUserAdminDb() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return false;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Error checking admin status in assignment helpers:", profileError);
    return false;
  }

  return Boolean(profile?.is_admin);
}

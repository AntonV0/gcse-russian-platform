import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return null;

  return profile;
}

export async function getCurrentCourseAccess(
  courseSlug: string,
  variant: string = "foundation"
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: access, error } = await supabase
    .from("user_course_access")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .eq("course_variant", variant)
    .single();

  if (error) return null;

  return access;
}
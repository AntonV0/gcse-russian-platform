import { createClient } from "@/lib/supabase/server";
import { getCurrentCourseVariantAccessGrantDb } from "@/lib/access/access-helpers-db";
import { cache } from "react";

export const getCurrentUser = cache(async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

export const getCurrentProfile = cache(async function getCurrentProfile() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return null;

  return profile;
});

export const getCurrentCourseAccess = cache(async function getCurrentCourseAccess(
  courseSlug: string,
  variantSlug: string = "foundation"
) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return null;

  // 1. Prefer the new access grant model
  const grant = await getCurrentCourseVariantAccessGrantDb(
    courseSlug,
    variantSlug,
    user.id
  );

  if (grant) {
    return {
      user_id: grant.user_id,
      course_slug: courseSlug,
      course_variant: variantSlug,
      access_mode: grant.access_mode,
      source: "user_access_grants",
      product_id: grant.product_id,
      starts_at: grant.starts_at,
      ends_at: grant.ends_at,
      is_active: grant.is_active,
    };
  }

  // 2. Fallback to the old table during migration
  const { data: access, error } = await supabase
    .from("user_course_access")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .eq("course_variant", variantSlug)
    .single();

  if (error) return null;

  return access;
});

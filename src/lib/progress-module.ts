import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function getModuleProgress(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string
) {
  const user = await getCurrentUser();

  if (!user) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("lesson_slug, completed")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .eq("variant_slug", variantSlug)
    .eq("module_slug", moduleSlug);

  if (error || !data) return [];

  return data;
}
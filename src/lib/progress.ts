import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function getLessonProgress(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
) {
  const user = await getCurrentUser();

  if (!user) return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .eq("variant_slug", variantSlug)
    .eq("module_slug", moduleSlug)
    .eq("lesson_slug", lessonSlug)
    .single();

  if (error) return null;

  return data;
}

export async function getCourseProgressSummary(
  courseSlug: string,
  variantSlug: string = "foundation"
) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      completedLessons: 0,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .eq("variant_slug", variantSlug)
    .eq("completed", true);

  if (error || !data) {
    return {
      completedLessons: 0,
    };
  }

  return {
    completedLessons: data.length,
  };
}

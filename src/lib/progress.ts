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

export type LessonSectionProgressRow = {
  id: string;
  user_id: string;
  lesson_id: string;
  section_id: string;
  first_visited_at: string;
  last_visited_at: string;
  visit_count: number;
  created_at: string;
  updated_at: string;
};

export async function getLessonSectionProgress(
  lessonId: string
): Promise<LessonSectionProgressRow[]> {
  const user = await getCurrentUser();

  if (!user) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_section_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId);

  if (error || !data) {
    return [];
  }

  return data as LessonSectionProgressRow[];
}

export async function getVisitedLessonSectionIds(lessonId: string): Promise<string[]> {
  const rows = await getLessonSectionProgress(lessonId);
  return rows.map((row) => row.section_id);
}

export async function markLessonSectionVisited(lessonId: string, sectionId: string) {
  const user = await getCurrentUser();

  if (!user) return;

  const supabase = await createClient();

  const { error } = await supabase.from("lesson_section_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      section_id: sectionId,
      last_visited_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,lesson_id,section_id",
    }
  );

  if (error) {
    console.error("Error marking lesson section visited:", error);
  }
}

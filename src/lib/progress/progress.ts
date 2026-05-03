import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { syncFoundationSectionProgressToHigherSameLesson } from "@/lib/progress/cross-variant-sync";

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
    .select("id, completed")
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

  const { count, error } = await supabase
    .from("lesson_progress")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .eq("variant_slug", variantSlug)
    .eq("completed", true);

  if (error) {
    return {
      completedLessons: 0,
    };
  }

  return {
    completedLessons: count ?? 0,
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
    .select(
      "id, user_id, lesson_id, section_id, first_visited_at, last_visited_at, visit_count, created_at, updated_at"
    )
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

export async function getLessonSectionProgressSummary(
  lessonId: string,
  totalSections: number
) {
  const rows = await getLessonSectionProgress(lessonId);
  const visitedCount = rows.length;
  const percent =
    totalSections > 0 ? Math.round((visitedCount / totalSections) * 100) : 0;

  return {
    visitedCount,
    totalSections,
    percent,
    allVisited: totalSections > 0 && visitedCount >= totalSections,
  };
}

export async function markLessonSectionVisited(lessonId: string, sectionId: string) {
  const user = await getCurrentUser();

  if (!user) return false;

  const supabase = await createClient();

  const { data: existing, error: existingError } = await supabase
    .from("lesson_section_progress")
    .select("id, visit_count")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .eq("section_id", sectionId)
    .maybeSingle();

  if (existingError) {
    console.error("Error checking lesson section visit:", existingError);
    return false;
  }

  const now = new Date().toISOString();

  if (!existing) {
    const { error: insertError } = await supabase
      .from("lesson_section_progress")
      .upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          section_id: sectionId,
          first_visited_at: now,
          last_visited_at: now,
          visit_count: 1,
          created_at: now,
          updated_at: now,
        },
        {
          ignoreDuplicates: true,
          onConflict: "user_id,lesson_id,section_id",
        }
      );

    if (insertError) {
      console.error("Error inserting lesson section visit:", insertError);
      return false;
    }

    await syncFoundationSectionProgressToHigherSameLesson({
      userId: user.id,
      lessonId,
      sectionId,
    });

    return true;
  }

  const { error: updateError } = await supabase
    .from("lesson_section_progress")
    .update({
      last_visited_at: now,
      updated_at: now,
      visit_count: (existing.visit_count ?? 1) + 1,
    })
    .eq("id", existing.id);

  if (updateError) {
    console.error("Error updating lesson section visit:", updateError);
    return false;
  }

  await syncFoundationSectionProgressToHigherSameLesson({
    userId: user.id,
    lessonId,
    sectionId,
  });

  return true;
}

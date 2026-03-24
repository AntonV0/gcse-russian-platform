// /src/lib/assignment-progress.ts
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function getLessonCompletionMap(
  lessons: {
    course_slug: string;
    variant_slug: string;
    module_slug: string;
    slug: string;
  }[]
) {
  const user = await getCurrentUser();
  if (!user) return new Map<string, boolean>();

  const supabase = await createClient();

  const { data } = await supabase
    .from("lesson_progress")
    .select("course_slug, variant_slug, module_slug, lesson_slug, completed")
    .eq("user_id", user.id)
    .eq("completed", true);

  const map = new Map<string, boolean>();

  for (const row of data ?? []) {
    const key = `${row.course_slug}|${row.variant_slug}|${row.module_slug}|${row.lesson_slug}`;
    map.set(key, true);
  }

  return map;
}

export async function getQuestionSetStartedMap(questionSetIds: string[]) {
  const user = await getCurrentUser();
  if (!user || questionSetIds.length === 0) return new Map<string, boolean>();

  const supabase = await createClient();

  const { data } = await supabase
    .from("question_attempts")
    .select("question_id")
    .eq("user_id", user.id);

  // VERY SIMPLE first version:
  // if user has ANY attempts → treat set as started

  const startedMap = new Map<string, boolean>();

  if (data && data.length > 0) {
    for (const id of questionSetIds) {
      startedMap.set(id, true);
    }
  }

  return startedMap;
}

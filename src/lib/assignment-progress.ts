import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

type LessonProgressLookup = {
  course_slug: string;
  variant_slug: string;
  module_slug: string;
  slug: string;
};

export async function getLessonCompletionMap(lessons: LessonProgressLookup[]) {
  const user = await getCurrentUser();
  if (!user || lessons.length === 0) {
    return new Map<string, boolean>();
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("course_slug, variant_slug, module_slug, lesson_slug, completed")
    .eq("user_id", user.id)
    .eq("completed", true);

  if (error) {
    console.error("Error loading lesson completion map:", error);
    return new Map<string, boolean>();
  }

  const lessonKeys = new Set(
    lessons.map(
      (lesson) =>
        `${lesson.course_slug}|${lesson.variant_slug}|${lesson.module_slug}|${lesson.slug}`
    )
  );

  const map = new Map<string, boolean>();

  for (const row of data ?? []) {
    const key = `${row.course_slug}|${row.variant_slug}|${row.module_slug}|${row.lesson_slug}`;

    if (lessonKeys.has(key)) {
      map.set(key, true);
    }
  }

  return map;
}

export async function getQuestionSetStartedMap(questionSetIds: string[]) {
  const user = await getCurrentUser();
  if (!user || questionSetIds.length === 0) {
    return new Map<string, boolean>();
  }

  const supabase = await createClient();

  const { data: questions, error: questionError } = await supabase
    .from("questions")
    .select("id, question_set_id")
    .in("question_set_id", questionSetIds);

  if (questionError) {
    console.error(
      "Error loading question set questions for progress map:",
      questionError
    );
    return new Map<string, boolean>();
  }

  const questionIds = (questions ?? []).map((question) => question.id);

  if (questionIds.length === 0) {
    return new Map<string, boolean>();
  }

  const { data: attempts, error: attemptError } = await supabase
    .from("question_attempts")
    .select("question_id")
    .eq("user_id", user.id)
    .in("question_id", questionIds);

  if (attemptError) {
    console.error("Error loading question attempts for progress map:", attemptError);
    return new Map<string, boolean>();
  }

  const attemptedQuestionIds = new Set(
    (attempts ?? []).map((attempt) => attempt.question_id)
  );

  const startedMap = new Map<string, boolean>();

  for (const question of questions ?? []) {
    if (attemptedQuestionIds.has(question.id)) {
      startedMap.set(question.question_set_id, true);
    }
  }

  return startedMap;
}

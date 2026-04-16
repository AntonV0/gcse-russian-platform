import { createClient } from "@/lib/supabase/server";

type RecordQuestionAttemptInput = {
  questionId: string;
  lessonId?: string | null;
  submittedText?: string | null;
  submittedPayload?: Record<string, unknown> | null;
  isCorrect: boolean;
  awardedMarks?: number | null;
  feedback?: string | null;
};

export async function recordQuestionAttempt({
  questionId,
  lessonId = null,
  submittedText = null,
  submittedPayload = null,
  isCorrect,
  awardedMarks = null,
  feedback = null,
}: RecordQuestionAttemptInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error getting current user for question attempt:", userError);
    return { success: false, error: "auth_error" as const };
  }

  if (!user) {
    return { success: false, error: "not_authenticated" as const };
  }

  const { error: attemptError } = await supabase.from("question_attempts").insert({
    user_id: user.id,
    question_id: questionId,
    lesson_id: lessonId,
    submitted_text: submittedText,
    submitted_payload: submittedPayload,
    is_correct: isCorrect,
    awarded_marks: awardedMarks,
    feedback,
  });

  if (attemptError) {
    console.error("Error inserting question attempt:", attemptError);
    return { success: false, error: "attempt_insert_failed" as const };
  }

  const { data: existingProgress, error: progressReadError } = await supabase
    .from("question_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("question_id", questionId)
    .maybeSingle();

  if (progressReadError) {
    console.error("Error reading question progress:", progressReadError);
    return { success: false, error: "progress_read_failed" as const };
  }

  const numericScore = awardedMarks ?? (isCorrect ? 1 : 0);

  if (!existingProgress) {
    const { error: progressInsertError } = await supabase
      .from("question_progress")
      .insert({
        user_id: user.id,
        question_id: questionId,
        total_attempts: 1,
        correct_attempts: isCorrect ? 1 : 0,
        best_score: numericScore,
        last_score: numericScore,
        first_answered_at: new Date().toISOString(),
        last_answered_at: new Date().toISOString(),
      });

    if (progressInsertError) {
      console.error("Error inserting question progress:", progressInsertError);
      return { success: false, error: "progress_insert_failed" as const };
    }
  } else {
    const { error: progressUpdateError } = await supabase
      .from("question_progress")
      .update({
        total_attempts: existingProgress.total_attempts + 1,
        correct_attempts: existingProgress.correct_attempts + (isCorrect ? 1 : 0),
        best_score:
          existingProgress.best_score == null
            ? numericScore
            : Math.max(existingProgress.best_score, numericScore),
        last_score: numericScore,
        last_answered_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("question_id", questionId);

    if (progressUpdateError) {
      console.error("Error updating question progress:", progressUpdateError);
      return { success: false, error: "progress_update_failed" as const };
    }
  }

  return { success: true };
}

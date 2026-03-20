"use server";

import { recordQuestionAttempt } from "@/lib/question-progress";

type SubmitQuestionAttemptInput = {
  questionId: string;
  lessonId?: string | null;
  submittedText?: string | null;
  submittedPayload?: Record<string, unknown> | null;
  isCorrect: boolean;
  awardedMarks?: number | null;
  feedback?: string | null;
};

export async function submitQuestionAttemptAction(
  input: SubmitQuestionAttemptInput
) {
  return recordQuestionAttempt(input);
}
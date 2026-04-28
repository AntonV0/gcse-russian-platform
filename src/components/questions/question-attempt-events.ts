"use client";

export const QUESTION_ATTEMPT_SUBMITTED_EVENT = "question-practice:attempt-submitted";

export type QuestionAttemptSubmittedDetail = {
  questionId: string;
  isCorrect: boolean;
  statusLabel?: string;
  correctAnswerText?: string | null;
  feedback?: string | null;
};

export function notifyQuestionAttemptSubmitted(detail: QuestionAttemptSubmittedDetail) {
  window.dispatchEvent(
    new CustomEvent<QuestionAttemptSubmittedDetail>(QUESTION_ATTEMPT_SUBMITTED_EVENT, {
      detail,
    })
  );
}

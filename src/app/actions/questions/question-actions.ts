"use server";

import {
  buildRuntimeQuestion,
  type QuestionFeedbackResult,
  type RuntimeQuestion,
  type RuntimeTextQuestion,
  validateMultipleChoiceAnswer,
  validateStructuredAnswer,
  validateTextAnswer,
} from "@/lib/questions/question-engine";
import {
  getAcceptedAnswersByQuestionIdDb,
  getQuestionByIdDb,
  getQuestionOptionsByQuestionIdDb,
} from "@/lib/questions/question-helpers-db";
import { recordQuestionAttempt } from "@/lib/questions/question-progress";

type SubmitQuestionAttemptInput = {
  questionId: string;
  lessonId?: string | null;
  selectedOptionId?: string | null;
  submittedText?: string | null;
  submittedPayload?: Record<string, unknown> | null;
};

export type SubmitQuestionAttemptActionResult =
  | {
      success: true;
      feedback: QuestionFeedbackResult;
    }
  | {
      success: false;
      error:
        | "question_not_found"
        | "unsupported_question_type"
        | "missing_answer"
        | "attempt_record_failed";
    };

function getBooleanMetadata(
  metadata: Record<string, unknown>,
  key: string
): boolean | undefined {
  const value = metadata[key];
  return typeof value === "boolean" ? value : undefined;
}

function getValidationOptions(metadata: Record<string, unknown>) {
  return {
    ignorePunctuation: getBooleanMetadata(metadata, "ignorePunctuation") ?? false,
    ignoreArticles: getBooleanMetadata(metadata, "ignoreArticles") ?? false,
    collapseWhitespace: getBooleanMetadata(metadata, "collapseWhitespace") ?? true,
  };
}

function toPublicFeedback(result: QuestionFeedbackResult): QuestionFeedbackResult {
  return {
    isCorrect: result.isCorrect,
    feedback: result.feedback,
    statusLabel: result.statusLabel,
    correctAnswerText: result.correctAnswerText,
    acceptedAnswerTexts: result.acceptedAnswerTexts,
  };
}

function isRuntimeTextQuestion(
  question: RuntimeQuestion
): question is RuntimeTextQuestion {
  return question.type === "short_answer" || question.type === "translation";
}

export async function submitQuestionAttemptAction(
  input: SubmitQuestionAttemptInput
): Promise<SubmitQuestionAttemptActionResult> {
  const [question, options, acceptedAnswers] = await Promise.all([
    getQuestionByIdDb(input.questionId),
    getQuestionOptionsByQuestionIdDb(input.questionId),
    getAcceptedAnswersByQuestionIdDb(input.questionId),
  ]);

  if (!question) {
    return { success: false, error: "question_not_found" };
  }

  const runtimeQuestion = buildRuntimeQuestion({
    question,
    options,
    acceptedAnswers,
  });

  if (!runtimeQuestion) {
    return { success: false, error: "unsupported_question_type" };
  }

  let feedback: QuestionFeedbackResult;
  let submittedText = input.submittedText ?? null;
  let submittedPayload: Record<string, unknown> | null = null;

  if (runtimeQuestion.type === "multiple_choice") {
    if (!input.selectedOptionId) {
      return { success: false, error: "missing_answer" };
    }

    const result = validateMultipleChoiceAnswer({
      question: runtimeQuestion,
      selectedOptionId: input.selectedOptionId,
    });

    feedback = toPublicFeedback(result);
    submittedText = null;
    submittedPayload = {
      selectedOptionId: result.selectedOptionId,
      selectedOptionText: result.selectedOptionText,
      statusLabel: result.statusLabel,
      correctAnswerText: result.correctAnswerText,
      acceptedAnswerTexts: result.acceptedAnswerTexts,
      questionType: runtimeQuestion.type,
    };
  } else if (isRuntimeTextQuestion(runtimeQuestion)) {
    const answerText = input.submittedText?.trim();

    if (!answerText) {
      return { success: false, error: "missing_answer" };
    }

    const result = validateTextAnswer({
      question: runtimeQuestion,
      submittedText: input.submittedText ?? "",
      options: getValidationOptions(runtimeQuestion.metadata),
    });

    feedback = toPublicFeedback(result);
    submittedPayload = {
      answer: input.submittedText ?? "",
      normalizedAnswer: result.normalizedSubmittedText,
      matchedAnswerId: result.matchedAnswer?.id ?? null,
      statusLabel: result.statusLabel,
      correctAnswerText: result.correctAnswerText,
      acceptedAnswerTexts: result.acceptedAnswerTexts,
      questionType: runtimeQuestion.type,
    };
  } else {
    const payload = input.submittedPayload;

    if (!payload) {
      return { success: false, error: "missing_answer" };
    }

    const result = validateStructuredAnswer({
      question: runtimeQuestion,
      submittedPayload: payload,
      options: getValidationOptions(runtimeQuestion.metadata),
    });

    feedback = toPublicFeedback(result);
    submittedText = null;
    submittedPayload = {
      ...payload,
      statusLabel: result.statusLabel,
      correctAnswerText: result.correctAnswerText,
      acceptedAnswerTexts: result.acceptedAnswerTexts,
      questionType: runtimeQuestion.type,
    };
  }

  const attemptResult = await recordQuestionAttempt({
    questionId: input.questionId,
    lessonId: input.lessonId,
    submittedText,
    submittedPayload,
    isCorrect: feedback.isCorrect,
    awardedMarks: feedback.isCorrect ? runtimeQuestion.marks : 0,
    feedback: feedback.feedback,
  });

  if (!attemptResult.success) {
    return { success: false, error: "attempt_record_failed" };
  }

  return {
    success: true,
    feedback,
  };
}

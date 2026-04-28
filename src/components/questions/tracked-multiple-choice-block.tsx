"use client";

import { useState, useTransition } from "react";
import MultipleChoiceBlock from "@/components/questions/multiple-choice-block";
import {
  submitQuestionAttemptAction,
  type SubmitQuestionAttemptActionResult,
} from "@/app/actions/questions/question-actions";
import { notifyQuestionAttemptSubmitted } from "@/components/questions/question-attempt-events";

type TrackedMultipleChoiceBlockProps = {
  questionId: string;
  lessonId?: string | null;
  question: string;
  options: { id: string; text: string }[];
  audioUrl?: string | null;
  audioMaxPlays?: number;
  audioListeningMode?: boolean;
  audioAutoPlay?: boolean;
  audioHideNativeControls?: boolean;
};

export default function TrackedMultipleChoiceBlock({
  questionId,
  lessonId = null,
  question,
  options,
  audioUrl = null,
  audioMaxPlays,
  audioListeningMode = false,
  audioAutoPlay = false,
  audioHideNativeControls = false,
}: TrackedMultipleChoiceBlockProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitQuestionAttemptActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const submitted = result?.success === true;
  const feedback = result?.success === true ? result.feedback : null;

  async function handleSubmit() {
    if (!selectedOptionId || submitted || isPending) return;

    startTransition(async () => {
      const actionResult = await submitQuestionAttemptAction({
        questionId,
        lessonId,
        selectedOptionId,
      });

      setResult(actionResult);

      if (actionResult.success) {
        notifyQuestionAttemptSubmitted({
          questionId,
          isCorrect: actionResult.feedback.isCorrect,
          statusLabel: actionResult.feedback.statusLabel,
          correctAnswerText: actionResult.feedback.correctAnswerText,
          feedback: actionResult.feedback.feedback,
        });
      }
    });
  }

  return (
    <MultipleChoiceBlock
      question={question}
      options={options}
      explanation={feedback?.feedback ?? undefined}
      audioUrl={audioUrl}
      audioMaxPlays={audioMaxPlays}
      audioListeningMode={audioListeningMode}
      audioAutoPlay={audioAutoPlay}
      audioHideNativeControls={audioHideNativeControls}
      selectedOptionId={selectedOptionId}
      hasSubmitted={submitted}
      isSubmitting={isPending}
      isCorrect={feedback?.isCorrect}
      onSelectOption={setSelectedOptionId}
      onSubmit={handleSubmit}
      feedbackStatusLabel={feedback?.statusLabel}
      feedbackCorrectAnswerText={feedback?.correctAnswerText}
      feedbackAcceptedAnswerTexts={feedback?.acceptedAnswerTexts}
    />
  );
}

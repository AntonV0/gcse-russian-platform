"use client";

import { useMemo, useState } from "react";
import QuestionCard from "@/components/lesson-blocks/question-card";
import QuestionFeedback from "@/components/lesson-blocks/question-feedback";

type TranslationDirection = "to_russian" | "to_english";

type TranslationBlockProps = {
  question: string;
  acceptedAnswers: string[];
  explanation?: string;
  placeholder?: string;
  value?: string;
  hasSubmitted?: boolean;
  isCorrect?: boolean;
  isSubmitting?: boolean;
  onValueChange?: (value: string) => void;
  onSubmit?: () => void;
  direction?: TranslationDirection;
  sourceLanguageLabel?: string;
  targetLanguageLabel?: string;
  instruction?: string;
};

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase();
}

function getDefaultInstruction(params: {
  direction?: TranslationDirection;
  sourceLanguageLabel?: string;
  targetLanguageLabel?: string;
}) {
  const { direction, sourceLanguageLabel, targetLanguageLabel } = params;

  if (targetLanguageLabel) {
    return `Translate into ${targetLanguageLabel}`;
  }

  if (direction === "to_russian") {
    return "Translate into Russian";
  }

  if (direction === "to_english") {
    return "Translate into English";
  }

  if (sourceLanguageLabel && targetLanguageLabel) {
    return `Translate from ${sourceLanguageLabel} into ${targetLanguageLabel}`;
  }

  return "Translate";
}

export default function TranslationBlock({
  question,
  acceptedAnswers,
  explanation,
  placeholder = "Type your translation",
  value,
  hasSubmitted,
  isCorrect,
  isSubmitting = false,
  onValueChange,
  onSubmit,
  direction,
  sourceLanguageLabel,
  targetLanguageLabel,
  instruction,
}: TranslationBlockProps) {
  const [internalAnswer, setInternalAnswer] = useState("");
  const [internalHasSubmitted, setInternalHasSubmitted] = useState(false);

  const resolvedAnswer = value !== undefined ? value : internalAnswer;
  const resolvedHasSubmitted =
    hasSubmitted !== undefined ? hasSubmitted : internalHasSubmitted;

  const normalizedAcceptedAnswers = useMemo(
    () => acceptedAnswers.map(normalizeAnswer),
    [acceptedAnswers]
  );

  const resolvedIsCorrect =
    isCorrect !== undefined
      ? isCorrect
      : normalizedAcceptedAnswers.includes(normalizeAnswer(resolvedAnswer));

  const resolvedInstruction =
    instruction ??
    getDefaultInstruction({
      direction,
      sourceLanguageLabel,
      targetLanguageLabel,
    });

  function handleChange(nextValue: string) {
    if (resolvedHasSubmitted || isSubmitting) return;

    if (onValueChange) {
      onValueChange(nextValue);
      return;
    }

    setInternalAnswer(nextValue);
  }

  function handleSubmit() {
    if (!resolvedAnswer.trim() || resolvedHasSubmitted || isSubmitting) return;

    if (onSubmit) {
      onSubmit();
      return;
    }

    setInternalHasSubmitted(true);
  }

  return (
    <QuestionCard
      heading="Translation"
      instruction={resolvedInstruction}
      prompt={question}
      feedback={
        resolvedHasSubmitted ? (
          <QuestionFeedback
            isCorrect={resolvedIsCorrect}
            explanation={explanation}
          />
        ) : null
      }
    >
      {(sourceLanguageLabel || targetLanguageLabel) && (
        <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-600">
          {sourceLanguageLabel ? (
            <span className="rounded-full bg-gray-100 px-3 py-1">
              Source: {sourceLanguageLabel}
            </span>
          ) : null}

          {targetLanguageLabel ? (
            <span className="rounded-full bg-gray-100 px-3 py-1">
              Target: {targetLanguageLabel}
            </span>
          ) : null}
        </div>
      )}

      <div className="space-y-4">
        <input
          type="text"
          value={resolvedAnswer}
          onChange={(event) => handleChange(event.target.value)}
          disabled={resolvedHasSubmitted || isSubmitting}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!resolvedAnswer.trim() || resolvedHasSubmitted || isSubmitting}
          className="rounded-lg bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resolvedHasSubmitted
            ? "Submitted"
            : isSubmitting
              ? "Saving..."
              : "Check answer"}
        </button>
      </div>
    </QuestionCard>
  );
}
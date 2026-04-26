"use client";

import { useMemo, useState } from "react";
import QuestionCard from "@/components/questions/question-card";
import QuestionFeedback from "@/components/questions/question-feedback";
import Button from "@/components/ui/button";

type MultipleChoiceOption = {
  id: string;
  text: string;
};

type MultipleChoiceBlockProps = {
  question: string;
  options: MultipleChoiceOption[];
  correctOptionId?: string;
  explanation?: string;
  audioUrl?: string | null;
  audioMaxPlays?: number;
  audioListeningMode?: boolean;
  audioAutoPlay?: boolean;
  audioHideNativeControls?: boolean;
  selectedOptionId?: string | null;
  hasSubmitted?: boolean;
  isCorrect?: boolean;
  isSubmitting?: boolean;
  onSelectOption?: (optionId: string) => void;
  onSubmit?: () => void;
  feedbackStatusLabel?: string;
  feedbackCorrectAnswerText?: string | null;
  feedbackAcceptedAnswerTexts?: string[];
};

export default function MultipleChoiceBlock({
  question,
  options,
  correctOptionId = "",
  explanation,
  audioUrl = null,
  audioMaxPlays,
  audioListeningMode = false,
  audioAutoPlay = false,
  audioHideNativeControls = false,
  selectedOptionId,
  hasSubmitted,
  isCorrect,
  isSubmitting = false,
  onSelectOption,
  onSubmit,
  feedbackStatusLabel,
  feedbackCorrectAnswerText,
  feedbackAcceptedAnswerTexts = [],
}: MultipleChoiceBlockProps) {
  const [internalSelectedOptionId, setInternalSelectedOptionId] = useState<string | null>(
    null
  );
  const [internalHasSubmitted, setInternalHasSubmitted] = useState(false);

  const resolvedSelectedOptionId =
    selectedOptionId !== undefined ? selectedOptionId : internalSelectedOptionId;

  const resolvedHasSubmitted =
    hasSubmitted !== undefined ? hasSubmitted : internalHasSubmitted;

  const computedIsCorrect = useMemo(() => {
    return resolvedSelectedOptionId === correctOptionId;
  }, [resolvedSelectedOptionId, correctOptionId]);

  const resolvedIsCorrect = isCorrect !== undefined ? isCorrect : computedIsCorrect;

  function handleSelect(optionId: string) {
    if (resolvedHasSubmitted || isSubmitting) return;

    if (onSelectOption) {
      onSelectOption(optionId);
      return;
    }

    setInternalSelectedOptionId(optionId);
  }

  function handleSubmit() {
    if (!resolvedSelectedOptionId || resolvedHasSubmitted || isSubmitting) return;

    if (onSubmit) {
      onSubmit();
      return;
    }

    setInternalHasSubmitted(true);
  }

  return (
    <QuestionCard
      prompt={question}
      audioUrl={audioUrl}
      audioMaxPlays={audioMaxPlays}
      audioListeningMode={audioListeningMode}
      audioAutoPlay={audioAutoPlay}
      audioHideNativeControls={audioHideNativeControls}
      feedback={
        resolvedHasSubmitted ? (
          <QuestionFeedback
            isCorrect={resolvedIsCorrect}
            explanation={explanation}
            statusLabel={feedbackStatusLabel}
            correctAnswerText={feedbackCorrectAnswerText}
            acceptedAnswerTexts={feedbackAcceptedAnswerTexts}
          />
        ) : null
      }
    >
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = resolvedSelectedOptionId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              disabled={resolvedHasSubmitted || isSubmitting}
              className={[
                "min-h-12 w-full rounded-xl border px-4 py-3 text-left transition",
                isSelected
                  ? "border-[var(--accent-selected-border)] bg-[var(--accent-selected-bg)] text-[var(--accent-on-soft)]"
                  : "border-[var(--border)] bg-[var(--surface-plain-bg)] hover:bg-[var(--surface-muted-bg)]",
                resolvedHasSubmitted || isSubmitting
                  ? "cursor-default"
                  : "cursor-pointer",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current/20 text-xs font-semibold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="min-w-0 [overflow-wrap:anywhere]">{option.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="app-mobile-action-stack flex">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!resolvedSelectedOptionId || resolvedHasSubmitted || isSubmitting}
          variant="primary"
          size="sm"
          icon={isSubmitting ? "pending" : "confirm"}
        >
          {resolvedHasSubmitted
            ? "Submitted"
            : isSubmitting
              ? "Saving..."
              : "Check answer"}
        </Button>
      </div>
    </QuestionCard>
  );
}

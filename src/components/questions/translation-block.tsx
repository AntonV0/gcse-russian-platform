"use client";

import { useMemo, useState } from "react";
import QuestionCard from "@/components/questions/question-card";
import QuestionFeedback from "@/components/questions/question-feedback";

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
  feedbackStatusLabel?: string;
  feedbackCorrectAnswerText?: string | null;
  feedbackAcceptedAnswerTexts?: string[];
  audioUrl?: string | null;
  audioMaxPlays?: number;
  audioListeningMode?: boolean;
  audioAutoPlay?: boolean;
  audioHideNativeControls?: boolean;
  onAudioPlaybackCompleted?: () => void;
  submitLocked?: boolean;
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
  feedbackStatusLabel,
  feedbackCorrectAnswerText,
  feedbackAcceptedAnswerTexts = [],
  audioUrl = null,
  audioMaxPlays,
  audioListeningMode = false,
  audioAutoPlay = false,
  audioHideNativeControls = false,
  onAudioPlaybackCompleted,
  submitLocked = false,
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
    if (!resolvedAnswer.trim() || resolvedHasSubmitted || isSubmitting || submitLocked) {
      return;
    }

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
      audioUrl={audioUrl}
      audioMaxPlays={audioMaxPlays}
      audioListeningMode={audioListeningMode}
      audioAutoPlay={audioAutoPlay}
      audioHideNativeControls={audioHideNativeControls}
      onAudioPlaybackCompleted={onAudioPlaybackCompleted}
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
      {sourceLanguageLabel || targetLanguageLabel ? (
        <div className="flex flex-wrap gap-2">
          {sourceLanguageLabel ? (
            <span className="app-pill app-pill-muted">Source: {sourceLanguageLabel}</span>
          ) : null}

          {targetLanguageLabel ? (
            <span className="app-pill app-pill-muted">Target: {targetLanguageLabel}</span>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-4">
        <input
          type="text"
          value={resolvedAnswer}
          onChange={(event) => handleChange(event.target.value)}
          disabled={resolvedHasSubmitted || isSubmitting}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3 outline-none transition focus:border-[var(--brand-blue)] focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand-blue)_12%,transparent)]"
        />

        {submitLocked ? (
          <p className="rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
            Listen to the audio fully before submitting your translation.
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            !resolvedAnswer.trim() || resolvedHasSubmitted || isSubmitting || submitLocked
          }
          className="app-btn-base app-btn-primary rounded-lg px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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

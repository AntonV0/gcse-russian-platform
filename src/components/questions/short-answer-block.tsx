"use client";

import { useMemo, useState } from "react";
import QuestionCard from "@/components/questions/question-card";
import QuestionFeedback from "@/components/questions/question-feedback";

type ShortAnswerBlockProps = {
  question: string;
  acceptedAnswers?: string[];
  explanation?: string;
  placeholder?: string;
  value?: string;
  hasSubmitted?: boolean;
  isCorrect?: boolean;
  isSubmitting?: boolean;
  onValueChange?: (value: string) => void;
  onSubmit?: () => void;
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

export default function ShortAnswerBlock({
  question,
  acceptedAnswers = [],
  explanation,
  placeholder = "Type your answer",
  value,
  hasSubmitted,
  isCorrect,
  isSubmitting = false,
  onValueChange,
  onSubmit,
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
}: ShortAnswerBlockProps) {
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
      <div className="space-y-4">
        <input
          type="text"
          value={resolvedAnswer}
          onChange={(event) => handleChange(event.target.value)}
          disabled={resolvedHasSubmitted || isSubmitting}
          placeholder={placeholder}
          className="app-form-control app-form-input"
        />

        {submitLocked ? (
          <p className="rounded-xl border border-[var(--warning-border)] bg-[var(--warning-surface)] px-3 py-2 text-sm text-[var(--warning-text)]">
            Listen to the audio fully before submitting your answer.
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            !resolvedAnswer.trim() || resolvedHasSubmitted || isSubmitting || submitLocked
          }
          className="app-btn-base app-btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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

"use client";

import QuestionCard from "@/components/questions/question-card";
import QuestionFeedback from "@/components/questions/question-feedback";

type SentenceBuilderBlockProps = {
  question: string;
  instruction?: string;
  audioUrl?: string | null;
  audioMaxPlays?: number;
  audioListeningMode?: boolean;
  audioAutoPlay?: boolean;
  audioHideNativeControls?: boolean;
  onAudioPlaybackCompleted?: () => void;
  availableTokens: string[];
  selectedTokens: string[];
  explanation?: string;
  hasSubmitted?: boolean;
  isCorrect?: boolean;
  isSubmitting?: boolean;
  onAddToken: (index: number) => void;
  onRemoveToken: (index: number) => void;
  onReset: () => void;
  onSubmit: () => void;
  feedbackStatusLabel?: string;
  feedbackCorrectAnswerText?: string | null;
  feedbackAcceptedAnswerTexts?: string[];
  sourceLanguageLabel?: string;
  targetLanguageLabel?: string;
};

export default function SentenceBuilderBlock({
  question,
  instruction = "Build the Russian sentence",
  audioUrl = null,
  audioMaxPlays,
  audioListeningMode = false,
  audioAutoPlay = false,
  audioHideNativeControls = false,
  onAudioPlaybackCompleted,
  availableTokens,
  selectedTokens,
  explanation,
  hasSubmitted = false,
  isCorrect = false,
  isSubmitting = false,
  onAddToken,
  onRemoveToken,
  onReset,
  onSubmit,
  feedbackStatusLabel,
  feedbackCorrectAnswerText,
  feedbackAcceptedAnswerTexts = [],
  sourceLanguageLabel,
  targetLanguageLabel,
}: SentenceBuilderBlockProps) {
  const safeAvailableTokens = Array.isArray(availableTokens) ? availableTokens : [];
  const safeSelectedTokens = Array.isArray(selectedTokens) ? selectedTokens : [];

  const canSubmit = safeSelectedTokens.length > 0 && !hasSubmitted && !isSubmitting;
  const canReset = safeSelectedTokens.length > 0 && !hasSubmitted && !isSubmitting;

  return (
    <QuestionCard
      heading="Sentence builder"
      instruction={instruction}
      prompt={question}
      audioUrl={audioUrl}
      audioMaxPlays={audioMaxPlays}
      audioListeningMode={audioListeningMode}
      audioAutoPlay={audioAutoPlay}
      audioHideNativeControls={audioHideNativeControls}
      onAudioPlaybackCompleted={onAudioPlaybackCompleted}
      feedback={
        hasSubmitted ? (
          <QuestionFeedback
            isCorrect={isCorrect}
            explanation={explanation}
            statusLabel={feedbackStatusLabel}
            correctAnswerText={feedbackCorrectAnswerText}
            acceptedAnswerTexts={feedbackAcceptedAnswerTexts}
          />
        ) : null
      }
    >
      {(sourceLanguageLabel || targetLanguageLabel) && (
        <div className="flex flex-wrap gap-2">
          {sourceLanguageLabel ? (
            <span className="app-pill app-pill-muted">Source: {sourceLanguageLabel}</span>
          ) : null}

          {targetLanguageLabel ? (
            <span className="app-pill app-pill-muted">Target: {targetLanguageLabel}</span>
          ) : null}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium text-[var(--text-secondary)]">Your sentence</p>

        <div className="flex min-h-[60px] flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-3">
          {safeSelectedTokens.length > 0 ? (
            safeSelectedTokens.map((token, index) => (
              <button
                key={`${token}-${index}`}
                type="button"
                onClick={() => onRemoveToken(index)}
                disabled={hasSubmitted || isSubmitting}
                className="app-choice-chip app-choice-chip-selected px-3 py-1.5 text-sm disabled:cursor-default"
              >
                {token}
              </button>
            ))
          ) : (
            <span className="text-sm app-text-muted">
              Select words below to build your answer
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-[var(--text-secondary)]">
          Available words
        </p>

        <div className="flex flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] p-3">
          {safeAvailableTokens.length > 0 ? (
            safeAvailableTokens.map((token, index) => (
              <button
                key={`${token}-${index}`}
                type="button"
                onClick={() => onAddToken(index)}
                disabled={hasSubmitted || isSubmitting}
                className="app-choice-chip px-3 py-1.5 text-sm disabled:cursor-default"
              >
                {token}
              </button>
            ))
          ) : (
            <span className="text-sm app-text-muted">
              No word bank available for this question.
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="app-btn-base app-btn-primary rounded-lg px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {hasSubmitted ? "Submitted" : isSubmitting ? "Saving..." : "Check answer"}
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={!canReset}
          className="app-btn-base app-btn-secondary rounded-lg px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset
        </button>
      </div>
    </QuestionCard>
  );
}

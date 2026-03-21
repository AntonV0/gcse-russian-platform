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
  const canSubmit = selectedTokens.length > 0 && !hasSubmitted && !isSubmitting;
  const canReset = selectedTokens.length > 0 && !hasSubmitted && !isSubmitting;

  return (
    <QuestionCard
      heading="Sentence Builder"
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
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Your answer</p>

          <div className="flex min-h-16 flex-wrap gap-2">
            {selectedTokens.length > 0 ? (
              selectedTokens.map((token, index) => (
                <button
                  key={`${token}-${index}`}
                  type="button"
                  onClick={() => onRemoveToken(index)}
                  disabled={hasSubmitted || isSubmitting}
                  className="rounded-full border border-black bg-black px-3 py-1.5 text-sm text-white disabled:opacity-60"
                >
                  {token}
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Select the Russian words in the correct order.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Word bank</p>

          <div className="flex flex-wrap gap-2">
            {availableTokens.map((token, index) => (
              <button
                key={`${token}-${index}`}
                type="button"
                onClick={() => onAddToken(index)}
                disabled={hasSubmitted || isSubmitting}
                className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-60"
              >
                {token}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="rounded-lg bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {hasSubmitted ? "Submitted" : isSubmitting ? "Saving..." : "Check answer"}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={!canReset}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </div>
    </QuestionCard>
  );
}
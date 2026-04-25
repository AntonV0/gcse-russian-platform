"use client";

import QuestionCard from "@/components/questions/question-card";
import QuestionFeedback from "@/components/questions/question-feedback";
import Button from "@/components/ui/button";

export type SelectionGroup = {
  id: string;
  label?: string;
  options: string[];
};

type SelectionBasedDisplayMode = "grouped" | "inline_gaps";

type SelectionBasedBlockProps = {
  question: string;
  instruction?: string;
  audioUrl?: string | null;
  audioMaxPlays?: number;
  audioListeningMode?: boolean;
  audioAutoPlay?: boolean;
  audioHideNativeControls?: boolean;
  onAudioPlaybackCompleted?: () => void;
  groups: SelectionGroup[];
  selectedOptions: Record<string, string | undefined>;
  explanation?: string;
  hasSubmitted?: boolean;
  isCorrect?: boolean;
  isSubmitting?: boolean;
  onSelectOption: (groupId: string, option: string) => void;
  onReset: () => void;
  onSubmit: () => void;
  feedbackStatusLabel?: string;
  feedbackCorrectAnswerText?: string | null;
  feedbackAcceptedAnswerTexts?: string[];
  sourceLanguageLabel?: string;
  targetLanguageLabel?: string;
  displayMode?: SelectionBasedDisplayMode;
};

export default function SelectionBasedBlock({
  question,
  instruction,
  audioUrl = null,
  audioMaxPlays,
  audioListeningMode = false,
  audioAutoPlay = false,
  audioHideNativeControls = false,
  onAudioPlaybackCompleted,
  groups,
  selectedOptions,
  explanation,
  hasSubmitted = false,
  isCorrect = false,
  isSubmitting = false,
  onSelectOption,
  onReset,
  onSubmit,
  feedbackStatusLabel,
  feedbackCorrectAnswerText,
  feedbackAcceptedAnswerTexts = [],
  sourceLanguageLabel,
  targetLanguageLabel,
  displayMode = "grouped",
}: SelectionBasedBlockProps) {
  const canSubmit =
    !hasSubmitted &&
    !isSubmitting &&
    groups.every((group) => {
      const value = selectedOptions[group.id];
      return typeof value === "string" && value.length > 0;
    });

  const canReset =
    !isSubmitting &&
    Object.values(selectedOptions).some(
      (value) => typeof value === "string" && value.length > 0
    );

  return (
    <QuestionCard
      heading="Selection"
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

      {displayMode === "inline_gaps" ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
          <div className="flex flex-wrap items-center gap-4">
            {groups.map((group, index) => (
              <div key={group.id} className="space-y-2">
                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  {group.label ?? `Gap ${index + 1}`}
                </p>

                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const isSelected = selectedOptions[group.id] === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => onSelectOption(group.id, option)}
                        disabled={hasSubmitted || isSubmitting}
                        className={[
                          "app-choice-chip px-3 py-1.5 text-sm",
                          isSelected ? "app-choice-chip-selected" : "",
                          hasSubmitted || isSubmitting
                            ? "cursor-default"
                            : "cursor-pointer",
                        ].join(" ")}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group, index) => (
            <div
              key={group.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] p-4"
            >
              <p className="mb-3 text-sm font-medium text-[var(--text-secondary)]">
                {group.label ?? `Choose option ${index + 1}`}
              </p>

              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => {
                  const isSelected = selectedOptions[group.id] === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onSelectOption(group.id, option)}
                      disabled={hasSubmitted || isSubmitting}
                      className={[
                        "app-choice-chip px-3 py-1.5 text-sm",
                        isSelected ? "app-choice-chip-selected" : "",
                        hasSubmitted || isSubmitting
                          ? "cursor-default"
                          : "cursor-pointer",
                      ].join(" ")}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          variant="primary"
          size="sm"
          icon={isSubmitting ? "pending" : "confirm"}
        >
          {hasSubmitted ? "Submitted" : isSubmitting ? "Saving..." : "Check answer"}
        </Button>

        <Button
          type="button"
          onClick={onReset}
          disabled={!canReset}
          variant="secondary"
          size="sm"
          icon="refresh"
        >
          Reset
        </Button>
      </div>
    </QuestionCard>
  );
}

"use client";

import QuestionCard from "@/components/questions/question-card";
import QuestionFeedback from "@/components/questions/question-feedback";

export type SelectionGroup = {
  id: string;
  label?: string;
  options: string[];
};

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
  selectedOptions: Record<string, string>;
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
  displayMode?: "grouped" | "inline_gaps";
};

export default function SelectionBasedBlock({
  question,
  instruction = "Select the correct Russian forms",
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
  const completedGroupCount = groups.filter(
    (group) => typeof selectedOptions[group.id] === "string"
  ).length;

  const canSubmit =
    completedGroupCount === groups.length &&
    groups.length > 0 &&
    !hasSubmitted &&
    !isSubmitting;

  const canReset = completedGroupCount > 0 && !hasSubmitted && !isSubmitting;

  return (
    <QuestionCard
      heading="Selection Task"
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

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-sm font-medium text-gray-700">Your answer</p>
        <div className="flex min-h-12 flex-wrap gap-2">
          {groups.length > 0 ? (
            groups.map((group) => (
              <span
                key={group.id}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  selectedOptions[group.id]
                    ? "bg-black text-white"
                    : "bg-white text-gray-500 ring-1 ring-gray-300"
                }`}
              >
                {selectedOptions[group.id] ?? "…"}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">No selection groups configured.</p>
          )}
        </div>
      </div>

      {displayMode === "inline_gaps" ? (
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="mb-3 text-sm font-medium text-gray-700">Choose each gap</p>
          <div className="flex flex-wrap gap-4">
            {groups.map((group, index) => (
              <div key={group.id} className="space-y-2">
                <p className="text-xs font-medium text-gray-600">
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
                        className={`rounded-full border px-3 py-1.5 text-sm transition ${
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white hover:bg-gray-50"
                        } disabled:opacity-60`}
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
            <div key={group.id} className="rounded-lg border border-gray-200 p-4">
              <p className="mb-3 text-sm font-medium text-gray-700">
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
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        isSelected
                          ? "border-black bg-black text-white"
                          : "border-gray-300 bg-white hover:bg-gray-50"
                      } disabled:opacity-60`}
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
    </QuestionCard>
  );
}
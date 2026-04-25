"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import {
  submitQuestionAttemptAction,
  type SubmitQuestionAttemptActionResult,
} from "@/app/actions/questions/question-actions";
import QuestionCard from "@/components/questions/question-card";
import QuestionFeedback from "@/components/questions/question-feedback";
import Button from "@/components/ui/button";
import type {
  RuntimeCategorisationQuestion,
  RuntimeMatchingQuestion,
  RuntimeMultipleResponseQuestion,
  RuntimeOrderingQuestion,
  RuntimeStructuredQuestion,
  RuntimeWordBankGapFillQuestion,
} from "@/lib/questions/question-engine";

type TrackedDigitalInteractionBlockProps = {
  question: RuntimeStructuredQuestion;
  lessonId?: string | null;
  audioUrl?: string | null;
  audioMaxPlays?: number;
  audioListeningMode?: boolean;
  audioAutoPlay?: boolean;
  audioHideNativeControls?: boolean;
};

function ToggleChip({
  selected,
  disabled,
  children,
  onClick,
}: {
  selected: boolean;
  disabled: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "app-choice-chip px-3 py-1.5 text-sm",
        selected ? "app-choice-chip-selected" : "",
        disabled ? "cursor-default" : "cursor-pointer",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function getHeading(question: RuntimeStructuredQuestion) {
  switch (question.type) {
    case "multiple_response":
      return "Multi-select";
    case "matching":
      return "Matching";
    case "ordering":
      return "Ordering";
    case "word_bank_gap_fill":
      return "Word bank";
    case "categorisation":
      return "Categorisation";
    default:
      return "Question";
  }
}

export default function TrackedDigitalInteractionBlock({
  question,
  lessonId = null,
  audioUrl = null,
  audioMaxPlays,
  audioListeningMode = false,
  audioAutoPlay = false,
  audioHideNativeControls = false,
}: TrackedDigitalInteractionBlockProps) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [gapAnswers, setGapAnswers] = useState<Record<string, string>>({});
  const [categoryAnswers, setCategoryAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SubmitQuestionAttemptActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const submitted = result?.success === true;
  const feedback = result?.success === true ? result.feedback : null;

  const selectedOrderSet = useMemo(() => new Set(selectedOrder), [selectedOrder]);

  function submitPayload(payload: Record<string, unknown>) {
    if (submitted || isPending) return;

    startTransition(async () => {
      const actionResult = await submitQuestionAttemptAction({
        questionId: question.id,
        lessonId,
        submittedPayload: payload,
      });

      setResult(actionResult);
    });
  }

  function toggleSelectedOption(optionId: string) {
    if (submitted || isPending) return;

    setSelectedOptionIds((current) =>
      current.includes(optionId)
        ? current.filter((item) => item !== optionId)
        : [...current, optionId]
    );
  }

  function renderMultipleResponse(currentQuestion: RuntimeMultipleResponseQuestion) {
    const canSubmit = selectedOptionIds.length > 0 && !submitted && !isPending;

    return (
      <>
        <div className="flex flex-wrap gap-2">
          {currentQuestion.options.map((option) => (
            <ToggleChip
              key={option.id}
              selected={selectedOptionIds.includes(option.id)}
              disabled={submitted || isPending}
              onClick={() => toggleSelectedOption(option.id)}
            >
              {option.text}
            </ToggleChip>
          ))}
        </div>

        <Button
          type="button"
          onClick={() => submitPayload({ selectedOptionIds })}
          disabled={!canSubmit}
          variant="primary"
          size="sm"
          icon={isPending ? "pending" : "confirm"}
        >
          {submitted ? "Submitted" : isPending ? "Saving..." : "Check answer"}
        </Button>
      </>
    );
  }

  function renderMatching(currentQuestion: RuntimeMatchingQuestion) {
    const canSubmit =
      currentQuestion.prompts.length > 0 &&
      currentQuestion.prompts.every((prompt) => Boolean(matches[prompt.id])) &&
      !submitted &&
      !isPending;

    return (
      <>
        <div className="grid gap-3">
          {currentQuestion.prompts.map((prompt) => (
            <label key={prompt.id} className="grid gap-2 text-sm">
              <span className="font-medium text-[var(--text-secondary)]">
                {prompt.text}
              </span>
              <select
                value={matches[prompt.id] ?? ""}
                onChange={(event) =>
                  setMatches((current) => ({
                    ...current,
                    [prompt.id]: event.target.value,
                  }))
                }
                disabled={submitted || isPending}
                className="app-form-control app-form-select"
              >
                <option value="">Choose match</option>
                {currentQuestion.options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.text}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <Button
          type="button"
          onClick={() => submitPayload({ matches })}
          disabled={!canSubmit}
          variant="primary"
          size="sm"
          icon={isPending ? "pending" : "confirm"}
        >
          {submitted ? "Submitted" : isPending ? "Saving..." : "Check answer"}
        </Button>
      </>
    );
  }

  function renderOrdering(currentQuestion: RuntimeOrderingQuestion) {
    const availableItems = currentQuestion.items.filter(
      (item) => !selectedOrderSet.has(item.id)
    );
    const canSubmit = selectedOrder.length > 0 && !submitted && !isPending;

    return (
      <>
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--text-secondary)]">Your order</p>
          <div className="flex min-h-[56px] flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-3">
            {selectedOrder.length > 0 ? (
              selectedOrder.map((itemId) => {
                const item = currentQuestion.items.find((entry) => entry.id === itemId);

                if (!item) return null;

                return (
                  <ToggleChip
                    key={item.id}
                    selected
                    disabled={submitted || isPending}
                    onClick={() =>
                      setSelectedOrder((current) =>
                        current.filter((entry) => entry !== item.id)
                      )
                    }
                  >
                    {item.text}
                  </ToggleChip>
                );
              })
            ) : (
              <span className="text-sm app-text-muted">Select items below.</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Available items
          </p>
          <div className="flex flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] p-3">
            {availableItems.map((item) => (
              <ToggleChip
                key={item.id}
                selected={false}
                disabled={submitted || isPending}
                onClick={() => setSelectedOrder((current) => [...current, item.id])}
              >
                {item.text}
              </ToggleChip>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => submitPayload({ order: selectedOrder })}
            disabled={!canSubmit}
            variant="primary"
            size="sm"
            icon={isPending ? "pending" : "confirm"}
          >
            {submitted ? "Submitted" : isPending ? "Saving..." : "Check answer"}
          </Button>
          <Button
            type="button"
            onClick={() => setSelectedOrder([])}
            disabled={submitted || isPending || selectedOrder.length === 0}
            variant="secondary"
            size="sm"
            icon="refresh"
          >
            Reset
          </Button>
        </div>
      </>
    );
  }

  function renderWordBankGapFill(currentQuestion: RuntimeWordBankGapFillQuestion) {
    const canSubmit =
      currentQuestion.gaps.length > 0 &&
      currentQuestion.gaps.every((gap) => Boolean(gapAnswers[gap.id])) &&
      !submitted &&
      !isPending;

    return (
      <>
        {currentQuestion.text ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3 text-sm leading-6 text-[var(--text-secondary)]">
            {currentQuestion.text}
          </div>
        ) : null}

        <div className="grid gap-3">
          {currentQuestion.gaps.map((gap) => (
            <label key={gap.id} className="grid gap-2 text-sm">
              <span className="font-medium text-[var(--text-secondary)]">
                {gap.label}
              </span>
              <select
                value={gapAnswers[gap.id] ?? ""}
                onChange={(event) =>
                  setGapAnswers((current) => ({
                    ...current,
                    [gap.id]: event.target.value,
                  }))
                }
                disabled={submitted || isPending}
                className="app-form-control app-form-select"
              >
                <option value="">Choose answer</option>
                {currentQuestion.wordBank.map((word) => (
                  <option key={`${gap.id}-${word}`} value={word}>
                    {word}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <Button
          type="button"
          onClick={() => submitPayload({ gaps: gapAnswers })}
          disabled={!canSubmit}
          variant="primary"
          size="sm"
          icon={isPending ? "pending" : "confirm"}
        >
          {submitted ? "Submitted" : isPending ? "Saving..." : "Check answer"}
        </Button>
      </>
    );
  }

  function renderCategorisation(currentQuestion: RuntimeCategorisationQuestion) {
    const canSubmit =
      currentQuestion.items.length > 0 &&
      currentQuestion.items.every((item) => Boolean(categoryAnswers[item.id])) &&
      !submitted &&
      !isPending;

    return (
      <>
        <div className="grid gap-3">
          {currentQuestion.items.map((item) => (
            <label key={item.id} className="grid gap-2 text-sm">
              <span className="font-medium text-[var(--text-secondary)]">
                {item.text}
              </span>
              <select
                value={categoryAnswers[item.id] ?? ""}
                onChange={(event) =>
                  setCategoryAnswers((current) => ({
                    ...current,
                    [item.id]: event.target.value,
                  }))
                }
                disabled={submitted || isPending}
                className="app-form-control app-form-select"
              >
                <option value="">Choose category</option>
                {currentQuestion.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <Button
          type="button"
          onClick={() => submitPayload({ categories: categoryAnswers })}
          disabled={!canSubmit}
          variant="primary"
          size="sm"
          icon={isPending ? "pending" : "confirm"}
        >
          {submitted ? "Submitted" : isPending ? "Saving..." : "Check answer"}
        </Button>
      </>
    );
  }

  return (
    <QuestionCard
      heading={getHeading(question)}
      prompt={question.prompt}
      audioUrl={audioUrl}
      audioMaxPlays={audioMaxPlays}
      audioListeningMode={audioListeningMode}
      audioAutoPlay={audioAutoPlay}
      audioHideNativeControls={audioHideNativeControls}
      feedback={
        submitted && feedback ? (
          <QuestionFeedback
            isCorrect={feedback.isCorrect}
            explanation={feedback.feedback ?? undefined}
            statusLabel={feedback.statusLabel}
            correctAnswerText={feedback.correctAnswerText}
            acceptedAnswerTexts={feedback.acceptedAnswerTexts}
          />
        ) : null
      }
    >
      <div className="space-y-4">
        {question.type === "multiple_response" ? renderMultipleResponse(question) : null}
        {question.type === "matching" ? renderMatching(question) : null}
        {question.type === "ordering" ? renderOrdering(question) : null}
        {question.type === "word_bank_gap_fill"
          ? renderWordBankGapFill(question)
          : null}
        {question.type === "categorisation" ? renderCategorisation(question) : null}
      </div>
    </QuestionCard>
  );
}

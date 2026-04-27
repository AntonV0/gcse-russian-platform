"use client";

import type { RuntimeWordBankGapFillQuestion } from "@/lib/questions/question-engine";
import { type InteractionControlProps, SubmitAnswerButton } from "./interaction-shared";

export function WordBankGapFillInteraction({
  question,
  gapAnswers,
  onChangeGapAnswer,
  submitted,
  isPending,
  onSubmitPayload,
}: InteractionControlProps & {
  question: RuntimeWordBankGapFillQuestion;
  gapAnswers: Record<string, string>;
  onChangeGapAnswer: (gapId: string, answer: string) => void;
}) {
  const canSubmit =
    question.gaps.length > 0 &&
    question.gaps.every((gap) => Boolean(gapAnswers[gap.id])) &&
    !submitted &&
    !isPending;

  return (
    <>
      {question.text ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3 text-sm leading-6 text-[var(--text-secondary)]">
          {question.text}
        </div>
      ) : null}

      <div className="grid gap-3">
        {question.gaps.map((gap) => (
          <label key={gap.id} className="grid gap-2 text-sm">
            <span className="font-medium text-[var(--text-secondary)]">{gap.label}</span>
            <select
              value={gapAnswers[gap.id] ?? ""}
              onChange={(event) => onChangeGapAnswer(gap.id, event.target.value)}
              disabled={submitted || isPending}
              className="app-form-control app-form-select"
            >
              <option value="">Choose answer</option>
              {question.wordBank.map((word) => (
                <option key={`${gap.id}-${word}`} value={word}>
                  {word}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="app-mobile-action-stack flex">
        <SubmitAnswerButton
          canSubmit={canSubmit}
          submitted={submitted}
          isPending={isPending}
          onClick={() => onSubmitPayload({ gaps: gapAnswers })}
        />
      </div>
    </>
  );
}

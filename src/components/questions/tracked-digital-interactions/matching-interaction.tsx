"use client";

import type { RuntimeMatchingQuestion } from "@/lib/questions/question-engine";
import { type InteractionControlProps, SubmitAnswerButton } from "./interaction-shared";

export function MatchingInteraction({
  question,
  matches,
  onChangeMatch,
  submitted,
  isPending,
  onSubmitPayload,
}: InteractionControlProps & {
  question: RuntimeMatchingQuestion;
  matches: Record<string, string>;
  onChangeMatch: (promptId: string, optionId: string) => void;
}) {
  const canSubmit =
    question.prompts.length > 0 &&
    question.prompts.every((prompt) => Boolean(matches[prompt.id])) &&
    !submitted &&
    !isPending;

  return (
    <>
      <div className="grid gap-3">
        {question.prompts.map((prompt) => (
          <label key={prompt.id} className="grid gap-2 text-sm">
            <span className="font-medium text-[var(--text-secondary)]">
              {prompt.text}
            </span>
            <select
              value={matches[prompt.id] ?? ""}
              onChange={(event) => onChangeMatch(prompt.id, event.target.value)}
              disabled={submitted || isPending}
              className="app-form-control app-form-select"
            >
              <option value="">Choose match</option>
              {question.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.text}
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
          onClick={() => onSubmitPayload({ matches })}
        />
      </div>
    </>
  );
}

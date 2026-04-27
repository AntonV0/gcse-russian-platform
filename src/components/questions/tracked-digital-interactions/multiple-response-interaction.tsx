"use client";

import type { RuntimeMultipleResponseQuestion } from "@/lib/questions/question-engine";
import {
  type InteractionControlProps,
  SubmitAnswerButton,
  ToggleChip,
} from "./interaction-shared";

export function MultipleResponseInteraction({
  question,
  selectedOptionIds,
  onToggleOption,
  submitted,
  isPending,
  onSubmitPayload,
}: InteractionControlProps & {
  question: RuntimeMultipleResponseQuestion;
  selectedOptionIds: string[];
  onToggleOption: (optionId: string) => void;
}) {
  const canSubmit = selectedOptionIds.length > 0 && !submitted && !isPending;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {question.options.map((option) => (
          <ToggleChip
            key={option.id}
            selected={selectedOptionIds.includes(option.id)}
            disabled={submitted || isPending}
            onClick={() => onToggleOption(option.id)}
          >
            {option.text}
          </ToggleChip>
        ))}
      </div>

      <div className="app-mobile-action-stack flex">
        <SubmitAnswerButton
          canSubmit={canSubmit}
          submitted={submitted}
          isPending={isPending}
          onClick={() => onSubmitPayload({ selectedOptionIds })}
        />
      </div>
    </>
  );
}

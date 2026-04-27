"use client";

import type { RuntimeCategorisationQuestion } from "@/lib/questions/question-engine";
import { type InteractionControlProps, SubmitAnswerButton } from "./interaction-shared";

export function CategorisationInteraction({
  question,
  categoryAnswers,
  onChangeCategoryAnswer,
  submitted,
  isPending,
  onSubmitPayload,
}: InteractionControlProps & {
  question: RuntimeCategorisationQuestion;
  categoryAnswers: Record<string, string>;
  onChangeCategoryAnswer: (itemId: string, categoryId: string) => void;
}) {
  const canSubmit =
    question.items.length > 0 &&
    question.items.every((item) => Boolean(categoryAnswers[item.id])) &&
    !submitted &&
    !isPending;

  return (
    <>
      <div className="grid gap-3">
        {question.items.map((item) => (
          <label key={item.id} className="grid gap-2 text-sm">
            <span className="font-medium text-[var(--text-secondary)]">{item.text}</span>
            <select
              value={categoryAnswers[item.id] ?? ""}
              onChange={(event) => onChangeCategoryAnswer(item.id, event.target.value)}
              disabled={submitted || isPending}
              className="app-form-control app-form-select"
            >
              <option value="">Choose category</option>
              {question.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
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
          onClick={() => onSubmitPayload({ categories: categoryAnswers })}
        />
      </div>
    </>
  );
}

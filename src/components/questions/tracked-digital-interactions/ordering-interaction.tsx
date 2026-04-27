"use client";

import Button from "@/components/ui/button";
import type { RuntimeOrderingQuestion } from "@/lib/questions/question-engine";
import {
  type InteractionControlProps,
  SubmitAnswerButton,
  ToggleChip,
} from "./interaction-shared";

export function OrderingInteraction({
  question,
  selectedOrder,
  onAddItem,
  onRemoveItem,
  onReset,
  submitted,
  isPending,
  onSubmitPayload,
}: InteractionControlProps & {
  question: RuntimeOrderingQuestion;
  selectedOrder: string[];
  onAddItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onReset: () => void;
}) {
  const selectedOrderSet = new Set(selectedOrder);
  const availableItems = question.items.filter((item) => !selectedOrderSet.has(item.id));
  const canSubmit = selectedOrder.length > 0 && !submitted && !isPending;

  return (
    <>
      <div className="space-y-2">
        <p className="text-sm font-medium text-[var(--text-secondary)]">Your order</p>
        <div className="flex min-h-[56px] flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-3">
          {selectedOrder.length > 0 ? (
            selectedOrder.map((itemId) => {
              const item = question.items.find((entry) => entry.id === itemId);

              if (!item) return null;

              return (
                <ToggleChip
                  key={item.id}
                  selected
                  disabled={submitted || isPending}
                  onClick={() => onRemoveItem(item.id)}
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
              onClick={() => onAddItem(item.id)}
            >
              {item.text}
            </ToggleChip>
          ))}
        </div>
      </div>

      <div className="app-mobile-action-stack flex flex-wrap gap-2">
        <SubmitAnswerButton
          canSubmit={canSubmit}
          submitted={submitted}
          isPending={isPending}
          onClick={() => onSubmitPayload({ order: selectedOrder })}
        />
        <Button
          type="button"
          onClick={onReset}
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

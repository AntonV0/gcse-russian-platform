"use client";

import { type ReactNode } from "react";
import Button from "@/components/ui/button";

export type InteractionControlProps = {
  submitted: boolean;
  isPending: boolean;
  onSubmitPayload: (payload: Record<string, unknown>) => void;
};

export function ToggleChip({
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
        "app-choice-chip px-3 py-2 text-sm",
        selected ? "app-choice-chip-selected" : "",
        disabled ? "cursor-default" : "cursor-pointer",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function SubmitAnswerButton({
  canSubmit,
  submitted,
  isPending,
  onClick,
}: {
  canSubmit: boolean;
  submitted: boolean;
  isPending: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={!canSubmit}
      variant="primary"
      size="sm"
      icon={isPending ? "pending" : "confirm"}
    >
      {submitted ? "Submitted" : isPending ? "Saving..." : "Check answer"}
    </Button>
  );
}

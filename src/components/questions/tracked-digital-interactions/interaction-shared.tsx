"use client";

import { type ReactNode } from "react";
import QuestionChoiceButton from "@/components/questions/question-choice-button";
import { AutoLangText } from "@/components/typography/russian-text";
import Button from "@/components/ui/button";
export { AutoLangText } from "@/components/typography/russian-text";
export { getTextLanguage } from "@/lib/typography/text-language";

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
    <QuestionChoiceButton
      onClick={onClick}
      disabled={disabled}
      selected={selected}
    >
      {typeof children === "string" ? <AutoLangText>{children}</AutoLangText> : children}
    </QuestionChoiceButton>
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
      icon="confirm"
      loading={isPending}
      loadingLabel="Saving..."
    >
      {submitted ? "Submitted" : "Check answer"}
    </Button>
  );
}

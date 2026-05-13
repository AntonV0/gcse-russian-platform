import type { QuestionOptionState } from "@/components/questions/question-option-state";

type QuestionChoiceButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "type"
> & {
  selected?: boolean;
  state?: QuestionOptionState;
  display?: "chip" | "option";
  className?: string;
};

export default function QuestionChoiceButton({
  selected = false,
  state,
  display = "chip",
  className,
  disabled,
  children,
  ...buttonProps
}: QuestionChoiceButtonProps) {
  const resolvedState = state ?? (selected ? "selected" : "idle");
  const selectedClass =
    display === "option" ? "app-answer-option-selected" : "app-choice-chip-selected";
  const stateClass =
    display === "option"
      ? {
          idle: "",
          selected: selectedClass,
          correct: "app-answer-option-correct",
          incorrect: "app-answer-option-incorrect",
          missed: "app-answer-option-missed",
        }[resolvedState]
      : {
          idle: "",
          selected: selectedClass,
          correct: "app-choice-chip-correct",
          incorrect: "app-choice-chip-incorrect",
          missed: "app-choice-chip-missed",
        }[resolvedState];
  const baseClass =
    display === "option"
      ? "app-answer-option min-h-12 w-full rounded-xl border px-4 py-3 text-left"
      : "app-choice-chip px-3 py-2 text-sm";

  return (
    <button
      {...buttonProps}
      type="button"
      disabled={disabled}
      className={[
        baseClass,
        stateClass,
        disabled ? "cursor-default" : "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

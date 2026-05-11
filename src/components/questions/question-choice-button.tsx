type QuestionChoiceButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "type"
> & {
  selected?: boolean;
  display?: "chip" | "option";
  className?: string;
};

export default function QuestionChoiceButton({
  selected = false,
  display = "chip",
  className,
  disabled,
  children,
  ...buttonProps
}: QuestionChoiceButtonProps) {
  const selectedClass =
    display === "option" ? "app-answer-option-selected" : "app-choice-chip-selected";
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
        selected ? selectedClass : "",
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

import type { AnswerStrategy } from "@/components/questions/tracked-short-answer-types";

export function UnsupportedAnswerStrategyMessage({
  answerStrategy,
}: {
  answerStrategy: AnswerStrategy;
}) {
  return (
    <div className="rounded-lg border border-[color-mix(in_srgb,var(--warning)_24%,transparent)] bg-[var(--warning-soft)] p-4 text-sm text-[var(--warning)]">
      This question requires a different interaction type (
      {answerStrategy.replace("_", " ")}). This will be supported soon.
    </div>
  );
}

"use client";

import DevComponentMarker from "@/components/ui/dev-component-marker";

type QuestionFeedbackProps = {
  isCorrect: boolean;
  explanation?: string;
  statusLabel?: string;
  correctAnswerText?: string | null;
  acceptedAnswerTexts?: string[];
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function QuestionFeedback({
  isCorrect,
  explanation,
  statusLabel,
  correctAnswerText,
  acceptedAnswerTexts = [],
}: QuestionFeedbackProps) {
  const visibleAcceptedAnswers = isCorrect
    ? []
    : acceptedAnswerTexts.filter((answer) => answer !== correctAnswerText);

  const wrapperClass = isCorrect
    ? [
        "border-[rgba(31,138,76,0.24)]",
        "bg-[linear-gradient(135deg,rgba(31,138,76,0.12)_0%,rgba(31,138,76,0.04)_100%)]",
        "text-[var(--success)]",
        "shadow-[0_10px_24px_rgba(31,138,76,0.06)]",
      ].join(" ")
    : [
        "border-[rgba(194,59,59,0.24)]",
        "bg-[linear-gradient(135deg,rgba(194,59,59,0.12)_0%,rgba(194,59,59,0.04)_100%)]",
        "text-[var(--danger)]",
        "shadow-[0_10px_24px_rgba(194,59,59,0.06)]",
      ].join(" ");

  return (
    <div className="dev-marker-host relative">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="QuestionFeedback"
          filePath="src/components/questions/question-feedback.tsx"
        />
      ) : null}

      <div
        className={[
          "relative overflow-hidden rounded-[1.4rem] border p-4",
          wrapperClass,
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)]" />

        <div className="relative">
          <p className="font-semibold tracking-[-0.01em]">
            {statusLabel ?? (isCorrect ? "Correct." : "Not quite.")}
          </p>

          {!isCorrect && correctAnswerText ? (
            <p className="mt-3 text-sm leading-6">
              <span className="font-medium">Correct answer:</span> {correctAnswerText}
            </p>
          ) : null}

          {!isCorrect && visibleAcceptedAnswers.length > 0 ? (
            <div className="mt-3 text-sm leading-6">
              <p className="font-medium">Accepted answers:</p>
              <ul className="mt-1 list-disc pl-5">
                {visibleAcceptedAnswers.map((answer) => (
                  <li key={answer}>{answer}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {explanation ? <p className="mt-3 text-sm leading-6">{explanation}</p> : null}
        </div>
      </div>
    </div>
  );
}

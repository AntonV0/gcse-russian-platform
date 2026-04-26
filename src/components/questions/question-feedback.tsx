import AppIcon from "@/components/ui/app-icon";
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
    ? "app-question-feedback-success"
    : "app-question-feedback-danger";

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
          "app-question-feedback p-4",
          wrapperClass,
        ].join(" ")}
      >
        <div className="relative">
          <div className="flex items-center gap-2 text-base font-semibold leading-6">
            <AppIcon icon={isCorrect ? "success" : "error"} size={17} />
            <p>{statusLabel ?? (isCorrect ? "Correct." : "Not quite.")}</p>
          </div>

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

type QuestionFeedbackProps = {
  isCorrect: boolean;
  explanation?: string;
  statusLabel?: string;
  correctAnswerText?: string | null;
  acceptedAnswerTexts?: string[];
};

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
    ? "border-green-200 bg-green-50 text-green-900"
    : "border-red-200 bg-red-50 text-red-900";

  return (
    <div className={`rounded-xl border p-4 ${wrapperClass}`}>
      <p className="font-semibold">
        {statusLabel ?? (isCorrect ? "Correct." : "Not quite.")}
      </p>

      {!isCorrect && correctAnswerText ? (
        <p className="mt-3 text-sm">
          <span className="font-medium">Correct answer:</span> {correctAnswerText}
        </p>
      ) : null}

      {!isCorrect && visibleAcceptedAnswers.length > 0 ? (
        <div className="mt-3 text-sm">
          <p className="font-medium">Accepted answers:</p>
          <ul className="mt-1 list-disc pl-5">
            {visibleAcceptedAnswers.map((answer) => (
              <li key={answer}>{answer}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {explanation ? <p className="mt-3 text-sm">{explanation}</p> : null}
    </div>
  );
}

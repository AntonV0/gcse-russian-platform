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

  return (
    <div
      className={`rounded-lg p-4 ${
        isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
      }`}
    >
      <p className="font-medium">
        {statusLabel ?? (isCorrect ? "Correct." : "Not quite.")}
      </p>

      {!isCorrect && correctAnswerText ? (
        <p className="mt-2 text-sm">
          <span className="font-medium">Correct answer:</span> {correctAnswerText}
        </p>
      ) : null}

      {!isCorrect && visibleAcceptedAnswers.length > 0 ? (
        <div className="mt-2 text-sm">
          <p className="font-medium">Accepted answers:</p>
          <ul className="mt-1 list-disc pl-5">
            {visibleAcceptedAnswers.map((answer) => (
              <li key={answer}>{answer}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {explanation ? <p className="mt-2 text-sm">{explanation}</p> : null}
    </div>
  );
}

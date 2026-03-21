type QuestionFeedbackProps = {
  isCorrect: boolean;
  explanation?: string;
};

export default function QuestionFeedback({
  isCorrect,
  explanation,
}: QuestionFeedbackProps) {
  return (
    <div
      className={`rounded-lg p-4 ${
        isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
      }`}
    >
      <p className="font-medium">{isCorrect ? "Correct." : "Not quite."}</p>

      {explanation ? <p className="mt-2 text-sm">{explanation}</p> : null}
    </div>
  );
}
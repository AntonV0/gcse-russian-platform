"use client";

import { useMemo, useState, useTransition } from "react";
import { submitQuestionAttemptAction } from "@/app/actions/question-actions";

type TrackedShortAnswerBlockProps = {
  questionId: string;
  lessonId?: string | null;
  question: string;
  acceptedAnswers: string[];
  explanation?: string;
  placeholder?: string;
};

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase();
}

export default function TrackedShortAnswerBlock({
  questionId,
  lessonId = null,
  question,
  acceptedAnswers,
  explanation,
  placeholder = "Type your answer",
}: TrackedShortAnswerBlockProps) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const normalizedAcceptedAnswers = useMemo(
    () => acceptedAnswers.map(normalizeAnswer),
    [acceptedAnswers]
  );

  const isCorrect = normalizedAcceptedAnswers.includes(normalizeAnswer(value));

  async function handleSubmit() {
    if (!value.trim() || submitted) return;

    setSubmitted(true);

    startTransition(async () => {
      await submitQuestionAttemptAction({
        questionId,
        lessonId,
        submittedText: value,
        submittedPayload: { answer: value },
        isCorrect,
        awardedMarks: isCorrect ? 1 : 0,
        feedback: explanation ?? null,
      });
    });
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="font-medium">{question}</p>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={submitted || isPending}
        placeholder={placeholder}
        className="w-full rounded border px-3 py-2"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!value.trim() || submitted || isPending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {submitted ? "Submitted" : isPending ? "Saving..." : "Check answer"}
      </button>

      {submitted ? (
        <div className="text-sm">
          {isCorrect ? (
            <p className="font-medium text-green-600">✓ Correct</p>
          ) : (
            <p className="font-medium text-red-600">✗ Incorrect</p>
          )}

          {explanation ? <p className="mt-2 text-gray-700">{explanation}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
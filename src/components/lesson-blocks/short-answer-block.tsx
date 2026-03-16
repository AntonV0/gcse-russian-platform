"use client";

import { useMemo, useState } from "react";

type ShortAnswerBlockProps = {
  question: string;
  acceptedAnswers: string[];
  explanation?: string;
  placeholder?: string;
};

export default function ShortAnswerBlock({
  question,
  acceptedAnswers,
  explanation,
  placeholder = "Type your answer",
}: ShortAnswerBlockProps) {
  const [answer, setAnswer] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const normalizedAcceptedAnswers = useMemo(
    () => acceptedAnswers.map((item) => item.trim().toLowerCase()),
    [acceptedAnswers]
  );

  const normalizedAnswer = answer.trim().toLowerCase();
  const isCorrect = normalizedAcceptedAnswers.includes(normalizedAnswer);

  function handleSubmit() {
    if (!answer.trim()) return;
    setHasSubmitted(true);
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Question</h2>
      <p className="mb-4 text-gray-800">{question}</p>

      <div className="space-y-4">
        <input
          type="text"
          value={answer}
          onChange={(event) => {
            if (hasSubmitted) return;
            setAnswer(event.target.value);
          }}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!answer.trim() || hasSubmitted}
          className="rounded-lg bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check answer
        </button>
      </div>

      {hasSubmitted ? (
        <div
          className={`mt-4 rounded-lg p-4 ${
            isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          <p className="font-medium">
            {isCorrect ? "Correct." : "Not quite."}
          </p>

          {explanation ? <p className="mt-2 text-sm">{explanation}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
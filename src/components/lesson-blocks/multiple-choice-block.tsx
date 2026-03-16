"use client";

import { useState } from "react";

type MultipleChoiceOption = {
  id: string;
  text: string;
};

type MultipleChoiceBlockProps = {
  question: string;
  options: MultipleChoiceOption[];
  correctOptionId: string;
  explanation?: string;
};

export default function MultipleChoiceBlock({
  question,
  options,
  correctOptionId,
  explanation,
}: MultipleChoiceBlockProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isCorrect = selectedOptionId === correctOptionId;

  function handleSubmit() {
    if (!selectedOptionId) return;
    setHasSubmitted(true);
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Question</h2>
      <p className="mb-4 text-gray-800">{question}</p>

      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                if (hasSubmitted) return;
                setSelectedOptionId(option.id);
              }}
              className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                isSelected
                  ? "border-black bg-gray-100"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              } ${hasSubmitted ? "cursor-default" : "cursor-pointer"}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedOptionId || hasSubmitted}
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

          {explanation ? (
            <p className="mt-2 text-sm">{explanation}</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
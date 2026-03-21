"use client";

import { useState, useTransition } from "react";
import {
  type RuntimeMultipleChoiceQuestion,
  validateMultipleChoiceAnswer,
} from "@/lib/question-engine";
import { submitQuestionAttemptAction } from "@/app/actions/question-actions";

type TrackedMultipleChoiceBlockProps = {
  questionId: string;
  lessonId?: string | null;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation?: string;
};

export default function TrackedMultipleChoiceBlock({
  questionId,
  lessonId = null,
  question,
  options,
  correctOptionId,
  explanation,
}: TrackedMultipleChoiceBlockProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const runtimeQuestion: RuntimeMultipleChoiceQuestion = {
    id: questionId,
    questionSetId: "",
    type: "multiple_choice",
    prompt: question,
    promptRich: null,
    explanation: explanation ?? null,
    difficulty: null,
    marks: 1,
    audioPath: null,
    imagePath: null,
    metadata: {},
    position: 0,
    isActive: true,
    createdAt: "",
    updatedAt: "",
    options: options.map((option, index) => ({
      id: option.id,
      text: option.text,
      isCorrect: option.id === correctOptionId,
      position: index,
    })),
    correctOptionId: correctOptionId || null,
  };

  const result = validateMultipleChoiceAnswer({
    question: runtimeQuestion,
    selectedOptionId,
  });

  async function handleSubmit() {
    if (!selectedOptionId || submitted) return;

    setSubmitted(true);

    startTransition(async () => {
      await submitQuestionAttemptAction({
        questionId,
        lessonId,
        submittedText: null,
        submittedPayload: { selectedOptionId },
        isCorrect: result.isCorrect,
        awardedMarks: result.isCorrect ? runtimeQuestion.marks : 0,
        feedback: result.feedback,
      });
    });
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="font-medium">{question}</p>

      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-center gap-2 rounded border p-2"
          >
            <input
              type="radio"
              name={questionId}
              value={option.id}
              checked={selectedOptionId === option.id}
              onChange={() => setSelectedOptionId(option.id)}
              disabled={submitted || isPending}
            />
            <span>{option.text}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selectedOptionId || submitted || isPending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {submitted ? "Submitted" : isPending ? "Saving..." : "Check answer"}
      </button>

      {submitted ? (
        <div className="text-sm">
          {result.isCorrect ? (
            <p className="font-medium text-green-600">✓ Correct</p>
          ) : (
            <p className="font-medium text-red-600">✗ Incorrect</p>
          )}

          {explanation ? (
            <p className="mt-2 text-gray-700">{explanation}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
"use client";

import { useState, useTransition } from "react";
import MultipleChoiceBlock from "@/components/questions/multiple-choice-block";
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
        submittedPayload: {
          selectedOptionId,
          selectedOptionText: result.selectedOptionText,
          correctOptionId: result.correctOptionId,
          correctAnswerText: result.correctAnswerText,
          acceptedAnswerTexts: result.acceptedAnswerTexts,
          statusLabel: result.statusLabel,
          questionType: "multiple_choice",
        },
        isCorrect: result.isCorrect,
        awardedMarks: result.isCorrect ? runtimeQuestion.marks : 0,
        feedback: result.feedback,
      });
    });
  }

  return (
    <MultipleChoiceBlock
      question={question}
      options={options}
      correctOptionId={correctOptionId}
      explanation={explanation}
      selectedOptionId={selectedOptionId}
      hasSubmitted={submitted}
      isSubmitting={isPending}
      onSelectOption={setSelectedOptionId}
      onSubmit={handleSubmit}
      feedbackStatusLabel={result.statusLabel}
      feedbackCorrectAnswerText={result.correctAnswerText}
      feedbackAcceptedAnswerTexts={result.acceptedAnswerTexts}
    />
  );
}
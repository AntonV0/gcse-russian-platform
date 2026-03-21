"use client";

import { useState, useTransition } from "react";
import ShortAnswerBlock from "@/components/lesson-blocks/short-answer-block";
import TranslationBlock from "@/components/lesson-blocks/translation-block";
import {
  type RuntimeAcceptedAnswer,
  type RuntimeTextQuestion,
  validateTextAnswer,
} from "@/lib/question-engine";
import { submitQuestionAttemptAction } from "@/app/actions/question-actions";

type TranslationDirection = "to_russian" | "to_english";

type TranslationUiConfig = {
  direction?: TranslationDirection;
  sourceLanguageLabel?: string;
  targetLanguageLabel?: string;
  instruction?: string;
  placeholder?: string;
};

type TrackedShortAnswerBlockProps = {
  questionId: string;
  lessonId?: string | null;
  question: string;
  questionType?: "short_answer" | "translation";
  acceptedAnswers: RuntimeAcceptedAnswer[];
  explanation?: string;
  placeholder?: string;
  translationUi?: TranslationUiConfig;
};

export default function TrackedShortAnswerBlock({
  questionId,
  lessonId = null,
  question,
  questionType = "short_answer",
  acceptedAnswers,
  explanation,
  placeholder = "Type your answer",
  translationUi,
}: TrackedShortAnswerBlockProps) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const runtimeQuestion: RuntimeTextQuestion = {
    id: questionId,
    questionSetId: "",
    type: questionType,
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
    acceptedAnswers,
  };

  const result = validateTextAnswer({
    question: runtimeQuestion,
    submittedText: value,
  });

  async function handleSubmit() {
    if (!value.trim() || submitted) return;

    setSubmitted(true);

    startTransition(async () => {
      await submitQuestionAttemptAction({
        questionId,
        lessonId,
        submittedText: value,
        submittedPayload: {
          answer: value,
          normalizedAnswer: result.normalizedSubmittedText,
          matchedAnswerId: result.matchedAnswer?.id ?? null,
          questionType,
        },
        isCorrect: result.isCorrect,
        awardedMarks: result.isCorrect ? runtimeQuestion.marks : 0,
        feedback: result.feedback,
      });
    });
  }

  if (questionType === "translation") {
    return (
      <TranslationBlock
        question={question}
        acceptedAnswers={acceptedAnswers.map((answer) => answer.text)}
        explanation={explanation}
        placeholder={translationUi?.placeholder ?? placeholder}
        value={value}
        hasSubmitted={submitted}
        isCorrect={result.isCorrect}
        isSubmitting={isPending}
        onValueChange={setValue}
        onSubmit={handleSubmit}
        direction={translationUi?.direction}
        sourceLanguageLabel={translationUi?.sourceLanguageLabel}
        targetLanguageLabel={translationUi?.targetLanguageLabel}
        instruction={translationUi?.instruction}
      />
    );
  }

  return (
    <ShortAnswerBlock
      question={question}
      acceptedAnswers={acceptedAnswers.map((answer) => answer.text)}
      explanation={explanation}
      placeholder={placeholder}
      value={value}
      hasSubmitted={submitted}
      isCorrect={result.isCorrect}
      isSubmitting={isPending}
      onValueChange={setValue}
      onSubmit={handleSubmit}
    />
  );
}
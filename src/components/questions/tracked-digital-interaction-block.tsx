"use client";

import { useState, useTransition } from "react";
import {
  submitQuestionAttemptAction,
  type SubmitQuestionAttemptActionResult,
} from "@/app/actions/questions/question-actions";
import QuestionCard from "@/components/questions/question-card";
import QuestionFeedback from "@/components/questions/question-feedback";
import {
  CategorisationInteraction,
  MatchingInteraction,
  MultipleResponseInteraction,
  OrderingInteraction,
  WordBankGapFillInteraction,
} from "@/components/questions/tracked-digital-interaction-controls";
import type { RuntimeStructuredQuestion } from "@/lib/questions/question-engine";

type TrackedDigitalInteractionBlockProps = {
  question: RuntimeStructuredQuestion;
  lessonId?: string | null;
  audioUrl?: string | null;
  audioMaxPlays?: number;
  audioListeningMode?: boolean;
  audioAutoPlay?: boolean;
  audioHideNativeControls?: boolean;
};

function getHeading(question: RuntimeStructuredQuestion) {
  switch (question.type) {
    case "multiple_response":
      return "Multi-select";
    case "matching":
      return "Matching";
    case "ordering":
      return "Ordering";
    case "word_bank_gap_fill":
      return "Word bank";
    case "categorisation":
      return "Categorisation";
    default:
      return "Question";
  }
}

export default function TrackedDigitalInteractionBlock({
  question,
  lessonId = null,
  audioUrl = null,
  audioMaxPlays,
  audioListeningMode = false,
  audioAutoPlay = false,
  audioHideNativeControls = false,
}: TrackedDigitalInteractionBlockProps) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [gapAnswers, setGapAnswers] = useState<Record<string, string>>({});
  const [categoryAnswers, setCategoryAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SubmitQuestionAttemptActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const submitted = result?.success === true;
  const feedback = result?.success === true ? result.feedback : null;

  function submitPayload(payload: Record<string, unknown>) {
    if (submitted || isPending) return;

    startTransition(async () => {
      const actionResult = await submitQuestionAttemptAction({
        questionId: question.id,
        lessonId,
        submittedPayload: payload,
      });

      setResult(actionResult);
    });
  }

  function toggleSelectedOption(optionId: string) {
    if (submitted || isPending) return;

    setSelectedOptionIds((current) =>
      current.includes(optionId)
        ? current.filter((item) => item !== optionId)
        : [...current, optionId]
    );
  }

  function setPromptMatch(promptId: string, optionId: string) {
    setMatches((current) => ({
      ...current,
      [promptId]: optionId,
    }));
  }

  function addOrderItem(itemId: string) {
    if (submitted || isPending) return;

    setSelectedOrder((current) => [...current, itemId]);
  }

  function removeOrderItem(itemId: string) {
    if (submitted || isPending) return;

    setSelectedOrder((current) => current.filter((entry) => entry !== itemId));
  }

  function setGapAnswer(gapId: string, answer: string) {
    setGapAnswers((current) => ({
      ...current,
      [gapId]: answer,
    }));
  }

  function setCategoryAnswer(itemId: string, categoryId: string) {
    setCategoryAnswers((current) => ({
      ...current,
      [itemId]: categoryId,
    }));
  }

  return (
    <QuestionCard
      heading={getHeading(question)}
      prompt={question.prompt}
      audioUrl={audioUrl}
      audioMaxPlays={audioMaxPlays}
      audioListeningMode={audioListeningMode}
      audioAutoPlay={audioAutoPlay}
      audioHideNativeControls={audioHideNativeControls}
      feedback={
        submitted && feedback ? (
          <QuestionFeedback
            isCorrect={feedback.isCorrect}
            explanation={feedback.feedback ?? undefined}
            statusLabel={feedback.statusLabel}
            correctAnswerText={feedback.correctAnswerText}
            acceptedAnswerTexts={feedback.acceptedAnswerTexts}
          />
        ) : null
      }
    >
      <div className="space-y-4">
        {question.type === "multiple_response" ? (
          <MultipleResponseInteraction
            question={question}
            selectedOptionIds={selectedOptionIds}
            onToggleOption={toggleSelectedOption}
            submitted={submitted}
            isPending={isPending}
            onSubmitPayload={submitPayload}
          />
        ) : null}
        {question.type === "matching" ? (
          <MatchingInteraction
            question={question}
            matches={matches}
            onChangeMatch={setPromptMatch}
            submitted={submitted}
            isPending={isPending}
            onSubmitPayload={submitPayload}
          />
        ) : null}
        {question.type === "ordering" ? (
          <OrderingInteraction
            question={question}
            selectedOrder={selectedOrder}
            onAddItem={addOrderItem}
            onRemoveItem={removeOrderItem}
            onReset={() => setSelectedOrder([])}
            submitted={submitted}
            isPending={isPending}
            onSubmitPayload={submitPayload}
          />
        ) : null}
        {question.type === "word_bank_gap_fill" ? (
          <WordBankGapFillInteraction
            question={question}
            gapAnswers={gapAnswers}
            onChangeGapAnswer={setGapAnswer}
            submitted={submitted}
            isPending={isPending}
            onSubmitPayload={submitPayload}
          />
        ) : null}
        {question.type === "categorisation" ? (
          <CategorisationInteraction
            question={question}
            categoryAnswers={categoryAnswers}
            onChangeCategoryAnswer={setCategoryAnswer}
            submitted={submitted}
            isPending={isPending}
            onSubmitPayload={submitPayload}
          />
        ) : null}
      </div>
    </QuestionCard>
  );
}

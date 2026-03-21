"use client";

import { useMemo, useState, useTransition } from "react";
import ShortAnswerBlock from "@/components/questions/short-answer-block";
import TranslationBlock from "@/components/questions/translation-block";
import SentenceBuilderBlock from "@/components/questions/sentence-builder-block";
import {
  type RuntimeAcceptedAnswer,
  type RuntimeTextQuestion,
  tokenizeSentenceBuilderText,
  validateSentenceBuilderAnswer,
  validateTextAnswer,
} from "@/lib/question-engine";
import { submitQuestionAttemptAction } from "@/app/actions/question-actions";

type TranslationDirection = "to_russian" | "to_english";

type AnswerStrategy =
  | "text_input"
  | "selection_based"
  | "sentence_builder"
  | "upload_required";

type TranslationUiConfig = {
  direction?: TranslationDirection;
  sourceLanguageLabel?: string;
  targetLanguageLabel?: string;
  instruction?: string;
  placeholder?: string;
};

type SentenceBuilderUiConfig = {
  wordBank?: string[];
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
  sentenceBuilderUi?: SentenceBuilderUiConfig;
  audioUrl?: string | null;
  answerStrategy?: AnswerStrategy;
};

function buildSentenceBuilderTokenPool(params: {
  answers: RuntimeAcceptedAnswer[];
  customWordBank?: string[];
}) {
  if (params.customWordBank && params.customWordBank.length > 0) {
    return [...params.customWordBank];
  }

  const primaryAnswer =
    params.answers.find((answer) => answer.isPrimary) ?? params.answers[0] ?? null;

  if (!primaryAnswer) {
    return [];
  }

  return tokenizeSentenceBuilderText(primaryAnswer.text);
}

export default function TrackedShortAnswerBlock({
  questionId,
  lessonId = null,
  question,
  questionType = "short_answer",
  acceptedAnswers,
  explanation,
  placeholder = "Type your answer",
  translationUi,
  sentenceBuilderUi,
  audioUrl = null,
  answerStrategy = "text_input",
}: TrackedShortAnswerBlockProps) {
  const initialSentenceBuilderTokens = useMemo(
    () =>
      buildSentenceBuilderTokenPool({
        answers: acceptedAnswers,
        customWordBank: sentenceBuilderUi?.wordBank,
      }),
    [acceptedAnswers, sentenceBuilderUi?.wordBank]
  );

  const [value, setValue] = useState("");
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>(
    initialSentenceBuilderTokens
  );
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

  const textResult = validateTextAnswer({
    question: runtimeQuestion,
    submittedText: value,
  });

  const sentenceBuilderResult = validateSentenceBuilderAnswer({
    question: runtimeQuestion,
    submittedTokens: selectedTokens,
  });

  const sentenceBuilderInstruction = useMemo(() => {
    if (translationUi?.instruction) {
      return translationUi.instruction;
    }

    if (translationUi?.targetLanguageLabel) {
      return `Build the sentence in ${translationUi.targetLanguageLabel}`;
    }

    return "Build the sentence in Russian";
  }, [translationUi]);

  async function handleSubmitText() {
    if (!value.trim() || submitted) return;

    setSubmitted(true);

    startTransition(async () => {
      await submitQuestionAttemptAction({
        questionId,
        lessonId,
        submittedText: value,
        submittedPayload: {
          answer: value,
          normalizedAnswer: textResult.normalizedSubmittedText,
          matchedAnswerId: textResult.matchedAnswer?.id ?? null,
          correctAnswerText: textResult.correctAnswerText,
          acceptedAnswerTexts: textResult.acceptedAnswerTexts,
          statusLabel: textResult.statusLabel,
          questionType,
          answerStrategy,
        },
        isCorrect: textResult.isCorrect,
        awardedMarks: textResult.isCorrect ? runtimeQuestion.marks : 0,
        feedback: textResult.feedback,
      });
    });
  }

  async function handleSubmitSentenceBuilder() {
    if (selectedTokens.length === 0 || submitted) return;

    setSubmitted(true);

    startTransition(async () => {
      await submitQuestionAttemptAction({
        questionId,
        lessonId,
        submittedText: sentenceBuilderResult.submittedText,
        submittedPayload: {
          selectedTokens,
          availableTokens,
          normalizedAnswer: sentenceBuilderResult.normalizedSubmittedText,
          matchedAnswerId: sentenceBuilderResult.matchedAnswer?.id ?? null,
          correctAnswerText: sentenceBuilderResult.correctAnswerText,
          acceptedAnswerTexts: sentenceBuilderResult.acceptedAnswerTexts,
          statusLabel: sentenceBuilderResult.statusLabel,
          questionType,
          answerStrategy,
        },
        isCorrect: sentenceBuilderResult.isCorrect,
        awardedMarks: sentenceBuilderResult.isCorrect ? runtimeQuestion.marks : 0,
        feedback: sentenceBuilderResult.feedback,
      });
    });
  }

  function handleAddToken(index: number) {
    if (submitted || isPending) return;

    const token = availableTokens[index];
    if (!token) return;

    setSelectedTokens((current) => [...current, token]);
    setAvailableTokens((current) => current.filter((_, i) => i !== index));
  }

  function handleRemoveToken(index: number) {
    if (submitted || isPending) return;

    const token = selectedTokens[index];
    if (!token) return;

    setSelectedTokens((current) => current.filter((_, i) => i !== index));
    setAvailableTokens((current) => [...current, token]);
  }

  function handleResetSentenceBuilder() {
    if (submitted || isPending) return;

    setSelectedTokens([]);
    setAvailableTokens(
      buildSentenceBuilderTokenPool({
        answers: acceptedAnswers,
        customWordBank: sentenceBuilderUi?.wordBank,
      })
    );
  }

  if (questionType === "translation" && answerStrategy === "sentence_builder") {
    return (
      <SentenceBuilderBlock
        question={question}
        instruction={sentenceBuilderInstruction}
        audioUrl={audioUrl}
        availableTokens={availableTokens}
        selectedTokens={selectedTokens}
        explanation={explanation}
        hasSubmitted={submitted}
        isCorrect={sentenceBuilderResult.isCorrect}
        isSubmitting={isPending}
        onAddToken={handleAddToken}
        onRemoveToken={handleRemoveToken}
        onReset={handleResetSentenceBuilder}
        onSubmit={handleSubmitSentenceBuilder}
        feedbackStatusLabel={sentenceBuilderResult.statusLabel}
        feedbackCorrectAnswerText={sentenceBuilderResult.correctAnswerText}
        feedbackAcceptedAnswerTexts={sentenceBuilderResult.acceptedAnswerTexts}
        sourceLanguageLabel={translationUi?.sourceLanguageLabel}
        targetLanguageLabel={translationUi?.targetLanguageLabel}
      />
    );
  }

  if (questionType === "translation" && answerStrategy !== "text_input") {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
        This question requires a different interaction type (
        {answerStrategy.replace("_", " ")}). This will be supported soon.
      </div>
    );
  }

  if (questionType === "translation") {
    return (
      <TranslationBlock
        question={question}
        acceptedAnswers={acceptedAnswers.map((a) => a.text)}
        explanation={explanation}
        placeholder={translationUi?.placeholder ?? placeholder}
        value={value}
        hasSubmitted={submitted}
        isCorrect={textResult.isCorrect}
        isSubmitting={isPending}
        onValueChange={setValue}
        onSubmit={handleSubmitText}
        direction={translationUi?.direction}
        sourceLanguageLabel={translationUi?.sourceLanguageLabel}
        targetLanguageLabel={translationUi?.targetLanguageLabel}
        instruction={translationUi?.instruction}
        feedbackStatusLabel={textResult.statusLabel}
        feedbackCorrectAnswerText={textResult.correctAnswerText}
        feedbackAcceptedAnswerTexts={textResult.acceptedAnswerTexts}
        audioUrl={audioUrl}
      />
    );
  }

  return (
    <ShortAnswerBlock
      question={question}
      acceptedAnswers={acceptedAnswers.map((a) => a.text)}
      explanation={explanation}
      placeholder={placeholder}
      value={value}
      hasSubmitted={submitted}
      isCorrect={textResult.isCorrect}
      isSubmitting={isPending}
      onValueChange={setValue}
      onSubmit={handleSubmitText}
      feedbackStatusLabel={textResult.statusLabel}
      feedbackCorrectAnswerText={textResult.correctAnswerText}
      feedbackAcceptedAnswerTexts={textResult.acceptedAnswerTexts}
      audioUrl={audioUrl}
    />
  );
}
"use client";

import { useMemo, useState, useTransition } from "react";
import ShortAnswerBlock from "@/components/questions/short-answer-block";
import TranslationBlock from "@/components/questions/translation-block";
import SentenceBuilderBlock from "@/components/questions/sentence-builder-block";
import SelectionBasedBlock, {
  type SelectionGroup,
} from "@/components/questions/selection-based-block";
import {
  type RuntimeAcceptedAnswer,
  type RuntimeTextQuestion,
  type TextValidationOptions,
  tokenizeSentenceBuilderText,
  validateSentenceBuilderAnswer,
  validateTextAnswer,
} from "@/lib/questions/question-engine";
import { submitQuestionAttemptAction } from "@/app/actions/questions/question-actions";

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

type SelectionBasedUiConfig = {
  groups?: SelectionGroup[];
  displayMode?: "grouped" | "inline_gaps";
};

type ListeningUiConfig = {
  maxPlays?: number;
  listeningMode?: boolean;
  autoPlay?: boolean;
  hideNativeControls?: boolean;
  requireAudioCompletionBeforeSubmit?: boolean;
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
  selectionBasedUi?: SelectionBasedUiConfig;
  validationOptions?: TextValidationOptions;
  audioUrl?: string | null;
  listeningUi?: ListeningUiConfig;
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

function buildSelectionBasedSubmittedText(params: {
  groups: SelectionGroup[];
  selectedOptions: Record<string, string>;
}) {
  return params.groups
    .map((group) => params.selectedOptions[group.id])
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .join(" ");
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
  selectionBasedUi,
  validationOptions,
  audioUrl = null,
  listeningUi,
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

  const selectionGroups = selectionBasedUi?.groups ?? [];

  const [value, setValue] = useState("");
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>(
    initialSentenceBuilderTokens
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [audioCompleted, setAudioCompleted] = useState(false);
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
    options: validationOptions,
  });

  const sentenceBuilderResult = validateSentenceBuilderAnswer({
    question: runtimeQuestion,
    submittedTokens: selectedTokens,
    options: validationOptions,
  });

  const selectionBasedSubmittedText = buildSelectionBasedSubmittedText({
    groups: selectionGroups,
    selectedOptions,
  });

  const selectionBasedResult = validateTextAnswer({
    question: runtimeQuestion,
    submittedText: selectionBasedSubmittedText,
    options: validationOptions,
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

  const selectionBasedInstruction = useMemo(() => {
    if (translationUi?.instruction) {
      return translationUi.instruction;
    }

    if (translationUi?.targetLanguageLabel) {
      return `Select the correct forms in ${translationUi.targetLanguageLabel}`;
    }

    return "Select the correct Russian forms";
  }, [translationUi]);

  const audioGatePassed =
    !listeningUi?.requireAudioCompletionBeforeSubmit || audioCompleted;

  async function handleSubmitText() {
    if (!value.trim() || submitted || !audioGatePassed) return;

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
          validationOptions,
        },
        isCorrect: textResult.isCorrect,
        awardedMarks: textResult.isCorrect ? runtimeQuestion.marks : 0,
        feedback: textResult.feedback,
      });
    });
  }

  async function handleSubmitSentenceBuilder() {
    if (selectedTokens.length === 0 || submitted || !audioGatePassed) return;

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
          validationOptions,
        },
        isCorrect: sentenceBuilderResult.isCorrect,
        awardedMarks: sentenceBuilderResult.isCorrect ? runtimeQuestion.marks : 0,
        feedback: sentenceBuilderResult.feedback,
      });
    });
  }

  async function handleSubmitSelectionBased() {
    if (selectionBasedSubmittedText.length === 0 || submitted || !audioGatePassed) {
      return;
    }

    setSubmitted(true);

    startTransition(async () => {
      await submitQuestionAttemptAction({
        questionId,
        lessonId,
        submittedText: selectionBasedSubmittedText,
        submittedPayload: {
          selectedOptions,
          normalizedAnswer: selectionBasedResult.normalizedSubmittedText,
          matchedAnswerId: selectionBasedResult.matchedAnswer?.id ?? null,
          correctAnswerText: selectionBasedResult.correctAnswerText,
          acceptedAnswerTexts: selectionBasedResult.acceptedAnswerTexts,
          statusLabel: selectionBasedResult.statusLabel,
          questionType,
          answerStrategy,
          validationOptions,
        },
        isCorrect: selectionBasedResult.isCorrect,
        awardedMarks: selectionBasedResult.isCorrect ? runtimeQuestion.marks : 0,
        feedback: selectionBasedResult.feedback,
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

  function handleSelectOption(groupId: string, option: string) {
    if (submitted || isPending) return;

    setSelectedOptions((current) => ({
      ...current,
      [groupId]: option,
    }));
  }

  function handleResetSelectionBased() {
    if (submitted || isPending) return;

    setSelectedOptions({});
  }

  if (questionType === "translation" && answerStrategy === "sentence_builder") {
    return (
      <SentenceBuilderBlock
        question={question}
        instruction={sentenceBuilderInstruction}
        audioUrl={audioUrl}
        audioMaxPlays={listeningUi?.maxPlays}
        audioListeningMode={listeningUi?.listeningMode}
        audioAutoPlay={listeningUi?.autoPlay}
        audioHideNativeControls={listeningUi?.hideNativeControls}
        onAudioPlaybackCompleted={() => setAudioCompleted(true)}
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

  if (questionType === "translation" && answerStrategy === "selection_based") {
    return (
      <SelectionBasedBlock
        question={question}
        instruction={selectionBasedInstruction}
        audioUrl={audioUrl}
        audioMaxPlays={listeningUi?.maxPlays}
        audioListeningMode={listeningUi?.listeningMode}
        audioAutoPlay={listeningUi?.autoPlay}
        audioHideNativeControls={listeningUi?.hideNativeControls}
        onAudioPlaybackCompleted={() => setAudioCompleted(true)}
        groups={selectionGroups}
        selectedOptions={selectedOptions}
        explanation={explanation}
        hasSubmitted={submitted}
        isCorrect={selectionBasedResult.isCorrect}
        isSubmitting={isPending}
        onSelectOption={handleSelectOption}
        onReset={handleResetSelectionBased}
        onSubmit={handleSubmitSelectionBased}
        feedbackStatusLabel={selectionBasedResult.statusLabel}
        feedbackCorrectAnswerText={selectionBasedResult.correctAnswerText}
        feedbackAcceptedAnswerTexts={selectionBasedResult.acceptedAnswerTexts}
        sourceLanguageLabel={translationUi?.sourceLanguageLabel}
        targetLanguageLabel={translationUi?.targetLanguageLabel}
        displayMode={selectionBasedUi?.displayMode}
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
        audioMaxPlays={listeningUi?.maxPlays}
        audioListeningMode={listeningUi?.listeningMode}
        audioAutoPlay={listeningUi?.autoPlay}
        audioHideNativeControls={listeningUi?.hideNativeControls}
        onAudioPlaybackCompleted={() => setAudioCompleted(true)}
        submitLocked={!audioGatePassed}
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
      audioMaxPlays={listeningUi?.maxPlays}
      audioListeningMode={listeningUi?.listeningMode}
      audioAutoPlay={listeningUi?.autoPlay}
      audioHideNativeControls={listeningUi?.hideNativeControls}
      onAudioPlaybackCompleted={() => setAudioCompleted(true)}
      submitLocked={!audioGatePassed}
    />
  );
}

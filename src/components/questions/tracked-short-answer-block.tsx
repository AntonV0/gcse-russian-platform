"use client";

import { useMemo, useState, useTransition } from "react";
import ShortAnswerBlock from "@/components/questions/short-answer-block";
import TranslationBlock from "@/components/questions/translation-block";
import SentenceBuilderBlock from "@/components/questions/sentence-builder-block";
import SelectionBasedBlock from "@/components/questions/selection-based-block";
import { UnsupportedAnswerStrategyMessage } from "@/components/questions/unsupported-answer-strategy-message";
import {
  submitQuestionAttemptAction,
  type SubmitQuestionAttemptActionResult,
} from "@/app/actions/questions/question-actions";
import type { TrackedShortAnswerBlockProps } from "./tracked-short-answer-types";
import {
  buildSelectionBasedSubmittedText,
  buildSentenceBuilderTokenPool,
  getSelectionBasedInstruction,
  getSentenceBuilderInstruction,
} from "./tracked-short-answer-utils";

export default function TrackedShortAnswerBlock({
  questionId,
  lessonId = null,
  question,
  questionType = "short_answer",
  explanation,
  placeholder = "Type your answer",
  translationUi,
  sentenceBuilderUi,
  selectionBasedUi,
  audioUrl = null,
  listeningUi,
  answerStrategy = "text_input",
}: TrackedShortAnswerBlockProps) {
  const initialSentenceBuilderTokens = useMemo(
    () =>
      buildSentenceBuilderTokenPool({
        customWordBank: sentenceBuilderUi?.wordBank,
      }),
    [sentenceBuilderUi?.wordBank]
  );

  const selectionGroups = selectionBasedUi?.groups ?? [];

  const [value, setValue] = useState("");
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>(
    initialSentenceBuilderTokens
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [audioCompleted, setAudioCompleted] = useState(false);
  const [result, setResult] = useState<SubmitQuestionAttemptActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const submitted = result?.success === true;
  const feedback = result?.success === true ? result.feedback : null;

  const selectionBasedSubmittedText = buildSelectionBasedSubmittedText({
    groups: selectionGroups,
    selectedOptions,
  });

  const sentenceBuilderInstruction = getSentenceBuilderInstruction(translationUi);
  const selectionBasedInstruction = getSelectionBasedInstruction(translationUi);

  const audioGatePassed =
    !listeningUi?.requireAudioCompletionBeforeSubmit || audioCompleted;

  async function handleSubmitText() {
    if (!value.trim() || submitted || isPending || !audioGatePassed) return;

    startTransition(async () => {
      const actionResult = await submitQuestionAttemptAction({
        questionId,
        lessonId,
        submittedText: value,
      });

      setResult(actionResult);
    });
  }

  async function handleSubmitSentenceBuilder() {
    if (selectedTokens.length === 0 || submitted || isPending || !audioGatePassed) {
      return;
    }

    const submittedText = selectedTokens.join(" ");

    startTransition(async () => {
      const actionResult = await submitQuestionAttemptAction({
        questionId,
        lessonId,
        submittedText,
      });

      setResult(actionResult);
    });
  }

  async function handleSubmitSelectionBased() {
    if (
      selectionBasedSubmittedText.length === 0 ||
      submitted ||
      isPending ||
      !audioGatePassed
    ) {
      return;
    }

    startTransition(async () => {
      const actionResult = await submitQuestionAttemptAction({
        questionId,
        lessonId,
        submittedText: selectionBasedSubmittedText,
      });

      setResult(actionResult);
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
        explanation={feedback?.feedback ?? explanation}
        hasSubmitted={submitted}
        isCorrect={feedback?.isCorrect}
        isSubmitting={isPending}
        onAddToken={handleAddToken}
        onRemoveToken={handleRemoveToken}
        onReset={handleResetSentenceBuilder}
        onSubmit={handleSubmitSentenceBuilder}
        feedbackStatusLabel={feedback?.statusLabel}
        feedbackCorrectAnswerText={feedback?.correctAnswerText}
        feedbackAcceptedAnswerTexts={feedback?.acceptedAnswerTexts}
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
        explanation={feedback?.feedback ?? explanation}
        hasSubmitted={submitted}
        isCorrect={feedback?.isCorrect}
        isSubmitting={isPending}
        onSelectOption={handleSelectOption}
        onReset={handleResetSelectionBased}
        onSubmit={handleSubmitSelectionBased}
        feedbackStatusLabel={feedback?.statusLabel}
        feedbackCorrectAnswerText={feedback?.correctAnswerText}
        feedbackAcceptedAnswerTexts={feedback?.acceptedAnswerTexts}
        sourceLanguageLabel={translationUi?.sourceLanguageLabel}
        targetLanguageLabel={translationUi?.targetLanguageLabel}
        displayMode={selectionBasedUi?.displayMode}
      />
    );
  }

  if (questionType === "translation" && answerStrategy !== "text_input") {
    return <UnsupportedAnswerStrategyMessage answerStrategy={answerStrategy} />;
  }

  if (questionType === "translation") {
    return (
      <TranslationBlock
        question={question}
        explanation={feedback?.feedback ?? explanation}
        placeholder={translationUi?.placeholder ?? placeholder}
        value={value}
        hasSubmitted={submitted}
        isCorrect={feedback?.isCorrect}
        isSubmitting={isPending}
        onValueChange={setValue}
        onSubmit={handleSubmitText}
        direction={translationUi?.direction}
        sourceLanguageLabel={translationUi?.sourceLanguageLabel}
        targetLanguageLabel={translationUi?.targetLanguageLabel}
        instruction={translationUi?.instruction}
        feedbackStatusLabel={feedback?.statusLabel}
        feedbackCorrectAnswerText={feedback?.correctAnswerText}
        feedbackAcceptedAnswerTexts={feedback?.acceptedAnswerTexts}
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
      explanation={feedback?.feedback ?? explanation}
      placeholder={placeholder}
      value={value}
      hasSubmitted={submitted}
      isCorrect={feedback?.isCorrect}
      isSubmitting={isPending}
      onValueChange={setValue}
      onSubmit={handleSubmitText}
      feedbackStatusLabel={feedback?.statusLabel}
      feedbackCorrectAnswerText={feedback?.correctAnswerText}
      feedbackAcceptedAnswerTexts={feedback?.acceptedAnswerTexts}
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

import TrackedMultipleChoiceBlock from "@/components/questions/tracked-multiple-choice-block";
import TrackedDigitalInteractionBlock from "@/components/questions/tracked-digital-interaction-block";
import TrackedShortAnswerBlock from "@/components/questions/tracked-short-answer-block";
import {
  tokenizeSentenceBuilderText,
  type RuntimeQuestion,
  type RuntimeTextQuestion,
} from "@/lib/questions/question-engine";
import { getPublicAudioUrl } from "@/lib/shared/media";

type QuestionRendererProps = {
  question: RuntimeQuestion;
  lessonId?: string | null;
};

type SelectionGroupMetadata = {
  id: string;
  label?: string;
  options: string[];
};

function getStringMetadata(
  metadata: Record<string, unknown>,
  key: string
): string | undefined {
  const value = metadata[key];
  return typeof value === "string" ? value : undefined;
}

function getNumberMetadata(
  metadata: Record<string, unknown>,
  key: string
): number | undefined {
  const value = metadata[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getBooleanMetadata(
  metadata: Record<string, unknown>,
  key: string
): boolean | undefined {
  const value = metadata[key];
  return typeof value === "boolean" ? value : undefined;
}

function getTranslationDirection(
  metadata: Record<string, unknown>
): "to_russian" | "to_english" | undefined {
  const value = metadata.direction;

  if (value === "to_russian" || value === "to_english") {
    return value;
  }

  return undefined;
}

function getAnswerStrategy(
  metadata: Record<string, unknown>
): "text_input" | "selection_based" | "sentence_builder" | "upload_required" {
  const value = metadata.answerStrategy;

  if (
    value === "text_input" ||
    value === "selection_based" ||
    value === "sentence_builder" ||
    value === "upload_required"
  ) {
    return value;
  }

  return "text_input";
}

function getStringArrayMetadata(
  metadata: Record<string, unknown>,
  key: string
): string[] | undefined {
  const value = metadata[key];

  if (!Array.isArray(value)) {
    return undefined;
  }

  const stringValues = value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  );

  return stringValues.length > 0 ? stringValues : undefined;
}

function getSelectionGroupsMetadata(
  metadata: Record<string, unknown>
): SelectionGroupMetadata[] | undefined {
  const value = metadata.selectionGroups;

  if (!Array.isArray(value)) {
    return undefined;
  }

  const groups: SelectionGroupMetadata[] = [];

  value.forEach((item, index) => {
    if (!item || typeof item !== "object") {
      return;
    }

    const group = item as Record<string, unknown>;
    const optionsValue = group.options;

    if (!Array.isArray(optionsValue)) {
      return;
    }

    const options = optionsValue.filter(
      (option): option is string => typeof option === "string" && option.trim().length > 0
    );

    if (options.length === 0) {
      return;
    }

    const resolvedId =
      typeof group.id === "string" && group.id.trim().length > 0
        ? group.id
        : `group-${index + 1}`;

    const resolvedLabel =
      typeof group.label === "string" && group.label.trim().length > 0
        ? group.label
        : undefined;

    groups.push({
      id: resolvedId,
      label: resolvedLabel,
      options,
    });
  });

  return groups.length > 0 ? groups : undefined;
}

function shuffleTokensForQuestion(tokens: string[], questionId: string) {
  const shuffled = [...tokens];
  let seed = [...questionId].reduce((sum, char) => sum + char.charCodeAt(0), 0);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const swapIndex = seed % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function getSentenceBuilderWordBank(question: RuntimeTextQuestion) {
  const metadataWordBank = getStringArrayMetadata(question.metadata, "wordBank");

  if (metadataWordBank) {
    return metadataWordBank;
  }

  const primaryAnswer =
    question.acceptedAnswers.find((answer) => answer.isPrimary) ??
    question.acceptedAnswers[0] ??
    null;

  if (!primaryAnswer) {
    return undefined;
  }

  return shuffleTokensForQuestion(
    tokenizeSentenceBuilderText(primaryAnswer.text),
    question.id
  );
}

export default async function QuestionRenderer({
  question,
  lessonId = null,
}: QuestionRendererProps) {
  const audioUrl = await getPublicAudioUrl(question.audioPath);

  const answerStrategy = getAnswerStrategy(question.metadata);

  const listeningUi = {
    maxPlays: getNumberMetadata(question.metadata, "maxPlays"),
    listeningMode: getBooleanMetadata(question.metadata, "listeningMode") ?? false,
    autoPlay: getBooleanMetadata(question.metadata, "autoPlay") ?? false,
    hideNativeControls:
      getBooleanMetadata(question.metadata, "hideNativeControls") ?? false,
    requireAudioCompletionBeforeSubmit:
      getBooleanMetadata(question.metadata, "requireAudioCompletionBeforeSubmit") ??
      false,
  };

  switch (question.type) {
    case "multiple_choice":
      return (
        <TrackedMultipleChoiceBlock
          questionId={question.id}
          lessonId={lessonId}
          question={question.prompt}
          options={question.options.map((option) => ({
            id: option.id,
            text: option.text,
          }))}
          audioUrl={audioUrl}
          audioMaxPlays={listeningUi.maxPlays}
          audioListeningMode={listeningUi.listeningMode}
          audioAutoPlay={listeningUi.autoPlay}
          audioHideNativeControls={listeningUi.hideNativeControls}
        />
      );

    case "short_answer":
      return (
        <TrackedShortAnswerBlock
          questionId={question.id}
          lessonId={lessonId}
          question={question.prompt}
          questionType="short_answer"
          placeholder={
            getStringMetadata(question.metadata, "placeholder") ?? "Type your answer"
          }
          audioUrl={audioUrl}
          listeningUi={listeningUi}
          answerStrategy={answerStrategy}
        />
      );

    case "translation":
      return (
        <TrackedShortAnswerBlock
          questionId={question.id}
          lessonId={lessonId}
          question={question.prompt}
          questionType="translation"
          placeholder={
            getStringMetadata(question.metadata, "placeholder") ?? "Type your translation"
          }
          audioUrl={audioUrl}
          listeningUi={listeningUi}
          answerStrategy={answerStrategy}
          translationUi={{
            direction: getTranslationDirection(question.metadata),
            sourceLanguageLabel: getStringMetadata(
              question.metadata,
              "sourceLanguageLabel"
            ),
            targetLanguageLabel: getStringMetadata(
              question.metadata,
              "targetLanguageLabel"
            ),
            instruction: getStringMetadata(question.metadata, "instruction"),
            placeholder: getStringMetadata(question.metadata, "placeholder"),
          }}
          sentenceBuilderUi={{
            wordBank: getSentenceBuilderWordBank(question),
          }}
          selectionBasedUi={{
            groups: getSelectionGroupsMetadata(question.metadata),
            displayMode:
              getStringMetadata(question.metadata, "selectionDisplayMode") ===
              "inline_gaps"
                ? "inline_gaps"
                : "grouped",
          }}
        />
      );

    case "multiple_response":
    case "matching":
    case "ordering":
    case "word_bank_gap_fill":
    case "categorisation":
      return (
        <TrackedDigitalInteractionBlock
          question={question}
          lessonId={lessonId}
          audioUrl={audioUrl}
          audioMaxPlays={listeningUi.maxPlays}
          audioListeningMode={listeningUi.listeningMode}
          audioAutoPlay={listeningUi.autoPlay}
          audioHideNativeControls={listeningUi.hideNativeControls}
        />
      );
  }
}

import TrackedMultipleChoiceBlock from "@/components/questions/tracked-multiple-choice-block";
import TrackedShortAnswerBlock from "@/components/questions/tracked-short-answer-block";
import type { RuntimeQuestion } from "@/lib/question-engine";
import { getPublicAudioUrl } from "@/lib/media";

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
      (option): option is string =>
        typeof option === "string" && option.trim().length > 0
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

export default async function QuestionRenderer({
  question,
  lessonId = null,
}: QuestionRendererProps) {
  const audioUrl = await getPublicAudioUrl(question.audioPath);

  const answerStrategy = getAnswerStrategy(question.metadata);
  const audioMaxPlays = getNumberMetadata(question.metadata, "maxPlays");
  const audioListeningMode =
    getBooleanMetadata(question.metadata, "listeningMode") ?? false;

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
          correctOptionId={question.correctOptionId ?? ""}
          explanation={question.explanation ?? undefined}
          audioUrl={audioUrl}
          audioMaxPlays={audioMaxPlays}
          audioListeningMode={audioListeningMode}
        />
      );

    case "short_answer":
      return (
        <TrackedShortAnswerBlock
          questionId={question.id}
          lessonId={lessonId}
          question={question.prompt}
          questionType="short_answer"
          acceptedAnswers={question.acceptedAnswers}
          explanation={question.explanation ?? undefined}
          placeholder={
            getStringMetadata(question.metadata, "placeholder") ??
            "Type your answer"
          }
          audioUrl={audioUrl}
          audioMaxPlays={audioMaxPlays}
          audioListeningMode={audioListeningMode}
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
          acceptedAnswers={question.acceptedAnswers}
          explanation={question.explanation ?? undefined}
          placeholder={
            getStringMetadata(question.metadata, "placeholder") ??
            "Type your translation"
          }
          audioUrl={audioUrl}
          audioMaxPlays={audioMaxPlays}
          audioListeningMode={audioListeningMode}
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
            wordBank: getStringArrayMetadata(question.metadata, "wordBank"),
          }}
          selectionBasedUi={{
            groups: getSelectionGroupsMetadata(question.metadata),
          }}
        />
      );
  }
}
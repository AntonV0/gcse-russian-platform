import TrackedMultipleChoiceBlock from "@/components/questions/tracked-multiple-choice-block";
import TrackedShortAnswerBlock from "@/components/questions/tracked-short-answer-block";
import type { RuntimeQuestion } from "@/lib/question-engine";
import { getPublicAudioUrl } from "@/lib/media";

type QuestionRendererProps = {
  question: RuntimeQuestion;
  lessonId?: string | null;
};

function getStringMetadata(
  metadata: Record<string, unknown>,
  key: string
): string | undefined {
  const value = metadata[key];
  return typeof value === "string" ? value : undefined;
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

export default async function QuestionRenderer({
  question,
  lessonId = null,
}: QuestionRendererProps) {
  const audioUrl = await getPublicAudioUrl(question.audioPath);

  const answerStrategy = getAnswerStrategy(question.metadata);

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
        />
      );
  }
}
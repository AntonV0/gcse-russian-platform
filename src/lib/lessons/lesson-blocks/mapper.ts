import type { LessonBlock } from "@/types/lesson";
import {
  normalizeAudioBlockData,
  normalizeCalloutBlockData,
  normalizeExamTipBlockData,
  normalizeHeaderBlockData,
  normalizeImageBlockData,
  normalizeNoteBlockData,
  normalizeQuestionSetBlockData,
  normalizeSubheaderBlockData,
  normalizeTextBlockData,
  normalizeVocabularyBlockData,
  normalizeVocabularySetBlockData,
} from "./normalizers";
import { optionalString, requireString } from "./parsing";
import type { DbLessonBlockLike } from "./types";

export function mapDbBlockToLessonBlock(row: DbLessonBlockLike): LessonBlock {
  const data = row.data ?? {};

  switch (row.block_type) {
    case "header":
      return {
        type: "header",
        ...normalizeHeaderBlockData({
          content: data.content,
        }),
      };

    case "subheader":
      return {
        type: "subheader",
        ...normalizeSubheaderBlockData({
          content: data.content,
        }),
      };

    case "divider":
      return {
        type: "divider",
      };

    case "text":
      return {
        type: "text",
        ...normalizeTextBlockData({
          content: data.content,
        }),
      };

    case "note":
      return {
        type: "note",
        ...normalizeNoteBlockData({
          title: data.title,
          content: data.content,
        }),
      };

    case "callout":
      return {
        type: "callout",
        ...normalizeCalloutBlockData({
          title: data.title,
          content: data.content,
        }),
      };

    case "exam-tip":
      return {
        type: "exam-tip",
        ...normalizeExamTipBlockData({
          title: data.title,
          content: data.content,
        }),
      };

    case "image":
      return {
        type: "image",
        ...normalizeImageBlockData({
          src: data.src,
          alt: data.alt,
          caption: data.caption,
        }),
      };

    case "audio":
      return {
        type: "audio",
        ...normalizeAudioBlockData({
          title: data.title,
          src: data.src,
          caption: data.caption,
          autoPlay: data.autoPlay,
        }),
      };

    case "vocabulary":
      return {
        type: "vocabulary",
        ...normalizeVocabularyBlockData({
          title: data.title,
          items: data.items,
        }),
      };

    case "vocabulary-set":
      return {
        type: "vocabulary-set",
        ...normalizeVocabularySetBlockData({
          title: data.title,
          vocabularySetSlug: data.vocabularySetSlug,
        }),
      };

    case "question-set":
      return {
        type: "question-set",
        ...normalizeQuestionSetBlockData({
          title: data.title,
          questionSetSlug: data.questionSetSlug,
        }),
      };

    case "multiple-choice":
      return {
        type: "multiple-choice",
        question: requireString(data.question, "question"),
        options: Array.isArray(data.options)
          ? data.options.map((option, index) => {
              if (!option || typeof option !== "object") {
                throw new Error(`Invalid multiple-choice option at index ${index}`);
              }

              const record = option as Record<string, unknown>;

              return {
                id: requireString(record.id, `options[${index}].id`),
                text: requireString(record.text, `options[${index}].text`),
              };
            })
          : [],
        correctOptionId: requireString(data.correctOptionId, "correctOptionId"),
        explanation: optionalString(data.explanation),
      };

    case "short-answer":
      return {
        type: "short-answer",
        question: requireString(data.question, "question"),
        acceptedAnswers: Array.isArray(data.acceptedAnswers)
          ? data.acceptedAnswers.filter(
              (value): value is string =>
                typeof value === "string" && value.trim().length > 0
            )
          : [],
        explanation: optionalString(data.explanation),
        placeholder: optionalString(data.placeholder),
      };

    default:
      throw new Error(`Unsupported lesson block type: ${row.block_type}`);
  }
}

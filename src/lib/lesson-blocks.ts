import type { LessonBlock, LessonSectionKind } from "@/types/lesson";

export type DbLessonBlockLike = {
  block_type: string;
  data: Record<string, unknown> | null;
};

export type LessonBlockType = LessonBlock["type"];

export const allowedSectionKinds: LessonSectionKind[] = [
  "intro",
  "content",
  "grammar",
  "practice",
  "reading_practice",
  "writing_practice",
  "speaking_practice",
  "listening_practice",
  "summary",
];

export function resolveSectionKind(value: string): LessonSectionKind {
  return allowedSectionKinds.includes(value as LessonSectionKind)
    ? (value as LessonSectionKind)
    : "content";
}

export function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid lesson block field: ${field}`);
  }

  return value.trim();
}

export function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

export function parseVocabularyItems(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [russian, english] = line.split("|").map((part) => part?.trim() ?? "");

      if (!russian || !english) {
        throw new Error(
          `Vocabulary line ${index + 1} must use the format: russian | english`
        );
      }

      return { russian, english };
    });
}

export function getLessonBlockLabel(blockType: string): string {
  switch (blockType) {
    case "header":
      return "Header";
    case "subheader":
      return "Subheader";
    case "divider":
      return "Divider";
    case "text":
      return "Text";
    case "note":
      return "Note";
    case "callout":
      return "Callout";
    case "exam-tip":
      return "Exam tip";
    case "image":
      return "Image";
    case "audio":
      return "Audio";
    case "vocabulary":
      return "Vocabulary";
    case "vocabulary-set":
      return "Vocabulary set";
    case "question-set":
      return "Question set";
    case "multiple-choice":
      return "Multiple choice";
    case "short-answer":
      return "Short answer";
    default:
      return blockType;
  }
}

export function getLessonBlockGroupLabel(blockType: string): string {
  switch (blockType) {
    case "header":
    case "subheader":
    case "divider":
      return "Structure";
    case "text":
    case "note":
    case "callout":
    case "exam-tip":
      return "Teaching";
    case "vocabulary":
    case "vocabulary-set":
      return "Vocabulary";
    case "image":
    case "audio":
      return "Media";
    case "question-set":
    case "multiple-choice":
    case "short-answer":
      return "Practice";
    default:
      return "Block";
  }
}

export function getLessonBlockAccentClass(blockType: string): string {
  switch (blockType) {
    case "header":
    case "subheader":
    case "divider":
      return "border-slate-200 bg-slate-50 text-slate-700";
    case "text":
    case "note":
    case "callout":
    case "exam-tip":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "vocabulary":
    case "vocabulary-set":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "image":
    case "audio":
      return "border-purple-200 bg-purple-50 text-purple-700";
    case "question-set":
    case "multiple-choice":
    case "short-answer":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

export function normalizeHeaderBlockData(input: { content: unknown }) {
  return {
    content: requireString(input.content, "content"),
  };
}

export function normalizeSubheaderBlockData(input: { content: unknown }) {
  return {
    content: requireString(input.content, "content"),
  };
}

export function normalizeTextBlockData(input: { content: unknown }) {
  return {
    content: requireString(input.content, "content"),
  };
}

export function normalizeNoteBlockData(input: { title: unknown; content: unknown }) {
  return {
    title: requireString(input.title, "title"),
    content: requireString(input.content, "content"),
  };
}

export function normalizeCalloutBlockData(input: { title: unknown; content: unknown }) {
  return {
    title: optionalString(input.title),
    content: requireString(input.content, "content"),
  };
}

export function normalizeExamTipBlockData(input: { title: unknown; content: unknown }) {
  return {
    title: optionalString(input.title),
    content: requireString(input.content, "content"),
  };
}

export function normalizeImageBlockData(input: {
  src: unknown;
  alt: unknown;
  caption: unknown;
}) {
  return {
    src: requireString(input.src, "src"),
    alt: optionalString(input.alt),
    caption: optionalString(input.caption),
  };
}

export function normalizeAudioBlockData(input: {
  title: unknown;
  src: unknown;
  caption: unknown;
  autoPlay: unknown;
}) {
  return {
    title: optionalString(input.title),
    src: requireString(input.src, "src"),
    caption: optionalString(input.caption),
    autoPlay: typeof input.autoPlay === "boolean" ? input.autoPlay : false,
  };
}

export function normalizeVocabularyBlockData(input: { title: unknown; items: unknown }) {
  let itemsValue: { russian: string; english: string }[] = [];

  if (typeof input.items === "string") {
    itemsValue = parseVocabularyItems(input.items);
  } else if (Array.isArray(input.items)) {
    itemsValue = input.items.map((item, index) => {
      if (!item || typeof item !== "object") {
        throw new Error(`Invalid vocabulary item at index ${index}`);
      }

      const record = item as Record<string, unknown>;

      return {
        russian: requireString(record.russian, `items[${index}].russian`),
        english: requireString(record.english, `items[${index}].english`),
      };
    });
  } else {
    throw new Error("Invalid lesson block field: items");
  }

  return {
    title: requireString(input.title, "title"),
    items: itemsValue,
  };
}

export function normalizeQuestionSetBlockData(input: {
  title: unknown;
  questionSetSlug: unknown;
}) {
  return {
    title: optionalString(input.title),
    questionSetSlug: requireString(input.questionSetSlug, "questionSetSlug"),
  };
}

export function normalizeVocabularySetBlockData(input: {
  title: unknown;
  vocabularySetSlug: unknown;
}) {
  return {
    title: optionalString(input.title),
    vocabularySetSlug: requireString(input.vocabularySetSlug, "vocabularySetSlug"),
  };
}

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

export function getLessonBlockPreview(block: LessonBlock | DbLessonBlockLike): string {
  const typedBlock = "type" in block ? block : mapDbBlockToLessonBlock(block);

  switch (typedBlock.type) {
    case "header":
    case "subheader":
    case "text":
      return typedBlock.content;

    case "note":
      return typedBlock.title || typedBlock.content;

    case "callout":
    case "exam-tip":
      return typedBlock.title || typedBlock.content;

    case "image":
      return typedBlock.caption || typedBlock.src;

    case "audio":
      return typedBlock.title || typedBlock.src;

    case "vocabulary":
      return typedBlock.items.length > 0
        ? `${typedBlock.items.length} item(s) · ${typedBlock.items
            .slice(0, 2)
            .map((item) => `${item.russian} = ${item.english}`)
            .join(", ")}`
        : "Vocabulary block";

    case "vocabulary-set":
      return typedBlock.title || typedBlock.vocabularySetSlug;

    case "question-set":
      return typedBlock.title || typedBlock.questionSetSlug;

    case "multiple-choice":
      return typedBlock.question;

    case "short-answer":
      return typedBlock.question;

    case "divider":
      return "Divider";

    default:
      return "Block";
  }
}

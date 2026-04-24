import { optionalString, parseVocabularyItems, requireString } from "./parsing";

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

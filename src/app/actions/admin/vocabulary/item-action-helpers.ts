import type {
  DbVocabularyAspect,
  DbVocabularyGender,
  DbVocabularyItemPriority,
  DbVocabularyItemSourceType,
  DbVocabularyItemType,
  DbVocabularyPartOfSpeech,
  DbVocabularyProductiveReceptive,
  DbVocabularyTier,
} from "@/lib/vocabulary/shared/types";
import { getTrimmedString } from "@/app/actions/shared/form-data";

export function getRequiredString(formData: FormData, key: string) {
  const value = getTrimmedString(formData, key);

  if (!value) {
    throw new Error(`${key} is required`);
  }

  return value;
}

export function getOptionalNonNegativeNumber(formData: FormData, key: string) {
  const raw = getTrimmedString(formData, key);

  if (!raw) return null;

  const value = Number(raw);

  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${key} must be a non-negative number`);
  }

  return value;
}

export function assertVocabularyItemType(value: string): DbVocabularyItemType {
  if (value === "word" || value === "phrase") {
    return value;
  }

  throw new Error("Invalid vocabulary item type");
}

export function assertVocabularyItemSourceType(
  value: string
): DbVocabularyItemSourceType {
  if (value === "spec_required" || value === "extended" || value === "custom") {
    return value;
  }

  throw new Error("Invalid vocabulary item source type");
}

export function assertVocabularyItemPriority(value: string): DbVocabularyItemPriority {
  if (value === "core" || value === "extension") {
    return value;
  }

  throw new Error("Invalid vocabulary item priority");
}

export function assertVocabularyPartOfSpeech(value: string): DbVocabularyPartOfSpeech {
  if (
    value === "noun" ||
    value === "verb" ||
    value === "adjective" ||
    value === "adverb" ||
    value === "pronoun" ||
    value === "preposition" ||
    value === "conjunction" ||
    value === "number" ||
    value === "phrase" ||
    value === "interjection" ||
    value === "other" ||
    value === "unknown"
  ) {
    return value;
  }

  throw new Error("Invalid part of speech");
}

export function assertVocabularyGender(value: string): DbVocabularyGender {
  if (
    value === "masculine" ||
    value === "feminine" ||
    value === "neuter" ||
    value === "plural_only" ||
    value === "common" ||
    value === "not_applicable" ||
    value === "unknown"
  ) {
    return value;
  }

  throw new Error("Invalid vocabulary gender");
}

export function assertVocabularyProductiveReceptive(
  value: string
): DbVocabularyProductiveReceptive {
  if (
    value === "productive" ||
    value === "receptive" ||
    value === "both" ||
    value === "unknown"
  ) {
    return value;
  }

  throw new Error("Invalid productive/receptive value");
}

export function assertVocabularyTier(value: string): DbVocabularyTier {
  if (
    value === "foundation" ||
    value === "higher" ||
    value === "both" ||
    value === "unknown"
  ) {
    return value;
  }

  throw new Error("Invalid vocabulary tier");
}

export function assertVocabularyAspect(value: string): DbVocabularyAspect {
  if (
    value === "perfective" ||
    value === "imperfective" ||
    value === "both" ||
    value === "not_applicable" ||
    value === "unknown"
  ) {
    return value;
  }

  throw new Error("Invalid vocabulary aspect");
}

export function buildItemsPath(vocabularySetId: string) {
  return `/admin/vocabulary/${vocabularySetId}/items`;
}

export function parseBulkVocabularyLines(rawInput: string) {
  return rawInput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const delimiter = line.includes("\t") ? "\t" : line.includes("|") ? "|" : ",";
      const [russian = "", english = ""] = line
        .split(delimiter)
        .map((part) => part.trim());

      return {
        russian,
        english,
      };
    })
    .filter((item) => item.russian && item.english);
}

import type {
  DbVocabularyItem,
  DbVocabularyTier,
} from "@/lib/vocabulary/vocabulary-helpers-db";

export function getVocabularyItemSourceTypeLabel(
  sourceType: DbVocabularyItem["source_type"]
) {
  switch (sourceType) {
    case "spec_required":
      return "Spec required";
    case "extended":
      return "Extended";
    case "custom":
      return "Custom";
    default:
      return sourceType;
  }
}

export function getVocabularyItemPriorityLabel(priority: DbVocabularyItem["priority"]) {
  switch (priority) {
    case "core":
      return "Core";
    case "extension":
      return "Extension";
    default:
      return priority;
  }
}

export function getVocabularyItemTypeLabel(itemType: DbVocabularyItem["item_type"]) {
  switch (itemType) {
    case "word":
      return "Word";
    case "phrase":
      return "Phrase";
    default:
      return itemType;
  }
}

export function getVocabularyPartOfSpeechLabel(
  partOfSpeech: DbVocabularyItem["part_of_speech"]
) {
  return partOfSpeech.replaceAll("_", " ");
}

export function getDefaultVocabularyItemTier(setTier: DbVocabularyTier) {
  return setTier === "foundation" || setTier === "higher" || setTier === "both"
    ? setTier
    : "unknown";
}

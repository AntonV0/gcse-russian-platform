import type {
  DbVocabularyDisplayVariant,
  DbVocabularyItem,
  DbVocabularyListMode,
  DbVocabularyProductiveReceptive,
  DbVocabularySetType,
  DbVocabularyTier,
} from "./types";

export function groupVocabularyItemsBySource(items: DbVocabularyItem[]) {
  return {
    specRequired: items.filter((item) => item.source_type === "spec_required"),
    extended: items.filter((item) => item.source_type === "extended"),
    custom: items.filter((item) => item.source_type === "custom"),
  };
}

export function getVocabularyListModeLabel(listMode: DbVocabularyListMode) {
  switch (listMode) {
    case "spec_only":
      return "Exam list";
    case "extended_only":
      return "Extra practice";
    case "spec_and_extended":
      return "Exam + extra";
    case "custom":
      return "Custom set";
    default:
      return listMode;
  }
}

export function getVocabularyTierLabel(tier: DbVocabularyTier) {
  switch (tier) {
    case "foundation":
      return "Foundation";
    case "higher":
      return "Higher";
    case "both":
      return "Both tiers";
    case "unknown":
      return "Unknown tier";
    default:
      return tier;
  }
}

export function getVocabularyProductiveReceptiveLabel(
  value: DbVocabularyProductiveReceptive
) {
  switch (value) {
    case "productive":
      return "Productive";
    case "receptive":
      return "Receptive";
    case "both":
      return "Productive + receptive";
    case "unknown":
      return "Unknown";
    default:
      return value;
  }
}

export function getVocabularySetTypeLabel(setType: DbVocabularySetType) {
  switch (setType) {
    case "specification":
      return "Specification";
    case "core":
      return "Core";
    case "theme":
      return "Theme";
    case "phrase_bank":
      return "Phrase bank";
    case "exam_prep":
      return "Exam prep";
    case "lesson_custom":
      return "Lesson custom";
    default:
      return setType;
  }
}

export function getVocabularyDisplayVariantLabel(
  displayVariant: DbVocabularyDisplayVariant
) {
  switch (displayVariant) {
    case "single_column":
      return "Single column";
    case "two_column":
      return "Two column";
    case "compact_cards":
      return "Compact cards";
    default:
      return displayVariant;
  }
}

export function getVocabularyThemeLabel(value: string | null) {
  if (!value) return "General";
  return value.replaceAll("_", " ").replaceAll("-", " ");
}

export function getVocabularyTopicLabel(value: string | null) {
  if (!value) return "Mixed";
  return value.replaceAll("_", " ").replaceAll("-", " ");
}

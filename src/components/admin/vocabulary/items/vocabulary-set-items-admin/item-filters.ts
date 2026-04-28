import type {
  DbVocabularyItem,
  DbVocabularyItemCoverage,
  DbVocabularyItemSourceType,
  DbVocabularyPartOfSpeech,
  DbVocabularyProductiveReceptive,
  DbVocabularyTier,
} from "@/lib/vocabulary/shared/types";
import type { VocabularyItemAdminFilters } from "./types";

export function getUniqueSortedValues(values: (string | null | undefined)[]) {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value)))
  ).sort((a, b) => a.localeCompare(b));
}

export function normalizePartOfSpeechFilter(
  value?: string
): DbVocabularyPartOfSpeech | "all" {
  const allowed = new Set([
    "noun",
    "verb",
    "adjective",
    "adverb",
    "pronoun",
    "preposition",
    "conjunction",
    "number",
    "phrase",
    "interjection",
    "other",
    "unknown",
  ]);

  return value && allowed.has(value) ? (value as DbVocabularyPartOfSpeech) : "all";
}

export function normalizeSourceTypeFilter(
  value?: string
): DbVocabularyItemSourceType | "all" {
  return value === "spec_required" || value === "extended" || value === "custom"
    ? value
    : "all";
}

export function normalizeTierFilter(value?: string): DbVocabularyTier | "all" {
  return value === "foundation" ||
    value === "higher" ||
    value === "both" ||
    value === "unknown"
    ? value
    : "all";
}

export function normalizeSkillUseFilter(
  value?: string
): DbVocabularyProductiveReceptive | "all" {
  return value === "productive" ||
    value === "receptive" ||
    value === "both" ||
    value === "unknown"
    ? value
    : "all";
}

export function normalizeCoverageFilter(value?: string) {
  if (
    value === "foundation" ||
    value === "higher" ||
    value === "volna" ||
    value === "custom" ||
    value === "unused"
  ) {
    return value;
  }

  return "all";
}

export function hasActiveVocabularyItemFilters(filters: VocabularyItemAdminFilters) {
  return (
    Boolean(filters.itemSearch?.trim()) ||
    normalizePartOfSpeechFilter(filters.partOfSpeech) !== "all" ||
    normalizeSourceTypeFilter(filters.sourceType) !== "all" ||
    normalizeTierFilter(filters.tier) !== "all" ||
    normalizeSkillUseFilter(filters.skillUse) !== "all" ||
    Boolean(filters.categoryKey?.trim()) ||
    normalizeCoverageFilter(filters.coverage) !== "all"
  );
}

export function filterVocabularyItems({
  items,
  itemCoverageById,
  filters,
}: {
  items: DbVocabularyItem[];
  itemCoverageById: Map<string, DbVocabularyItemCoverage>;
  filters: VocabularyItemAdminFilters;
}) {
  const search = filters.itemSearch?.trim().toLowerCase();
  const partOfSpeech = normalizePartOfSpeechFilter(filters.partOfSpeech);
  const sourceType = normalizeSourceTypeFilter(filters.sourceType);
  const tier = normalizeTierFilter(filters.tier);
  const skillUse = normalizeSkillUseFilter(filters.skillUse);
  const categoryKey = filters.categoryKey?.trim();
  const coverage = normalizeCoverageFilter(filters.coverage);

  return items.filter((item) => {
    if (search) {
      const haystack = [
        item.russian,
        item.english,
        item.transliteration,
        item.example_ru,
        item.example_en,
        item.notes,
        item.canonical_key,
        item.import_key,
        item.theme_key,
        item.topic_key,
        item.category_key,
        item.subcategory_key,
        item.source_section_ref,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(search)) return false;
    }

    if (partOfSpeech !== "all" && item.part_of_speech !== partOfSpeech) {
      return false;
    }

    if (sourceType !== "all" && item.source_type !== sourceType) {
      return false;
    }

    if (tier !== "all" && item.tier !== tier) {
      return false;
    }

    if (skillUse !== "all" && item.productive_receptive !== skillUse) {
      return false;
    }

    if (
      categoryKey &&
      item.category_key !== categoryKey &&
      item.subcategory_key !== categoryKey
    ) {
      return false;
    }

    const itemCoverage = itemCoverageById.get(item.id);

    if (coverage === "foundation" && !itemCoverage?.used_in_foundation) {
      return false;
    }

    if (coverage === "higher" && !itemCoverage?.used_in_higher) {
      return false;
    }

    if (coverage === "volna" && !itemCoverage?.used_in_volna) {
      return false;
    }

    if (coverage === "custom" && !itemCoverage?.used_in_custom_list) {
      return false;
    }

    if (
      coverage === "unused" &&
      (itemCoverage?.used_in_foundation ||
        itemCoverage?.used_in_higher ||
        itemCoverage?.used_in_volna ||
        itemCoverage?.used_in_custom_list)
    ) {
      return false;
    }

    return true;
  });
}

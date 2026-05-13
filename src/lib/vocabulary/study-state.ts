import type {
  DbVocabularyItem,
  DbVocabularyItemSourceType,
  DbVocabularyProductiveReceptive,
} from "@/lib/vocabulary/shared/types";

export type VocabularyStudyState = "new" | "needs_practice" | "mastered";

export type VocabularyStudyStateFilter = VocabularyStudyState | "all";

export type VocabularyStudySourceFilter = DbVocabularyItemSourceType | "all";

export type VocabularyStudySkillFilter = DbVocabularyProductiveReceptive | "all";

export type VocabularyStudyStateMap = Record<string, VocabularyStudyState>;

export type VocabularyStudyStateCounts = Record<VocabularyStudyState, number>;

const VOCABULARY_STUDY_STATES = new Set<VocabularyStudyState>([
  "new",
  "needs_practice",
  "mastered",
]);

export function normalizeVocabularyStudyState(
  value: unknown
): VocabularyStudyState | null {
  return typeof value === "string" &&
    VOCABULARY_STUDY_STATES.has(value as VocabularyStudyState)
    ? (value as VocabularyStudyState)
    : null;
}

export function getVocabularyStudyState(
  itemId: string,
  stateByItemId: VocabularyStudyStateMap
): VocabularyStudyState {
  return stateByItemId[itemId] ?? "new";
}

export function getVocabularyStudyStateCounts(
  itemIds: string[],
  stateByItemId: VocabularyStudyStateMap
): VocabularyStudyStateCounts {
  return itemIds.reduce<VocabularyStudyStateCounts>(
    (counts, itemId) => {
      counts[getVocabularyStudyState(itemId, stateByItemId)] += 1;
      return counts;
    },
    {
      new: 0,
      needs_practice: 0,
      mastered: 0,
    }
  );
}

function normalizeSearchValue(value: string) {
  return value.trim().toLocaleLowerCase();
}

function itemMatchesSearch(item: DbVocabularyItem, search: string) {
  const normalizedSearch = normalizeSearchValue(search);

  if (!normalizedSearch) return true;

  return [
    item.russian,
    item.english,
    item.transliteration,
    item.example_ru,
    item.example_en,
    item.notes,
  ]
    .filter(Boolean)
    .some((value) => String(value).toLocaleLowerCase().includes(normalizedSearch));
}

export function getVocabularyStudyItemMatchesFilters({
  item,
  search,
  stateFilter,
  sourceFilter,
  skillFilter,
  stateByItemId,
}: {
  item: DbVocabularyItem;
  search: string;
  stateFilter: VocabularyStudyStateFilter;
  sourceFilter: VocabularyStudySourceFilter;
  skillFilter: VocabularyStudySkillFilter;
  stateByItemId: VocabularyStudyStateMap;
}) {
  if (!itemMatchesSearch(item, search)) return false;

  if (
    stateFilter !== "all" &&
    getVocabularyStudyState(item.id, stateByItemId) !== stateFilter
  ) {
    return false;
  }

  if (sourceFilter !== "all" && item.source_type !== sourceFilter) {
    return false;
  }

  if (skillFilter !== "all" && item.productive_receptive !== skillFilter) {
    return false;
  }

  return true;
}

import { describe, expect, it } from "vitest";
import {
  getVocabularyStudyItemMatchesFilters,
  getVocabularyStudyState,
  getVocabularyStudyStateCounts,
  normalizeVocabularyStudyState,
  type VocabularyStudyStateMap,
} from "@/lib/vocabulary/study-state";
import type { DbVocabularyItem } from "@/lib/vocabulary/shared/types";

function vocabularyItem(overrides: Partial<DbVocabularyItem>): DbVocabularyItem {
  return {
    id: "item-1",
    vocabulary_set_id: "set-1",
    vocabulary_list_id: null,
    canonical_key: null,
    russian: "дом",
    english: "house",
    transliteration: "dom",
    example_ru: "Это мой дом.",
    example_en: "This is my house.",
    audio_path: null,
    notes: null,
    item_type: "word",
    source_type: "spec_required",
    priority: "core",
    part_of_speech: "noun",
    gender: "masculine",
    plural: null,
    productive_receptive: "both",
    tier: "foundation",
    theme_key: null,
    topic_key: null,
    category_key: null,
    subcategory_key: null,
    aspect: "not_applicable",
    case_governed: null,
    is_reflexive: false,
    source_key: null,
    source_version: null,
    source_section_ref: null,
    import_key: null,
    position: 1,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("vocabulary study state helpers", () => {
  it("normalizes only supported study states", () => {
    expect(normalizeVocabularyStudyState("new")).toBe("new");
    expect(normalizeVocabularyStudyState("needs_practice")).toBe("needs_practice");
    expect(normalizeVocabularyStudyState("mastered")).toBe("mastered");
    expect(normalizeVocabularyStudyState("unknown")).toBeNull();
    expect(normalizeVocabularyStudyState(null)).toBeNull();
  });

  it("treats missing item state as new", () => {
    expect(getVocabularyStudyState("item-1", {})).toBe("new");
    expect(getVocabularyStudyState("item-1", { "item-1": "mastered" })).toBe("mastered");
  });

  it("counts new, needs practice, and mastered items", () => {
    const states: VocabularyStudyStateMap = {
      "item-2": "needs_practice",
      "item-3": "mastered",
      "item-4": "mastered",
    };

    expect(
      getVocabularyStudyStateCounts(["item-1", "item-2", "item-3", "item-4"], states)
    ).toEqual({
      new: 1,
      needs_practice: 1,
      mastered: 2,
    });
  });

  it("matches search, source, skill, and state filters together", () => {
    const item = vocabularyItem({
      id: "item-1",
      english: "to travel by train",
      productive_receptive: "productive",
      source_type: "extended",
    });

    expect(
      getVocabularyStudyItemMatchesFilters({
        item,
        search: "TRAIN",
        stateFilter: "needs_practice",
        sourceFilter: "extended",
        skillFilter: "productive",
        stateByItemId: { "item-1": "needs_practice" },
      })
    ).toBe(true);

    expect(
      getVocabularyStudyItemMatchesFilters({
        item,
        search: "airport",
        stateFilter: "needs_practice",
        sourceFilter: "extended",
        skillFilter: "productive",
        stateByItemId: { "item-1": "needs_practice" },
      })
    ).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import {
  renderVocabularyMarkdownExport,
  type VocabularyExportInput,
} from "@/lib/vocabulary/exports";
import type {
  DbVocabularyItem,
  DbVocabularyList,
  DbVocabularySet,
} from "@/lib/vocabulary/shared/types";

const baseSet: DbVocabularySet = {
  id: "set-1",
  slug: "family-basics",
  title: "Family basics",
  description: "Core GCSE Russian family vocabulary.",
  theme_key: "identity_and_culture",
  topic_key: "identity_and_culture_family_and_relationships",
  tier: "both",
  list_mode: "spec_and_extended",
  set_type: "theme",
  default_display_variant: "two_column",
  is_published: true,
  is_trial_visible: false,
  requires_paid_access: true,
  available_in_volna: true,
  sort_order: 1,
  source_key: "aqa-gcse-russian",
  source_version: "2026-draft",
  import_key: "family-import",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-02T00:00:00.000Z",
};

const baseList: DbVocabularyList = {
  id: "list-1",
  vocabulary_set_id: "set-1",
  slug: "family-list",
  title: "Family list",
  description: null,
  theme_key: "identity_and_culture",
  topic_key: "identity_and_culture_family_and_relationships",
  category_key: "relations",
  subcategory_key: null,
  tier: "both",
  list_mode: "spec_only",
  default_display_variant: "two_column",
  is_published: true,
  sort_order: 1,
  source_key: "spec",
  source_version: null,
  source_section_ref: "Theme 1",
  import_key: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-02T00:00:00.000Z",
};

function createItem(overrides: Partial<DbVocabularyItem>): DbVocabularyItem {
  return {
    id: "item-1",
    vocabulary_set_id: "set-1",
    vocabulary_list_id: "list-1",
    canonical_key: "family_mum",
    russian: "мама",
    english: "mum",
    transliteration: "mama",
    example_ru: "Это моя мама.",
    example_en: "This is my mum.",
    audio_path: null,
    notes: "Check register in context.",
    item_type: "word",
    source_type: "spec_required",
    priority: "core",
    part_of_speech: "noun",
    gender: "feminine",
    plural: "мамы",
    productive_receptive: "both",
    tier: "foundation",
    theme_key: "identity_and_culture",
    topic_key: "identity_and_culture_family_and_relationships",
    category_key: "family",
    subcategory_key: null,
    aspect: "not_applicable",
    case_governed: null,
    is_reflexive: false,
    source_key: "spec",
    source_version: "2026-draft",
    source_section_ref: "1.1",
    import_key: "family-import",
    position: 2,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-02T00:00:00.000Z",
    ...overrides,
  };
}

function createVocabularyExportInput(
  overrides?: Partial<VocabularyExportInput>
): VocabularyExportInput {
  return {
    vocabularySet: baseSet,
    lists: [baseList],
    items: [
      createItem({ id: "item-2", russian: "брат", english: "brother", position: 1 }),
      createItem({ id: "item-1" }),
    ],
    ...overrides,
  };
}

describe("renderVocabularyMarkdownExport", () => {
  it("renders set metadata and a stable filename", () => {
    const exportResult = renderVocabularyMarkdownExport(createVocabularyExportInput());

    expect(exportResult.filename).toBe("family-basics-review.md");
    expect(exportResult.markdown).toContain("# Family basics");
    expect(exportResult.markdown).toContain("- Tier: Both tiers");
    expect(exportResult.markdown).toContain("- Topic: Relations, relationships");
    expect(exportResult.markdown).toContain("- Published: Yes");
    expect(exportResult.markdown).toContain("- Available in Volna: Yes");
    expect(exportResult.markdown).toContain("- Source key: aqa-gcse-russian");
    expect(exportResult.markdown).toContain("- Import key: family-import");
  });

  it("sorts lists and vocabulary items deterministically", () => {
    const exportResult = renderVocabularyMarkdownExport(
      createVocabularyExportInput({
        lists: [
          { ...baseList, id: "list-2", slug: "later", title: "Later", sort_order: 2 },
          baseList,
        ],
      })
    );

    const firstListIndex = exportResult.markdown.indexOf("## 1. Family list");
    const secondListIndex = exportResult.markdown.indexOf("## 2. Later");
    const brotherIndex = exportResult.markdown.indexOf("| 1 | брат | brother |");
    const mumIndex = exportResult.markdown.indexOf("| 2 | мама | mum |");

    expect(firstListIndex).toBeGreaterThan(-1);
    expect(secondListIndex).toBeGreaterThan(firstListIndex);
    expect(brotherIndex).toBeGreaterThan(firstListIndex);
    expect(mumIndex).toBeGreaterThan(brotherIndex);
  });

  it("renders examples, notes, useful metadata, and missing values", () => {
    const exportResult = renderVocabularyMarkdownExport(
      createVocabularyExportInput({
        items: [
          createItem({
            id: "item-3",
            russian: "учиться",
            english: "to study",
            transliteration: null,
            example_ru: null,
            example_en: null,
            notes: null,
            part_of_speech: "verb",
            aspect: "imperfective",
            case_governed: "dative",
            productive_receptive: "productive",
            position: 1,
          }),
        ],
      })
    );

    expect(exportResult.markdown).toContain("| 1 | учиться | to study | Not set |");
    expect(exportResult.markdown).toContain("Part of speech: verb");
    expect(exportResult.markdown).toContain("Aspect: imperfective");
    expect(exportResult.markdown).toContain("Case governed: dative");
    expect(exportResult.markdown).toContain("Use: Productive");
  });

  it("keeps direct or unmatched items visible when a set also has lists", () => {
    const exportResult = renderVocabularyMarkdownExport(
      createVocabularyExportInput({
        items: [
          createItem({
            id: "item-4",
            vocabulary_list_id: null,
            russian: "семья",
            english: "family",
            position: 1,
          }),
        ],
      })
    );

    expect(exportResult.markdown).toContain("## Unlisted Vocabulary Items");
    expect(exportResult.markdown).toContain("| 1 | семья | family |");
  });
});

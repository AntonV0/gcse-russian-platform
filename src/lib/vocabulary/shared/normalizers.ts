import type {
  DbVocabularyItem,
  DbVocabularyItemCoverage,
  DbVocabularySet,
  DbVocabularySetSummaryRow,
} from "@/lib/vocabulary/shared/types";

export function normalizeVocabularySet(row: unknown): DbVocabularySet {
  const record = row as Partial<DbVocabularySet>;

  return {
    id: String(record.id),
    slug: record.slug ?? null,
    title: String(record.title),
    description: record.description ?? null,
    theme_key: record.theme_key ?? null,
    topic_key: record.topic_key ?? null,
    tier: record.tier ?? "both",
    list_mode: record.list_mode ?? "custom",
    set_type: record.set_type ?? "lesson_custom",
    default_display_variant: record.default_display_variant ?? "single_column",
    is_published: Boolean(record.is_published),
    sort_order: Number(record.sort_order ?? 0),
    source_key: record.source_key ?? null,
    source_version: record.source_version ?? null,
    import_key: record.import_key ?? null,
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

export function normalizeVocabularyItem(row: unknown): DbVocabularyItem {
  const record = row as Partial<DbVocabularyItem>;

  return {
    id: String(record.id),
    vocabulary_set_id: String(record.vocabulary_set_id),
    vocabulary_list_id: record.vocabulary_list_id ?? null,
    canonical_key: record.canonical_key ?? null,
    russian: String(record.russian),
    english: String(record.english),
    transliteration: record.transliteration ?? null,
    example_ru: record.example_ru ?? null,
    example_en: record.example_en ?? null,
    audio_path: record.audio_path ?? null,
    notes: record.notes ?? null,
    item_type: record.item_type ?? "word",
    source_type: record.source_type ?? "custom",
    priority: record.priority ?? "core",
    part_of_speech: record.part_of_speech ?? "unknown",
    gender: record.gender ?? "unknown",
    plural: record.plural ?? null,
    productive_receptive: record.productive_receptive ?? "unknown",
    tier: record.tier ?? "unknown",
    theme_key: record.theme_key ?? null,
    topic_key: record.topic_key ?? null,
    category_key: record.category_key ?? null,
    subcategory_key: record.subcategory_key ?? null,
    aspect: record.aspect ?? "unknown",
    case_governed: record.case_governed ?? null,
    is_reflexive: Boolean(record.is_reflexive),
    source_key: record.source_key ?? null,
    source_version: record.source_version ?? null,
    source_section_ref: record.source_section_ref ?? null,
    import_key: record.import_key ?? null,
    position: Number(record.position ?? 0),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

export function normalizeVocabularyItemCoverage(row: unknown): DbVocabularyItemCoverage {
  const record = row as Partial<DbVocabularyItemCoverage>;

  return {
    vocabulary_item_id: String(record.vocabulary_item_id),
    used_in_foundation: Boolean(record.used_in_foundation),
    used_in_higher: Boolean(record.used_in_higher),
    used_in_volna: Boolean(record.used_in_volna),
    used_in_custom_list: Boolean(record.used_in_custom_list),
    foundation_occurrences: Number(record.foundation_occurrences ?? 0),
    higher_occurrences: Number(record.higher_occurrences ?? 0),
    volna_occurrences: Number(record.volna_occurrences ?? 0),
    custom_list_occurrences: Number(record.custom_list_occurrences ?? 0),
  };
}

export function normalizeVocabularySetSummaryRow(
  row: unknown
): DbVocabularySetSummaryRow {
  const record = row as Partial<DbVocabularySetSummaryRow>;

  return {
    vocabulary_set_id: String(record.vocabulary_set_id),
    item_count: Number(record.item_count ?? 0),
    list_count: Number(record.list_count ?? 0),
    total_occurrences: Number(record.total_occurrences ?? 0),
    foundation_occurrences: Number(record.foundation_occurrences ?? 0),
    higher_occurrences: Number(record.higher_occurrences ?? 0),
    volna_occurrences: Number(record.volna_occurrences ?? 0),
    foundation_total_items: Number(record.foundation_total_items ?? 0),
    higher_total_items: Number(record.higher_total_items ?? 0),
    volna_total_items: Number(record.volna_total_items ?? 0),
    custom_list_total_items: Number(record.custom_list_total_items ?? 0),
    foundation_used_items: Number(record.foundation_used_items ?? 0),
    higher_used_items: Number(record.higher_used_items ?? 0),
    volna_used_items: Number(record.volna_used_items ?? 0),
    custom_list_used_items: Number(record.custom_list_used_items ?? 0),
  };
}

export function slugifyVocabularyTitle(title: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "default-list";
}

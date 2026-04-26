import type { DbGrammarExample, DbGrammarPoint, DbGrammarSet, DbGrammarTable } from "@/lib/grammar/types";

export function normalizeGrammarSet(row: unknown): DbGrammarSet {
  const record = row as Partial<DbGrammarSet>;

  return {
    id: String(record.id),
    slug: String(record.slug),
    title: String(record.title),
    description: record.description ?? null,
    theme_key: record.theme_key ?? null,
    topic_key: record.topic_key ?? null,
    tier: record.tier ?? "both",
    sort_order: Number(record.sort_order ?? 0),
    is_published: Boolean(record.is_published),
    is_trial_visible: Boolean(record.is_trial_visible),
    requires_paid_access: Boolean(record.requires_paid_access),
    available_in_volna: Boolean(record.available_in_volna),
    source_key: record.source_key ?? null,
    source_version: record.source_version ?? null,
    import_key: record.import_key ?? null,
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

export function normalizeGrammarPoint(row: unknown): DbGrammarPoint {
  const record = row as Partial<DbGrammarPoint>;

  return {
    id: String(record.id),
    grammar_set_id: String(record.grammar_set_id),
    slug: String(record.slug),
    title: String(record.title),
    short_description: record.short_description ?? null,
    full_explanation: record.full_explanation ?? null,
    spec_reference: record.spec_reference ?? null,
    grammar_tag_key: record.grammar_tag_key ?? null,
    category_key: record.category_key ?? null,
    tier: record.tier ?? "both",
    sort_order: Number(record.sort_order ?? 0),
    is_published: Boolean(record.is_published),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

export function normalizeGrammarExample(row: unknown): DbGrammarExample {
  const record = row as Partial<DbGrammarExample>;

  return {
    id: String(record.id),
    grammar_point_id: String(record.grammar_point_id),
    russian_text: String(record.russian_text),
    english_translation: String(record.english_translation),
    optional_highlight: record.optional_highlight ?? null,
    note: record.note ?? null,
    sort_order: Number(record.sort_order ?? 0),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.map((item) => String(item));
}

function normalizeStringMatrix(value: unknown): string[][] {
  if (!Array.isArray(value)) return [];

  return value.map((row) => {
    if (!Array.isArray(row)) return [];
    return row.map((cell) => String(cell));
  });
}

export function normalizeGrammarTable(row: unknown): DbGrammarTable {
  const record = row as Partial<DbGrammarTable>;

  return {
    id: String(record.id),
    grammar_point_id: String(record.grammar_point_id),
    title: String(record.title),
    columns: normalizeStringArray(record.columns),
    rows: normalizeStringMatrix(record.rows),
    optional_note: record.optional_note ?? null,
    sort_order: Number(record.sort_order ?? 0),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}


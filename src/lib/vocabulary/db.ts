import { createClient } from "@/lib/supabase/server";

export type DbVocabularyTier = "foundation" | "higher" | "both" | "unknown";

export type DbVocabularyListMode =
  | "spec_only"
  | "extended_only"
  | "spec_and_extended"
  | "custom";

export type DbVocabularySetType =
  | "specification"
  | "core"
  | "theme"
  | "phrase_bank"
  | "exam_prep"
  | "lesson_custom";

export type DbVocabularyDisplayVariant = "single_column" | "two_column" | "compact_cards";

export type DbVocabularyItemType = "word" | "phrase";

export type DbVocabularyItemSourceType = "spec_required" | "extended" | "custom";

export type DbVocabularyItemPriority = "core" | "extension";

export type DbVocabularyPartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "preposition"
  | "conjunction"
  | "number"
  | "phrase"
  | "interjection"
  | "other"
  | "unknown";

export type DbVocabularyGender =
  | "masculine"
  | "feminine"
  | "neuter"
  | "plural_only"
  | "common"
  | "not_applicable"
  | "unknown";

export type DbVocabularyProductiveReceptive =
  | "productive"
  | "receptive"
  | "both"
  | "unknown";

export type DbVocabularyAspect =
  | "perfective"
  | "imperfective"
  | "both"
  | "not_applicable"
  | "unknown";

export type DbVocabularyUsageVariant = "foundation" | "higher" | "volna";

export type DbVocabularyCoverageVariant = DbVocabularyUsageVariant;

export type DbVocabularyStudyVariant = DbVocabularyUsageVariant;

export type DbVocabularyUsageType =
  | "lesson_block"
  | "lesson_page"
  | "revision_page"
  | "other";

export type DbVocabularySet = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  theme_key: string | null;
  topic_key: string | null;
  tier: DbVocabularyTier;
  list_mode: DbVocabularyListMode;
  set_type: DbVocabularySetType;
  default_display_variant: DbVocabularyDisplayVariant;
  is_published: boolean;
  sort_order: number;
  source_key: string | null;
  source_version: string | null;
  import_key: string | null;
  created_at: string;
  updated_at: string;
};

export type DbVocabularyList = {
  id: string;
  vocabulary_set_id: string;
  slug: string;
  title: string;
  description: string | null;
  theme_key: string | null;
  topic_key: string | null;
  category_key: string | null;
  subcategory_key: string | null;
  tier: DbVocabularyTier;
  list_mode: DbVocabularyListMode;
  default_display_variant: DbVocabularyDisplayVariant;
  is_published: boolean;
  sort_order: number;
  source_key: string | null;
  source_version: string | null;
  source_section_ref: string | null;
  import_key: string | null;
  created_at: string;
  updated_at: string;
};

export type DbVocabularyItem = {
  id: string;
  vocabulary_set_id: string;
  vocabulary_list_id?: string | null;
  canonical_key: string | null;
  russian: string;
  english: string;
  transliteration: string | null;
  example_ru: string | null;
  example_en: string | null;
  audio_path: string | null;
  notes: string | null;
  item_type: DbVocabularyItemType;
  source_type: DbVocabularyItemSourceType;
  priority: DbVocabularyItemPriority;
  part_of_speech: DbVocabularyPartOfSpeech;
  gender: DbVocabularyGender;
  plural: string | null;
  productive_receptive: DbVocabularyProductiveReceptive;
  tier: DbVocabularyTier;
  theme_key: string | null;
  topic_key: string | null;
  category_key: string | null;
  subcategory_key: string | null;
  aspect: DbVocabularyAspect;
  case_governed: string | null;
  is_reflexive: boolean;
  source_key: string | null;
  source_version: string | null;
  source_section_ref: string | null;
  import_key: string | null;
  position: number;
  created_at: string;
  updated_at: string;
};

export type DbVocabularyListItem = {
  id: string;
  vocabulary_list_id: string;
  vocabulary_item_id: string;
  position: number;
  productive_receptive_override: DbVocabularyProductiveReceptive | null;
  tier_override: DbVocabularyTier | null;
  notes_override: string | null;
  source_section_ref: string | null;
  import_key: string | null;
  created_at: string;
};

export type DbVocabularyItemCoverage = {
  vocabulary_item_id: string;
  used_in_foundation: boolean;
  used_in_higher: boolean;
  used_in_volna: boolean;
  used_in_custom_list: boolean;
  foundation_occurrences: number;
  higher_occurrences: number;
  volna_occurrences: number;
  custom_list_occurrences: number;
};

export type DbLessonVocabularySetUsage = {
  id: string;
  lesson_id: string;
  vocabulary_set_id: string;
  variant: DbVocabularyUsageVariant;
  usage_type: DbVocabularyUsageType;
  created_at: string;
};

export type LoadedVocabularySetDb = {
  vocabularySet: DbVocabularySet | null;
  vocabularyList: DbVocabularyList | null;
  lists: DbVocabularyList[];
  items: DbVocabularyItem[];
};

export type DbVocabularySetUsageStats = {
  totalOccurrences: number;
  foundationOccurrences: number;
  higherOccurrences: number;
  volnaOccurrences: number;
  usedInFoundation: boolean;
  usedInHigher: boolean;
  usedInVolna: boolean;
};

export type DbVocabularySetCoverageSummary = {
  totalItems: number;
  foundationTotalItems: number;
  higherTotalItems: number;
  volnaTotalItems: number;
  customListTotalItems: number;
  foundationUsedItems: number;
  higherUsedItems: number;
  volnaUsedItems: number;
  customListUsedItems: number;
};

export type DbVocabularySetListItem = DbVocabularySet & {
  item_count: number;
  list_count: number;
  usage_stats: DbVocabularySetUsageStats;
  coverage_summary: DbVocabularySetCoverageSummary;
};

export type DbVocabularySetOption = Pick<
  DbVocabularySet,
  "id" | "title" | "slug" | "is_published" | "tier" | "list_mode" | "sort_order"
>;

export type LoadedVocabularySetDetailDb = {
  vocabularySet: DbVocabularySet | null;
  vocabularyList: DbVocabularyList | null;
  lists: DbVocabularyList[];
  items: DbVocabularyItem[];
  usageStats: DbVocabularySetUsageStats;
};

export type VocabularySetLoadOptions = {
  scopeVariant?: DbVocabularyStudyVariant | "all" | null;
};

export type VocabularySetFilters = {
  search?: string | null;
  tier?: DbVocabularyTier | "all" | null;
  themeKey?: string | null;
  listMode?: DbVocabularyListMode | "all" | null;
  published?: "all" | "published" | "draft" | null;
};

const SUPABASE_PAGE_SIZE = 1000;
const SUPABASE_IN_BATCH_SIZE = 100;

type SupabasePagedQuery<T> = {
  range: (
    from: number,
    to: number
  ) => PromiseLike<{
    data: T[] | null;
    error: unknown;
  }>;
};

async function fetchSupabasePages<T>({
  queryFactory,
  errorMessage,
  errorContext,
}: {
  queryFactory: () => SupabasePagedQuery<T>;
  errorMessage: string;
  errorContext: Record<string, unknown>;
}) {
  const rows: T[] = [];

  for (let from = 0; ; from += SUPABASE_PAGE_SIZE) {
    const to = from + SUPABASE_PAGE_SIZE - 1;
    const { data, error } = await queryFactory().range(from, to);

    if (error) {
      console.error(errorMessage, {
        ...errorContext,
        error,
      });
      return [] as T[];
    }

    const pageRows = data ?? [];
    rows.push(...pageRows);

    if (pageRows.length < SUPABASE_PAGE_SIZE) {
      return rows;
    }
  }
}

function chunkValues<T>(values: T[], batchSize = SUPABASE_IN_BATCH_SIZE) {
  const chunks: T[][] = [];

  for (let start = 0; start < values.length; start += batchSize) {
    chunks.push(values.slice(start, start + batchSize));
  }

  return chunks;
}

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

export function getRequiredVocabularyCoverageVariants(tier: DbVocabularyTier) {
  if (tier === "foundation") {
    return ["foundation", "higher", "volna"] as const;
  }

  if (tier === "higher") {
    return ["higher", "volna"] as const;
  }

  return ["foundation", "higher", "volna"] as const;
}

export function getVocabularyListAppliesToStudyVariant(
  listTier: DbVocabularyTier,
  studyVariant: DbVocabularyStudyVariant
) {
  if (listTier === "both" || listTier === "unknown") {
    return true;
  }

  if (studyVariant === "foundation") {
    return listTier === "foundation";
  }

  return listTier === "foundation" || listTier === "higher";
}

export function getVocabularyItemAppliesToStudyVariant(
  itemTier: DbVocabularyTier,
  studyVariant: DbVocabularyStudyVariant
) {
  if (itemTier === "both" || itemTier === "unknown") {
    return true;
  }

  if (studyVariant === "foundation") {
    return itemTier === "foundation";
  }

  return itemTier === "foundation" || itemTier === "higher";
}

function filterVocabularyListsForStudyVariant(
  lists: DbVocabularyList[],
  studyVariant?: DbVocabularyStudyVariant | "all" | null
) {
  if (!studyVariant || studyVariant === "all") {
    return lists;
  }

  return lists.filter((list) =>
    getVocabularyListAppliesToStudyVariant(list.tier, studyVariant)
  );
}

function getCoverageTotalItemIdsForVariant(params: {
  lists: DbVocabularyList[];
  listItems: Pick<DbVocabularyListItem, "vocabulary_list_id" | "vocabulary_item_id">[];
  fallbackItems: Pick<DbVocabularyItem, "id" | "tier">[];
  variant: DbVocabularyCoverageVariant;
}) {
  const fallbackItemIds = new Set(
    params.fallbackItems
      .filter((item) => getVocabularyItemAppliesToStudyVariant(item.tier, params.variant))
      .map((item) => item.id)
  );

  if (params.lists.length === 0 || params.listItems.length === 0) {
    return fallbackItemIds;
  }

  const listIds = new Set(
    params.lists
      .filter((list) => getVocabularyListAppliesToStudyVariant(list.tier, params.variant))
      .map((list) => list.id)
  );
  const listItemIds = params.listItems
    .filter((listItem) => listIds.has(listItem.vocabulary_list_id))
    .map((listItem) => listItem.vocabulary_item_id);

  return new Set([...fallbackItemIds, ...listItemIds]);
}

export function getVocabularyCoverageVariantLabel(
  variant: DbVocabularyCoverageVariant
) {
  switch (variant) {
    case "foundation":
      return "Foundation";
    case "higher":
      return "Higher";
    case "volna":
      return "Volna";
    default:
      return variant;
  }
}

export function getVocabularyCoverageVariantCount(
  coverage: DbVocabularyItemCoverage | null,
  variant: DbVocabularyCoverageVariant
) {
  if (!coverage) return 0;

  switch (variant) {
    case "foundation":
      return coverage.foundation_occurrences;
    case "higher":
      return coverage.higher_occurrences;
    case "volna":
      return coverage.volna_occurrences;
    default:
      return 0;
  }
}

export function getVocabularyCoverageVariantUsed(
  coverage: DbVocabularyItemCoverage | null,
  variant: DbVocabularyCoverageVariant
) {
  return getVocabularyCoverageVariantCount(coverage, variant) > 0;
}

export function buildVocabularyUsageStats(
  usages: Pick<DbLessonVocabularySetUsage, "variant">[]
): DbVocabularySetUsageStats {
  let foundationOccurrences = 0;
  let higherOccurrences = 0;
  let volnaOccurrences = 0;

  for (const usage of usages) {
    switch (usage.variant) {
      case "foundation":
        foundationOccurrences += 1;
        break;
      case "higher":
        higherOccurrences += 1;
        break;
      case "volna":
        volnaOccurrences += 1;
        break;
      default:
        break;
    }
  }

  const totalOccurrences = foundationOccurrences + higherOccurrences + volnaOccurrences;

  return {
    totalOccurrences,
    foundationOccurrences,
    higherOccurrences,
    volnaOccurrences,
    usedInFoundation: foundationOccurrences > 0,
    usedInHigher: higherOccurrences > 0,
    usedInVolna: volnaOccurrences > 0,
  };
}

function normalizeVocabularySet(row: unknown): DbVocabularySet {
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

function normalizeVocabularyItem(row: unknown): DbVocabularyItem {
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

function normalizeVocabularyItemCoverage(row: unknown): DbVocabularyItemCoverage {
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

function slugifyVocabularyTitle(title: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "default-list";
}

export async function getVocabularySetByIdDb(vocabularySetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_sets")
    .select("*")
    .eq("id", vocabularySetId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching vocabulary set by id:", {
      vocabularySetId,
      error,
    });
    return null;
  }

  return data ? normalizeVocabularySet(data) : null;
}

export async function getVocabularySetBySlugDb(vocabularySetSlug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_sets")
    .select("*")
    .eq("slug", vocabularySetSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching vocabulary set by slug:", {
      vocabularySetSlug,
      error,
    });
    return null;
  }

  return data ? normalizeVocabularySet(data) : null;
}

export async function getVocabularySetByRefDb(vocabularySetRef: string) {
  const bySlug = await getVocabularySetBySlugDb(vocabularySetRef);

  if (bySlug) {
    return bySlug;
  }

  return getVocabularySetByIdDb(vocabularySetRef);
}

export async function getVocabularyListsBySetIdDb(vocabularySetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_lists")
    .select("*")
    .eq("vocabulary_set_id", vocabularySetId)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching vocabulary lists by set id:", {
      vocabularySetId,
      error,
    });
    return [];
  }

  return (data ?? []) as DbVocabularyList[];
}

export async function getVocabularyListByIdDb(vocabularyListId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_lists")
    .select("*")
    .eq("id", vocabularyListId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching vocabulary list by id:", {
      vocabularyListId,
      error,
    });
    return null;
  }

  return (data as DbVocabularyList | null) ?? null;
}

export async function getDefaultVocabularyListBySetIdDb(vocabularySetId: string) {
  const lists = await getVocabularyListsBySetIdDb(vocabularySetId);
  return lists[0] ?? null;
}

export async function ensureDefaultVocabularyListForSetDb(vocabularySet: DbVocabularySet) {
  const existing = await getDefaultVocabularyListBySetIdDb(vocabularySet.id);

  if (existing) {
    return existing;
  }

  const supabase = await createClient();
  const slug = vocabularySet.slug?.trim() || slugifyVocabularyTitle(vocabularySet.title);

  const { data, error } = await supabase
    .from("vocabulary_lists")
    .insert({
      vocabulary_set_id: vocabularySet.id,
      slug,
      title: vocabularySet.title,
      description: vocabularySet.description,
      theme_key: vocabularySet.theme_key,
      topic_key: vocabularySet.topic_key,
      tier: vocabularySet.tier,
      list_mode: vocabularySet.list_mode,
      default_display_variant: vocabularySet.default_display_variant,
      is_published: vocabularySet.is_published,
      sort_order: 0,
      source_key: vocabularySet.source_key,
      source_version: vocabularySet.source_version,
      import_key: vocabularySet.import_key
        ? `${vocabularySet.import_key}:default-list`
        : null,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error creating default vocabulary list:", {
      vocabularySetId: vocabularySet.id,
      error,
    });
    throw new Error("Failed to create default vocabulary list");
  }

  return data as DbVocabularyList;
}

export async function getVocabularyItemsByListIdDb(vocabularyListId: string) {
  const items = await getVocabularyItemsByListIdsDb([vocabularyListId]);
  return items;
}

export async function getVocabularyItemsByListIdsDb(vocabularyListIds: string[]) {
  const uniqueVocabularyListIds = Array.from(new Set(vocabularyListIds));

  if (uniqueVocabularyListIds.length === 0) {
    return [];
  }

  const supabase = await createClient();
  const rows = (
    await Promise.all(
      chunkValues(uniqueVocabularyListIds).map((listIdBatch) =>
        fetchSupabasePages<{
          position?: number;
          vocabulary_list_id?: string;
          vocabulary_items?: Record<string, unknown> | Record<string, unknown>[] | null;
        }>({
          queryFactory: () =>
            supabase
              .from("vocabulary_list_items")
              .select("position, vocabulary_list_id, vocabulary_items(*)")
              .in("vocabulary_list_id", listIdBatch)
              .order("position", { ascending: true }),
          errorMessage: "Error fetching vocabulary items by list ids:",
          errorContext: { vocabularyListIds: listIdBatch },
        })
      )
    )
  ).flat();

  return rows
    .map((row) => {
      const joinedItem = Array.isArray(row.vocabulary_items)
        ? row.vocabulary_items[0]
        : row.vocabulary_items;

      if (!joinedItem) return null;

      return normalizeVocabularyItem({
        ...joinedItem,
        vocabulary_list_id: row.vocabulary_list_id ?? null,
        position: row.position ?? 0,
      });
    })
    .filter((item): item is DbVocabularyItem => Boolean(item));
}

async function getVocabularyItemsDirectBySetIdDb(vocabularySetId: string) {
  const supabase = await createClient();
  const data = await fetchSupabasePages<Record<string, unknown>>({
    queryFactory: () =>
      supabase
        .from("vocabulary_items")
        .select("*")
        .eq("vocabulary_set_id", vocabularySetId)
        .order("position", { ascending: true }),
    errorMessage: "Error fetching legacy vocabulary items by set id:",
    errorContext: { vocabularySetId },
  });

  return data.map(normalizeVocabularyItem);
}

export async function getVocabularyItemsBySetIdDb(
  vocabularySetId: string,
  options?: VocabularySetLoadOptions
) {
  const lists = await getVocabularyListsBySetIdDb(vocabularySetId);
  const scopedLists = filterVocabularyListsForStudyVariant(
    lists,
    options?.scopeVariant
  );

  if (scopedLists.length > 0) {
    const listItems = await getVocabularyItemsByListIdsDb(
      scopedLists.map((list) => list.id)
    );
    const fallbackItems = await getVocabularyItemsDirectBySetIdDb(vocabularySetId);
    const scopeVariant = options?.scopeVariant;
    const scopedFallbackItems =
      !scopeVariant || scopeVariant === "all"
        ? fallbackItems
        : fallbackItems.filter((item) =>
            getVocabularyItemAppliesToStudyVariant(item.tier, scopeVariant)
          );

    if (listItems.length >= scopedFallbackItems.length) {
      return listItems;
    }

    return scopedFallbackItems;
  }

  if (lists.length > 0) {
    const fallbackItems = await getVocabularyItemsDirectBySetIdDb(vocabularySetId);
    const scopeVariant = options?.scopeVariant;

    if (!scopeVariant || scopeVariant === "all") {
      return fallbackItems;
    }

    return fallbackItems.filter((item) =>
      getVocabularyItemAppliesToStudyVariant(item.tier, scopeVariant)
    );
  }

  const items = await getVocabularyItemsDirectBySetIdDb(vocabularySetId);
  const scopeVariant = options?.scopeVariant;

  if (!scopeVariant || scopeVariant === "all") {
    return items;
  }

  return items.filter((item) =>
    getVocabularyItemAppliesToStudyVariant(item.tier, scopeVariant)
  );
}

export async function getVocabularyItemCoverageByItemIdsDb(vocabularyItemIds: string[]) {
  const uniqueVocabularyItemIds = Array.from(new Set(vocabularyItemIds));

  if (uniqueVocabularyItemIds.length === 0) {
    return new Map<string, DbVocabularyItemCoverage>();
  }

  const supabase = await createClient();
  const coverageRows: unknown[] = [];
  const batchSize = 400;

  for (let start = 0; start < uniqueVocabularyItemIds.length; start += batchSize) {
    const batchIds = uniqueVocabularyItemIds.slice(start, start + batchSize);
    const { data, error } = await supabase
      .from("vocabulary_item_coverage")
      .select("*")
      .in("vocabulary_item_id", batchIds);

    if (error) {
      console.error("Error fetching vocabulary item coverage:", {
        vocabularyItemIds: batchIds,
        error,
      });
      return new Map<string, DbVocabularyItemCoverage>();
    }

    coverageRows.push(...(data ?? []));
  }

  return new Map(
    coverageRows.map((row) => {
      const coverage = normalizeVocabularyItemCoverage(row);
      return [coverage.vocabulary_item_id, coverage];
    })
  );
}

export async function getVocabularySetCoverageSummaryBySetIdDb(vocabularySetId: string) {
  const [lists, items] = await Promise.all([
    getVocabularyListsBySetIdDb(vocabularySetId),
    getVocabularyItemsBySetIdDb(vocabularySetId, { scopeVariant: "all" }),
  ]);
  const uniqueItems = Array.from(
    new Map(items.map((item) => [item.id, item])).values()
  );
  const listItems = items
    .filter((item) => item.vocabulary_list_id)
    .map((item) => ({
      vocabulary_list_id: item.vocabulary_list_id as string,
      vocabulary_item_id: item.id,
    }));
  const itemCoverageById = await getVocabularyItemCoverageByItemIdsDb(
    uniqueItems.map((item) => item.id)
  );

  return buildVocabularySetCoverageSummary({
    lists,
    listItems,
    items: uniqueItems,
    itemCoverageById,
  });
}

function createEmptyCoverageSummary(): DbVocabularySetCoverageSummary {
  return {
    totalItems: 0,
    foundationTotalItems: 0,
    higherTotalItems: 0,
    volnaTotalItems: 0,
    customListTotalItems: 0,
    foundationUsedItems: 0,
    higherUsedItems: 0,
    volnaUsedItems: 0,
    customListUsedItems: 0,
  };
}

function buildVocabularySetCoverageSummary(params: {
  lists: DbVocabularyList[];
  listItems: Pick<DbVocabularyListItem, "vocabulary_list_id" | "vocabulary_item_id">[];
  items: Pick<DbVocabularyItem, "id" | "tier">[];
  itemCoverageById: Map<string, DbVocabularyItemCoverage>;
}): DbVocabularySetCoverageSummary {
  const uniqueItems = Array.from(
    new Map(params.items.map((item) => [item.id, item])).values()
  );
  const foundationItemIds = getCoverageTotalItemIdsForVariant({
    lists: params.lists,
    listItems: params.listItems,
    fallbackItems: uniqueItems,
    variant: "foundation",
  });
  const higherItemIds = getCoverageTotalItemIdsForVariant({
    lists: params.lists,
    listItems: params.listItems,
    fallbackItems: uniqueItems,
    variant: "higher",
  });
  const volnaItemIds = getCoverageTotalItemIdsForVariant({
    lists: params.lists,
    listItems: params.listItems,
    fallbackItems: uniqueItems,
    variant: "volna",
  });

  return {
    totalItems: uniqueItems.length,
    foundationTotalItems: foundationItemIds.size,
    higherTotalItems: higherItemIds.size,
    volnaTotalItems: volnaItemIds.size,
    customListTotalItems: uniqueItems.length,
    foundationUsedItems: Array.from(foundationItemIds).filter(
      (itemId) => params.itemCoverageById.get(itemId)?.used_in_foundation
    ).length,
    higherUsedItems: Array.from(higherItemIds).filter(
      (itemId) => params.itemCoverageById.get(itemId)?.used_in_higher
    ).length,
    volnaUsedItems: Array.from(volnaItemIds).filter(
      (itemId) => params.itemCoverageById.get(itemId)?.used_in_volna
    ).length,
    customListUsedItems: uniqueItems.filter(
      (item) => params.itemCoverageById.get(item.id)?.used_in_custom_list
    ).length,
  };
}

async function getVocabularyListItemsByListIdsDb(vocabularyListIds: string[]) {
  const uniqueVocabularyListIds = Array.from(new Set(vocabularyListIds));

  if (uniqueVocabularyListIds.length === 0) {
    return [] as Pick<
      DbVocabularyListItem,
      "vocabulary_list_id" | "vocabulary_item_id" | "position"
    >[];
  }

  const supabase = await createClient();
  const rows = (
    await Promise.all(
      chunkValues(uniqueVocabularyListIds).map((listIdBatch) =>
        fetchSupabasePages<
          Pick<DbVocabularyListItem, "vocabulary_list_id" | "vocabulary_item_id" | "position">
        >({
          queryFactory: () =>
            supabase
              .from("vocabulary_list_items")
              .select("vocabulary_list_id, vocabulary_item_id, position")
              .in("vocabulary_list_id", listIdBatch),
          errorMessage: "Error fetching vocabulary list items by list ids:",
          errorContext: { vocabularyListIds: listIdBatch },
        })
      )
    )
  ).flat();

  return rows as Pick<
    DbVocabularyListItem,
    "vocabulary_list_id" | "vocabulary_item_id" | "position"
  >[];
}

async function getVocabularyItemsBySetIdsDb(vocabularySetIds: string[]) {
  const uniqueVocabularySetIds = Array.from(new Set(vocabularySetIds));

  if (uniqueVocabularySetIds.length === 0) {
    return [] as DbVocabularyItem[];
  }

  const supabase = await createClient();
  const data = (
    await Promise.all(
      chunkValues(uniqueVocabularySetIds).map((setIdBatch) =>
        fetchSupabasePages<Record<string, unknown>>({
          queryFactory: () =>
            supabase
              .from("vocabulary_items")
              .select("*")
              .in("vocabulary_set_id", setIdBatch),
          errorMessage: "Error fetching vocabulary items by set ids:",
          errorContext: { vocabularySetIds: setIdBatch },
        })
      )
    )
  ).flat();

  return data.map(normalizeVocabularyItem);
}

export async function getVocabularyItemCountBySetIdDb(vocabularySetId: string) {
  const lists = await getVocabularyListsBySetIdDb(vocabularySetId);

  if (lists.length > 0) {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("vocabulary_list_items")
      .select("id", { count: "exact", head: true })
      .in(
        "vocabulary_list_id",
        lists.map((list) => list.id)
      );

    if (error) {
      console.error("Error counting vocabulary list items by set id:", {
        vocabularySetId,
        error,
      });
      return 0;
    }

    return count ?? 0;
  }

  const supabase = await createClient();

  const { count, error } = await supabase
    .from("vocabulary_items")
    .select("id", { count: "exact", head: true })
    .eq("vocabulary_set_id", vocabularySetId);

  if (error) {
    console.error("Error counting legacy vocabulary items by set id:", {
      vocabularySetId,
      error,
    });
    return 0;
  }

  return count ?? 0;
}

export async function getVocabularyListCountBySetIdDb(vocabularySetId: string) {
  const lists = await getVocabularyListsBySetIdDb(vocabularySetId);
  return lists.length;
}

export async function getVocabularySetUsagesBySetIdDb(vocabularySetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_vocabulary_set_usages")
    .select("*")
    .eq("vocabulary_set_id", vocabularySetId);

  if (error) {
    console.error("Error fetching vocabulary set usages by set id:", {
      vocabularySetId,
      error,
    });
    return [];
  }

  return (data ?? []) as DbLessonVocabularySetUsage[];
}

export async function getVocabularySetUsageStatsBySetIdDb(
  vocabularySetId: string
): Promise<DbVocabularySetUsageStats> {
  const usages = await getVocabularySetUsagesBySetIdDb(vocabularySetId);
  return buildVocabularyUsageStats(usages);
}

export async function loadVocabularySetByIdDb(
  vocabularySetId: string,
  options?: VocabularySetLoadOptions
): Promise<LoadedVocabularySetDetailDb> {
  const vocabularySet = await getVocabularySetByIdDb(vocabularySetId);

  if (!vocabularySet) {
    return {
      vocabularySet: null,
      vocabularyList: null,
      lists: [],
      items: [],
      usageStats: {
        totalOccurrences: 0,
        foundationOccurrences: 0,
        higherOccurrences: 0,
        volnaOccurrences: 0,
        usedInFoundation: false,
        usedInHigher: false,
        usedInVolna: false,
      },
    };
  }

  const lists = await getVocabularyListsBySetIdDb(vocabularySet.id);
  const vocabularyList = lists[0] ?? null;
  const [items, usageStats] = await Promise.all([
    getVocabularyItemsBySetIdDb(vocabularySet.id, options),
    getVocabularySetUsageStatsBySetIdDb(vocabularySet.id),
  ]);

  return {
    vocabularySet,
    vocabularyList,
    lists,
    items,
    usageStats,
  };
}

export async function loadVocabularySetBySlugDb(
  vocabularySetSlug: string,
  options?: VocabularySetLoadOptions
): Promise<LoadedVocabularySetDb> {
  const vocabularySet = await getVocabularySetBySlugDb(vocabularySetSlug);

  if (!vocabularySet) {
    return {
      vocabularySet: null,
      vocabularyList: null,
      lists: [],
      items: [],
    };
  }

  const lists = await getVocabularyListsBySetIdDb(vocabularySet.id);
  const items = await getVocabularyItemsBySetIdDb(vocabularySet.id, options);

  return {
    vocabularySet,
    vocabularyList: lists[0] ?? null,
    lists,
    items,
  };
}

export async function loadVocabularySetByRefDb(
  vocabularySetRef: string,
  options?: VocabularySetLoadOptions
): Promise<LoadedVocabularySetDb> {
  const vocabularySet = await getVocabularySetByRefDb(vocabularySetRef);

  if (!vocabularySet) {
    return {
      vocabularySet: null,
      vocabularyList: null,
      lists: [],
      items: [],
    };
  }

  const lists = await getVocabularyListsBySetIdDb(vocabularySet.id);
  const items = await getVocabularyItemsBySetIdDb(vocabularySet.id, options);

  return {
    vocabularySet,
    vocabularyList: lists[0] ?? null,
    lists,
    items,
  };
}

async function attachVocabularyCountsAndUsage(
  vocabularySets: DbVocabularySet[]
): Promise<DbVocabularySetListItem[]> {
  if (vocabularySets.length === 0) {
    return [];
  }

  const supabase = await createClient();
  const vocabularySetIds = vocabularySets.map((vocabularySet) => vocabularySet.id);

  const [listRows, usageRows, setItems] = await Promise.all([
    Promise.all(
      chunkValues(vocabularySetIds).map((setIdBatch) =>
        fetchSupabasePages<DbVocabularyList>({
          queryFactory: () =>
            supabase
              .from("vocabulary_lists")
              .select("*")
              .in("vocabulary_set_id", setIdBatch),
          errorMessage: "Error fetching vocabulary lists for set summaries:",
          errorContext: { vocabularySetIds: setIdBatch },
        })
      )
    ).then((rows) => rows.flat()),
    Promise.all(
      chunkValues(vocabularySetIds).map((setIdBatch) =>
        fetchSupabasePages<DbLessonVocabularySetUsage>({
          queryFactory: () =>
            supabase
              .from("lesson_vocabulary_set_usages")
              .select("*")
              .in("vocabulary_set_id", setIdBatch),
          errorMessage: "Error fetching vocabulary usages for set summaries:",
          errorContext: { vocabularySetIds: setIdBatch },
        })
      )
    ).then((rows) => rows.flat()),
    getVocabularyItemsBySetIdsDb(vocabularySetIds),
  ]);

  const lists = listRows.sort(
    (a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title)
  );
  const listItems = await getVocabularyListItemsByListIdsDb(
    lists.map((list) => list.id)
  );
  const itemCoverageById = await getVocabularyItemCoverageByItemIdsDb(
    setItems.map((item) => item.id)
  );

  const listsBySetId = new Map<string, DbVocabularyList[]>();
  const itemsBySetId = new Map<string, DbVocabularyItem[]>();
  const listItemsBySetId = new Map<
    string,
    Pick<DbVocabularyListItem, "vocabulary_list_id" | "vocabulary_item_id">[]
  >();
  const usagesBySetId = new Map<string, DbLessonVocabularySetUsage[]>();
  const setIdByListId = new Map(lists.map((list) => [list.id, list.vocabulary_set_id]));

  for (const list of lists) {
    const nextLists = listsBySetId.get(list.vocabulary_set_id) ?? [];
    nextLists.push(list);
    listsBySetId.set(list.vocabulary_set_id, nextLists);
  }

  for (const item of setItems) {
    const nextItems = itemsBySetId.get(item.vocabulary_set_id) ?? [];
    nextItems.push(item);
    itemsBySetId.set(item.vocabulary_set_id, nextItems);
  }

  for (const listItem of listItems) {
    const vocabularySetId = setIdByListId.get(listItem.vocabulary_list_id);
    if (!vocabularySetId) continue;

    const nextListItems = listItemsBySetId.get(vocabularySetId) ?? [];
    nextListItems.push(listItem);
    listItemsBySetId.set(vocabularySetId, nextListItems);
  }

  for (const usage of usageRows) {
    const nextUsages = usagesBySetId.get(usage.vocabulary_set_id) ?? [];
    nextUsages.push(usage);
    usagesBySetId.set(usage.vocabulary_set_id, nextUsages);
  }

  return vocabularySets.map((vocabularySet) => {
    const setLists = listsBySetId.get(vocabularySet.id) ?? [];
    const setItemsForSummary = itemsBySetId.get(vocabularySet.id) ?? [];
    const setListItems = listItemsBySetId.get(vocabularySet.id) ?? [];
    const uniqueItemCount = Math.max(
      setItemsForSummary.length,
      new Set(setListItems.map((listItem) => listItem.vocabulary_item_id)).size
    );

    return {
      ...vocabularySet,
      item_count: uniqueItemCount,
      list_count: setLists.length,
      usage_stats: buildVocabularyUsageStats(usagesBySetId.get(vocabularySet.id) ?? []),
      coverage_summary:
        setItemsForSummary.length > 0
          ? buildVocabularySetCoverageSummary({
              lists: setLists,
              listItems: setListItems,
              items: setItemsForSummary,
              itemCoverageById,
            })
          : createEmptyCoverageSummary(),
    };
  });
}

function applyVocabularySetFilters(
  vocabularySets: DbVocabularySetListItem[],
  filters?: VocabularySetFilters
) {
  const search = filters?.search?.trim().toLowerCase();
  const tier = filters?.tier && filters.tier !== "all" ? filters.tier : null;
  const themeKey = filters?.themeKey?.trim();
  const listMode = filters?.listMode && filters.listMode !== "all" ? filters.listMode : null;
  const published = filters?.published ?? "all";

  return vocabularySets.filter((vocabularySet) => {
    if (search) {
      const haystack = [
        vocabularySet.title,
        vocabularySet.description,
        vocabularySet.slug,
        vocabularySet.theme_key,
        vocabularySet.topic_key,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(search)) return false;
    }

    if (tier && vocabularySet.tier !== tier && vocabularySet.tier !== "both") {
      return false;
    }

    if (themeKey && vocabularySet.theme_key !== themeKey) {
      return false;
    }

    if (listMode && vocabularySet.list_mode !== listMode) {
      return false;
    }

    if (published === "published" && !vocabularySet.is_published) {
      return false;
    }

    if (published === "draft" && vocabularySet.is_published) {
      return false;
    }

    return true;
  });
}

export async function getVocabularySetsDb(options?: {
  publishedOnly?: boolean;
  filters?: VocabularySetFilters;
}) {
  const supabase = await createClient();
  const filters = options?.filters;
  const tier = filters?.tier && filters.tier !== "all" ? filters.tier : null;
  const themeKey = filters?.themeKey?.trim();
  const listMode = filters?.listMode && filters.listMode !== "all" ? filters.listMode : null;
  const published = filters?.published ?? "all";

  const data = await fetchSupabasePages<Record<string, unknown>>({
    queryFactory: () => {
      let query = supabase
        .from("vocabulary_sets")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });

      if (options?.publishedOnly || published === "published") {
        query = query.eq("is_published", true);
      } else if (published === "draft") {
        query = query.eq("is_published", false);
      }

      if (tier) {
        query = query.in("tier", [tier, "both"]);
      }

      if (themeKey) {
        query = query.eq("theme_key", themeKey);
      }

      if (listMode) {
        query = query.eq("list_mode", listMode);
      }

      return query;
    },
    errorMessage: "Error fetching vocabulary sets:",
    errorContext: { options },
  });

  const withCounts = await attachVocabularyCountsAndUsage(
    data.map(normalizeVocabularySet)
  );

  return applyVocabularySetFilters(withCounts, filters);
}

export async function getPublishedVocabularySetsDb(filters?: VocabularySetFilters) {
  return getVocabularySetsDb({ publishedOnly: true, filters });
}

export async function getVocabularySetOptionsDb(options?: {
  publishedOnly?: boolean;
}) {
  const supabase = await createClient();
  const data = await fetchSupabasePages<DbVocabularySetOption>({
    queryFactory: () => {
      let query = supabase
        .from("vocabulary_sets")
        .select("id, title, slug, is_published, tier, list_mode, sort_order")
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });

      if (options?.publishedOnly) {
        query = query.eq("is_published", true);
      }

      return query;
    },
    errorMessage: "Error fetching vocabulary set options:",
    errorContext: { options },
  });

  return data
    .filter((set) => typeof set.slug === "string" && set.slug.trim().length > 0)
    .sort((a, b) => {
      if (a.is_published !== b.is_published) {
        return a.is_published ? -1 : 1;
      }

      return a.title.localeCompare(b.title);
    });
}

export async function getVocabularySetThemeKeysDb(options?: {
  publishedOnly?: boolean;
}) {
  const supabase = await createClient();
  const data = await fetchSupabasePages<{ theme_key: string | null }>({
    queryFactory: () => {
      let query = supabase
        .from("vocabulary_sets")
        .select("theme_key")
        .not("theme_key", "is", null)
        .order("theme_key", { ascending: true });

      if (options?.publishedOnly) {
        query = query.eq("is_published", true);
      }

      return query;
    },
    errorMessage: "Error fetching vocabulary theme keys:",
    errorContext: { options },
  });

  return Array.from(
    new Set(
      data
        .map((row) => row.theme_key)
        .filter((themeKey): themeKey is string => Boolean(themeKey))
    )
  ).sort((a, b) => getVocabularyThemeLabel(a).localeCompare(getVocabularyThemeLabel(b)));
}

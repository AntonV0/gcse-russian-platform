import { createClient } from "@/lib/supabase/server";
import { getVocabularyThemeLabel } from "@/lib/vocabulary/shared/labels";
import { chunkValues, fetchSupabasePages } from "@/lib/vocabulary/shared/pagination";
import type {
  DbVocabularyListMode,
  DbVocabularySet,
  DbVocabularySetType,
  DbVocabularySetOption,
  DbVocabularySetOptionList,
} from "@/lib/vocabulary/shared/types";

type VocabularySetKeyOptions = {
  publishedOnly?: boolean;
  excludeSetTypes?: DbVocabularySetType[];
  setType?: DbVocabularySetType | "all" | null;
  listMode?: DbVocabularyListMode | "all" | null;
  themeKey?: string | null;
  sourceKey?: string | null;
};

type VocabularySetKeyQuery<TQuery> = TQuery & {
  eq: (column: string, value: unknown) => VocabularySetKeyQuery<TQuery>;
  neq: (column: string, value: unknown) => VocabularySetKeyQuery<TQuery>;
};

function applyVocabularySetKeyOptions<TQuery>(
  query: TQuery,
  options?: VocabularySetKeyOptions
) {
  let nextQuery = query as VocabularySetKeyQuery<TQuery>;
  const setType = options?.setType && options.setType !== "all" ? options.setType : null;
  const listMode =
    options?.listMode && options.listMode !== "all" ? options.listMode : null;
  const themeKey = options?.themeKey?.trim();
  const sourceKey = options?.sourceKey?.trim();

  if (options?.publishedOnly) {
    nextQuery = nextQuery.eq("is_published", true);
  }

  if (setType) {
    nextQuery = nextQuery.eq("set_type", setType);
  }

  if (listMode) {
    nextQuery = nextQuery.eq("list_mode", listMode);
  }

  if (themeKey) {
    nextQuery = nextQuery.eq("theme_key", themeKey);
  }

  if (sourceKey) {
    nextQuery = nextQuery.eq("source_key", sourceKey);
  }

  for (const excludedSetType of options?.excludeSetTypes ?? []) {
    nextQuery = nextQuery.neq("set_type", excludedSetType);
  }

  return nextQuery as TQuery;
}

async function getVocabularyOptionListsBySetIdsDb(vocabularySetIds: string[]) {
  const uniqueVocabularySetIds = Array.from(new Set(vocabularySetIds));

  if (uniqueVocabularySetIds.length === 0) {
    return new Map<string, DbVocabularySetOptionList[]>();
  }

  const supabase = await createClient();
  const rows = (
    await Promise.all(
      chunkValues(uniqueVocabularySetIds).map((setIdBatch) =>
        fetchSupabasePages<DbVocabularySetOptionList>({
          queryFactory: () =>
            supabase
              .from("vocabulary_lists")
              .select(
                "id, vocabulary_set_id, title, slug, tier, list_mode, sort_order, is_published"
              )
              .in("vocabulary_set_id", setIdBatch)
              .order("sort_order", { ascending: true })
              .order("title", { ascending: true }),
          errorMessage: "Error fetching vocabulary list options:",
          errorContext: { vocabularySetIds: setIdBatch },
        })
      )
    )
  ).flat();

  const listsBySetId = new Map<string, DbVocabularySetOptionList[]>();

  for (const row of rows) {
    const nextRows = listsBySetId.get(row.vocabulary_set_id) ?? [];
    nextRows.push(row);
    listsBySetId.set(row.vocabulary_set_id, nextRows);
  }

  return listsBySetId;
}

export async function getVocabularySetOptionsDb(options?: {
  publishedOnly?: boolean;
  excludeSetTypes?: DbVocabularySetType[];
}) {
  const supabase = await createClient();
  const data = await fetchSupabasePages<
    Pick<
      DbVocabularySet,
      | "id"
      | "title"
      | "slug"
      | "is_published"
      | "tier"
      | "list_mode"
      | "set_type"
      | "sort_order"
    >
  >({
    queryFactory: () => {
      let query = supabase
        .from("vocabulary_sets")
        .select("id, title, slug, is_published, tier, list_mode, set_type, sort_order")
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });

      if (options?.publishedOnly) {
        query = query.eq("is_published", true);
      }

      for (const excludedSetType of options?.excludeSetTypes ?? []) {
        query = query.neq("set_type", excludedSetType);
      }

      return query;
    },
    errorMessage: "Error fetching vocabulary set options:",
    errorContext: { options },
  });

  const sets = data
    .filter((set) => typeof set.slug === "string" && set.slug.trim().length > 0)
    .sort((a, b) => {
      if (a.is_published !== b.is_published) {
        return a.is_published ? -1 : 1;
      }

      return a.title.localeCompare(b.title);
    });
  const listsBySetId = await getVocabularyOptionListsBySetIdsDb(
    sets.map((set) => set.id)
  );

  return sets.map(
    (set): DbVocabularySetOption => ({
      ...set,
      slug: set.slug,
      lists: listsBySetId.get(set.id) ?? [],
    })
  );
}

export async function getVocabularySetThemeKeysDb(options?: VocabularySetKeyOptions) {
  const supabase = await createClient();
  const data = await fetchSupabasePages<{ theme_key: string | null }>({
    queryFactory: () => {
      const query = supabase
        .from("vocabulary_sets")
        .select("theme_key")
        .not("theme_key", "is", null)
        .order("theme_key", { ascending: true });

      return applyVocabularySetKeyOptions(query, options);
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

export async function getVocabularySetSourceKeysDb(options?: VocabularySetKeyOptions) {
  const supabase = await createClient();
  const data = await fetchSupabasePages<{ source_key: string | null }>({
    queryFactory: () => {
      const query = supabase
        .from("vocabulary_sets")
        .select("source_key")
        .not("source_key", "is", null)
        .order("source_key", { ascending: true });

      return applyVocabularySetKeyOptions(query, options);
    },
    errorMessage: "Error fetching vocabulary source keys:",
    errorContext: { options },
  });

  return Array.from(
    new Set(
      data
        .map((row) => row.source_key)
        .filter((sourceKey): sourceKey is string => Boolean(sourceKey))
    )
  ).sort((a, b) => a.localeCompare(b));
}

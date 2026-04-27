import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getVocabularyThemeLabel } from "@/lib/vocabulary/labels";
import { chunkValues, fetchSupabasePages } from "@/lib/vocabulary/pagination";
import type {
  DbVocabularySet,
  DbVocabularySetOption,
  DbVocabularySetOptionList,
} from "@/lib/vocabulary/types";

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

export async function getVocabularySetOptionsDb(options?: { publishedOnly?: boolean }) {
  const supabase = await createClient();
  const data = await fetchSupabasePages<
    Pick<
      DbVocabularySet,
      "id" | "title" | "slug" | "is_published" | "tier" | "list_mode" | "sort_order"
    >
  >({
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

export async function getVocabularySetThemeKeysDb(options?: {
  publishedOnly?: boolean;
  useAdminClient?: boolean;
}) {
  const supabase = options?.useAdminClient ? createAdminClient() : await createClient();
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

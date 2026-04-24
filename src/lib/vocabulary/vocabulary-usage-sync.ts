import { createClient } from "@/lib/supabase/server";

export type VocabularyUsageVariant = "foundation" | "higher" | "volna";

type LessonVocabularyLinkRow = {
  lesson_id: string;
  lesson_section_id: string;
  lesson_block_id: string;
  link_type: "set" | "list";
  vocabulary_set_id?: string;
  vocabulary_list_id?: string;
  variant: VocabularyUsageVariant;
  usage_type: "lesson_block";
  position: number;
};

export function resolveVocabularyUsageVariantFromSlug(
  variantSlug: string
): VocabularyUsageVariant | null {
  const normalized = variantSlug.trim().toLowerCase();

  if (!normalized) return null;
  if (normalized === "foundation" || normalized.includes("foundation")) {
    return "foundation";
  }
  if (normalized === "higher" || normalized.includes("higher")) {
    return "higher";
  }
  if (normalized === "volna" || normalized.includes("volna")) {
    return "volna";
  }

  return null;
}

export async function getVocabularyUsageVariantForLessonSync(params: {
  variantSlug?: string | null;
  variantId?: string | null;
}): Promise<VocabularyUsageVariant | null> {
  const fromSlug = resolveVocabularyUsageVariantFromSlug(params.variantSlug ?? "");

  if (fromSlug) {
    return fromSlug;
  }

  const variantId = params.variantId?.trim();

  if (!variantId) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("course_variants")
    .select("slug")
    .eq("id", variantId)
    .maybeSingle();

  if (error) {
    console.error("Error resolving course variant for vocabulary usage sync:", error);
    return null;
  }

  const slug =
    data && typeof data.slug === "string" ? data.slug.trim().toLowerCase() : "";

  return resolveVocabularyUsageVariantFromSlug(slug);
}

export async function syncLessonVocabularySetUsagesForLesson(params: {
  lessonId: string;
  variant: VocabularyUsageVariant;
}) {
  const supabase = await createClient();

  const { data: sections, error: sectionsError } = await supabase
    .from("lesson_sections")
    .select("id")
    .eq("lesson_id", params.lessonId);

  if (sectionsError) {
    console.error(
      "Error loading lesson sections for vocabulary usage sync:",
      sectionsError
    );
    throw new Error("Failed to sync lesson vocabulary usage");
  }

  const sectionIds = (sections ?? []).map((section) => section.id as string);

  let vocabularySetIds: string[] = [];
  let vocabularyLinkRows: LessonVocabularyLinkRow[] = [];

  if (sectionIds.length > 0) {
    const { data: vocabularySetBlocks, error: blocksError } = await supabase
      .from("lesson_blocks")
      .select("id, lesson_section_id, data, position")
      .in("lesson_section_id", sectionIds)
      .eq("block_type", "vocabulary-set");

    if (blocksError) {
      console.error(
        "Error loading lesson vocabulary-set blocks for usage sync:",
        blocksError
      );
      throw new Error("Failed to sync lesson vocabulary usage");
    }

    const blockLinks = (vocabularySetBlocks ?? [])
      .map((block) => {
        if (!block || typeof block !== "object") return null;

        const data =
          "data" in block && block.data && typeof block.data === "object"
            ? (block.data as Record<string, unknown>)
            : null;

        const vocabularySetSlug =
          data && typeof data.vocabularySetSlug === "string"
            ? data.vocabularySetSlug.trim()
            : "";
        const vocabularyListSlug =
          data && typeof data.vocabularyListSlug === "string"
            ? data.vocabularyListSlug.trim()
            : "";

        return {
          blockId: String(block.id),
          sectionId: String(block.lesson_section_id),
          position: Number(block.position ?? 0),
          vocabularySetSlug,
          vocabularyListSlug,
        };
      })
      .filter(
        (
          value
        ): value is {
          blockId: string;
          sectionId: string;
          position: number;
          vocabularySetSlug: string;
          vocabularyListSlug: string;
        } => Boolean(value && (value.vocabularySetSlug || value.vocabularyListSlug))
      );

    const setSlugs = Array.from(
      new Set(
        blockLinks
          .map((blockLink) => blockLink.vocabularySetSlug)
          .filter((value) => value.length > 0)
      )
    );

    if (setSlugs.length > 0) {
      const { data: vocabularySets, error: vocabularySetsError } = await supabase
        .from("vocabulary_sets")
        .select("id, slug")
        .in("slug", setSlugs);

      if (vocabularySetsError) {
        console.error(
          "Error loading vocabulary sets for lesson vocabulary usage sync:",
          vocabularySetsError
        );
        throw new Error("Failed to sync lesson vocabulary usage");
      }

      const setIdBySlug = new Map(
        (vocabularySets ?? [])
          .filter((set) => typeof set.id === "string" && typeof set.slug === "string")
          .map((set) => [set.slug as string, set.id as string])
      );

      vocabularySetIds = Array.from(new Set(Array.from(setIdBySlug.values())));

      const { data: vocabularyLists, error: vocabularyListsError } = await supabase
        .from("vocabulary_lists")
        .select("id, vocabulary_set_id, sort_order")
        .in("vocabulary_set_id", vocabularySetIds)
        .order("sort_order", { ascending: true });

      if (vocabularyListsError) {
        console.error(
          "Error loading vocabulary lists for lesson vocabulary usage sync:",
          vocabularyListsError
        );
        throw new Error("Failed to sync lesson vocabulary usage");
      }

      const defaultListIdBySetId = new Map<string, string>();

      for (const list of vocabularyLists ?? []) {
        const setId =
          typeof list.vocabulary_set_id === "string" ? list.vocabulary_set_id : "";

        if (setId && !defaultListIdBySetId.has(setId) && typeof list.id === "string") {
          defaultListIdBySetId.set(setId, list.id);
        }
      }

      const nextVocabularyLinkRows: LessonVocabularyLinkRow[] = [];

      for (const blockLink of blockLinks) {
        const vocabularySetId = setIdBySlug.get(blockLink.vocabularySetSlug);
        if (!vocabularySetId) continue;

        const vocabularyListId = defaultListIdBySetId.get(vocabularySetId);

        nextVocabularyLinkRows.push({
          lesson_id: params.lessonId,
          lesson_section_id: blockLink.sectionId,
          lesson_block_id: blockLink.blockId,
          link_type: vocabularyListId ? "list" : "set",
          vocabulary_set_id: vocabularySetId,
          vocabulary_list_id: vocabularyListId,
          variant: params.variant,
          usage_type: "lesson_block",
          position: blockLink.position,
        });
      }

      vocabularyLinkRows = nextVocabularyLinkRows;
    }
  }

  const { error: deleteError } = await supabase
    .from("lesson_vocabulary_set_usages")
    .delete()
    .eq("lesson_id", params.lessonId)
    .eq("variant", params.variant)
    .eq("usage_type", "lesson_block");

  if (deleteError) {
    console.error(
      "Error clearing lesson vocabulary usage rows before sync:",
      deleteError
    );
    throw new Error("Failed to sync lesson vocabulary usage");
  }

  const { error: linksDeleteError } = await supabase
    .from("lesson_vocabulary_links")
    .delete()
    .eq("lesson_id", params.lessonId)
    .eq("variant", params.variant)
    .eq("usage_type", "lesson_block");

  if (linksDeleteError) {
    console.error(
      "Error clearing structured lesson vocabulary links before sync:",
      linksDeleteError
    );
    throw new Error("Failed to sync lesson vocabulary links");
  }

  if (vocabularySetIds.length === 0) {
    return;
  }

  const rows = vocabularySetIds.map((vocabularySetId) => ({
    lesson_id: params.lessonId,
    vocabulary_set_id: vocabularySetId,
    variant: params.variant,
    usage_type: "lesson_block" as const,
  }));

  const { error: insertError } = await supabase
    .from("lesson_vocabulary_set_usages")
    .insert(rows);

  if (insertError) {
    console.error("Error inserting synced lesson vocabulary usage rows:", insertError);
    throw new Error("Failed to sync lesson vocabulary usage");
  }

  if (vocabularyLinkRows.length > 0) {
    const { error: linksInsertError } = await supabase
      .from("lesson_vocabulary_links")
      .insert(vocabularyLinkRows);

    if (linksInsertError) {
      console.error(
        "Error inserting structured lesson vocabulary links:",
        linksInsertError
      );
      throw new Error("Failed to sync lesson vocabulary links");
    }
  }
}

"use server";

import { createClient } from "@/lib/supabase/server";

export type VocabularyUsageVariant = "foundation" | "higher" | "volna";

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

  if (sectionIds.length > 0) {
    const { data: vocabularySetBlocks, error: blocksError } = await supabase
      .from("lesson_blocks")
      .select("data")
      .in("lesson_section_id", sectionIds)
      .eq("block_type", "vocabulary-set");

    if (blocksError) {
      console.error(
        "Error loading lesson vocabulary-set blocks for usage sync:",
        blocksError
      );
      throw new Error("Failed to sync lesson vocabulary usage");
    }

    const slugs = Array.from(
      new Set(
        (vocabularySetBlocks ?? [])
          .map((block) => {
            if (!block || typeof block !== "object") return null;

            const data =
              "data" in block && block.data && typeof block.data === "object"
                ? (block.data as Record<string, unknown>)
                : null;

            const slug =
              data && typeof data.vocabularySetSlug === "string"
                ? data.vocabularySetSlug.trim()
                : "";

            return slug || null;
          })
          .filter((value): value is string => Boolean(value))
      )
    );

    if (slugs.length > 0) {
      const { data: vocabularySets, error: vocabularySetsError } = await supabase
        .from("vocabulary_sets")
        .select("id, slug")
        .in("slug", slugs);

      if (vocabularySetsError) {
        console.error(
          "Error loading vocabulary sets for lesson vocabulary usage sync:",
          vocabularySetsError
        );
        throw new Error("Failed to sync lesson vocabulary usage");
      }

      vocabularySetIds = Array.from(
        new Set(
          (vocabularySets ?? [])
            .map((set) => (typeof set.id === "string" ? set.id : null))
            .filter((value): value is string => Boolean(value))
        )
      );
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
}

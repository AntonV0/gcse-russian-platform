"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export function getTrimmedString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "true";
}

export function getAdminLessonPath(params: {
  courseId: string;
  variantId: string;
  moduleId: string;
  lessonId: string;
}) {
  return `/admin/content/courses/${params.courseId}/variants/${params.variantId}/modules/${params.moduleId}/lessons/${params.lessonId}`;
}

export function getPublicLessonPath(params: {
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}) {
  return `/courses/${params.courseSlug}/${params.variantSlug}/modules/${params.moduleSlug}/lessons/${params.lessonSlug}`;
}

export function getRouteRedirectPath(formData: FormData) {
  const courseId = getTrimmedString(formData, "courseId");
  const variantId = getTrimmedString(formData, "variantId");
  const moduleId = getTrimmedString(formData, "moduleId");
  const lessonId = getTrimmedString(formData, "lessonId");

  return `/admin/content/courses/${courseId}/variants/${variantId}/modules/${moduleId}/lessons/${lessonId}`;
}

export function revalidateLessonTemplatePaths() {
  revalidatePath("/admin/lesson-templates");
  revalidatePath("/admin/lesson-templates/block-presets");
}

export function revalidateLessonSectionTemplatePaths() {
  revalidatePath("/admin/lesson-templates");
  revalidatePath("/admin/lesson-templates/section-templates");
}

export function revalidateLessonTemplateEntityPaths() {
  revalidatePath("/admin/lesson-templates");
  revalidatePath("/admin/lesson-templates/lesson-templates");
}

export function getVariantVisibility(formData: FormData) {
  const value = getTrimmedString(formData, "variantVisibility");

  if (
    value === "shared" ||
    value === "foundation_only" ||
    value === "higher_only" ||
    value === "volna_only"
  ) {
    return value;
  }

  return "shared";
}

export function getCanonicalSectionKey(formData: FormData) {
  const value = getTrimmedString(formData, "canonicalSectionKey")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return value || null;
}

export function resolveVocabularyUsageVariantFromSlug(
  variantSlug: string
): "foundation" | "higher" | "volna" | null {
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

export async function getVocabularyUsageVariantForLessonSync(formData: FormData) {
  const variantSlug = getTrimmedString(formData, "variantSlug");
  const fromSlug = resolveVocabularyUsageVariantFromSlug(variantSlug);

  if (fromSlug) {
    return fromSlug;
  }

  const variantId = getTrimmedString(formData, "variantId");

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
  variant: "foundation" | "higher" | "volna";
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

export async function syncLessonVocabularySetUsagesFromFormData(formData: FormData) {
  const lessonId = getTrimmedString(formData, "lessonId");

  if (!lessonId) {
    return;
  }

  const variant = await getVocabularyUsageVariantForLessonSync(formData);

  if (!variant) {
    return;
  }

  await syncLessonVocabularySetUsagesForLesson({
    lessonId,
    variant,
  });
}

export async function revalidateLessonPaths(formData: FormData) {
  const courseId = getTrimmedString(formData, "courseId");
  const variantId = getTrimmedString(formData, "variantId");
  const moduleId = getTrimmedString(formData, "moduleId");
  const lessonId = getTrimmedString(formData, "lessonId");

  const courseSlug = getTrimmedString(formData, "courseSlug");
  const variantSlug = getTrimmedString(formData, "variantSlug");
  const moduleSlug = getTrimmedString(formData, "moduleSlug");
  const lessonSlug = getTrimmedString(formData, "lessonSlug");

  const adminPath = getAdminLessonPath({
    courseId,
    variantId,
    moduleId,
    lessonId,
  });

  const publicPath = getPublicLessonPath({
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug,
  });

  revalidatePath(adminPath);
  revalidatePath(publicPath);

  redirect(adminPath);
}

export async function finalizeLessonMutation(formData: FormData) {
  await syncLessonVocabularySetUsagesFromFormData(formData);
  await revalidateLessonPaths(formData);
}

export async function getNextSectionPosition(lessonId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_sections")
    .select("id")
    .eq("lesson_id", lessonId);

  if (error) {
    console.error("Error counting lesson sections:", error);
    throw new Error("Failed to prepare section position");
  }

  return (data?.length ?? 0) + 1;
}

export async function getNextBlockPosition(sectionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_blocks")
    .select("id")
    .eq("lesson_section_id", sectionId);

  if (error) {
    console.error("Error counting lesson blocks:", error);
    throw new Error("Failed to prepare block position");
  }

  return (data?.length ?? 0) + 1;
}

export async function getNextLessonBlockPositionInSection(sectionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_blocks")
    .select("position")
    .eq("lesson_section_id", sectionId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error getting next lesson block position in section:", error);
    throw new Error(`Failed to get next block position: ${error.message}`);
  }

  return data?.position ? data.position + 1 : 1;
}

export async function normalizeLessonBlockPositionsInSection(sectionId: string) {
  const supabase = await createClient();

  const { data: blocks, error: loadError } = await supabase
    .from("lesson_blocks")
    .select("id")
    .eq("lesson_section_id", sectionId)
    .order("position", { ascending: true });

  if (loadError) {
    console.error("Error loading section blocks for normalization:", loadError);
    throw new Error(`Failed to normalize section blocks: ${loadError.message}`);
  }

  for (let index = 0; index < (blocks?.length ?? 0); index += 1) {
    const block = blocks![index];

    const { error } = await supabase
      .from("lesson_blocks")
      .update({ position: -1 * (index + 1) })
      .eq("id", block.id);

    if (error) {
      console.error("Error setting temporary lesson block positions:", error);
      throw new Error(`Failed to normalize section blocks: ${error.message}`);
    }
  }

  for (let index = 0; index < (blocks?.length ?? 0); index += 1) {
    const block = blocks![index];

    const { error } = await supabase
      .from("lesson_blocks")
      .update({ position: index + 1 })
      .eq("id", block.id);

    if (error) {
      console.error("Error setting final lesson block positions:", error);
      throw new Error(`Failed to normalize section blocks: ${error.message}`);
    }
  }
}

export async function reorderTablePositions(params: {
  table:
    | "lesson_sections"
    | "lesson_blocks"
    | "lesson_block_preset_blocks"
    | "lesson_section_template_presets"
    | "lesson_template_sections";
  orderedIds: string[];
  scope:
    | { lesson_id: string }
    | { lesson_section_id: string }
    | { lesson_block_preset_id: string }
    | { lesson_section_template_id: string; lesson_block_preset_id_field?: string }
    | { lesson_template_id: string };
  temporaryPositionMode?: "negative" | "high";
}) {
  const supabase = await createClient();
  const temporaryPositionMode = params.temporaryPositionMode ?? "negative";

  for (let index = 0; index < params.orderedIds.length; index += 1) {
    const id = params.orderedIds[index];
    const temporaryPosition =
      temporaryPositionMode === "high" ? 1000 + index : -1 * (index + 1);

    let query = supabase
      .from(params.table)
      .update({ position: temporaryPosition })
      .eq("id", id);

    if ("lesson_id" in params.scope) {
      query = query.eq("lesson_id", params.scope.lesson_id);
    }

    if ("lesson_section_id" in params.scope) {
      query = query.eq("lesson_section_id", params.scope.lesson_section_id);
    }

    if ("lesson_block_preset_id" in params.scope) {
      query = query.eq("lesson_block_preset_id", params.scope.lesson_block_preset_id);
    }

    if ("lesson_section_template_id" in params.scope) {
      query = query.eq(
        "lesson_section_template_id",
        params.scope.lesson_section_template_id
      );
    }

    if ("lesson_template_id" in params.scope) {
      query = query.eq("lesson_template_id", params.scope.lesson_template_id);
    }

    const { error } = await query;

    if (error) {
      console.error(`Error setting temporary positions for ${params.table}:`, error);
      throw new Error(`Failed to reorder ${params.table}: ${error.message}`);
    }
  }

  for (let index = 0; index < params.orderedIds.length; index += 1) {
    const id = params.orderedIds[index];

    let query = supabase
      .from(params.table)
      .update({ position: index + 1 })
      .eq("id", id);

    if ("lesson_id" in params.scope) {
      query = query.eq("lesson_id", params.scope.lesson_id);
    }

    if ("lesson_section_id" in params.scope) {
      query = query.eq("lesson_section_id", params.scope.lesson_section_id);
    }

    if ("lesson_block_preset_id" in params.scope) {
      query = query.eq("lesson_block_preset_id", params.scope.lesson_block_preset_id);
    }

    if ("lesson_section_template_id" in params.scope) {
      query = query.eq(
        "lesson_section_template_id",
        params.scope.lesson_section_template_id
      );
    }

    if ("lesson_template_id" in params.scope) {
      query = query.eq("lesson_template_id", params.scope.lesson_template_id);
    }

    const { error } = await query;

    if (error) {
      console.error(`Error setting final positions for ${params.table}:`, error);
      throw new Error(`Failed to reorder ${params.table}: ${error.message}`);
    }
  }
}

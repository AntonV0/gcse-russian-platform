"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  getVocabularyUsageVariantForLessonSync,
  syncLessonVocabularySetUsagesForLesson,
} from "@/lib/vocabulary/vocabulary-usage-sync";

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

export async function syncLessonVocabularySetUsagesFromFormData(formData: FormData) {
  const lessonId = getTrimmedString(formData, "lessonId");

  if (!lessonId) {
    return;
  }

  const variant = await getVocabularyUsageVariantForLessonSync({
    variantSlug: getTrimmedString(formData, "variantSlug"),
    variantId: getTrimmedString(formData, "variantId"),
  });

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

export async function reorderTablePositions(params: {
  table:
    | "lesson_sections"
    | "lesson_blocks"
    | "lesson_block_preset_blocks"
    | "lesson_section_template_presets"
    | "lesson_template_sections";
  orderedIds: string[];
  idColumn?: string;
  scope: Record<string, string>;
  temporaryPositionMode?: "negative" | "high";
}) {
  const supabase = await createClient();
  const idColumn = params.idColumn ?? "id";
  const temporaryPositionMode = params.temporaryPositionMode ?? "negative";

  for (let index = 0; index < params.orderedIds.length; index += 1) {
    const rowId = params.orderedIds[index];
    const temporaryPosition =
      temporaryPositionMode === "high" ? 1000 + index : -1 * (index + 1);

    let query = supabase
      .from(params.table)
      .update({ position: temporaryPosition })
      .eq(idColumn, rowId);

    for (const [column, value] of Object.entries(params.scope)) {
      query = query.eq(column, value);
    }

    const { error } = await query;

    if (error) {
      console.error("Error setting temporary positions:", {
        table: params.table,
        idColumn,
        rowId,
        scope: params.scope,
        error,
      });
      throw new Error(`Failed to reorder rows: ${error.message}`);
    }
  }

  for (let index = 0; index < params.orderedIds.length; index += 1) {
    const rowId = params.orderedIds[index];

    let query = supabase
      .from(params.table)
      .update({ position: index + 1 })
      .eq(idColumn, rowId);

    for (const [column, value] of Object.entries(params.scope)) {
      query = query.eq(column, value);
    }

    const { error } = await query;

    if (error) {
      console.error("Error setting final positions:", {
        table: params.table,
        idColumn,
        rowId,
        scope: params.scope,
        error,
      });
      throw new Error(`Failed to reorder rows: ${error.message}`);
    }
  }
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

  await reorderTablePositions({
    table: "lesson_blocks",
    orderedIds: (blocks ?? []).map((block) => block.id as string),
    scope: {
      lesson_section_id: sectionId,
    },
  });
}

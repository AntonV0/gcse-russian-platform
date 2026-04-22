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

"use server";

import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { resolveSectionKind } from "@/lib/lessons/lesson-blocks";
import {
  getTrimmedString,
  reorderTablePositions,
  revalidateLessonTemplateEntityPaths,
} from "@/app/actions/admin/admin-lesson-builder-shared";
import {
  createLessonTemplateEntity,
  getNextPosition,
  reorderRemainingRows,
  revalidateLessonTemplateDetailPath,
  updateLessonTemplateEntity,
} from "./shared";

export async function createLessonTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getTrimmedString(formData, "description");

  if (!title || !slug) {
    throw new Error("Title and slug are required");
  }

  await createLessonTemplateEntity({
    title,
    slug,
    description,
  });

  revalidateLessonTemplateEntityPaths();
}

export async function updateLessonTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const templateId = getTrimmedString(formData, "templateId");
  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getTrimmedString(formData, "description");
  const isActive = String(formData.get("isActive") || "") === "true";

  if (!templateId || !title || !slug) {
    throw new Error("Template id, title, and slug are required");
  }

  await updateLessonTemplateEntity({
    templateId,
    title,
    slug,
    description,
    isActive,
  });

  await revalidateLessonTemplateDetailPath(templateId);
}

export async function deleteLessonTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const templateId = getTrimmedString(formData, "templateId");
  if (!templateId) {
    throw new Error("Template id is required");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("lesson_templates").delete().eq("id", templateId);

  if (error) {
    console.error("Error deleting lesson template:", error);
    throw new Error(`Failed to delete lesson template: ${error.message}`);
  }

  revalidateLessonTemplateEntityPaths();
  redirect("/admin/lesson-templates/lesson-templates");
}

export async function addSectionToLessonTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const templateId = getTrimmedString(formData, "templateId");
  const sectionTemplateId = getTrimmedString(formData, "sectionTemplateId");
  const titleOverride = getTrimmedString(formData, "titleOverride");
  const sectionKindOverrideRaw = getTrimmedString(formData, "sectionKindOverride");

  if (!templateId || !sectionTemplateId) {
    throw new Error("Template id and section template id are required");
  }

  const sectionKindOverride = sectionKindOverrideRaw
    ? resolveSectionKind(sectionKindOverrideRaw)
    : null;

  const position = await getNextPosition({
    table: "lesson_template_sections",
    positionColumnScope: "lesson_template_id",
    scopeValue: templateId,
  });

  const supabase = await createClient();

  const { error } = await supabase.from("lesson_template_sections").insert({
    lesson_template_id: templateId,
    lesson_section_template_id: sectionTemplateId,
    title_override: titleOverride || null,
    section_kind_override: sectionKindOverride,
    position,
  });

  if (error) {
    console.error("Error adding section to lesson template:", error);
    throw new Error(`Failed to add section to lesson template: ${error.message}`);
  }

  await revalidateLessonTemplateDetailPath(templateId);
}

export async function updateLessonTemplateSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const templateId = getTrimmedString(formData, "templateId");
  const lessonTemplateSectionId = getTrimmedString(formData, "lessonTemplateSectionId");
  const titleOverride = getTrimmedString(formData, "titleOverride");
  const sectionKindOverrideRaw = getTrimmedString(formData, "sectionKindOverride");

  if (!templateId || !lessonTemplateSectionId) {
    throw new Error("Template id and lesson template section id are required");
  }

  const sectionKindOverride = sectionKindOverrideRaw
    ? resolveSectionKind(sectionKindOverrideRaw)
    : null;

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_template_sections")
    .update({
      title_override: titleOverride || null,
      section_kind_override: sectionKindOverride,
    })
    .eq("id", lessonTemplateSectionId)
    .eq("lesson_template_id", templateId);

  if (error) {
    console.error("Error updating lesson template section:", error);
    throw new Error(`Failed to update lesson template section: ${error.message}`);
  }

  await revalidateLessonTemplateDetailPath(templateId);
}

export async function removeSectionFromLessonTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const templateId = getTrimmedString(formData, "templateId");
  const lessonTemplateSectionId = getTrimmedString(formData, "lessonTemplateSectionId");

  if (!templateId || !lessonTemplateSectionId) {
    throw new Error("Template id and lesson template section id are required");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_template_sections")
    .delete()
    .eq("id", lessonTemplateSectionId)
    .eq("lesson_template_id", templateId);

  if (error) {
    console.error("Error removing section from lesson template:", error);
    throw new Error(`Failed to remove section from lesson template: ${error.message}`);
  }

  await reorderRemainingRows({
    table: "lesson_template_sections",
    selectIdField: "id",
    scope: {
      lesson_template_id: templateId,
    },
  });

  await revalidateLessonTemplateDetailPath(templateId);
}

export async function reorderLessonTemplateSectionsAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const templateId = getTrimmedString(formData, "templateId");
  const orderedLessonTemplateSectionIdsRaw = getTrimmedString(
    formData,
    "orderedLessonTemplateSectionIds"
  );

  if (!templateId || !orderedLessonTemplateSectionIdsRaw) {
    throw new Error("Missing required fields");
  }

  const orderedLessonTemplateSectionIds = orderedLessonTemplateSectionIdsRaw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (orderedLessonTemplateSectionIds.length === 0) {
    throw new Error("No lesson template section ids provided");
  }

  await reorderTablePositions({
    table: "lesson_template_sections",
    orderedIds: orderedLessonTemplateSectionIds,
    scope: {
      lesson_template_id: templateId,
    },
  });

  await revalidateLessonTemplateDetailPath(templateId);
}

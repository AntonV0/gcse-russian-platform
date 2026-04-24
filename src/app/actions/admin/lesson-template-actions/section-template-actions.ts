"use server";

import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { resolveSectionKind } from "@/lib/lessons/lesson-blocks";
import {
  getTrimmedString,
  reorderTablePositions,
  revalidateLessonSectionTemplatePaths,
} from "@/app/actions/admin/admin-lesson-builder-shared";
import {
  createLessonSectionTemplateEntity,
  getNextPosition,
  reorderRemainingRows,
  revalidateSectionTemplateDetailPath,
  updateLessonSectionTemplateEntity,
} from "./shared";

export async function createLessonSectionTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getTrimmedString(formData, "description");
  const defaultSectionTitle = getTrimmedString(formData, "defaultSectionTitle");
  const defaultSectionKindRaw = getTrimmedString(formData, "defaultSectionKind");

  if (!title || !slug || !defaultSectionTitle || !defaultSectionKindRaw) {
    throw new Error(
      "Title, slug, default section title, and default section kind are required"
    );
  }

  const defaultSectionKind = resolveSectionKind(defaultSectionKindRaw);

  await createLessonSectionTemplateEntity({
    title,
    slug,
    description,
    defaultSectionTitle,
    defaultSectionKind,
  });

  revalidateLessonSectionTemplatePaths();
}

export async function updateLessonSectionTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const templateId = getTrimmedString(formData, "templateId");
  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getTrimmedString(formData, "description");
  const defaultSectionTitle = getTrimmedString(formData, "defaultSectionTitle");
  const defaultSectionKindRaw = getTrimmedString(formData, "defaultSectionKind");
  const isActive = String(formData.get("isActive") || "") === "true";

  if (!templateId || !title || !slug || !defaultSectionTitle || !defaultSectionKindRaw) {
    throw new Error(
      "Template id, title, slug, default section title, and default section kind are required"
    );
  }

  const defaultSectionKind = resolveSectionKind(defaultSectionKindRaw);

  await updateLessonSectionTemplateEntity({
    templateId,
    title,
    slug,
    description,
    defaultSectionTitle,
    defaultSectionKind,
    isActive,
  });

  await revalidateSectionTemplateDetailPath(templateId);
}

export async function deleteLessonSectionTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const templateId = getTrimmedString(formData, "templateId");
  if (!templateId) {
    throw new Error("Template id is required");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_section_templates")
    .delete()
    .eq("id", templateId);

  if (error) {
    console.error("Error deleting lesson section template:", error);
    throw new Error(`Failed to delete section template: ${error.message}`);
  }

  revalidateLessonSectionTemplatePaths();
  redirect("/admin/lesson-templates/section-templates");
}

export async function addPresetToLessonSectionTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const templateId = getTrimmedString(formData, "templateId");
  const presetId = getTrimmedString(formData, "presetId");

  if (!templateId || !presetId) {
    throw new Error("Template id and preset id are required");
  }

  const position = await getNextPosition({
    table: "lesson_section_template_presets",
    positionColumnScope: "lesson_section_template_id",
    scopeValue: templateId,
  });

  const supabase = await createClient();

  const { error } = await supabase.from("lesson_section_template_presets").insert({
    lesson_section_template_id: templateId,
    lesson_block_preset_id: presetId,
    position,
  });

  if (error) {
    console.error("Error adding preset to lesson section template:", error);
    throw new Error(`Failed to add preset to section template: ${error.message}`);
  }

  await revalidateSectionTemplateDetailPath(templateId);
}

export async function removePresetFromLessonSectionTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const templateId = getTrimmedString(formData, "templateId");
  const presetId = getTrimmedString(formData, "presetId");

  if (!templateId || !presetId) {
    throw new Error("Template id and preset id are required");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_section_template_presets")
    .delete()
    .eq("lesson_section_template_id", templateId)
    .eq("lesson_block_preset_id", presetId);

  if (error) {
    console.error("Error removing preset from lesson section template:", error);
    throw new Error(`Failed to remove preset from section template: ${error.message}`);
  }

  await reorderRemainingRows({
    table: "lesson_section_template_presets",
    selectIdField: "id",
    scope: {
      lesson_section_template_id: templateId,
    },
  });

  await revalidateSectionTemplateDetailPath(templateId);
}

export async function reorderLessonSectionTemplatePresetsAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const templateId = getTrimmedString(formData, "templateId");
  const orderedPresetIdsRaw = getTrimmedString(formData, "orderedPresetIds");

  if (!templateId || !orderedPresetIdsRaw) {
    throw new Error("Missing required fields");
  }

  const orderedPresetIds = orderedPresetIdsRaw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (orderedPresetIds.length === 0) {
    throw new Error("No preset ids provided");
  }

  await reorderTablePositions({
    table: "lesson_section_template_presets",
    orderedIds: orderedPresetIds,
    scope: {
      lesson_section_template_id: templateId,
    },
  });

  await revalidateSectionTemplateDetailPath(templateId);
}

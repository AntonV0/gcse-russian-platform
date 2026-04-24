"use server";

import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  getTrimmedString,
  reorderTablePositions,
  revalidateLessonTemplatePaths,
} from "@/app/actions/admin/admin-lesson-builder-shared";
import {
  createLessonBlockPresetEntity,
  getNextPosition,
  normalizeTemplateBlockData,
  reorderRemainingRows,
  revalidatePresetDetailPath,
  updateLessonBlockPresetEntity,
  type TemplateBlockType,
} from "./shared";

export async function createLessonBlockPresetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getTrimmedString(formData, "description");

  if (!title || !slug) {
    throw new Error("Title and slug are required");
  }

  await createLessonBlockPresetEntity({
    title,
    slug,
    description,
  });

  revalidateLessonTemplatePaths();
}

export async function updateLessonBlockPresetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const presetId = getTrimmedString(formData, "presetId");
  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getTrimmedString(formData, "description");
  const isActive = String(formData.get("isActive") || "") === "true";

  if (!presetId || !title || !slug) {
    throw new Error("Preset id, title, and slug are required");
  }

  await updateLessonBlockPresetEntity({
    presetId,
    title,
    slug,
    description,
    isActive,
  });

  await revalidatePresetDetailPath(presetId);
}

export async function deleteLessonBlockPresetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const presetId = getTrimmedString(formData, "presetId");
  if (!presetId) {
    throw new Error("Preset id is required");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_block_presets")
    .delete()
    .eq("id", presetId);

  if (error) {
    console.error("Error deleting lesson block preset:", error);
    throw new Error(`Failed to delete block preset: ${error.message}`);
  }

  revalidateLessonTemplatePaths();
  redirect("/admin/lesson-templates/block-presets");
}

export async function createLessonBlockPresetBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const presetId = getTrimmedString(formData, "presetId");
  const blockType = getTrimmedString(formData, "blockType") as TemplateBlockType;

  if (!presetId || !blockType) {
    throw new Error("Preset id and block type are required");
  }

  const data = normalizeTemplateBlockData(blockType, formData);
  const position = await getNextPosition({
    table: "lesson_block_preset_blocks",
    positionColumnScope: "lesson_block_preset_id",
    scopeValue: presetId,
  });

  const supabase = await createClient();

  const { error } = await supabase.from("lesson_block_preset_blocks").insert({
    lesson_block_preset_id: presetId,
    block_type: blockType,
    position,
    data,
    is_active: true,
  });

  if (error) {
    console.error("Error creating lesson block preset block:", error);
    throw new Error(`Failed to create preset block: ${error.message}`);
  }

  await revalidatePresetDetailPath(presetId);
}

export async function updateLessonBlockPresetBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const presetId = getTrimmedString(formData, "presetId");
  const presetBlockId = getTrimmedString(formData, "presetBlockId");
  const blockType = getTrimmedString(formData, "blockType") as TemplateBlockType;
  const isActive = String(formData.get("isActive") || "") === "true";

  if (!presetId || !presetBlockId || !blockType) {
    throw new Error("Preset id, preset block id, and block type are required");
  }

  const data = normalizeTemplateBlockData(blockType, formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_block_preset_blocks")
    .update({
      data,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", presetBlockId)
    .eq("lesson_block_preset_id", presetId);

  if (error) {
    console.error("Error updating lesson block preset block:", error);
    throw new Error(`Failed to update preset block: ${error.message}`);
  }

  await revalidatePresetDetailPath(presetId);
}

export async function deleteLessonBlockPresetBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const presetId = getTrimmedString(formData, "presetId");
  const presetBlockId = getTrimmedString(formData, "presetBlockId");

  if (!presetId || !presetBlockId) {
    throw new Error("Preset id and preset block id are required");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_block_preset_blocks")
    .delete()
    .eq("id", presetBlockId)
    .eq("lesson_block_preset_id", presetId);

  if (error) {
    console.error("Error deleting lesson block preset block:", error);
    throw new Error(`Failed to delete preset block: ${error.message}`);
  }

  await reorderRemainingRows({
    table: "lesson_block_preset_blocks",
    selectIdField: "id",
    scope: {
      lesson_block_preset_id: presetId,
    },
  });

  await revalidatePresetDetailPath(presetId);
}

export async function reorderLessonBlockPresetBlocksAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const presetId = getTrimmedString(formData, "presetId");
  const orderedPresetBlockIdsRaw = getTrimmedString(formData, "orderedPresetBlockIds");

  if (!presetId || !orderedPresetBlockIdsRaw) {
    throw new Error("Missing required fields");
  }

  const orderedPresetBlockIds = orderedPresetBlockIdsRaw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (orderedPresetBlockIds.length === 0) {
    throw new Error("No preset block ids provided");
  }

  await reorderTablePositions({
    table: "lesson_block_preset_blocks",
    orderedIds: orderedPresetBlockIds,
    scope: {
      lesson_block_preset_id: presetId,
    },
  });

  await revalidatePresetDetailPath(presetId);
}

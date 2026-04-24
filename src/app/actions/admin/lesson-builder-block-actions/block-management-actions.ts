"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  finalizeLessonMutation,
  getNextLessonBlockPositionInSection,
  getRouteRedirectPath,
  getTrimmedString,
  normalizeLessonBlockPositionsInSection,
  reorderTablePositions,
  syncLessonVocabularySetUsagesFromFormData,
} from "@/app/actions/admin/admin-lesson-builder-shared";
import { createBlockRow, type CreatableLessonBlockType } from "./shared";

export async function duplicateBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const blockId = getTrimmedString(formData, "blockId");

  if (!sectionId || !blockId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data: block, error } = await supabase
    .from("lesson_blocks")
    .select("*")
    .eq("id", blockId)
    .single();

  if (error || !block) {
    console.error("Error loading block for duplication:", error);
    throw new Error("Failed to load block");
  }

  await createBlockRow({
    sectionId,
    blockType: block.block_type as CreatableLessonBlockType,
    data: block.data ?? {},
    isPublished: false,
    settings: (block.settings ?? {}) as Record<string, unknown>,
  });

  await finalizeLessonMutation(formData);
}

export async function deleteBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");

  if (!blockId) {
    throw new Error("Missing block id");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("lesson_blocks").delete().eq("id", blockId);

  if (error) {
    console.error("Error deleting lesson block:", error);
    throw new Error("Failed to delete block");
  }

  await finalizeLessonMutation(formData);
}

export async function moveBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const blockId = getTrimmedString(formData, "blockId");
  const direction = getTrimmedString(formData, "direction");

  if (!sectionId || !blockId) {
    throw new Error("Missing required fields");
  }

  if (direction !== "up" && direction !== "down") {
    throw new Error("Invalid move direction");
  }

  const supabase = await createClient();

  const { data: blocks, error } = await supabase
    .from("lesson_blocks")
    .select("id, position")
    .eq("lesson_section_id", sectionId)
    .order("position", { ascending: true });

  if (error || !blocks) {
    console.error("Error loading lesson blocks for reorder:", error);
    throw new Error("Failed to load blocks");
  }

  const currentIndex = blocks.findIndex((block) => block.id === blockId);

  if (currentIndex === -1) {
    throw new Error("Block not found in section");
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= blocks.length) {
    await finalizeLessonMutation(formData);
    return;
  }

  const reordered = [...blocks];
  const [movedItem] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, movedItem);

  await reorderTablePositions({
    table: "lesson_blocks",
    orderedIds: reordered.map((block) => block.id as string),
    scope: {
      lesson_section_id: sectionId,
    },
    temporaryPositionMode: "high",
  });

  await finalizeLessonMutation(formData);
}

export async function toggleBlockPublishedAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const nextState = getTrimmedString(formData, "nextState");

  if (!blockId) {
    throw new Error("Missing block id");
  }

  if (nextState !== "published" && nextState !== "draft") {
    throw new Error("Invalid block state");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_blocks")
    .update({
      is_published: nextState === "published",
    })
    .eq("id", blockId);

  if (error) {
    console.error("Error toggling block published state:", error);
    throw new Error("Failed to update block state");
  }

  await finalizeLessonMutation(formData);
}

export async function reorderBlocksAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const sectionId = getTrimmedString(formData, "sectionId");
  const orderedBlockIdsRaw = getTrimmedString(formData, "orderedBlockIds");

  if (!sectionId || !orderedBlockIdsRaw) {
    throw new Error("Missing required fields");
  }

  const orderedBlockIds = orderedBlockIdsRaw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (orderedBlockIds.length === 0) {
    throw new Error("No block ids provided");
  }

  await reorderTablePositions({
    table: "lesson_blocks",
    orderedIds: orderedBlockIds,
    scope: {
      lesson_section_id: sectionId,
    },
  });

  await syncLessonVocabularySetUsagesFromFormData(formData);

  const redirectPath = getRouteRedirectPath(formData);
  revalidatePath(redirectPath);
}

export async function moveBlockToSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const blockId = getTrimmedString(formData, "blockId");
  const sourceSectionId = getTrimmedString(formData, "sourceSectionId");
  const targetSectionId = getTrimmedString(formData, "targetSectionId");

  if (!blockId || !sourceSectionId || !targetSectionId) {
    throw new Error("Missing required fields");
  }

  if (sourceSectionId === targetSectionId) {
    await finalizeLessonMutation(formData);
    return;
  }

  const supabase = await createClient();

  const { data: block, error: blockError } = await supabase
    .from("lesson_blocks")
    .select("id, lesson_section_id")
    .eq("id", blockId)
    .single();

  if (blockError || !block) {
    console.error("Error loading block before moving:", blockError);
    throw new Error("Block not found");
  }

  if (block.lesson_section_id !== sourceSectionId) {
    throw new Error("Block source section mismatch");
  }

  const nextTargetPosition = await getNextLessonBlockPositionInSection(targetSectionId);

  const { error: moveError } = await supabase
    .from("lesson_blocks")
    .update({
      lesson_section_id: targetSectionId,
      position: nextTargetPosition,
    })
    .eq("id", blockId)
    .eq("lesson_section_id", sourceSectionId);

  if (moveError) {
    console.error("Error moving block to target section:", moveError);
    throw new Error(`Failed to move block: ${moveError.message}`);
  }

  await normalizeLessonBlockPositionsInSection(sourceSectionId);
  await normalizeLessonBlockPositionsInSection(targetSectionId);

  await finalizeLessonMutation(formData);
}

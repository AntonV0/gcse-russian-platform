"use server";

import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { getPresetBlocksForInsertDb } from "@/lib/lessons/lesson-template-helpers-db";
import {
  finalizeLessonMutation,
  getNextBlockPosition,
  getTrimmedString,
} from "@/app/actions/admin/admin-lesson-builder-shared";

export async function insertBlockPresetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const presetId = getTrimmedString(formData, "presetId");

  if (!sectionId || !presetId) {
    throw new Error("Missing required fields");
  }

  const presetBlocks = await getPresetBlocksForInsertDb(presetId);
  const supabase = await createClient();
  const startingPosition = await getNextBlockPosition(sectionId);

  const rows = presetBlocks.map((block, index) => ({
    lesson_section_id: sectionId,
    block_type: block.blockType,
    position: startingPosition + index,
    is_published: true,
    data: block.data,
    settings: {},
  }));

  const { error } = await supabase.from("lesson_blocks").insert(rows);

  if (error) {
    console.error("Error inserting preset blocks:", error);
    throw new Error(`Failed to insert preset blocks: ${error.message}`);
  }

  await finalizeLessonMutation(formData);
}

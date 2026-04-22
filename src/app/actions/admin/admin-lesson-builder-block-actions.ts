"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  normalizeAudioBlockData,
  normalizeCalloutBlockData,
  normalizeExamTipBlockData,
  normalizeHeaderBlockData,
  normalizeImageBlockData,
  normalizeNoteBlockData,
  normalizeQuestionSetBlockData,
  normalizeSubheaderBlockData,
  normalizeTextBlockData,
  normalizeVocabularyBlockData,
  normalizeVocabularySetBlockData,
} from "@/lib/lessons/lesson-blocks";
import { getPresetBlocksForInsertDb } from "@/lib/lessons/lesson-template-helpers-db";
import { getVocabularySetBySlugDb } from "@/lib/vocabulary/vocabulary-helpers-db";
import {
  finalizeLessonMutation,
  getBoolean,
  getNextBlockPosition,
  getNextLessonBlockPositionInSection,
  getRouteRedirectPath,
  getTrimmedString,
  normalizeLessonBlockPositionsInSection,
  reorderTablePositions,
  syncLessonVocabularySetUsagesFromFormData,
} from "@/app/actions/admin/admin-lesson-builder-shared";
import { revalidatePath } from "next/cache";

type CreatableLessonBlockType =
  | "header"
  | "subheader"
  | "divider"
  | "text"
  | "note"
  | "callout"
  | "exam-tip"
  | "image"
  | "audio"
  | "vocabulary"
  | "question-set"
  | "vocabulary-set";

type SimpleContentBlockType = "header" | "subheader" | "text" | "callout" | "exam-tip";

async function createBlockRow(params: {
  sectionId: string;
  blockType: CreatableLessonBlockType;
  data: Record<string, unknown>;
  isPublished?: boolean;
  settings?: Record<string, unknown>;
}) {
  const supabase = await createClient();
  const nextPosition = await getNextBlockPosition(params.sectionId);

  const { error } = await supabase.from("lesson_blocks").insert({
    lesson_section_id: params.sectionId,
    block_type: params.blockType,
    position: nextPosition,
    is_published: params.isPublished ?? true,
    data: params.data,
    settings: params.settings ?? {},
  });

  if (error) {
    console.error(`Error creating ${params.blockType} block:`, error);
    throw new Error(`Failed to create ${params.blockType} block`);
  }
}

async function updateBlockRow(params: {
  blockId: string;
  blockType: Exclude<CreatableLessonBlockType, "divider">;
  data: Record<string, unknown>;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_blocks")
    .update({
      data: params.data,
    })
    .eq("id", params.blockId)
    .eq("block_type", params.blockType);

  if (error) {
    console.error(`Error updating ${params.blockType} block:`, error);
    throw new Error(`Failed to update ${params.blockType} block`);
  }
}

async function createValidatedBlock(params: {
  formData: FormData;
  sectionId: string;
  blockType: Exclude<CreatableLessonBlockType, "divider">;
  buildData: () => Promise<Record<string, unknown>> | Record<string, unknown>;
}) {
  const data = await params.buildData();

  await createBlockRow({
    sectionId: params.sectionId,
    blockType: params.blockType,
    data,
  });

  await finalizeLessonMutation(params.formData);
}

async function updateValidatedBlock(params: {
  formData: FormData;
  blockId: string;
  blockType: Exclude<CreatableLessonBlockType, "divider">;
  buildData: () => Promise<Record<string, unknown>> | Record<string, unknown>;
}) {
  const data = await params.buildData();

  await updateBlockRow({
    blockId: params.blockId,
    blockType: params.blockType,
    data,
  });

  await finalizeLessonMutation(params.formData);
}

async function createSimpleContentBlock(params: {
  formData: FormData;
  sectionId: string;
  blockType: SimpleContentBlockType;
  data: Record<string, unknown>;
}) {
  await createValidatedBlock({
    formData: params.formData,
    sectionId: params.sectionId,
    blockType: params.blockType,
    buildData: () => params.data,
  });
}

async function updateSimpleContentBlock(params: {
  formData: FormData;
  blockId: string;
  blockType: SimpleContentBlockType;
  data: Record<string, unknown>;
}) {
  await updateValidatedBlock({
    formData: params.formData,
    blockId: params.blockId,
    blockType: params.blockType,
    buildData: () => params.data,
  });
}

async function ensureVocabularySetExists(vocabularySetSlug: string) {
  const vocabularySet = await getVocabularySetBySlugDb(vocabularySetSlug);

  if (!vocabularySet) {
    throw new Error("Selected vocabulary set does not exist");
  }

  return vocabularySet;
}

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

export async function createHeaderBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !content) {
    throw new Error("Missing required fields");
  }

  await createSimpleContentBlock({
    formData,
    sectionId,
    blockType: "header",
    data: normalizeHeaderBlockData({ content }),
  });
}

export async function updateHeaderBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const content = getTrimmedString(formData, "content");

  if (!blockId || !content) {
    throw new Error("Missing required fields");
  }

  await updateSimpleContentBlock({
    formData,
    blockId,
    blockType: "header",
    data: normalizeHeaderBlockData({ content }),
  });
}

export async function createSubheaderBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !content) {
    throw new Error("Missing required fields");
  }

  await createSimpleContentBlock({
    formData,
    sectionId,
    blockType: "subheader",
    data: normalizeSubheaderBlockData({ content }),
  });
}

export async function updateSubheaderBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const content = getTrimmedString(formData, "content");

  if (!blockId || !content) {
    throw new Error("Missing required fields");
  }

  await updateSimpleContentBlock({
    formData,
    blockId,
    blockType: "subheader",
    data: normalizeSubheaderBlockData({ content }),
  });
}

export async function createDividerBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");

  if (!sectionId) {
    throw new Error("Missing required fields");
  }

  await createBlockRow({
    sectionId,
    blockType: "divider",
    data: {},
  });

  await finalizeLessonMutation(formData);
}

export async function createTextBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !content) {
    throw new Error("Missing required fields");
  }

  await createSimpleContentBlock({
    formData,
    sectionId,
    blockType: "text",
    data: normalizeTextBlockData({ content }),
  });
}

export async function updateTextBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const content = getTrimmedString(formData, "content");

  if (!blockId || !content) {
    throw new Error("Missing required fields");
  }

  await updateSimpleContentBlock({
    formData,
    blockId,
    blockType: "text",
    data: normalizeTextBlockData({ content }),
  });
}

export async function createNoteBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !title || !content) {
    throw new Error("Missing required fields");
  }

  await createValidatedBlock({
    formData,
    sectionId,
    blockType: "note",
    buildData: () => normalizeNoteBlockData({ title, content }),
  });
}

export async function updateNoteBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const title = getTrimmedString(formData, "title");
  const content = getTrimmedString(formData, "content");

  if (!blockId || !title || !content) {
    throw new Error("Missing required fields");
  }

  await updateValidatedBlock({
    formData,
    blockId,
    blockType: "note",
    buildData: () => normalizeNoteBlockData({ title, content }),
  });
}

export async function createCalloutBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !content) {
    throw new Error("Missing required fields");
  }

  await createSimpleContentBlock({
    formData,
    sectionId,
    blockType: "callout",
    data: normalizeCalloutBlockData({ title, content }),
  });
}

export async function updateCalloutBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const title = getTrimmedString(formData, "title");
  const content = getTrimmedString(formData, "content");

  if (!blockId || !content) {
    throw new Error("Missing required fields");
  }

  await updateSimpleContentBlock({
    formData,
    blockId,
    blockType: "callout",
    data: normalizeCalloutBlockData({ title, content }),
  });
}

export async function createExamTipBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !content) {
    throw new Error("Missing required fields");
  }

  await createSimpleContentBlock({
    formData,
    sectionId,
    blockType: "exam-tip",
    data: normalizeExamTipBlockData({ title, content }),
  });
}

export async function updateExamTipBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const title = getTrimmedString(formData, "title");
  const content = getTrimmedString(formData, "content");

  if (!blockId || !content) {
    throw new Error("Missing required fields");
  }

  await updateSimpleContentBlock({
    formData,
    blockId,
    blockType: "exam-tip",
    data: normalizeExamTipBlockData({ title, content }),
  });
}

export async function createImageBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const src = getTrimmedString(formData, "src");
  const alt = getTrimmedString(formData, "alt");
  const caption = getTrimmedString(formData, "caption");

  if (!sectionId || !src) {
    throw new Error("Missing required fields");
  }

  await createValidatedBlock({
    formData,
    sectionId,
    blockType: "image",
    buildData: () => normalizeImageBlockData({ src, alt, caption }),
  });
}

export async function updateImageBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const src = getTrimmedString(formData, "src");
  const alt = getTrimmedString(formData, "alt");
  const caption = getTrimmedString(formData, "caption");

  if (!blockId || !src) {
    throw new Error("Missing required fields");
  }

  await updateValidatedBlock({
    formData,
    blockId,
    blockType: "image",
    buildData: () => normalizeImageBlockData({ src, alt, caption }),
  });
}

export async function createAudioBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const src = getTrimmedString(formData, "src");
  const caption = getTrimmedString(formData, "caption");
  const autoPlay = getBoolean(formData, "autoPlay");

  if (!sectionId || !src) {
    throw new Error("Missing required fields");
  }

  await createValidatedBlock({
    formData,
    sectionId,
    blockType: "audio",
    buildData: () => normalizeAudioBlockData({ title, src, caption, autoPlay }),
  });
}

export async function updateAudioBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const title = getTrimmedString(formData, "title");
  const src = getTrimmedString(formData, "src");
  const caption = getTrimmedString(formData, "caption");
  const autoPlay = getBoolean(formData, "autoPlay");

  if (!blockId || !src) {
    throw new Error("Missing required fields");
  }

  await updateValidatedBlock({
    formData,
    blockId,
    blockType: "audio",
    buildData: () => normalizeAudioBlockData({ title, src, caption, autoPlay }),
  });
}

export async function createVocabularyBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const itemsRaw = getTrimmedString(formData, "items");

  if (!sectionId || !title || !itemsRaw) {
    throw new Error("Missing required fields");
  }

  await createValidatedBlock({
    formData,
    sectionId,
    blockType: "vocabulary",
    buildData: () =>
      normalizeVocabularyBlockData({
        title,
        items: itemsRaw,
      }),
  });
}

export async function updateVocabularyBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const title = getTrimmedString(formData, "title");
  const itemsRaw = getTrimmedString(formData, "items");

  if (!blockId || !title || !itemsRaw) {
    throw new Error("Missing required fields");
  }

  await updateValidatedBlock({
    formData,
    blockId,
    blockType: "vocabulary",
    buildData: () =>
      normalizeVocabularyBlockData({
        title,
        items: itemsRaw,
      }),
  });
}

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

export async function createQuestionSetBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const questionSetSlug = getTrimmedString(formData, "questionSetSlug");

  if (!sectionId || !questionSetSlug) {
    throw new Error("Missing required fields");
  }

  await createValidatedBlock({
    formData,
    sectionId,
    blockType: "question-set",
    buildData: () =>
      normalizeQuestionSetBlockData({
        title,
        questionSetSlug,
      }),
  });
}

export async function updateQuestionSetBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const title = getTrimmedString(formData, "title");
  const questionSetSlug = getTrimmedString(formData, "questionSetSlug");

  if (!blockId || !questionSetSlug) {
    throw new Error("Missing required fields");
  }

  await updateValidatedBlock({
    formData,
    blockId,
    blockType: "question-set",
    buildData: () =>
      normalizeQuestionSetBlockData({
        title,
        questionSetSlug,
      }),
  });
}

export async function createVocabularySetBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const vocabularySetSlug = getTrimmedString(formData, "vocabularySetSlug");

  if (!sectionId || !vocabularySetSlug) {
    throw new Error("Missing required fields");
  }

  await createValidatedBlock({
    formData,
    sectionId,
    blockType: "vocabulary-set",
    buildData: async () => {
      await ensureVocabularySetExists(vocabularySetSlug);

      return normalizeVocabularySetBlockData({
        title,
        vocabularySetSlug,
      });
    },
  });
}

export async function updateVocabularySetBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const title = getTrimmedString(formData, "title");
  const vocabularySetSlug = getTrimmedString(formData, "vocabularySetSlug");

  if (!blockId || !vocabularySetSlug) {
    throw new Error("Missing required fields");
  }

  await updateValidatedBlock({
    formData,
    blockId,
    blockType: "vocabulary-set",
    buildData: async () => {
      await ensureVocabularySetExists(vocabularySetSlug);

      return normalizeVocabularySetBlockData({
        title,
        vocabularySetSlug,
      });
    },
  });
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

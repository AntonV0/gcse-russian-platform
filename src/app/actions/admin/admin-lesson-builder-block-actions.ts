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

type SimpleContentBlockType = "header" | "subheader" | "text" | "callout" | "exam-tip";

type RegistryBlockType =
  | SimpleContentBlockType
  | "note"
  | "image"
  | "audio"
  | "vocabulary"
  | "question-set"
  | "vocabulary-set";

type BlockRegistryEntry = {
  normalize: (formData: FormData) => Record<string, unknown>;
  validate?: (formData: FormData) => Promise<void>;
};

const blockRegistry: Record<RegistryBlockType, BlockRegistryEntry> = {
  header: {
    normalize(formData) {
      return normalizeHeaderBlockData({
        content: getTrimmedString(formData, "content"),
      });
    },
  },

  subheader: {
    normalize(formData) {
      return normalizeSubheaderBlockData({
        content: getTrimmedString(formData, "content"),
      });
    },
  },

  text: {
    normalize(formData) {
      return normalizeTextBlockData({
        content: getTrimmedString(formData, "content"),
      });
    },
  },

  callout: {
    normalize(formData) {
      return normalizeCalloutBlockData({
        title: getTrimmedString(formData, "title"),
        content: getTrimmedString(formData, "content"),
      });
    },
  },

  "exam-tip": {
    normalize(formData) {
      return normalizeExamTipBlockData({
        title: getTrimmedString(formData, "title"),
        content: getTrimmedString(formData, "content"),
      });
    },
  },

  note: {
    normalize(formData) {
      return normalizeNoteBlockData({
        title: getTrimmedString(formData, "title"),
        content: getTrimmedString(formData, "content"),
      });
    },
  },

  image: {
    normalize(formData) {
      return normalizeImageBlockData({
        src: getTrimmedString(formData, "src"),
        alt: getTrimmedString(formData, "alt"),
        caption: getTrimmedString(formData, "caption"),
      });
    },
  },

  audio: {
    normalize(formData) {
      return normalizeAudioBlockData({
        title: getTrimmedString(formData, "title"),
        src: getTrimmedString(formData, "src"),
        caption: getTrimmedString(formData, "caption"),
        autoPlay: getBoolean(formData, "autoPlay"),
      });
    },
  },

  vocabulary: {
    normalize(formData) {
      return normalizeVocabularyBlockData({
        title: getTrimmedString(formData, "title"),
        items: getTrimmedString(formData, "items"),
      });
    },
  },

  "question-set": {
    normalize(formData) {
      return normalizeQuestionSetBlockData({
        title: getTrimmedString(formData, "title"),
        questionSetSlug: getTrimmedString(formData, "questionSetSlug"),
      });
    },
  },

  "vocabulary-set": {
    async validate(formData) {
      const vocabularySetSlug = getTrimmedString(formData, "vocabularySetSlug");
      const vocabularySet = await getVocabularySetBySlugDb(vocabularySetSlug);

      if (!vocabularySet) {
        throw new Error("Selected vocabulary set does not exist");
      }
    },
    normalize(formData) {
      return normalizeVocabularySetBlockData({
        title: getTrimmedString(formData, "title"),
        vocabularySetSlug: getTrimmedString(formData, "vocabularySetSlug"),
      });
    },
  },
};

function getBlockRegistryEntry(blockType: RegistryBlockType) {
  return blockRegistry[blockType];
}

async function createBlock(params: {
  formData: FormData;
  sectionId: string;
  blockType: RegistryBlockType;
  isPublished?: boolean;
}) {
  const entry = getBlockRegistryEntry(params.blockType);

  if (entry.validate) {
    await entry.validate(params.formData);
  }

  const data = entry.normalize(params.formData);
  const supabase = await createClient();
  const nextPosition = await getNextBlockPosition(params.sectionId);

  const { error } = await supabase.from("lesson_blocks").insert({
    lesson_section_id: params.sectionId,
    block_type: params.blockType,
    position: nextPosition,
    is_published: params.isPublished ?? true,
    data,
    settings: {},
  });

  if (error) {
    console.error(`Error creating ${params.blockType} block:`, error);
    throw new Error(`Failed to create ${params.blockType} block`);
  }

  await finalizeLessonMutation(params.formData);
}

async function updateBlock(params: {
  formData: FormData;
  blockId: string;
  blockType: RegistryBlockType;
}) {
  const entry = getBlockRegistryEntry(params.blockType);

  if (entry.validate) {
    await entry.validate(params.formData);
  }

  const data = entry.normalize(params.formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_blocks")
    .update({
      data,
    })
    .eq("id", params.blockId)
    .eq("block_type", params.blockType);

  if (error) {
    console.error(`Error updating ${params.blockType} block:`, error);
    throw new Error(`Failed to update ${params.blockType} block`);
  }

  await finalizeLessonMutation(params.formData);
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
  if (!sectionId || !getTrimmedString(formData, "content")) {
    throw new Error("Missing required fields");
  }

  await createBlock({
    formData,
    sectionId,
    blockType: "header",
  });
}

export async function updateHeaderBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  if (!blockId || !getTrimmedString(formData, "content")) {
    throw new Error("Missing required fields");
  }

  await updateBlock({
    formData,
    blockId,
    blockType: "header",
  });
}

export async function createSubheaderBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  if (!sectionId || !getTrimmedString(formData, "content")) {
    throw new Error("Missing required fields");
  }

  await createBlock({
    formData,
    sectionId,
    blockType: "subheader",
  });
}

export async function updateSubheaderBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  if (!blockId || !getTrimmedString(formData, "content")) {
    throw new Error("Missing required fields");
  }

  await updateBlock({
    formData,
    blockId,
    blockType: "subheader",
  });
}

export async function createDividerBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");

  if (!sectionId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();
  const nextPosition = await getNextBlockPosition(sectionId);

  const { error } = await supabase.from("lesson_blocks").insert({
    lesson_section_id: sectionId,
    block_type: "divider",
    position: nextPosition,
    is_published: true,
    data: {},
    settings: {},
  });

  if (error) {
    console.error("Error creating divider block:", error);
    throw new Error("Failed to create divider block");
  }

  await finalizeLessonMutation(formData);
}

export async function createTextBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  if (!sectionId || !getTrimmedString(formData, "content")) {
    throw new Error("Missing required fields");
  }

  await createBlock({
    formData,
    sectionId,
    blockType: "text",
  });
}

export async function updateTextBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  if (!blockId || !getTrimmedString(formData, "content")) {
    throw new Error("Missing required fields");
  }

  await updateBlock({
    formData,
    blockId,
    blockType: "text",
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

  await createBlock({
    formData,
    sectionId,
    blockType: "note",
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

  await updateBlock({
    formData,
    blockId,
    blockType: "note",
  });
}

export async function createCalloutBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !content) {
    throw new Error("Missing required fields");
  }

  await createBlock({
    formData,
    sectionId,
    blockType: "callout",
  });
}

export async function updateCalloutBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const content = getTrimmedString(formData, "content");

  if (!blockId || !content) {
    throw new Error("Missing required fields");
  }

  await updateBlock({
    formData,
    blockId,
    blockType: "callout",
  });
}

export async function createExamTipBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !content) {
    throw new Error("Missing required fields");
  }

  await createBlock({
    formData,
    sectionId,
    blockType: "exam-tip",
  });
}

export async function updateExamTipBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const content = getTrimmedString(formData, "content");

  if (!blockId || !content) {
    throw new Error("Missing required fields");
  }

  await updateBlock({
    formData,
    blockId,
    blockType: "exam-tip",
  });
}

export async function createImageBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const src = getTrimmedString(formData, "src");

  if (!sectionId || !src) {
    throw new Error("Missing required fields");
  }

  await createBlock({
    formData,
    sectionId,
    blockType: "image",
  });
}

export async function updateImageBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const src = getTrimmedString(formData, "src");

  if (!blockId || !src) {
    throw new Error("Missing required fields");
  }

  await updateBlock({
    formData,
    blockId,
    blockType: "image",
  });
}

export async function createAudioBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const src = getTrimmedString(formData, "src");

  if (!sectionId || !src) {
    throw new Error("Missing required fields");
  }

  await createBlock({
    formData,
    sectionId,
    blockType: "audio",
  });
}

export async function updateAudioBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const src = getTrimmedString(formData, "src");

  if (!blockId || !src) {
    throw new Error("Missing required fields");
  }

  await updateBlock({
    formData,
    blockId,
    blockType: "audio",
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

  await createBlock({
    formData,
    sectionId,
    blockType: "vocabulary",
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

  await updateBlock({
    formData,
    blockId,
    blockType: "vocabulary",
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

  const nextPosition = await getNextBlockPosition(sectionId);

  const { error: insertError } = await supabase.from("lesson_blocks").insert({
    lesson_section_id: sectionId,
    block_type: block.block_type,
    position: nextPosition,
    is_published: false,
    data: block.data ?? {},
    settings: block.settings ?? {},
  });

  if (insertError) {
    console.error("Error duplicating block:", insertError);
    throw new Error("Failed to duplicate block");
  }

  await finalizeLessonMutation(formData);
}

export async function createQuestionSetBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const questionSetSlug = getTrimmedString(formData, "questionSetSlug");

  if (!sectionId || !questionSetSlug) {
    throw new Error("Missing required fields");
  }

  await createBlock({
    formData,
    sectionId,
    blockType: "question-set",
  });
}

export async function updateQuestionSetBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const questionSetSlug = getTrimmedString(formData, "questionSetSlug");

  if (!blockId || !questionSetSlug) {
    throw new Error("Missing required fields");
  }

  await updateBlock({
    formData,
    blockId,
    blockType: "question-set",
  });
}

export async function createVocabularySetBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const vocabularySetSlug = getTrimmedString(formData, "vocabularySetSlug");

  if (!sectionId || !vocabularySetSlug) {
    throw new Error("Missing required fields");
  }

  await createBlock({
    formData,
    sectionId,
    blockType: "vocabulary-set",
  });
}

export async function updateVocabularySetBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const vocabularySetSlug = getTrimmedString(formData, "vocabularySetSlug");

  if (!blockId || !vocabularySetSlug) {
    throw new Error("Missing required fields");
  }

  await updateBlock({
    formData,
    blockId,
    blockType: "vocabulary-set",
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
    orderedIds: reordered.map((block) => block.id),
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

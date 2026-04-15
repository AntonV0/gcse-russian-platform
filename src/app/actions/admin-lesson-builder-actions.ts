"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/admin-auth";
import { getPresetBlocksForInsert } from "@/lib/lesson-block-presets";
import { resolveSectionKind } from "@/lib/lesson-blocks";
import {
  getBlocksForSectionTemplate,
  getSectionTemplateById,
} from "@/lib/lesson-section-templates";
import { lessonTemplates } from "@/lib/lesson-templates";
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
  requireString,
  optionalString,
} from "@/lib/lesson-blocks";

function getTrimmedString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "true";
}

function getAdminLessonPath(params: {
  courseId: string;
  variantId: string;
  moduleId: string;
  lessonId: string;
}) {
  return `/admin/content/courses/${params.courseId}/variants/${params.variantId}/modules/${params.moduleId}/lessons/${params.lessonId}`;
}

function getPublicLessonPath(params: {
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}) {
  return `/courses/${params.courseSlug}/${params.variantSlug}/modules/${params.moduleSlug}/lessons/${params.lessonSlug}`;
}

function getRouteRedirectPath(formData: FormData) {
  const courseId = getTrimmedString(formData, "courseId");
  const variantId = getTrimmedString(formData, "variantId");
  const moduleId = getTrimmedString(formData, "moduleId");
  const lessonId = getTrimmedString(formData, "lessonId");

  return `/admin/content/courses/${courseId}/variants/${variantId}/modules/${moduleId}/lessons/${lessonId}`;
}

function revalidateLessonTemplatePaths() {
  revalidatePath("/admin/lesson-templates");
  revalidatePath("/admin/lesson-templates/block-presets");
}

function revalidateLessonSectionTemplatePaths() {
  revalidatePath("/admin/lesson-templates");
  revalidatePath("/admin/lesson-templates/section-templates");
}

async function revalidateLessonPaths(formData: FormData) {
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

async function getNextSectionPosition(lessonId: string) {
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

async function getNextBlockPosition(sectionId: string) {
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

async function createSimpleContentBlock(params: {
  formData: FormData;
  sectionId: string;
  blockType: "header" | "subheader" | "text" | "callout" | "exam-tip";
  data: Record<string, unknown>;
}) {
  const supabase = await createClient();
  const nextPosition = await getNextBlockPosition(params.sectionId);

  const { error } = await supabase.from("lesson_blocks").insert({
    lesson_section_id: params.sectionId,
    block_type: params.blockType,
    position: nextPosition,
    is_published: true,
    data: params.data,
    settings: {},
  });

  if (error) {
    console.error(`Error creating ${params.blockType} block:`, error);
    throw new Error(`Failed to create ${params.blockType} block`);
  }

  await revalidateLessonPaths(params.formData);
}

async function updateSimpleContentBlock(params: {
  formData: FormData;
  blockId: string;
  blockType: "header" | "subheader" | "text" | "callout" | "exam-tip";
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

  await revalidateLessonPaths(params.formData);
}

export async function insertBlockPresetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const presetId = getTrimmedString(formData, "presetId");

  if (!sectionId || !presetId) {
    throw new Error("Missing required fields");
  }

  const presetBlocks = getPresetBlocksForInsert(presetId);
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

  await revalidateLessonPaths(formData);
}

export async function createSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const lessonId = getTrimmedString(formData, "lessonId");
  const title = getTrimmedString(formData, "title");
  const description = getTrimmedString(formData, "description");
  const sectionKind = getTrimmedString(formData, "sectionKind") || "content";

  if (!lessonId || !title) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();
  const nextPosition = await getNextSectionPosition(lessonId);

  const { error } = await supabase.from("lesson_sections").insert({
    lesson_id: lessonId,
    title,
    description: description || null,
    section_kind: sectionKind,
    position: nextPosition,
    is_published: true,
    settings: {},
  });

  if (error) {
    console.error("Error creating lesson section:", error);
    throw new Error("Failed to create section");
  }

  await revalidateLessonPaths(formData);
}

export async function duplicateSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const lessonId = getTrimmedString(formData, "lessonId");
  const sectionId = getTrimmedString(formData, "sectionId");

  if (!lessonId || !sectionId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data: section, error: sectionError } = await supabase
    .from("lesson_sections")
    .select("*")
    .eq("id", sectionId)
    .single();

  if (sectionError || !section) {
    console.error("Error loading section for duplication:", sectionError);
    throw new Error("Failed to load section");
  }

  const nextSectionPosition = await getNextSectionPosition(lessonId);

  const { data: newSection, error: insertSectionError } = await supabase
    .from("lesson_sections")
    .insert({
      lesson_id: lessonId,
      title: `${section.title} (Copy)`,
      description: section.description,
      section_kind: section.section_kind,
      position: nextSectionPosition,
      is_published: false,
      settings: section.settings ?? {},
    })
    .select("*")
    .single();

  if (insertSectionError || !newSection) {
    console.error("Error duplicating section:", insertSectionError);
    throw new Error("Failed to duplicate section");
  }

  const { data: blocks, error: blocksError } = await supabase
    .from("lesson_blocks")
    .select("*")
    .eq("lesson_section_id", sectionId)
    .order("position", { ascending: true });

  if (blocksError) {
    console.error("Error loading section blocks for duplication:", blocksError);
    throw new Error("Failed to duplicate section blocks");
  }

  if (blocks && blocks.length > 0) {
    const duplicatedBlocks = blocks.map((block, index) => ({
      lesson_section_id: newSection.id,
      block_type: block.block_type,
      position: index + 1,
      is_published: false,
      data: block.data ?? {},
      settings: block.settings ?? {},
    }));

    const { error: insertBlocksError } = await supabase
      .from("lesson_blocks")
      .insert(duplicatedBlocks);

    if (insertBlocksError) {
      console.error("Error inserting duplicated blocks:", insertBlocksError);
      throw new Error("Failed to duplicate section blocks");
    }
  }

  await revalidateLessonPaths(formData);
}

export async function updateSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const description = getTrimmedString(formData, "description");
  const sectionKind = getTrimmedString(formData, "sectionKind") || "content";

  if (!sectionId || !title) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_sections")
    .update({
      title,
      description: description || null,
      section_kind: sectionKind,
    })
    .eq("id", sectionId);

  if (error) {
    console.error("Error updating lesson section:", error);
    throw new Error("Failed to update section");
  }

  await revalidateLessonPaths(formData);
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

  await revalidateLessonPaths(formData);
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

  const supabase = await createClient();
  const nextPosition = await getNextBlockPosition(sectionId);

  const { error } = await supabase.from("lesson_blocks").insert({
    lesson_section_id: sectionId,
    block_type: "note",
    position: nextPosition,
    is_published: true,
    data: normalizeNoteBlockData({ title, content }),
    settings: {},
  });

  if (error) {
    console.error("Error creating note block:", error);
    throw new Error("Failed to create note block");
  }

  await revalidateLessonPaths(formData);
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

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_blocks")
    .update({
      data: normalizeNoteBlockData({ title, content }),
    })
    .eq("id", blockId)
    .eq("block_type", "note");

  if (error) {
    console.error("Error updating note block:", error);
    throw new Error("Failed to update note block");
  }

  await revalidateLessonPaths(formData);
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

  const supabase = await createClient();
  const nextPosition = await getNextBlockPosition(sectionId);

  const { error } = await supabase.from("lesson_blocks").insert({
    lesson_section_id: sectionId,
    block_type: "image",
    position: nextPosition,
    is_published: true,
    data: normalizeImageBlockData({ src, alt, caption }),
    settings: {},
  });

  if (error) {
    console.error("Error creating image block:", error);
    throw new Error("Failed to create image block");
  }

  await revalidateLessonPaths(formData);
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

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_blocks")
    .update({
      data: normalizeImageBlockData({ src, alt, caption }),
    })
    .eq("id", blockId)
    .eq("block_type", "image");

  if (error) {
    console.error("Error updating image block:", error);
    throw new Error("Failed to update image block");
  }

  await revalidateLessonPaths(formData);
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

  const supabase = await createClient();
  const nextPosition = await getNextBlockPosition(sectionId);

  const { error } = await supabase.from("lesson_blocks").insert({
    lesson_section_id: sectionId,
    block_type: "audio",
    position: nextPosition,
    is_published: true,
    data: normalizeAudioBlockData({ title, src, caption, autoPlay }),
    settings: {},
  });

  if (error) {
    console.error("Error creating audio block:", error);
    throw new Error("Failed to create audio block");
  }

  await revalidateLessonPaths(formData);
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

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_blocks")
    .update({
      data: normalizeAudioBlockData({ title, src, caption, autoPlay }),
    })
    .eq("id", blockId)
    .eq("block_type", "audio");

  if (error) {
    console.error("Error updating audio block:", error);
    throw new Error("Failed to update audio block");
  }

  await revalidateLessonPaths(formData);
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

  const supabase = await createClient();
  const nextPosition = await getNextBlockPosition(sectionId);

  const { error } = await supabase.from("lesson_blocks").insert({
    lesson_section_id: sectionId,
    block_type: "vocabulary",
    position: nextPosition,
    is_published: true,
    data: normalizeVocabularyBlockData({
      title,
      items: itemsRaw,
    }),
    settings: {},
  });

  if (error) {
    console.error("Error creating vocabulary block:", error);
    throw new Error("Failed to create vocabulary block");
  }

  await revalidateLessonPaths(formData);
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

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_blocks")
    .update({
      data: normalizeVocabularyBlockData({
        title,
        items: itemsRaw,
      }),
    })
    .eq("id", blockId)
    .eq("block_type", "vocabulary");

  if (error) {
    console.error("Error updating vocabulary block:", error);
    throw new Error("Failed to update vocabulary block");
  }

  await revalidateLessonPaths(formData);
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

  await revalidateLessonPaths(formData);
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

  const supabase = await createClient();
  const nextPosition = await getNextBlockPosition(sectionId);

  const { error } = await supabase.from("lesson_blocks").insert({
    lesson_section_id: sectionId,
    block_type: "question-set",
    position: nextPosition,
    is_published: true,
    data: normalizeQuestionSetBlockData({
      title,
      questionSetSlug,
    }),
    settings: {},
  });

  if (error) {
    console.error("Error creating question-set block:", error);
    throw new Error("Failed to create question-set block");
  }

  await revalidateLessonPaths(formData);
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

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_blocks")
    .update({
      data: normalizeQuestionSetBlockData({
        title,
        questionSetSlug,
      }),
    })
    .eq("id", blockId)
    .eq("block_type", "question-set");

  if (error) {
    console.error("Error updating question-set block:", error);
    throw new Error("Failed to update question-set block");
  }

  await revalidateLessonPaths(formData);
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

  const supabase = await createClient();
  const nextPosition = await getNextBlockPosition(sectionId);

  const { error } = await supabase.from("lesson_blocks").insert({
    lesson_section_id: sectionId,
    block_type: "vocabulary-set",
    position: nextPosition,
    is_published: true,
    data: normalizeVocabularySetBlockData({
      title,
      vocabularySetSlug,
    }),
    settings: {},
  });

  if (error) {
    console.error("Error creating vocabulary-set block:", error);
    throw new Error("Failed to create vocabulary-set block");
  }

  await revalidateLessonPaths(formData);
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

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_blocks")
    .update({
      data: normalizeVocabularySetBlockData({
        title,
        vocabularySetSlug,
      }),
    })
    .eq("id", blockId)
    .eq("block_type", "vocabulary-set");

  if (error) {
    console.error("Error updating vocabulary-set block:", error);
    throw new Error("Failed to update vocabulary-set block");
  }

  await revalidateLessonPaths(formData);
}

export async function deleteSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");

  if (!sectionId) {
    throw new Error("Missing section id");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("lesson_sections").delete().eq("id", sectionId);

  if (error) {
    console.error("Error deleting lesson section:", error);
    throw new Error("Failed to delete section");
  }

  await revalidateLessonPaths(formData);
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

  await revalidateLessonPaths(formData);
}

export async function moveSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const lessonId = getTrimmedString(formData, "lessonId");
  const sectionId = getTrimmedString(formData, "sectionId");
  const direction = getTrimmedString(formData, "direction");

  if (!lessonId || !sectionId) {
    throw new Error("Missing required fields");
  }

  if (direction !== "up" && direction !== "down") {
    throw new Error("Invalid move direction");
  }

  const supabase = await createClient();

  const { data: sections, error } = await supabase
    .from("lesson_sections")
    .select("id, position")
    .eq("lesson_id", lessonId)
    .order("position", { ascending: true });

  if (error || !sections) {
    console.error("Error loading lesson sections for reorder:", error);
    throw new Error("Failed to load sections");
  }

  const currentIndex = sections.findIndex((section) => section.id === sectionId);

  if (currentIndex === -1) {
    throw new Error("Section not found in lesson");
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= sections.length) {
    await revalidateLessonPaths(formData);
  }

  const reordered = [...sections];
  const [movedItem] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, movedItem);

  for (let index = 0; index < reordered.length; index += 1) {
    const section = reordered[index];
    const temporaryPosition = 1000 + index;

    const { error: tempError } = await supabase
      .from("lesson_sections")
      .update({ position: temporaryPosition })
      .eq("id", section.id)
      .eq("lesson_id", lessonId);

    if (tempError) {
      console.error("Error setting temporary section position:", tempError);
      throw new Error("Failed to reorder sections");
    }
  }

  for (let index = 0; index < reordered.length; index += 1) {
    const section = reordered[index];
    const finalPosition = index + 1;

    const { error: finalError } = await supabase
      .from("lesson_sections")
      .update({ position: finalPosition })
      .eq("id", section.id)
      .eq("lesson_id", lessonId);

    if (finalError) {
      console.error("Error setting final section position:", finalError);
      throw new Error("Failed to reorder sections");
    }
  }

  await revalidateLessonPaths(formData);
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
    await revalidateLessonPaths(formData);
  }

  const reordered = [...blocks];
  const [movedItem] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, movedItem);

  for (let index = 0; index < reordered.length; index += 1) {
    const block = reordered[index];
    const temporaryPosition = 1000 + index;

    const { error: tempError } = await supabase
      .from("lesson_blocks")
      .update({ position: temporaryPosition })
      .eq("id", block.id)
      .eq("lesson_section_id", sectionId);

    if (tempError) {
      console.error("Error setting temporary block position:", tempError);
      throw new Error("Failed to reorder blocks");
    }
  }

  for (let index = 0; index < reordered.length; index += 1) {
    const block = reordered[index];
    const finalPosition = index + 1;

    const { error: finalError } = await supabase
      .from("lesson_blocks")
      .update({ position: finalPosition })
      .eq("id", block.id)
      .eq("lesson_section_id", sectionId);

    if (finalError) {
      console.error("Error setting final block position:", finalError);
      throw new Error("Failed to reorder blocks");
    }
  }

  await revalidateLessonPaths(formData);
}

export async function toggleSectionPublishedAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const nextState = getTrimmedString(formData, "nextState");

  if (!sectionId) {
    throw new Error("Missing section id");
  }

  if (nextState !== "published" && nextState !== "draft") {
    throw new Error("Invalid section state");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_sections")
    .update({
      is_published: nextState === "published",
    })
    .eq("id", sectionId);

  if (error) {
    console.error("Error toggling section published state:", error);
    throw new Error("Failed to update section state");
  }

  await revalidateLessonPaths(formData);
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

  await revalidateLessonPaths(formData);
}

export async function reorderSectionsAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const lessonId = getTrimmedString(formData, "lessonId");
  const orderedSectionIdsRaw = getTrimmedString(formData, "orderedSectionIds");

  if (!lessonId || !orderedSectionIdsRaw) {
    throw new Error("Missing required fields");
  }

  const orderedSectionIds = orderedSectionIdsRaw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (orderedSectionIds.length === 0) {
    throw new Error("No section ids provided");
  }

  const supabase = await createClient();

  // Phase 1: move reordered items to temporary negative positions
  for (let index = 0; index < orderedSectionIds.length; index += 1) {
    const sectionId = orderedSectionIds[index];

    const { error } = await supabase
      .from("lesson_sections")
      .update({ position: -1 * (index + 1) })
      .eq("id", sectionId)
      .eq("lesson_id", lessonId);

    if (error) {
      console.error("Error setting temporary section positions:", error);
      throw new Error(`Failed to reorder sections: ${error.message}`);
    }
  }

  // Phase 2: write final positions
  for (let index = 0; index < orderedSectionIds.length; index += 1) {
    const sectionId = orderedSectionIds[index];

    const { error } = await supabase
      .from("lesson_sections")
      .update({ position: index + 1 })
      .eq("id", sectionId)
      .eq("lesson_id", lessonId);

    if (error) {
      console.error("Error setting final section positions:", error);
      throw new Error(`Failed to reorder sections: ${error.message}`);
    }
  }

  const redirectPath = getRouteRedirectPath(formData);
  revalidatePath(redirectPath);
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

  const supabase = await createClient();

  // Phase 1: temporary negative positions
  for (let index = 0; index < orderedBlockIds.length; index += 1) {
    const blockId = orderedBlockIds[index];

    const { error } = await supabase
      .from("lesson_blocks")
      .update({ position: -1 * (index + 1) })
      .eq("id", blockId)
      .eq("lesson_section_id", sectionId);

    if (error) {
      console.error("Error setting temporary block positions:", error);
      throw new Error(`Failed to reorder blocks: ${error.message}`);
    }
  }

  // Phase 2: final positions
  for (let index = 0; index < orderedBlockIds.length; index += 1) {
    const blockId = orderedBlockIds[index];

    const { error } = await supabase
      .from("lesson_blocks")
      .update({ position: index + 1 })
      .eq("id", blockId)
      .eq("lesson_section_id", sectionId);

    if (error) {
      console.error("Error setting final block positions:", error);
      throw new Error(`Failed to reorder blocks: ${error.message}`);
    }
  }

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
    return;
  }

  const supabase = await createClient();

  const { data: existingBlock, error: existingBlockError } = await supabase
    .from("lesson_blocks")
    .select("id, lesson_section_id, position")
    .eq("id", blockId)
    .single();

  if (existingBlockError || !existingBlock) {
    console.error("Error loading block before moving:", existingBlockError);
    throw new Error("Block not found");
  }

  const { data: targetBlocks, error: targetBlocksError } = await supabase
    .from("lesson_blocks")
    .select("id, position")
    .eq("lesson_section_id", targetSectionId)
    .order("position", { ascending: true });

  if (targetBlocksError) {
    console.error("Error loading target section blocks:", targetBlocksError);
    throw new Error(`Failed to load target section blocks: ${targetBlocksError.message}`);
  }

  const nextTargetPosition = (targetBlocks?.length ?? 0) + 1;

  // Step 1: move the block to the target section at the end
  const { error: moveError } = await supabase
    .from("lesson_blocks")
    .update({
      lesson_section_id: targetSectionId,
      position: nextTargetPosition,
    })
    .eq("id", blockId)
    .eq("lesson_section_id", sourceSectionId);

  if (moveError) {
    console.error("Error moving block to new section:", moveError);
    throw new Error(`Failed to move block: ${moveError.message}`);
  }

  // Step 2: re-normalize source section positions
  const { data: sourceBlocksAfterMove, error: sourceBlocksError } = await supabase
    .from("lesson_blocks")
    .select("id, position")
    .eq("lesson_section_id", sourceSectionId)
    .order("position", { ascending: true });

  if (sourceBlocksError) {
    console.error("Error loading source section blocks after move:", sourceBlocksError);
    throw new Error(
      `Failed to refresh source section blocks: ${sourceBlocksError.message}`
    );
  }

  for (let index = 0; index < (sourceBlocksAfterMove?.length ?? 0); index += 1) {
    const sourceBlock = sourceBlocksAfterMove![index];

    const { error } = await supabase
      .from("lesson_blocks")
      .update({ position: -1 * (index + 1) })
      .eq("id", sourceBlock.id);

    if (error) {
      console.error("Error setting temporary source positions:", error);
      throw new Error(`Failed to normalize source section: ${error.message}`);
    }
  }

  for (let index = 0; index < (sourceBlocksAfterMove?.length ?? 0); index += 1) {
    const sourceBlock = sourceBlocksAfterMove![index];

    const { error } = await supabase
      .from("lesson_blocks")
      .update({ position: index + 1 })
      .eq("id", sourceBlock.id);

    if (error) {
      console.error("Error setting final source positions:", error);
      throw new Error(`Failed to normalize source section: ${error.message}`);
    }
  }

  const redirectPath = getRouteRedirectPath(formData);
  revalidatePath(redirectPath);
}

export async function insertSectionTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const lessonId = getTrimmedString(formData, "lessonId");
  const templateId = getTrimmedString(formData, "templateId");

  if (!lessonId || !templateId) {
    throw new Error("Missing required fields");
  }

  const template = getSectionTemplateById(templateId);
  const blocks = getBlocksForSectionTemplate(templateId);
  const supabase = await createClient();

  const nextSectionPosition = await getNextSectionPosition(lessonId);

  const { data: insertedSection, error: sectionError } = await supabase
    .from("lesson_sections")
    .insert({
      lesson_id: lessonId,
      title: template.title,
      description: template.description,
      section_kind: template.sectionKind,
      position: nextSectionPosition,
      is_published: true,
      settings: {},
    })
    .select("id")
    .single();

  if (sectionError || !insertedSection) {
    console.error("Error inserting section template:", sectionError);
    throw new Error(
      `Failed to insert section template: ${sectionError?.message ?? "Unknown error"}`
    );
  }

  if (blocks.length > 0) {
    const rows = blocks.map((block, index) => ({
      lesson_section_id: insertedSection.id,
      block_type: block.blockType,
      position: index + 1,
      is_published: true,
      data: block.data,
      settings: {},
    }));

    const { error: blocksError } = await supabase.from("lesson_blocks").insert(rows);

    if (blocksError) {
      console.error("Error inserting section template blocks:", blocksError);
      throw new Error(`Failed to insert section template blocks: ${blocksError.message}`);
    }
  }

  await revalidateLessonPaths(formData);
}

export async function insertLessonTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const lessonId = getTrimmedString(formData, "lessonId");
  const templateId = getTrimmedString(formData, "templateId");

  if (!lessonId || !templateId) {
    throw new Error("Missing required fields");
  }

  const template = lessonTemplates.find((item) => item.id === templateId);

  if (!template) {
    throw new Error("Lesson template not found");
  }

  const supabase = await createClient();
  const startingSectionPosition = await getNextSectionPosition(lessonId);

  for (let sectionIndex = 0; sectionIndex < template.sections.length; sectionIndex += 1) {
    const sectionTemplate = template.sections[sectionIndex];
    const baseTemplate = getSectionTemplateById(sectionTemplate.sectionTemplateId);
    const blocks = getBlocksForSectionTemplate(sectionTemplate.sectionTemplateId);

    const { data: insertedSection, error: sectionError } = await supabase
      .from("lesson_sections")
      .insert({
        lesson_id: lessonId,
        title: sectionTemplate.title,
        description: baseTemplate.description,
        section_kind: sectionTemplate.sectionKind,
        position: startingSectionPosition + sectionIndex,
        is_published: true,
        settings: {},
      })
      .select("id")
      .single();

    if (sectionError || !insertedSection) {
      console.error("Error inserting lesson template section:", sectionError);
      throw new Error(
        `Failed to insert lesson template section: ${sectionError?.message ?? "Unknown error"}`
      );
    }

    if (blocks.length > 0) {
      const rows = blocks.map((block, blockIndex) => ({
        lesson_section_id: insertedSection.id,
        block_type: block.blockType,
        position: blockIndex + 1,
        is_published: true,
        data: block.data,
        settings: {},
      }));

      const { error: blocksError } = await supabase.from("lesson_blocks").insert(rows);

      if (blocksError) {
        console.error("Error inserting lesson template blocks:", blocksError);
        throw new Error(
          `Failed to insert lesson template blocks: ${blocksError.message}`
        );
      }
    }
  }

  await revalidateLessonPaths(formData);
}

export async function createLessonBlockPresetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getTrimmedString(formData, "description");

  if (!title || !slug) {
    throw new Error("Title and slug are required");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("lesson_block_presets").insert({
    title,
    slug,
    description: description || null,
    is_active: true,
  });

  if (error) {
    console.error("Error creating lesson block preset:", error);
    throw new Error(`Failed to create block preset: ${error.message}`);
  }

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

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_block_presets")
    .update({
      title,
      slug,
      description: description || null,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", presetId);

  if (error) {
    console.error("Error updating lesson block preset:", error);
    throw new Error(`Failed to update block preset: ${error.message}`);
  }

  revalidateLessonTemplatePaths();
  revalidatePath(`/admin/lesson-templates/block-presets/${presetId}`);
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

type TemplateBlockType =
  | "header"
  | "subheader"
  | "divider"
  | "text"
  | "note"
  | "callout"
  | "exam-tip"
  | "vocabulary"
  | "image"
  | "audio"
  | "question-set"
  | "vocabulary-set";

function normalizeTemplateBlockData(
  blockType: TemplateBlockType,
  formData: FormData
): Record<string, unknown> {
  switch (blockType) {
    case "header":
      return normalizeHeaderBlockData({
        content: getTrimmedString(formData, "content"),
      });

    case "subheader":
      return normalizeSubheaderBlockData({
        content: getTrimmedString(formData, "content"),
      });

    case "divider":
      return {};

    case "text":
      return normalizeTextBlockData({
        content: getTrimmedString(formData, "content"),
      });

    case "note":
      return normalizeNoteBlockData({
        title: getTrimmedString(formData, "title"),
        content: getTrimmedString(formData, "content"),
      });

    case "callout":
      return normalizeCalloutBlockData({
        title: getTrimmedString(formData, "title"),
        content: getTrimmedString(formData, "content"),
      });

    case "exam-tip":
      return normalizeExamTipBlockData({
        title: getTrimmedString(formData, "title"),
        content: getTrimmedString(formData, "content"),
      });

    case "image":
      return normalizeImageBlockData({
        src: getTrimmedString(formData, "src"),
        alt: getTrimmedString(formData, "alt"),
        caption: getTrimmedString(formData, "caption"),
      });

    case "audio":
      return normalizeAudioBlockData({
        title: getTrimmedString(formData, "title"),
        src: getTrimmedString(formData, "src"),
        caption: getTrimmedString(formData, "caption"),
        autoPlay: String(formData.get("autoPlay") || "") === "true",
      });

    case "vocabulary":
      return normalizeVocabularyBlockData({
        title: getTrimmedString(formData, "title"),
        items: getTrimmedString(formData, "items"),
      });

    case "question-set":
      return normalizeQuestionSetBlockData({
        title: getTrimmedString(formData, "title"),
        questionSetSlug: getTrimmedString(formData, "questionSetSlug"),
      });

    case "vocabulary-set":
      return normalizeVocabularySetBlockData({
        title: getTrimmedString(formData, "title"),
        vocabularySetSlug: getTrimmedString(formData, "vocabularySetSlug"),
      });

    default:
      throw new Error(`Unsupported template block type: ${blockType}`);
  }
}

async function getNextLessonBlockPresetBlockPosition(presetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_block_preset_blocks")
    .select("position")
    .eq("lesson_block_preset_id", presetId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error getting next lesson block preset block position:", error);
    throw new Error(`Failed to get next preset block position: ${error.message}`);
  }

  return data?.position ? data.position + 1 : 1;
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
  const position = await getNextLessonBlockPresetBlockPosition(presetId);
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

  revalidateLessonTemplatePaths();
  revalidatePath(`/admin/lesson-templates/block-presets/${presetId}`);
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

  revalidateLessonTemplatePaths();
  revalidatePath(`/admin/lesson-templates/block-presets/${presetId}`);
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

  const { data: remainingBlocks, error: loadError } = await supabase
    .from("lesson_block_preset_blocks")
    .select("id")
    .eq("lesson_block_preset_id", presetId)
    .order("position", { ascending: true });

  if (loadError) {
    console.error("Error loading remaining preset blocks:", loadError);
    throw new Error(`Failed to normalize preset block order: ${loadError.message}`);
  }

  for (let index = 0; index < (remainingBlocks?.length ?? 0); index += 1) {
    const row = remainingBlocks![index];

    const { error: tempError } = await supabase
      .from("lesson_block_preset_blocks")
      .update({ position: -1 * (index + 1) })
      .eq("id", row.id);

    if (tempError) {
      console.error("Error setting temporary preset block positions:", tempError);
      throw new Error(`Failed to normalize preset block order: ${tempError.message}`);
    }
  }

  for (let index = 0; index < (remainingBlocks?.length ?? 0); index += 1) {
    const row = remainingBlocks![index];

    const { error: finalError } = await supabase
      .from("lesson_block_preset_blocks")
      .update({ position: index + 1 })
      .eq("id", row.id);

    if (finalError) {
      console.error("Error setting final preset block positions:", finalError);
      throw new Error(`Failed to normalize preset block order: ${finalError.message}`);
    }
  }

  revalidateLessonTemplatePaths();
  revalidatePath(`/admin/lesson-templates/block-presets/${presetId}`);
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

  const supabase = await createClient();

  for (let index = 0; index < orderedPresetBlockIds.length; index += 1) {
    const presetBlockId = orderedPresetBlockIds[index];

    const { error } = await supabase
      .from("lesson_block_preset_blocks")
      .update({ position: -1 * (index + 1) })
      .eq("id", presetBlockId)
      .eq("lesson_block_preset_id", presetId);

    if (error) {
      console.error("Error setting temporary preset block positions:", error);
      throw new Error(`Failed to reorder preset blocks: ${error.message}`);
    }
  }

  for (let index = 0; index < orderedPresetBlockIds.length; index += 1) {
    const presetBlockId = orderedPresetBlockIds[index];

    const { error } = await supabase
      .from("lesson_block_preset_blocks")
      .update({ position: index + 1 })
      .eq("id", presetBlockId)
      .eq("lesson_block_preset_id", presetId);

    if (error) {
      console.error("Error setting final preset block positions:", error);
      throw new Error(`Failed to reorder preset blocks: ${error.message}`);
    }
  }

  revalidateLessonTemplatePaths();
  revalidatePath(`/admin/lesson-templates/block-presets/${presetId}`);
}

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
  const supabase = await createClient();

  const { error } = await supabase.from("lesson_section_templates").insert({
    title,
    slug,
    description: description || null,
    default_section_title: defaultSectionTitle,
    default_section_kind: defaultSectionKind,
    is_active: true,
  });

  if (error) {
    console.error("Error creating lesson section template:", error);
    throw new Error(`Failed to create section template: ${error.message}`);
  }

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
  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_section_templates")
    .update({
      title,
      slug,
      description: description || null,
      default_section_title: defaultSectionTitle,
      default_section_kind: defaultSectionKind,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", templateId);

  if (error) {
    console.error("Error updating lesson section template:", error);
    throw new Error(`Failed to update section template: ${error.message}`);
  }

  revalidateLessonSectionTemplatePaths();
  revalidatePath(`/admin/lesson-templates/section-templates/${templateId}`);
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

async function getNextLessonSectionTemplatePresetPosition(templateId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_section_template_presets")
    .select("position")
    .eq("lesson_section_template_id", templateId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error getting next lesson section template preset position:", error);
    throw new Error(
      `Failed to get next section template preset position: ${error.message}`
    );
  }

  return data?.position ? data.position + 1 : 1;
}

export async function addPresetToLessonSectionTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const templateId = getTrimmedString(formData, "templateId");
  const presetId = getTrimmedString(formData, "presetId");

  if (!templateId || !presetId) {
    throw new Error("Template id and preset id are required");
  }

  const position = await getNextLessonSectionTemplatePresetPosition(templateId);
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

  revalidateLessonSectionTemplatePaths();
  revalidatePath(`/admin/lesson-templates/section-templates/${templateId}`);
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

  const { data: remainingLinks, error: loadError } = await supabase
    .from("lesson_section_template_presets")
    .select("lesson_block_preset_id")
    .eq("lesson_section_template_id", templateId)
    .order("position", { ascending: true });

  if (loadError) {
    console.error("Error loading remaining section template preset links:", loadError);
    throw new Error(
      `Failed to normalize section template preset order: ${loadError.message}`
    );
  }

  for (let index = 0; index < (remainingLinks?.length ?? 0); index += 1) {
    const row = remainingLinks![index];

    const { error: tempError } = await supabase
      .from("lesson_section_template_presets")
      .update({ position: -1 * (index + 1) })
      .eq("lesson_section_template_id", templateId)
      .eq("lesson_block_preset_id", row.lesson_block_preset_id);

    if (tempError) {
      console.error(
        "Error setting temporary section template preset positions:",
        tempError
      );
      throw new Error(
        `Failed to normalize section template preset order: ${tempError.message}`
      );
    }
  }

  for (let index = 0; index < (remainingLinks?.length ?? 0); index += 1) {
    const row = remainingLinks![index];

    const { error: finalError } = await supabase
      .from("lesson_section_template_presets")
      .update({ position: index + 1 })
      .eq("lesson_section_template_id", templateId)
      .eq("lesson_block_preset_id", row.lesson_block_preset_id);

    if (finalError) {
      console.error("Error setting final section template preset positions:", finalError);
      throw new Error(
        `Failed to normalize section template preset order: ${finalError.message}`
      );
    }
  }

  revalidateLessonSectionTemplatePaths();
  revalidatePath(`/admin/lesson-templates/section-templates/${templateId}`);
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

  const supabase = await createClient();

  for (let index = 0; index < orderedPresetIds.length; index += 1) {
    const presetId = orderedPresetIds[index];

    const { error } = await supabase
      .from("lesson_section_template_presets")
      .update({ position: -1 * (index + 1) })
      .eq("lesson_section_template_id", templateId)
      .eq("lesson_block_preset_id", presetId);

    if (error) {
      console.error("Error setting temporary section template preset positions:", error);
      throw new Error(`Failed to reorder section template presets: ${error.message}`);
    }
  }

  for (let index = 0; index < orderedPresetIds.length; index += 1) {
    const presetId = orderedPresetIds[index];

    const { error } = await supabase
      .from("lesson_section_template_presets")
      .update({ position: index + 1 })
      .eq("lesson_section_template_id", templateId)
      .eq("lesson_block_preset_id", presetId);

    if (error) {
      console.error("Error setting final section template preset positions:", error);
      throw new Error(`Failed to reorder section template presets: ${error.message}`);
    }
  }

  revalidateLessonSectionTemplatePaths();
  revalidatePath(`/admin/lesson-templates/section-templates/${templateId}`);
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/admin-auth";

function getTrimmedString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "true";
}

function parseVocabularyItems(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [russian, english] = line.split("|").map((part) => part?.trim() ?? "");

      if (!russian || !english) {
        throw new Error("Vocabulary lines must use the format: russian | english");
      }

      return { russian, english };
    });
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
    data: { content },
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
    data: { content },
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
    data: { content },
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
    data: { content },
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
    data: { content },
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
    data: { content },
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
    data: { title, content },
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
      data: { title, content },
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
    data: { title: title || undefined, content },
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
    data: { title: title || undefined, content },
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
    data: { title: title || undefined, content },
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
    data: { title: title || undefined, content },
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
    data: {
      src,
      alt: alt || undefined,
      caption: caption || undefined,
    },
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
      data: {
        src,
        alt: alt || undefined,
        caption: caption || undefined,
      },
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
    data: {
      title: title || undefined,
      src,
      caption: caption || undefined,
      autoPlay,
    },
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
      data: {
        title: title || undefined,
        src,
        caption: caption || undefined,
        autoPlay,
      },
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

  const items = parseVocabularyItems(itemsRaw);

  const supabase = await createClient();
  const nextPosition = await getNextBlockPosition(sectionId);

  const { error } = await supabase.from("lesson_blocks").insert({
    lesson_section_id: sectionId,
    block_type: "vocabulary",
    position: nextPosition,
    is_published: true,
    data: {
      title,
      items,
    },
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

  const items = parseVocabularyItems(itemsRaw);

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_blocks")
    .update({
      data: {
        title,
        items,
      },
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
    data: {
      title: title || undefined,
      questionSetSlug,
    },
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
      data: {
        title: title || undefined,
        questionSetSlug,
      },
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
    data: {
      title: title || undefined,
      vocabularySetSlug,
    },
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
      data: {
        title: title || undefined,
        vocabularySetSlug,
      },
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

  // Phase 1: move reordered items to temporary negative positions
  for (let index = 0; index < orderedBlockIds.length; index += 1) {
    const blockId = orderedBlockIds[index];

    const { error } = await supabase
      .from("lesson_blocks")
      .update({ position: -1 * (index + 1) })
      .eq("id", blockId)
      .eq("section_id", sectionId);

    if (error) {
      console.error("Error setting temporary block positions:", error);
      throw new Error(`Failed to reorder blocks: ${error.message}`);
    }
  }

  // Phase 2: write final positions
  for (let index = 0; index < orderedBlockIds.length; index += 1) {
    const blockId = orderedBlockIds[index];

    const { error } = await supabase
      .from("lesson_blocks")
      .update({ position: index + 1 })
      .eq("id", blockId)
      .eq("section_id", sectionId);

    if (error) {
      console.error("Error setting final block positions:", error);
      throw new Error(`Failed to reorder blocks: ${error.message}`);
    }
  }

  const redirectPath = getRouteRedirectPath(formData);
  revalidatePath(redirectPath);
}

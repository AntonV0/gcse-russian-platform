"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { resolveSectionKind } from "@/lib/lessons/lesson-blocks";
import {
  getLessonTemplateInsertDataDb,
  getSectionTemplateInsertDataDb,
} from "@/lib/lessons/lesson-template-helpers-db";
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
import {
  finalizeLessonMutation,
  getNextSectionPosition,
  getTrimmedString,
  reorderTablePositions,
  revalidateLessonSectionTemplatePaths,
  revalidateLessonTemplateEntityPaths,
  revalidateLessonTemplatePaths,
} from "@/app/actions/admin/admin-lesson-builder-shared";

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

async function getNextLessonTemplateSectionPosition(templateId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_template_sections")
    .select("position")
    .eq("lesson_template_id", templateId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error getting next lesson template section position:", error);
    throw new Error(
      `Failed to get next lesson template section position: ${error.message}`
    );
  }

  return data?.position ? data.position + 1 : 1;
}

export async function insertSectionTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const lessonId = getTrimmedString(formData, "lessonId");
  const templateId = getTrimmedString(formData, "templateId");

  if (!lessonId || !templateId) {
    throw new Error("Missing required fields");
  }

  const templateData = await getSectionTemplateInsertDataDb(templateId);
  const supabase = await createClient();

  const nextSectionPosition = await getNextSectionPosition(lessonId);

  const { data: insertedSection, error: sectionError } = await supabase
    .from("lesson_sections")
    .insert({
      lesson_id: lessonId,
      title: templateData.template.default_section_title,
      description: templateData.template.description,
      section_kind: templateData.template.default_section_kind,
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

  if (templateData.blocks.length > 0) {
    const rows = templateData.blocks.map((block, index) => ({
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

  await finalizeLessonMutation(formData);
}

export async function insertLessonTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const lessonId = getTrimmedString(formData, "lessonId");
  const templateId = getTrimmedString(formData, "templateId");

  if (!lessonId || !templateId) {
    throw new Error("Missing required fields");
  }

  const templateData = await getLessonTemplateInsertDataDb(templateId);
  const supabase = await createClient();
  const startingSectionPosition = await getNextSectionPosition(lessonId);

  for (
    let sectionIndex = 0;
    sectionIndex < templateData.sections.length;
    sectionIndex += 1
  ) {
    const section = templateData.sections[sectionIndex];

    const { data: insertedSection, error: sectionError } = await supabase
      .from("lesson_sections")
      .insert({
        lesson_id: lessonId,
        title: section.title,
        description: section.description,
        section_kind: section.sectionKind,
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

    if (section.blocks.length > 0) {
      const rows = section.blocks.map((block, blockIndex) => ({
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

  await finalizeLessonMutation(formData);
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

  await reorderTablePositions({
    table: "lesson_block_preset_blocks",
    orderedIds: (remainingBlocks ?? []).map((row) => row.id as string),
    scope: {
      lesson_block_preset_id: presetId,
    },
  });

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

  await reorderTablePositions({
    table: "lesson_block_preset_blocks",
    orderedIds: orderedPresetBlockIds,
    scope: {
      lesson_block_preset_id: presetId,
    },
  });

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

  await reorderTablePositions({
    table: "lesson_section_template_presets",
    orderedIds: (remainingLinks ?? []).map((row) => row.lesson_block_preset_id as string),
    idColumn: "lesson_block_preset_id",
    scope: {
      lesson_section_template_id: templateId,
    },
  });

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

  await reorderTablePositions({
    table: "lesson_section_template_presets",
    orderedIds: orderedPresetIds,
    idColumn: "lesson_block_preset_id",
    scope: {
      lesson_section_template_id: templateId,
    },
  });

  revalidateLessonSectionTemplatePaths();
  revalidatePath(`/admin/lesson-templates/section-templates/${templateId}`);
}

export async function createLessonTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getTrimmedString(formData, "description");

  if (!title || !slug) {
    throw new Error("Title and slug are required");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("lesson_templates").insert({
    title,
    slug,
    description: description || null,
    is_active: true,
  });

  if (error) {
    console.error("Error creating lesson template:", error);
    throw new Error(`Failed to create lesson template: ${error.message}`);
  }

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

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_templates")
    .update({
      title,
      slug,
      description: description || null,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", templateId);

  if (error) {
    console.error("Error updating lesson template:", error);
    throw new Error(`Failed to update lesson template: ${error.message}`);
  }

  revalidateLessonTemplateEntityPaths();
  revalidatePath(`/admin/lesson-templates/lesson-templates/${templateId}`);
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

  const position = await getNextLessonTemplateSectionPosition(templateId);
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

  revalidateLessonTemplateEntityPaths();
  revalidatePath(`/admin/lesson-templates/lesson-templates/${templateId}`);
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

  revalidateLessonTemplateEntityPaths();
  revalidatePath(`/admin/lesson-templates/lesson-templates/${templateId}`);
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

  const { data: remainingRows, error: loadError } = await supabase
    .from("lesson_template_sections")
    .select("id")
    .eq("lesson_template_id", templateId)
    .order("position", { ascending: true });

  if (loadError) {
    console.error("Error loading remaining lesson template sections:", loadError);
    throw new Error(
      `Failed to normalize lesson template section order: ${loadError.message}`
    );
  }

  await reorderTablePositions({
    table: "lesson_template_sections",
    orderedIds: (remainingRows ?? []).map((row) => row.id as string),
    scope: {
      lesson_template_id: templateId,
    },
  });

  revalidateLessonTemplateEntityPaths();
  revalidatePath(`/admin/lesson-templates/lesson-templates/${templateId}`);
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

  revalidateLessonTemplateEntityPaths();
  revalidatePath(`/admin/lesson-templates/lesson-templates/${templateId}`);
}

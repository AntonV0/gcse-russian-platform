import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
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
  getTrimmedString,
  reorderTablePositions,
  revalidateLessonSectionTemplatePaths,
  revalidateLessonTemplateEntityPaths,
  revalidateLessonTemplatePaths,
} from "@/app/actions/admin/admin-lesson-builder-shared";

export type TemplateBlockType =
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

type PositionTableConfig =
  | {
      table: "lesson_block_preset_blocks";
      positionColumnScope: "lesson_block_preset_id";
      scopeValue: string;
    }
  | {
      table: "lesson_section_template_presets";
      positionColumnScope: "lesson_section_template_id";
      scopeValue: string;
    }
  | {
      table: "lesson_template_sections";
      positionColumnScope: "lesson_template_id";
      scopeValue: string;
    };

export function normalizeTemplateBlockData(
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
        vocabularyListSlug: getTrimmedString(formData, "vocabularyListSlug"),
      });

    default:
      throw new Error(`Unsupported template block type: ${blockType}`);
  }
}

export async function getNextPosition(config: PositionTableConfig) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(config.table)
    .select("position")
    .eq(config.positionColumnScope, config.scopeValue)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(`Error getting next position for ${config.table}:`, error);
    throw new Error(`Failed to get next position: ${error.message}`);
  }

  return data?.position ? data.position + 1 : 1;
}

export async function revalidatePresetDetailPath(presetId: string) {
  revalidateLessonTemplatePaths();
  revalidatePath(`/admin/lesson-templates/block-presets/${presetId}`);
}

export async function revalidateSectionTemplateDetailPath(templateId: string) {
  revalidateLessonSectionTemplatePaths();
  revalidatePath(`/admin/lesson-templates/section-templates/${templateId}`);
}

export async function revalidateLessonTemplateDetailPath(templateId: string) {
  revalidateLessonTemplateEntityPaths();
  revalidatePath(`/admin/lesson-templates/lesson-templates/${templateId}`);
}

export async function reorderRemainingRows(params: {
  table:
    | "lesson_block_preset_blocks"
    | "lesson_section_template_presets"
    | "lesson_template_sections";
  selectIdField: "id";
  scope:
    | { lesson_block_preset_id: string }
    | { lesson_section_template_id: string }
    | { lesson_template_id: string };
}) {
  const supabase = await createClient();
  const [scopeKey, scopeValue] = Object.entries(params.scope)[0] as [string, string];

  const { data, error } = await supabase
    .from(params.table)
    .select(params.selectIdField)
    .eq(scopeKey, scopeValue)
    .order("position", { ascending: true });

  if (error) {
    console.error(`Error loading remaining rows from ${params.table}:`, error);
    throw new Error(`Failed to normalize order: ${error.message}`);
  }

  await reorderTablePositions({
    table: params.table,
    orderedIds: (data ?? []).map((row) => row.id as string),
    scope: params.scope,
  });
}

export async function insertLessonBlocksForSection(params: {
  lessonSectionId: string;
  blocks: {
    blockType: string;
    data: Record<string, unknown>;
  }[];
}) {
  if (params.blocks.length === 0) {
    return;
  }

  const supabase = await createClient();

  const rows = params.blocks.map((block, index) => ({
    lesson_section_id: params.lessonSectionId,
    block_type: block.blockType,
    position: index + 1,
    is_published: true,
    data: block.data,
    settings: {},
  }));

  const { error } = await supabase.from("lesson_blocks").insert(rows);

  if (error) {
    console.error("Error inserting lesson template blocks:", error);
    throw new Error(`Failed to insert lesson template blocks: ${error.message}`);
  }
}

export async function createLessonBlockPresetEntity(params: {
  title: string;
  slug: string;
  description: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("lesson_block_presets").insert({
    title: params.title,
    slug: params.slug,
    description: params.description || null,
    is_active: true,
  });

  if (error) {
    console.error("Error creating lesson block preset:", error);
    throw new Error(`Failed to create block preset: ${error.message}`);
  }
}

export async function updateLessonBlockPresetEntity(params: {
  presetId: string;
  title: string;
  slug: string;
  description: string;
  isActive: boolean;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_block_presets")
    .update({
      title: params.title,
      slug: params.slug,
      description: params.description || null,
      is_active: params.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.presetId);

  if (error) {
    console.error("Error updating lesson block preset:", error);
    throw new Error(`Failed to update block preset: ${error.message}`);
  }
}

export async function createLessonSectionTemplateEntity(params: {
  title: string;
  slug: string;
  description: string;
  defaultSectionTitle: string;
  defaultSectionKind: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("lesson_section_templates").insert({
    title: params.title,
    slug: params.slug,
    description: params.description || null,
    default_section_title: params.defaultSectionTitle,
    default_section_kind: params.defaultSectionKind,
    is_active: true,
  });

  if (error) {
    console.error("Error creating lesson section template:", error);
    throw new Error(`Failed to create section template: ${error.message}`);
  }
}

export async function updateLessonSectionTemplateEntity(params: {
  templateId: string;
  title: string;
  slug: string;
  description: string;
  defaultSectionTitle: string;
  defaultSectionKind: string;
  isActive: boolean;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_section_templates")
    .update({
      title: params.title,
      slug: params.slug,
      description: params.description || null,
      default_section_title: params.defaultSectionTitle,
      default_section_kind: params.defaultSectionKind,
      is_active: params.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.templateId);

  if (error) {
    console.error("Error updating lesson section template:", error);
    throw new Error(`Failed to update section template: ${error.message}`);
  }
}

export async function createLessonTemplateEntity(params: {
  title: string;
  slug: string;
  description: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("lesson_templates").insert({
    title: params.title,
    slug: params.slug,
    description: params.description || null,
    is_active: true,
  });

  if (error) {
    console.error("Error creating lesson template:", error);
    throw new Error(`Failed to create lesson template: ${error.message}`);
  }
}

export async function updateLessonTemplateEntity(params: {
  templateId: string;
  title: string;
  slug: string;
  description: string;
  isActive: boolean;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_templates")
    .update({
      title: params.title,
      slug: params.slug,
      description: params.description || null,
      is_active: params.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.templateId);

  if (error) {
    console.error("Error updating lesson template:", error);
    throw new Error(`Failed to update lesson template: ${error.message}`);
  }
}

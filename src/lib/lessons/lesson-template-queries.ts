import { createClient } from "@/lib/supabase/server";

import {
  LESSON_BLOCK_PRESET_BLOCK_SELECT,
  LESSON_BLOCK_PRESET_SELECT,
  LESSON_SECTION_TEMPLATE_PRESET_SELECT,
  LESSON_SECTION_TEMPLATE_SELECT,
  LESSON_TEMPLATE_SECTION_SELECT,
  LESSON_TEMPLATE_SELECT,
} from "./lesson-template-selects";
import type {
  DbLessonBlockPreset,
  DbLessonBlockPresetBlock,
  DbLessonSectionTemplate,
  DbLessonSectionTemplatePreset,
  DbLessonTemplate,
  DbLessonTemplateSection,
} from "./lesson-template-types";

export async function getLessonBlockPresetsDb(): Promise<DbLessonBlockPreset[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_block_presets")
    .select(LESSON_BLOCK_PRESET_SELECT)
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching lesson block presets:", error);
    return [];
  }

  return (data ?? []) as DbLessonBlockPreset[];
}

export async function getLessonBlockPresetBlocksDb(
  presetIds: string[]
): Promise<DbLessonBlockPresetBlock[]> {
  if (presetIds.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_block_preset_blocks")
    .select(LESSON_BLOCK_PRESET_BLOCK_SELECT)
    .in("lesson_block_preset_id", presetIds)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lesson block preset blocks:", error);
    return [];
  }

  return (data ?? []) as DbLessonBlockPresetBlock[];
}

export async function getLessonSectionTemplatesDb(): Promise<DbLessonSectionTemplate[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_section_templates")
    .select(LESSON_SECTION_TEMPLATE_SELECT)
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching lesson section templates:", error);
    return [];
  }

  return (data ?? []) as DbLessonSectionTemplate[];
}

export async function getLessonSectionTemplatePresetsDb(
  templateIds: string[]
): Promise<DbLessonSectionTemplatePreset[]> {
  if (templateIds.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_section_template_presets")
    .select(LESSON_SECTION_TEMPLATE_PRESET_SELECT)
    .in("lesson_section_template_id", templateIds)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lesson section template presets:", error);
    return [];
  }

  return (data ?? []) as DbLessonSectionTemplatePreset[];
}

export async function getLessonTemplatesDb(): Promise<DbLessonTemplate[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_templates")
    .select(LESSON_TEMPLATE_SELECT)
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching lesson templates:", error);
    return [];
  }

  return (data ?? []) as DbLessonTemplate[];
}

export async function getLessonTemplateSectionsDb(
  templateIds: string[]
): Promise<DbLessonTemplateSection[]> {
  if (templateIds.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_template_sections")
    .select(LESSON_TEMPLATE_SECTION_SELECT)
    .in("lesson_template_id", templateIds)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lesson template sections:", error);
    return [];
  }

  return (data ?? []) as DbLessonTemplateSection[];
}

export async function getLessonBlockPresetByIdDb(
  presetId: string
): Promise<DbLessonBlockPreset | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_block_presets")
    .select(LESSON_BLOCK_PRESET_SELECT)
    .eq("id", presetId)
    .single();

  if (error) {
    console.error("Error fetching lesson block preset by id:", error);
    return null;
  }

  return data as DbLessonBlockPreset;
}

export async function getLessonBlockPresetBlocksByPresetIdDb(
  presetId: string
): Promise<DbLessonBlockPresetBlock[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_block_preset_blocks")
    .select(LESSON_BLOCK_PRESET_BLOCK_SELECT)
    .eq("lesson_block_preset_id", presetId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lesson block preset blocks by preset id:", error);
    return [];
  }

  return (data ?? []) as DbLessonBlockPresetBlock[];
}

export async function getLessonSectionTemplateByIdDb(
  templateId: string
): Promise<DbLessonSectionTemplate | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_section_templates")
    .select(LESSON_SECTION_TEMPLATE_SELECT)
    .eq("id", templateId)
    .single();

  if (error) {
    console.error("Error fetching lesson section template by id:", error);
    return null;
  }

  return data as DbLessonSectionTemplate;
}

export async function getLessonSectionTemplatePresetLinksByTemplateIdDb(
  templateId: string
): Promise<DbLessonSectionTemplatePreset[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_section_template_presets")
    .select(LESSON_SECTION_TEMPLATE_PRESET_SELECT)
    .eq("lesson_section_template_id", templateId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lesson section template preset links:", error);
    return [];
  }

  return (data ?? []) as DbLessonSectionTemplatePreset[];
}

export async function getLessonTemplateByIdDb(
  templateId: string
): Promise<DbLessonTemplate | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_templates")
    .select(LESSON_TEMPLATE_SELECT)
    .eq("id", templateId)
    .single();

  if (error) {
    console.error("Error fetching lesson template by id:", error);
    return null;
  }

  return data as DbLessonTemplate;
}

export async function getLessonTemplateSectionsByTemplateIdDb(
  templateId: string
): Promise<DbLessonTemplateSection[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_template_sections")
    .select(LESSON_TEMPLATE_SECTION_SELECT)
    .eq("lesson_template_id", templateId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lesson template sections by template id:", error);
    return [];
  }

  return (data ?? []) as DbLessonTemplateSection[];
}

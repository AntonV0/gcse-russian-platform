import { createClient } from "@/lib/supabase/server";

export type DbLessonBlockPreset = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DbLessonBlockPresetBlock = {
  id: string;
  lesson_block_preset_id: string;
  block_type: string;
  position: number;
  data: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DbLessonSectionTemplate = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  default_section_title: string;
  default_section_kind: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DbLessonSectionTemplatePreset = {
  lesson_section_template_id: string;
  lesson_block_preset_id: string;
  position: number;
};

export type DbLessonTemplate = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DbLessonTemplateSection = {
  id: string;
  lesson_template_id: string;
  lesson_section_template_id: string;
  title_override: string | null;
  section_kind_override: string | null;
  position: number;
};

export async function getLessonBlockPresetsDb(): Promise<DbLessonBlockPreset[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_block_presets")
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
    .in("lesson_template_id", templateIds)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lesson template sections:", error);
    return [];
  }

  return (data ?? []) as DbLessonTemplateSection[];
}

export async function getLessonTemplateOverviewDb() {
  const [blockPresets, sectionTemplates, lessonTemplates] = await Promise.all([
    getLessonBlockPresetsDb(),
    getLessonSectionTemplatesDb(),
    getLessonTemplatesDb(),
  ]);

  const [presetBlocks, sectionTemplatePresets, lessonTemplateSections] =
    await Promise.all([
      getLessonBlockPresetBlocksDb(blockPresets.map((item) => item.id)),
      getLessonSectionTemplatePresetsDb(sectionTemplates.map((item) => item.id)),
      getLessonTemplateSectionsDb(lessonTemplates.map((item) => item.id)),
    ]);

  return {
    counts: {
      blockPresets: blockPresets.length,
      sectionTemplates: sectionTemplates.length,
      lessonTemplates: lessonTemplates.length,
      presetBlocks: presetBlocks.length,
      sectionTemplatePresetLinks: sectionTemplatePresets.length,
      lessonTemplateSections: lessonTemplateSections.length,
    },
    blockPresets,
    presetBlocks,
    sectionTemplates,
    sectionTemplatePresets,
    lessonTemplates,
    lessonTemplateSections,
  };
}

export async function getLessonBlockPresetByIdDb(
  presetId: string
): Promise<DbLessonBlockPreset | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_block_presets")
    .select("*")
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
    .select("*")
    .eq("lesson_block_preset_id", presetId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lesson block preset blocks by preset id:", error);
    return [];
  }

  return (data ?? []) as DbLessonBlockPresetBlock[];
}

export async function getLessonBlockPresetDetailDb(presetId: string) {
  const [preset, blocks] = await Promise.all([
    getLessonBlockPresetByIdDb(presetId),
    getLessonBlockPresetBlocksByPresetIdDb(presetId),
  ]);

  return {
    preset,
    blocks,
  };
}

export async function getLessonSectionTemplateByIdDb(
  templateId: string
): Promise<DbLessonSectionTemplate | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_section_templates")
    .select("*")
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
    .select("*")
    .eq("lesson_section_template_id", templateId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lesson section template preset links:", error);
    return [];
  }

  return (data ?? []) as DbLessonSectionTemplatePreset[];
}

export async function getLessonSectionTemplateDetailDb(templateId: string) {
  const [template, presetLinks, allPresets] = await Promise.all([
    getLessonSectionTemplateByIdDb(templateId),
    getLessonSectionTemplatePresetLinksByTemplateIdDb(templateId),
    getLessonBlockPresetsDb(),
  ]);

  return {
    template,
    presetLinks,
    allPresets,
  };
}

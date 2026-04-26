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

const LESSON_BLOCK_PRESET_SELECT =
  "id, slug, title, description, is_active, created_at, updated_at";
const LESSON_BLOCK_PRESET_BLOCK_SELECT =
  "id, lesson_block_preset_id, block_type, position, data, is_active, created_at, updated_at";
const LESSON_SECTION_TEMPLATE_SELECT =
  "id, slug, title, description, default_section_title, default_section_kind, is_active, created_at, updated_at";
const LESSON_SECTION_TEMPLATE_PRESET_SELECT =
  "lesson_section_template_id, lesson_block_preset_id, position";
const LESSON_TEMPLATE_SELECT =
  "id, slug, title, description, is_active, created_at, updated_at";
const LESSON_TEMPLATE_SECTION_SELECT =
  "id, lesson_template_id, lesson_section_template_id, title_override, section_kind_override, position";

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

export async function getLessonTemplateDetailDb(templateId: string) {
  const [template, templateSections, allSectionTemplates] = await Promise.all([
    getLessonTemplateByIdDb(templateId),
    getLessonTemplateSectionsByTemplateIdDb(templateId),
    getLessonSectionTemplatesDb(),
  ]);

  return {
    template,
    templateSections,
    allSectionTemplates,
  };
}

export type LessonBuilderBlockPresetOption = {
  id: string;
  label: string;
  description: string;
  blocksCount: number;
};

export type LessonBuilderSectionTemplateOption = {
  id: string;
  label: string;
  description: string;
  defaultSectionTitle: string;
  defaultSectionKind: string;
  presetCount: number;
};

export type LessonBuilderLessonTemplateOption = {
  id: string;
  label: string;
  description: string;
  sectionsCount: number;
};

export async function getLessonBuilderTemplateOptionsDb() {
  const [blockPresets, sectionTemplates, lessonTemplates] = await Promise.all([
    getLessonBlockPresetsDb(),
    getLessonSectionTemplatesDb(),
    getLessonTemplatesDb(),
  ]);

  const [presetBlocks, sectionTemplatePresetLinks, lessonTemplateSections] =
    await Promise.all([
      getLessonBlockPresetBlocksDb(blockPresets.map((item) => item.id)),
      getLessonSectionTemplatePresetsDb(sectionTemplates.map((item) => item.id)),
      getLessonTemplateSectionsDb(lessonTemplates.map((item) => item.id)),
    ]);

  const presetBlockCountById = new Map<string, number>();
  for (const block of presetBlocks) {
    presetBlockCountById.set(
      block.lesson_block_preset_id,
      (presetBlockCountById.get(block.lesson_block_preset_id) ?? 0) + 1
    );
  }

  const sectionTemplatePresetCountById = new Map<string, number>();
  for (const link of sectionTemplatePresetLinks) {
    sectionTemplatePresetCountById.set(
      link.lesson_section_template_id,
      (sectionTemplatePresetCountById.get(link.lesson_section_template_id) ?? 0) + 1
    );
  }

  const lessonTemplateSectionCountById = new Map<string, number>();
  for (const section of lessonTemplateSections) {
    lessonTemplateSectionCountById.set(
      section.lesson_template_id,
      (lessonTemplateSectionCountById.get(section.lesson_template_id) ?? 0) + 1
    );
  }

  return {
    blockPresets: blockPresets
      .filter((preset) => preset.is_active)
      .map<LessonBuilderBlockPresetOption>((preset) => ({
        id: preset.id,
        label: preset.title,
        description: preset.description ?? "",
        blocksCount: presetBlockCountById.get(preset.id) ?? 0,
      })),
    sectionTemplates: sectionTemplates
      .filter((template) => template.is_active)
      .map<LessonBuilderSectionTemplateOption>((template) => ({
        id: template.id,
        label: template.title,
        description: template.description ?? "",
        defaultSectionTitle: template.default_section_title,
        defaultSectionKind: template.default_section_kind,
        presetCount: sectionTemplatePresetCountById.get(template.id) ?? 0,
      })),
    lessonTemplates: lessonTemplates
      .filter((template) => template.is_active)
      .map<LessonBuilderLessonTemplateOption>((template) => ({
        id: template.id,
        label: template.title,
        description: template.description ?? "",
        sectionsCount: lessonTemplateSectionCountById.get(template.id) ?? 0,
      })),
  };
}

export async function getPresetBlocksForInsertDb(presetId: string) {
  const blocks = await getLessonBlockPresetBlocksByPresetIdDb(presetId);

  return blocks
    .filter((block) => block.is_active)
    .sort((a, b) => a.position - b.position)
    .map((block) => ({
      blockType: block.block_type,
      data: block.data ?? {},
    }));
}

export async function getSectionTemplateInsertDataDb(templateId: string) {
  const [template, presetLinks, allPresets] = await Promise.all([
    getLessonSectionTemplateByIdDb(templateId),
    getLessonSectionTemplatePresetLinksByTemplateIdDb(templateId),
    getLessonBlockPresetsDb(),
  ]);

  if (!template) {
    throw new Error("Section template not found");
  }

  const activePresetIds = new Set(
    allPresets.filter((preset) => preset.is_active).map((preset) => preset.id)
  );

  const orderedLinks = presetLinks
    .filter((link) => activePresetIds.has(link.lesson_block_preset_id))
    .sort((a, b) => a.position - b.position);

  const blocksPerPreset = await Promise.all(
    orderedLinks.map((link) => getPresetBlocksForInsertDb(link.lesson_block_preset_id))
  );

  return {
    template,
    blocks: blocksPerPreset.flat(),
  };
}

export async function getLessonTemplateInsertDataDb(templateId: string) {
  const [template, templateSections, sectionTemplates] = await Promise.all([
    getLessonTemplateByIdDb(templateId),
    getLessonTemplateSectionsByTemplateIdDb(templateId),
    getLessonSectionTemplatesDb(),
  ]);

  if (!template) {
    throw new Error("Lesson template not found");
  }

  const activeSectionTemplateIds = new Set(
    sectionTemplates.filter((item) => item.is_active).map((item) => item.id)
  );

  const orderedSections = templateSections
    .filter((section) => activeSectionTemplateIds.has(section.lesson_section_template_id))
    .sort((a, b) => a.position - b.position);

  const sectionData = await Promise.all(
    orderedSections.map(async (section) => {
      const base = await getSectionTemplateInsertDataDb(
        section.lesson_section_template_id
      );

      return {
        title: section.title_override || base.template.default_section_title,
        sectionKind: section.section_kind_override || base.template.default_section_kind,
        description: base.template.description,
        blocks: base.blocks,
      };
    })
  );

  return {
    template,
    sections: sectionData,
  };
}

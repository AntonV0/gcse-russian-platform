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

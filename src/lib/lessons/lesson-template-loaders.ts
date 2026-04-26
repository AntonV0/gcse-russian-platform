import {
  getLessonBlockPresetBlocksByPresetIdDb,
  getLessonBlockPresetBlocksDb,
  getLessonBlockPresetByIdDb,
  getLessonBlockPresetsDb,
  getLessonSectionTemplateByIdDb,
  getLessonSectionTemplatePresetLinksByTemplateIdDb,
  getLessonSectionTemplatePresetsDb,
  getLessonSectionTemplatesDb,
  getLessonTemplateByIdDb,
  getLessonTemplateSectionsByTemplateIdDb,
  getLessonTemplateSectionsDb,
  getLessonTemplatesDb,
} from "./lesson-template-queries";
import type {
  LessonBuilderBlockPresetOption,
  LessonBuilderLessonTemplateOption,
  LessonBuilderSectionTemplateOption,
} from "./lesson-template-types";

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

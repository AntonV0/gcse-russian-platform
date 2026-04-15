import { getPresetBlocksForInsert } from "@/lib/lesson-block-presets";
import { resolveSectionKind } from "@/lib/lesson-blocks";
import type { LessonSectionKind } from "@/types/lesson";

export type LessonSectionTemplate = {
  id: string;
  label: string;
  description: string;
  title: string;
  sectionKind: LessonSectionKind;
  presetIds: string[];
};

export const lessonSectionTemplates: LessonSectionTemplate[] = [
  {
    id: "grammar-teaching",
    label: "Grammar teaching section",
    description: "Good for explaining a grammar concept with support and practice.",
    title: "Grammar focus",
    sectionKind: "grammar",
    presetIds: ["teaching-explanation", "exam-skill"],
  },
  {
    id: "vocabulary-section",
    label: "Vocabulary section",
    description: "Vocabulary teaching followed by practice.",
    title: "Key vocabulary",
    sectionKind: "content",
    presetIds: ["vocabulary-teach-practice"],
  },
  {
    id: "practice-section",
    label: "Practice section",
    description: "Short practice-focused section with guidance.",
    title: "Practice",
    sectionKind: "practice",
    presetIds: ["exam-skill"],
  },
  {
    id: "summary-section",
    label: "Summary section",
    description: "Wrap up the lesson with a short recap.",
    title: "Summary",
    sectionKind: "summary",
    presetIds: ["teaching-explanation"],
  },
];

export function getSectionTemplateById(templateId: string): LessonSectionTemplate {
  const template = lessonSectionTemplates.find((item) => item.id === templateId);

  if (!template) {
    throw new Error("Section template not found");
  }

  return {
    ...template,
    sectionKind: resolveSectionKind(template.sectionKind),
  };
}

export function getBlocksForSectionTemplate(templateId: string) {
  const template = getSectionTemplateById(templateId);

  return template.presetIds.flatMap((presetId) => getPresetBlocksForInsert(presetId));
}

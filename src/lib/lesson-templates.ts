import type { LessonSectionKind } from "@/types/lesson";

export type LessonTemplateSection = {
  title: string;
  sectionKind: LessonSectionKind;
  sectionTemplateId: string;
};

export type LessonTemplate = {
  id: string;
  label: string;
  description: string;
  sections: LessonTemplateSection[];
};

export const lessonTemplates: LessonTemplate[] = [
  {
    id: "core-lesson",
    label: "Core lesson",
    description: "A balanced lesson with teaching, vocabulary, practice, and summary.",
    sections: [
      {
        title: "Introduction",
        sectionKind: "intro",
        sectionTemplateId: "grammar-teaching",
      },
      {
        title: "Key vocabulary",
        sectionKind: "content",
        sectionTemplateId: "vocabulary-section",
      },
      {
        title: "Practice",
        sectionKind: "practice",
        sectionTemplateId: "practice-section",
      },
      {
        title: "Summary",
        sectionKind: "summary",
        sectionTemplateId: "summary-section",
      },
    ],
  },
  {
    id: "grammar-heavy",
    label: "Grammar-heavy lesson",
    description: "Extra focus on concept explanation and exam technique.",
    sections: [
      {
        title: "Grammar focus",
        sectionKind: "grammar",
        sectionTemplateId: "grammar-teaching",
      },
      {
        title: "Guided practice",
        sectionKind: "practice",
        sectionTemplateId: "practice-section",
      },
      {
        title: "Summary",
        sectionKind: "summary",
        sectionTemplateId: "summary-section",
      },
    ],
  },
];

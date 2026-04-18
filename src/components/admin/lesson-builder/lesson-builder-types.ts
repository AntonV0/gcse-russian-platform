export type LessonBuilderTemplateOptions = {
  blockPresets: {
    id: string;
    label: string;
    description: string;
    blocksCount: number;
  }[];
  sectionTemplates: {
    id: string;
    label: string;
    description: string;
    defaultSectionTitle: string;
    defaultSectionKind: string;
    presetCount: number;
  }[];
  lessonTemplates: {
    id: string;
    label: string;
    description: string;
    sectionsCount: number;
  }[];
};

export type LessonSectionTrackVisibility = "shared" | "foundation_only" | "higher_only";

export type LessonSectionDeliveryVisibility = "all" | "self_study_only" | "volna_only";

export type AdminLessonBuilderProps = {
  lessonId: string;
  courseId: string;
  variantId: string;
  moduleId: string;
  lessonSlug: string;
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  sections: {
    id: string;
    title: string;
    description?: string | null;
    section_kind: string;
    position: number;
    is_published: boolean;
    track_visibility: LessonSectionTrackVisibility;
    delivery_visibility: LessonSectionDeliveryVisibility;
    canonical_section_key: string | null;
    blocks: {
      id: string;
      block_type: string;
      position: number;
      is_published: boolean;
      data: Record<string, unknown>;
    }[];
  }[];
  templateOptions: LessonBuilderTemplateOptions;
};

export type RouteFields = {
  courseId: string;
  variantId: string;
  moduleId: string;
  lessonId: string;
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
};

export type LessonSection = AdminLessonBuilderProps["sections"][number];
export type LessonBlock = LessonSection["blocks"][number];

export type NewBlockType =
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

export type DragSectionState = {
  sectionId: string;
} | null;

export type DragBlockState = {
  blockId: string;
} | null;

export type DraggedBlockContext = {
  blockId: string;
  sourceSectionId: string;
} | null;

export const SECTION_KIND_OPTIONS = [
  "intro",
  "content",
  "grammar",
  "practice",
  "reading_practice",
  "writing_practice",
  "speaking_practice",
  "listening_practice",
  "summary",
] as const;

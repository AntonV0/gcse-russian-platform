"use client";

import AdminLessonBuilderWorkspace from "@/components/admin/admin-lesson-builder-workspace";

type AdminLessonBuilderProps = {
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
    blocks: {
      id: string;
      block_type: string;
      position: number;
      is_published: boolean;
      data: Record<string, unknown>;
    }[];
  }[];
  templateOptions: {
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
};

export default function AdminLessonBuilder(props: AdminLessonBuilderProps) {
  return <AdminLessonBuilderWorkspace {...props} />;
}

import { createClient } from "@/lib/supabase/server";
import { mapDbBlockToLessonBlock, resolveSectionKind } from "@/lib/lesson-blocks";
import type { LessonSection } from "@/types/lesson";

export type DbLessonSection = {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  section_kind: string;
  position: number;
  is_published: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type DbLessonBlock = {
  id: string;
  lesson_section_id: string;
  block_type: string;
  position: number;
  data: Record<string, unknown>;
  is_published: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export async function getLessonSectionsByLessonIdDb(
  lessonId: string
): Promise<DbLessonSection[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_sections")
    .select("*")
    .eq("lesson_id", lessonId)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lesson sections:", { lessonId, error });
    return [];
  }

  return (data ?? []) as DbLessonSection[];
}

export async function getLessonBlocksBySectionIdsDb(
  sectionIds: string[]
): Promise<DbLessonBlock[]> {
  if (sectionIds.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_blocks")
    .select("*")
    .in("lesson_section_id", sectionIds)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lesson blocks:", { sectionIds, error });
    return [];
  }

  return (data ?? []) as DbLessonBlock[];
}

export async function loadLessonContentByLessonIdDb(
  lessonId: string
): Promise<{ lessonId: string; sections: LessonSection[] }> {
  const sections = await getLessonSectionsByLessonIdDb(lessonId);
  const sectionIds = sections.map((section) => section.id);
  const blocks = await getLessonBlocksBySectionIdsDb(sectionIds);

  const blocksBySectionId = new Map<string, DbLessonBlock[]>();

  for (const block of blocks) {
    const current = blocksBySectionId.get(block.lesson_section_id) ?? [];
    current.push(block);
    blocksBySectionId.set(block.lesson_section_id, current);
  }

  return {
    lessonId,
    sections: sections.map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description ?? undefined,
      sectionKind: resolveSectionKind(section.section_kind),
      position: section.position,
      blocks: (blocksBySectionId.get(section.id) ?? []).map(mapDbBlockToLessonBlock),
    })),
  };
}

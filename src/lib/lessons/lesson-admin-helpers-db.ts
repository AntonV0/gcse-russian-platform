"use server";

import { createClient } from "@/lib/supabase/server";

type DbLessonSectionRow = {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  section_kind: string;
  position: number;
  is_published: boolean;
  variant_visibility: "shared" | "foundation_only" | "higher_only" | "volna_only";
  canonical_section_key: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

type DbLessonBlockRow = {
  id: string;
  lesson_section_id: string;
  block_type: string;
  position: number;
  is_published: boolean;
  data: Record<string, unknown>;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

const LESSON_SECTION_SELECT =
  "id, lesson_id, title, description, section_kind, position, is_published, variant_visibility, canonical_section_key, settings, created_at, updated_at";
const LESSON_BLOCK_SELECT =
  "id, lesson_section_id, block_type, position, is_published, data, settings, created_at, updated_at";

export async function getLessonSectionsWithBlocksDb(lessonId: string) {
  const supabase = await createClient();

  const { data: sections, error: sectionsError } = await supabase
    .from("lesson_sections")
    .select(LESSON_SECTION_SELECT)
    .eq("lesson_id", lessonId)
    .order("position", { ascending: true });

  if (sectionsError) {
    console.error("Error loading sections:", sectionsError);
    return [];
  }

  const typedSections = (sections ?? []) as DbLessonSectionRow[];
  const sectionIds = typedSections.map((section) => section.id);

  if (sectionIds.length === 0) {
    return typedSections.map((section) => ({
      ...section,
      blocks: [] as DbLessonBlockRow[],
    }));
  }

  const { data: blocks, error: blocksError } = await supabase
    .from("lesson_blocks")
    .select(LESSON_BLOCK_SELECT)
    .in("lesson_section_id", sectionIds)
    .order("position", { ascending: true });

  if (blocksError) {
    console.error("Error loading blocks:", blocksError);
    return [];
  }

  const typedBlocks = (blocks ?? []) as DbLessonBlockRow[];
  const blocksBySection = new Map<string, DbLessonBlockRow[]>();

  for (const block of typedBlocks) {
    const existing = blocksBySection.get(block.lesson_section_id) ?? [];
    existing.push(block);
    blocksBySection.set(block.lesson_section_id, existing);
  }

  return typedSections.map((section) => ({
    ...section,
    blocks: blocksBySection.get(section.id) ?? [],
  }));
}

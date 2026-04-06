"use server";

import { createClient } from "@/lib/supabase/server";

export async function getLessonSectionsWithBlocksDb(lessonId: string) {
  const supabase = await createClient();

  const { data: sections, error: sectionsError } = await supabase
    .from("lesson_sections")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("position", { ascending: true });

  if (sectionsError) {
    console.error("Error loading sections:", sectionsError);
    return [];
  }

  const sectionIds = sections.map((s) => s.id);

  const { data: blocks, error: blocksError } = await supabase
    .from("lesson_blocks")
    .select("*")
    .in("lesson_section_id", sectionIds)
    .order("position", { ascending: true });

  if (blocksError) {
    console.error("Error loading blocks:", blocksError);
    return [];
  }

  const blocksBySection = new Map<string, any[]>();

  for (const block of blocks) {
    const arr = blocksBySection.get(block.lesson_section_id) ?? [];
    arr.push(block);
    blocksBySection.set(block.lesson_section_id, arr);
  }

  return sections.map((section) => ({
    ...section,
    blocks: blocksBySection.get(section.id) ?? [],
  }));
}

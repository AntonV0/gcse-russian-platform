"use server";

import { createClient } from "@/lib/supabase/server";

export async function createSectionAction(formData: FormData) {
  const supabase = await createClient();

  const lessonId = formData.get("lessonId") as string;
  const title = formData.get("title") as string;

  await supabase.from("lesson_sections").insert({
    lesson_id: lessonId,
    title,
    position: Date.now(),
    is_published: true,
    section_kind: "content",
  });
}

export async function createTextBlockAction(formData: FormData) {
  const supabase = await createClient();

  const sectionId = formData.get("sectionId") as string;
  const content = formData.get("content") as string;

  await supabase.from("lesson_blocks").insert({
    lesson_section_id: sectionId,
    block_type: "text",
    position: Date.now(),
    is_published: true,
    data: { content },
  });
}

export async function createNoteBlockAction(formData: FormData) {
  const supabase = await createClient();

  const sectionId = formData.get("sectionId") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await supabase.from("lesson_blocks").insert({
    lesson_section_id: sectionId,
    block_type: "note",
    position: Date.now(),
    is_published: true,
    data: { title, content },
  });
}

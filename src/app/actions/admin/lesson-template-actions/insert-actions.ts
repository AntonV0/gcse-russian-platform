"use server";

import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  getLessonTemplateInsertDataDb,
  getSectionTemplateInsertDataDb,
} from "@/lib/lessons/lesson-template-helpers-db";
import {
  finalizeLessonMutation,
  getNextSectionPosition,
  getTrimmedString,
} from "@/app/actions/admin/admin-lesson-builder-shared";
import { insertLessonBlocksForSection } from "./shared";

export async function insertSectionTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const lessonId = getTrimmedString(formData, "lessonId");
  const templateId = getTrimmedString(formData, "templateId");

  if (!lessonId || !templateId) {
    throw new Error("Missing required fields");
  }

  const templateData = await getSectionTemplateInsertDataDb(templateId);
  const supabase = await createClient();
  const nextSectionPosition = await getNextSectionPosition(lessonId);

  const { data: insertedSection, error: sectionError } = await supabase
    .from("lesson_sections")
    .insert({
      lesson_id: lessonId,
      title: templateData.template.default_section_title,
      description: templateData.template.description,
      section_kind: templateData.template.default_section_kind,
      position: nextSectionPosition,
      is_published: true,
      settings: {},
    })
    .select("id")
    .single();

  if (sectionError || !insertedSection) {
    console.error("Error inserting section template:", sectionError);
    throw new Error(
      `Failed to insert section template: ${sectionError?.message ?? "Unknown error"}`
    );
  }

  await insertLessonBlocksForSection({
    lessonSectionId: insertedSection.id,
    blocks: templateData.blocks,
  });

  await finalizeLessonMutation(formData);
}

export async function insertLessonTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const lessonId = getTrimmedString(formData, "lessonId");
  const templateId = getTrimmedString(formData, "templateId");

  if (!lessonId || !templateId) {
    throw new Error("Missing required fields");
  }

  const templateData = await getLessonTemplateInsertDataDb(templateId);
  const supabase = await createClient();
  const startingSectionPosition = await getNextSectionPosition(lessonId);

  for (
    let sectionIndex = 0;
    sectionIndex < templateData.sections.length;
    sectionIndex += 1
  ) {
    const section = templateData.sections[sectionIndex];

    const { data: insertedSection, error: sectionError } = await supabase
      .from("lesson_sections")
      .insert({
        lesson_id: lessonId,
        title: section.title,
        description: section.description,
        section_kind: section.sectionKind,
        position: startingSectionPosition + sectionIndex,
        is_published: true,
        settings: {},
      })
      .select("id")
      .single();

    if (sectionError || !insertedSection) {
      console.error("Error inserting lesson template section:", sectionError);
      throw new Error(
        `Failed to insert lesson template section: ${sectionError?.message ?? "Unknown error"}`
      );
    }

    await insertLessonBlocksForSection({
      lessonSectionId: insertedSection.id,
      blocks: section.blocks,
    });
  }

  await finalizeLessonMutation(formData);
}

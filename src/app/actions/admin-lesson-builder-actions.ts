"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/admin-auth";

function getTrimmedString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function getAdminLessonPath(params: {
  courseId: string;
  variantId: string;
  moduleId: string;
  lessonId: string;
}) {
  return `/admin/content/courses/${params.courseId}/variants/${params.variantId}/modules/${params.moduleId}/lessons/${params.lessonId}`;
}

function getPublicLessonPath(params: {
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}) {
  return `/courses/${params.courseSlug}/${params.variantSlug}/modules/${params.moduleSlug}/lessons/${params.lessonSlug}`;
}

async function revalidateLessonPaths(formData: FormData) {
  const courseId = getTrimmedString(formData, "courseId");
  const variantId = getTrimmedString(formData, "variantId");
  const moduleId = getTrimmedString(formData, "moduleId");
  const lessonId = getTrimmedString(formData, "lessonId");

  const courseSlug = getTrimmedString(formData, "courseSlug");
  const variantSlug = getTrimmedString(formData, "variantSlug");
  const moduleSlug = getTrimmedString(formData, "moduleSlug");
  const lessonSlug = getTrimmedString(formData, "lessonSlug");

  const adminPath = getAdminLessonPath({
    courseId,
    variantId,
    moduleId,
    lessonId,
  });

  const publicPath = getPublicLessonPath({
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug,
  });

  revalidatePath(adminPath);
  revalidatePath(publicPath);

  redirect(adminPath);
}

export async function createSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const lessonId = getTrimmedString(formData, "lessonId");
  const title = getTrimmedString(formData, "title");
  const description = getTrimmedString(formData, "description");
  const sectionKind = getTrimmedString(formData, "sectionKind") || "content";

  if (!lessonId || !title) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data: existingSections, error: countError } = await supabase
    .from("lesson_sections")
    .select("id")
    .eq("lesson_id", lessonId);

  if (countError) {
    console.error("Error counting lesson sections:", countError);
    throw new Error("Failed to prepare section position");
  }

  const nextPosition = (existingSections?.length ?? 0) + 1;

  const { error } = await supabase.from("lesson_sections").insert({
    lesson_id: lessonId,
    title,
    description: description || null,
    section_kind: sectionKind,
    position: nextPosition,
    is_published: true,
    settings: {},
  });

  if (error) {
    console.error("Error creating lesson section:", error);
    throw new Error("Failed to create section");
  }

  await revalidateLessonPaths(formData);
}

export async function createTextBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !content) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data: existingBlocks, error: countError } = await supabase
    .from("lesson_blocks")
    .select("id")
    .eq("lesson_section_id", sectionId);

  if (countError) {
    console.error("Error counting lesson blocks:", countError);
    throw new Error("Failed to prepare block position");
  }

  const nextPosition = (existingBlocks?.length ?? 0) + 1;

  const { error } = await supabase.from("lesson_blocks").insert({
    lesson_section_id: sectionId,
    block_type: "text",
    position: nextPosition,
    is_published: true,
    data: { content },
    settings: {},
  });

  if (error) {
    console.error("Error creating text block:", error);
    throw new Error("Failed to create text block");
  }

  await revalidateLessonPaths(formData);
}

export async function createNoteBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const content = getTrimmedString(formData, "content");

  if (!sectionId || !title || !content) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data: existingBlocks, error: countError } = await supabase
    .from("lesson_blocks")
    .select("id")
    .eq("lesson_section_id", sectionId);

  if (countError) {
    console.error("Error counting lesson blocks:", countError);
    throw new Error("Failed to prepare block position");
  }

  const nextPosition = (existingBlocks?.length ?? 0) + 1;

  const { error } = await supabase.from("lesson_blocks").insert({
    lesson_section_id: sectionId,
    block_type: "note",
    position: nextPosition,
    is_published: true,
    data: { title, content },
    settings: {},
  });

  if (error) {
    console.error("Error creating note block:", error);
    throw new Error("Failed to create note block");
  }

  await revalidateLessonPaths(formData);
}

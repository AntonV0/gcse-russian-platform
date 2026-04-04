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

export async function deleteSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");

  if (!sectionId) {
    throw new Error("Missing section id");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("lesson_sections").delete().eq("id", sectionId);

  if (error) {
    console.error("Error deleting lesson section:", error);
    throw new Error("Failed to delete section");
  }

  await revalidateLessonPaths(formData);
}

export async function deleteBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");

  if (!blockId) {
    throw new Error("Missing block id");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("lesson_blocks").delete().eq("id", blockId);

  if (error) {
    console.error("Error deleting lesson block:", error);
    throw new Error("Failed to delete block");
  }

  await revalidateLessonPaths(formData);
}

export async function moveSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const lessonId = getTrimmedString(formData, "lessonId");
  const sectionId = getTrimmedString(formData, "sectionId");
  const direction = getTrimmedString(formData, "direction");

  if (!lessonId || !sectionId) {
    throw new Error("Missing required fields");
  }

  if (direction !== "up" && direction !== "down") {
    throw new Error("Invalid move direction");
  }

  const supabase = await createClient();

  const { data: sections, error } = await supabase
    .from("lesson_sections")
    .select("id, position")
    .eq("lesson_id", lessonId)
    .order("position", { ascending: true });

  if (error || !sections) {
    console.error("Error loading lesson sections for reorder:", error);
    throw new Error("Failed to load sections");
  }

  const currentIndex = sections.findIndex((section) => section.id === sectionId);

  if (currentIndex === -1) {
    throw new Error("Section not found in lesson");
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= sections.length) {
    await revalidateLessonPaths(formData);
  }

  const reordered = [...sections];
  const [movedItem] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, movedItem);

  for (let index = 0; index < reordered.length; index += 1) {
    const section = reordered[index];
    const temporaryPosition = 1000 + index;

    const { error: tempError } = await supabase
      .from("lesson_sections")
      .update({ position: temporaryPosition })
      .eq("id", section.id)
      .eq("lesson_id", lessonId);

    if (tempError) {
      console.error("Error setting temporary section position:", tempError);
      throw new Error("Failed to reorder sections");
    }
  }

  for (let index = 0; index < reordered.length; index += 1) {
    const section = reordered[index];
    const finalPosition = index + 1;

    const { error: finalError } = await supabase
      .from("lesson_sections")
      .update({ position: finalPosition })
      .eq("id", section.id)
      .eq("lesson_id", lessonId);

    if (finalError) {
      console.error("Error setting final section position:", finalError);
      throw new Error("Failed to reorder sections");
    }
  }

  await revalidateLessonPaths(formData);
}

export async function moveBlockAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const blockId = getTrimmedString(formData, "blockId");
  const direction = getTrimmedString(formData, "direction");

  if (!sectionId || !blockId) {
    throw new Error("Missing required fields");
  }

  if (direction !== "up" && direction !== "down") {
    throw new Error("Invalid move direction");
  }

  const supabase = await createClient();

  const { data: blocks, error } = await supabase
    .from("lesson_blocks")
    .select("id, position")
    .eq("lesson_section_id", sectionId)
    .order("position", { ascending: true });

  if (error || !blocks) {
    console.error("Error loading lesson blocks for reorder:", error);
    throw new Error("Failed to load blocks");
  }

  const currentIndex = blocks.findIndex((block) => block.id === blockId);

  if (currentIndex === -1) {
    throw new Error("Block not found in section");
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= blocks.length) {
    await revalidateLessonPaths(formData);
  }

  const reordered = [...blocks];
  const [movedItem] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, movedItem);

  for (let index = 0; index < reordered.length; index += 1) {
    const block = reordered[index];
    const temporaryPosition = 1000 + index;

    const { error: tempError } = await supabase
      .from("lesson_blocks")
      .update({ position: temporaryPosition })
      .eq("id", block.id)
      .eq("lesson_section_id", sectionId);

    if (tempError) {
      console.error("Error setting temporary block position:", tempError);
      throw new Error("Failed to reorder blocks");
    }
  }

  for (let index = 0; index < reordered.length; index += 1) {
    const block = reordered[index];
    const finalPosition = index + 1;

    const { error: finalError } = await supabase
      .from("lesson_blocks")
      .update({ position: finalPosition })
      .eq("id", block.id)
      .eq("lesson_section_id", sectionId);

    if (finalError) {
      console.error("Error setting final block position:", finalError);
      throw new Error("Failed to reorder blocks");
    }
  }

  await revalidateLessonPaths(formData);
}

export async function toggleSectionPublishedAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const nextState = getTrimmedString(formData, "nextState");

  if (!sectionId) {
    throw new Error("Missing section id");
  }

  if (nextState !== "published" && nextState !== "draft") {
    throw new Error("Invalid section state");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_sections")
    .update({
      is_published: nextState === "published",
    })
    .eq("id", sectionId);

  if (error) {
    console.error("Error toggling section published state:", error);
    throw new Error("Failed to update section state");
  }

  await revalidateLessonPaths(formData);
}

export async function toggleBlockPublishedAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const blockId = getTrimmedString(formData, "blockId");
  const nextState = getTrimmedString(formData, "nextState");

  if (!blockId) {
    throw new Error("Missing block id");
  }

  if (nextState !== "published" && nextState !== "draft") {
    throw new Error("Invalid block state");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_blocks")
    .update({
      is_published: nextState === "published",
    })
    .eq("id", blockId);

  if (error) {
    console.error("Error toggling block published state:", error);
    throw new Error("Failed to update block state");
  }

  await revalidateLessonPaths(formData);
}

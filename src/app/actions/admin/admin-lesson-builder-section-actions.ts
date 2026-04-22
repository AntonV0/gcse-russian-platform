"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  finalizeLessonMutation,
  getCanonicalSectionKey,
  getNextSectionPosition,
  getTrimmedString,
  getVariantVisibility,
  reorderTablePositions,
} from "@/app/actions/admin/admin-lesson-builder-shared";

export async function createSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const lessonId = getTrimmedString(formData, "lessonId");
  const title = getTrimmedString(formData, "title");
  const description = getTrimmedString(formData, "description");
  const sectionKind = getTrimmedString(formData, "sectionKind") || "content";
  const variantVisibility = getVariantVisibility(formData);
  const canonicalSectionKey = getCanonicalSectionKey(formData);

  if (!lessonId || !title) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();
  const nextPosition = await getNextSectionPosition(lessonId);

  const { error } = await supabase.from("lesson_sections").insert({
    lesson_id: lessonId,
    title,
    description: description || null,
    section_kind: sectionKind,
    position: nextPosition,
    is_published: true,
    variant_visibility: variantVisibility,
    canonical_section_key: canonicalSectionKey,
    settings: {},
  });

  if (error) {
    console.error("Error creating lesson section:", error);
    throw new Error("Failed to create section");
  }

  await finalizeLessonMutation(formData);
}

export async function duplicateSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const lessonId = getTrimmedString(formData, "lessonId");
  const sectionId = getTrimmedString(formData, "sectionId");

  if (!lessonId || !sectionId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data: section, error: sectionError } = await supabase
    .from("lesson_sections")
    .select("*")
    .eq("id", sectionId)
    .single();

  if (sectionError || !section) {
    console.error("Error loading section for duplication:", sectionError);
    throw new Error("Failed to load section");
  }

  const nextSectionPosition = await getNextSectionPosition(lessonId);

  const { data: newSection, error: insertSectionError } = await supabase
    .from("lesson_sections")
    .insert({
      lesson_id: lessonId,
      title: `${section.title} (Copy)`,
      description: section.description,
      section_kind: section.section_kind,
      position: nextSectionPosition,
      is_published: false,
      variant_visibility: section.variant_visibility ?? "shared",
      canonical_section_key: section.canonical_section_key,
      settings: section.settings ?? {},
    })
    .select("*")
    .single();

  if (insertSectionError || !newSection) {
    console.error("Error duplicating section:", insertSectionError);
    throw new Error("Failed to duplicate section");
  }

  const { data: blocks, error: blocksError } = await supabase
    .from("lesson_blocks")
    .select("*")
    .eq("lesson_section_id", sectionId)
    .order("position", { ascending: true });

  if (blocksError) {
    console.error("Error loading section blocks for duplication:", blocksError);
    throw new Error("Failed to duplicate section blocks");
  }

  if (blocks && blocks.length > 0) {
    const duplicatedBlocks = blocks.map((block, index) => ({
      lesson_section_id: newSection.id,
      block_type: block.block_type,
      position: index + 1,
      is_published: false,
      data: block.data ?? {},
      settings: block.settings ?? {},
    }));

    const { error: insertBlocksError } = await supabase
      .from("lesson_blocks")
      .insert(duplicatedBlocks);

    if (insertBlocksError) {
      console.error("Error inserting duplicated blocks:", insertBlocksError);
      throw new Error("Failed to duplicate section blocks");
    }
  }

  await finalizeLessonMutation(formData);
}

export async function updateSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const sectionId = getTrimmedString(formData, "sectionId");
  const title = getTrimmedString(formData, "title");
  const description = getTrimmedString(formData, "description");
  const sectionKind = getTrimmedString(formData, "sectionKind") || "content";
  const variantVisibility = getVariantVisibility(formData);
  const canonicalSectionKey = getCanonicalSectionKey(formData);

  if (!sectionId || !title) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_sections")
    .update({
      title,
      description: description || null,
      section_kind: sectionKind,
      variant_visibility: variantVisibility,
      canonical_section_key: canonicalSectionKey,
    })
    .eq("id", sectionId);

  if (error) {
    console.error("Error updating lesson section:", error);
    throw new Error("Failed to update section");
  }

  await finalizeLessonMutation(formData);
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

  await finalizeLessonMutation(formData);
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
    await finalizeLessonMutation(formData);
    return;
  }

  const reordered = [...sections];
  const [movedItem] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, movedItem);

  await reorderTablePositions({
    table: "lesson_sections",
    orderedIds: reordered.map((section) => section.id as string),
    scope: {
      lesson_id: lessonId,
    },
    temporaryPositionMode: "high",
  });

  await finalizeLessonMutation(formData);
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

  await finalizeLessonMutation(formData);
}

export async function reorderSectionsAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const lessonId = getTrimmedString(formData, "lessonId");
  const orderedSectionIdsRaw = getTrimmedString(formData, "orderedSectionIds");

  if (!lessonId || !orderedSectionIdsRaw) {
    throw new Error("Missing required fields");
  }

  const orderedSectionIds = orderedSectionIdsRaw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (orderedSectionIds.length === 0) {
    throw new Error("No section ids provided");
  }

  await reorderTablePositions({
    table: "lesson_sections",
    orderedIds: orderedSectionIds,
    scope: {
      lesson_id: lessonId,
    },
  });

  await finalizeLessonMutation(formData);
}

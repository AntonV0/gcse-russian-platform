"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  getBoolean,
  getOptionalPositiveNumber,
  getOptionalString,
  getTrimmedString,
} from "./shared";

export async function createLessonAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const courseId = getTrimmedString(formData, "courseId");
  const variantId = getTrimmedString(formData, "variantId");
  const moduleId = getTrimmedString(formData, "moduleId");
  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const summary = getOptionalString(formData, "summary");
  const lessonType = getTrimmedString(formData, "lessonType") || "lesson";
  const estimatedMinutes = getOptionalPositiveNumber(formData, "estimatedMinutes");
  const contentSource = getTrimmedString(formData, "contentSource") || "code";
  const contentKey = getOptionalString(formData, "contentKey");
  const isPublished = getBoolean(formData, "isPublished");
  const isTrialVisible = getBoolean(formData, "isTrialVisible");
  const requiresPaidAccess = getBoolean(formData, "requiresPaidAccess");
  const availableInVolna = getBoolean(formData, "availableInVolna");

  if (!courseId || !variantId || !moduleId || !title || !slug) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data: existingLessons, error: countError } = await supabase
    .from("lessons")
    .select("id")
    .eq("module_id", moduleId);

  if (countError) {
    console.error("Error counting lessons:", countError);
    throw new Error("Failed to prepare lesson position");
  }

  const nextPosition = (existingLessons?.length ?? 0) + 1;

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      module_id: moduleId,
      title,
      slug,
      summary,
      lesson_type: lessonType,
      position: nextPosition,
      estimated_minutes: estimatedMinutes,
      is_published: isPublished,
      is_trial_visible: isTrialVisible,
      requires_paid_access: requiresPaidAccess,
      available_in_volna: availableInVolna,
      content_source: contentSource,
      content_key: contentKey,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating lesson:", error);
    throw new Error("Failed to create lesson");
  }

  redirect(
    `/admin/content/courses/${courseId}/variants/${variantId}/modules/${moduleId}/lessons/${data.id}`
  );
}

export async function updateLessonAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const courseId = getTrimmedString(formData, "courseId");
  const variantId = getTrimmedString(formData, "variantId");
  const moduleId = getTrimmedString(formData, "moduleId");
  const lessonId = getTrimmedString(formData, "lessonId");
  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const summary = getOptionalString(formData, "summary");
  const lessonType = getTrimmedString(formData, "lessonType") || "lesson";
  const position = getOptionalPositiveNumber(formData, "position");
  const estimatedMinutes = getOptionalPositiveNumber(formData, "estimatedMinutes");
  const contentSource = getTrimmedString(formData, "contentSource") || "code";
  const contentKey = getOptionalString(formData, "contentKey");
  const isPublished = getBoolean(formData, "isPublished");
  const isTrialVisible = getBoolean(formData, "isTrialVisible");
  const requiresPaidAccess = getBoolean(formData, "requiresPaidAccess");
  const availableInVolna = getBoolean(formData, "availableInVolna");

  if (!courseId || !variantId || !moduleId || !lessonId || !title || !slug) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const payload: {
    title: string;
    slug: string;
    summary: string | null;
    lesson_type: string;
    estimated_minutes: number | null;
    is_published: boolean;
    is_trial_visible: boolean;
    requires_paid_access: boolean;
    available_in_volna: boolean;
    content_source: string;
    content_key: string | null;
    position?: number;
  } = {
    title,
    slug,
    summary,
    lesson_type: lessonType,
    estimated_minutes: estimatedMinutes,
    is_published: isPublished,
    is_trial_visible: isTrialVisible,
    requires_paid_access: requiresPaidAccess,
    available_in_volna: availableInVolna,
    content_source: contentSource,
    content_key: contentKey,
  };

  if (position !== null) {
    payload.position = position;
  }

  const { error } = await supabase
    .from("lessons")
    .update(payload)
    .eq("id", lessonId)
    .eq("module_id", moduleId);

  if (error) {
    console.error("Error updating lesson:", error);
    throw new Error("Failed to update lesson");
  }

  redirect(
    `/admin/content/courses/${courseId}/variants/${variantId}/modules/${moduleId}/lessons/${lessonId}`
  );
}

export async function moveLessonAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const courseId = getTrimmedString(formData, "courseId");
  const variantId = getTrimmedString(formData, "variantId");
  const moduleId = getTrimmedString(formData, "moduleId");
  const lessonId = getTrimmedString(formData, "lessonId");
  const direction = getTrimmedString(formData, "direction");

  if (!courseId || !variantId || !moduleId || !lessonId) {
    throw new Error("Missing required fields");
  }

  if (direction !== "up" && direction !== "down") {
    throw new Error("Invalid move direction");
  }

  const supabase = await createClient();

  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("id, position")
    .eq("module_id", moduleId)
    .order("position", { ascending: true });

  if (error || !lessons) {
    console.error("Error loading lessons for reorder:", error);
    throw new Error("Failed to load lessons");
  }

  const currentIndex = lessons.findIndex((lesson) => lesson.id === lessonId);

  if (currentIndex === -1) {
    throw new Error("Lesson not found in module");
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= lessons.length) {
    revalidatePath(
      `/admin/content/courses/${courseId}/variants/${variantId}/modules/${moduleId}`
    );
    redirect(
      `/admin/content/courses/${courseId}/variants/${variantId}/modules/${moduleId}`
    );
  }

  const reordered = [...lessons];
  const [movedItem] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, movedItem);

  for (let index = 0; index < reordered.length; index += 1) {
    const lesson = reordered[index];
    const temporaryPosition = 1000 + index;

    const { error: tempError } = await supabase
      .from("lessons")
      .update({ position: temporaryPosition })
      .eq("id", lesson.id)
      .eq("module_id", moduleId);

    if (tempError) {
      console.error("Error setting temporary lesson position:", tempError);
      throw new Error("Failed to reorder lessons");
    }
  }

  for (let index = 0; index < reordered.length; index += 1) {
    const lesson = reordered[index];
    const finalPosition = index + 1;

    const { error: finalError } = await supabase
      .from("lessons")
      .update({ position: finalPosition })
      .eq("id", lesson.id)
      .eq("module_id", moduleId);

    if (finalError) {
      console.error("Error setting final lesson position:", finalError);
      throw new Error("Failed to reorder lessons");
    }
  }

  revalidatePath(
    `/admin/content/courses/${courseId}/variants/${variantId}/modules/${moduleId}`
  );
  redirect(
    `/admin/content/courses/${courseId}/variants/${variantId}/modules/${moduleId}`
  );
}

export async function unpublishLessonAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const courseId = getTrimmedString(formData, "courseId");
  const variantId = getTrimmedString(formData, "variantId");
  const moduleId = getTrimmedString(formData, "moduleId");
  const lessonId = getTrimmedString(formData, "lessonId");

  if (!courseId || !variantId || !moduleId || !lessonId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("lessons")
    .update({
      is_published: false,
    })
    .eq("id", lessonId)
    .eq("module_id", moduleId);

  if (error) {
    console.error("Error unpublishing lesson:", error);
    throw new Error("Failed to unpublish lesson");
  }

  revalidatePath(
    `/admin/content/courses/${courseId}/variants/${variantId}/modules/${moduleId}/lessons/${lessonId}`
  );
  redirect(
    `/admin/content/courses/${courseId}/variants/${variantId}/modules/${moduleId}/lessons/${lessonId}`
  );
}

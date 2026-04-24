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

export async function createVariantAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const courseId = getTrimmedString(formData, "courseId");
  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getOptionalString(formData, "description");
  const isActive = getBoolean(formData, "isActive");
  const isPublished = getBoolean(formData, "isPublished");

  if (!courseId || !title || !slug) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data: existingVariants, error: countError } = await supabase
    .from("course_variants")
    .select("id")
    .eq("course_id", courseId);

  if (countError) {
    console.error("Error counting variants:", countError);
    throw new Error("Failed to prepare variant position");
  }

  const nextPosition = (existingVariants?.length ?? 0) + 1;

  const { data, error } = await supabase
    .from("course_variants")
    .insert({
      course_id: courseId,
      title,
      slug,
      description,
      position: nextPosition,
      is_active: isActive,
      is_published: isPublished,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating variant:", error);
    throw new Error("Failed to create variant");
  }

  redirect(`/admin/content/courses/${courseId}/variants/${data.id}`);
}

export async function updateVariantAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const variantId = getTrimmedString(formData, "variantId");
  const courseId = getTrimmedString(formData, "courseId");
  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getOptionalString(formData, "description");
  const position = getOptionalPositiveNumber(formData, "position");
  const isActive = getBoolean(formData, "isActive");
  const isPublished = getBoolean(formData, "isPublished");

  if (!variantId || !courseId || !title || !slug) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const payload: {
    title: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    is_published: boolean;
    position?: number;
  } = {
    title,
    slug,
    description,
    is_active: isActive,
    is_published: isPublished,
  };

  if (position !== null) {
    payload.position = position;
  }

  const { error } = await supabase
    .from("course_variants")
    .update(payload)
    .eq("id", variantId)
    .eq("course_id", courseId);

  if (error) {
    console.error("Error updating variant:", error);
    throw new Error("Failed to update variant");
  }

  redirect(`/admin/content/courses/${courseId}/variants/${variantId}`);
}

export async function moveVariantAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const courseId = getTrimmedString(formData, "courseId");
  const variantId = getTrimmedString(formData, "variantId");
  const direction = getTrimmedString(formData, "direction");

  if (!courseId || !variantId) {
    throw new Error("Missing required fields");
  }

  if (direction !== "up" && direction !== "down") {
    throw new Error("Invalid move direction");
  }

  const supabase = await createClient();

  const { data: variants, error: loadError } = await supabase
    .from("course_variants")
    .select("id, position")
    .eq("course_id", courseId)
    .order("position", { ascending: true });

  if (loadError || !variants) {
    console.error("Error loading variants for reorder:", loadError);
    throw new Error("Failed to load variants");
  }

  const currentIndex = variants.findIndex((variant) => variant.id === variantId);

  if (currentIndex === -1) {
    throw new Error("Variant not found in course");
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= variants.length) {
    revalidatePath(`/admin/content/courses/${courseId}`);
    redirect(`/admin/content/courses/${courseId}`);
  }

  const reordered = [...variants];
  const [movedItem] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, movedItem);

  for (let index = 0; index < reordered.length; index += 1) {
    const variant = reordered[index];
    const temporaryPosition = 1000 + index;

    const { error: tempError } = await supabase
      .from("course_variants")
      .update({ position: temporaryPosition })
      .eq("id", variant.id)
      .eq("course_id", courseId);

    if (tempError) {
      console.error("Error setting temporary variant position:", tempError);
      throw new Error(
        `Failed temporary variant reorder: ${tempError.message ?? "unknown error"}`
      );
    }
  }

  for (let index = 0; index < reordered.length; index += 1) {
    const variant = reordered[index];
    const finalPosition = index + 1;

    const { error: finalError } = await supabase
      .from("course_variants")
      .update({ position: finalPosition })
      .eq("id", variant.id)
      .eq("course_id", courseId);

    if (finalError) {
      console.error("Error setting final variant position:", finalError);
      throw new Error(
        `Failed final variant reorder: ${finalError.message ?? "unknown error"}`
      );
    }
  }

  revalidatePath(`/admin/content/courses/${courseId}`);
  redirect(`/admin/content/courses/${courseId}`);
}

export async function archiveVariantAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const courseId = getTrimmedString(formData, "courseId");
  const variantId = getTrimmedString(formData, "variantId");

  if (!courseId || !variantId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("course_variants")
    .update({
      is_active: false,
      is_published: false,
    })
    .eq("id", variantId)
    .eq("course_id", courseId);

  if (error) {
    console.error("Error archiving variant:", error);
    throw new Error("Failed to archive variant");
  }

  revalidatePath(`/admin/content/courses/${courseId}`);
  redirect(`/admin/content/courses/${courseId}`);
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { assertAdminAccess } from "@/lib/auth/admin-auth";
import {
  getBoolean,
  getEnumValue,
  getOptionalPositiveNumber,
  getOptionalString,
  getTrimmedString,
} from "./shared";

export async function createModuleAction(formData: FormData) {
  await assertAdminAccess();

  const variantId = getTrimmedString(formData, "variantId");
  const courseId = getTrimmedString(formData, "courseId");
  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getOptionalString(formData, "description");
  const isPublished = getBoolean(formData, "isPublished");

  if (!variantId || !courseId || !title || !slug) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data: existingModules, error: countError } = await supabase
    .from("modules")
    .select("id")
    .eq("course_variant_id", variantId);

  if (countError) {
    console.error("Error counting modules:", countError);
    throw new Error("Failed to prepare module position");
  }

  const nextPosition = (existingModules?.length ?? 0) + 1;

  const { data, error } = await supabase
    .from("modules")
    .insert({
      course_variant_id: variantId,
      title,
      slug,
      description,
      position: nextPosition,
      is_published: isPublished,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating module:", error);
    throw new Error("Failed to create module");
  }

  redirect(`/admin/content/courses/${courseId}/variants/${variantId}/modules/${data.id}`);
}

export async function updateModuleAction(formData: FormData) {
  await assertAdminAccess();

  const courseId = getTrimmedString(formData, "courseId");
  const variantId = getTrimmedString(formData, "variantId");
  const moduleId = getTrimmedString(formData, "moduleId");
  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getOptionalString(formData, "description");
  const position = getOptionalPositiveNumber(formData, "position");
  const isPublished = getBoolean(formData, "isPublished");

  if (!courseId || !variantId || !moduleId || !title || !slug) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const payload: {
    title: string;
    slug: string;
    description: string | null;
    is_published: boolean;
    position?: number;
  } = {
    title,
    slug,
    description,
    is_published: isPublished,
  };

  if (position !== null) {
    payload.position = position;
  }

  const { error } = await supabase
    .from("modules")
    .update(payload)
    .eq("id", moduleId)
    .eq("course_variant_id", variantId);

  if (error) {
    console.error("Error updating module:", error);
    throw new Error("Failed to update module");
  }

  redirect(
    `/admin/content/courses/${courseId}/variants/${variantId}/modules/${moduleId}`
  );
}

export async function moveModuleAction(formData: FormData) {
  await assertAdminAccess();

  const courseId = getTrimmedString(formData, "courseId");
  const variantId = getTrimmedString(formData, "variantId");
  const moduleId = getTrimmedString(formData, "moduleId");
  const direction = getEnumValue(formData, "direction", ["up", "down"] as const);

  if (!courseId || !variantId || !moduleId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data: modules, error } = await supabase
    .from("modules")
    .select("id, position")
    .eq("course_variant_id", variantId)
    .order("position", { ascending: true });

  if (error || !modules) {
    console.error("Error loading modules for reorder:", error);
    throw new Error("Failed to load modules");
  }

  const currentIndex = modules.findIndex((module) => module.id === moduleId);

  if (currentIndex === -1) {
    throw new Error("Module not found in variant");
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= modules.length) {
    revalidatePath(`/admin/content/courses/${courseId}/variants/${variantId}`);
    redirect(`/admin/content/courses/${courseId}/variants/${variantId}`);
  }

  const reordered = [...modules];
  const [movedItem] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, movedItem);

  for (let index = 0; index < reordered.length; index += 1) {
    const courseModule = reordered[index];
    const temporaryPosition = 1000 + index;

    const { error: tempError } = await supabase
      .from("modules")
      .update({ position: temporaryPosition })
      .eq("id", courseModule.id)
      .eq("course_variant_id", variantId);

    if (tempError) {
      console.error("Error setting temporary module position:", tempError);
      throw new Error("Failed to reorder modules");
    }
  }

  for (let index = 0; index < reordered.length; index += 1) {
    const courseModule = reordered[index];
    const finalPosition = index + 1;

    const { error: finalError } = await supabase
      .from("modules")
      .update({ position: finalPosition })
      .eq("id", courseModule.id)
      .eq("course_variant_id", variantId);

    if (finalError) {
      console.error("Error setting final module position:", finalError);
      throw new Error("Failed to reorder modules");
    }
  }

  revalidatePath(`/admin/content/courses/${courseId}/variants/${variantId}`);
  redirect(`/admin/content/courses/${courseId}/variants/${variantId}`);
}

export async function unpublishModuleAction(formData: FormData) {
  await assertAdminAccess();

  const courseId = getTrimmedString(formData, "courseId");
  const variantId = getTrimmedString(formData, "variantId");
  const moduleId = getTrimmedString(formData, "moduleId");

  if (!courseId || !variantId || !moduleId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("modules")
    .update({
      is_published: false,
    })
    .eq("id", moduleId)
    .eq("course_variant_id", variantId);

  if (error) {
    console.error("Error unpublishing module:", error);
    throw new Error("Failed to unpublish module");
  }

  revalidatePath(`/admin/content/courses/${courseId}/variants/${variantId}`);
  redirect(`/admin/content/courses/${courseId}/variants/${variantId}`);
}

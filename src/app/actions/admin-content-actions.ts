"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/admin-auth";

function getTrimmedString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function getOptionalString(formData: FormData, key: string) {
  const value = getTrimmedString(formData, key);
  return value.length > 0 ? value : null;
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "true";
}

function getOptionalPositiveNumber(formData: FormData, key: string) {
  const raw = getTrimmedString(formData, key);
  if (!raw) return null;

  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${key} must be a positive number`);
  }

  return value;
}

export async function createCourseAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getOptionalString(formData, "description");
  const isActive = getBoolean(formData, "isActive");
  const isPublished = getBoolean(formData, "isPublished");

  if (!title || !slug) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .insert({
      title,
      slug,
      description,
      is_active: isActive,
      is_published: isPublished,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating course:", error);
    throw new Error("Failed to create course");
  }

  redirect(`/admin/content/courses/${data.id}`);
}

export async function updateCourseAction(formData: FormData) {
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

  const { error } = await supabase
    .from("courses")
    .update({
      title,
      slug,
      description,
      is_active: isActive,
      is_published: isPublished,
    })
    .eq("id", courseId);

  if (error) {
    console.error("Error updating course:", error);
    throw new Error("Failed to update course");
  }

  redirect(`/admin/content/courses/${courseId}`);
}

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

  const { data: currentVariant, error: currentError } = await supabase
    .from("course_variants")
    .select("id, course_id, position")
    .eq("id", variantId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (currentError || !currentVariant) {
    console.error("Error loading current variant:", currentError);
    throw new Error("Failed to load current variant");
  }

  const targetPosition =
    direction === "up" ? currentVariant.position - 1 : currentVariant.position + 1;

  if (targetPosition < 1) {
    redirect(`/admin/content/courses/${courseId}`);
  }

  const { data: swapVariant, error: swapError } = await supabase
    .from("course_variants")
    .select("id, position")
    .eq("course_id", courseId)
    .eq("position", targetPosition)
    .maybeSingle();

  if (swapError) {
    console.error("Error loading swap variant:", swapError);
    throw new Error("Failed to load target variant");
  }

  if (!swapVariant) {
    redirect(`/admin/content/courses/${courseId}`);
  }

  const { error: firstUpdateError } = await supabase
    .from("course_variants")
    .update({ position: 0 })
    .eq("id", currentVariant.id);

  if (firstUpdateError) {
    console.error("Error setting temporary variant position:", firstUpdateError);
    throw new Error("Failed to reorder variant");
  }

  const { error: secondUpdateError } = await supabase
    .from("course_variants")
    .update({ position: currentVariant.position })
    .eq("id", swapVariant.id);

  if (secondUpdateError) {
    console.error("Error updating swap variant position:", secondUpdateError);
    throw new Error("Failed to reorder variant");
  }

  const { error: thirdUpdateError } = await supabase
    .from("course_variants")
    .update({ position: swapVariant.position })
    .eq("id", currentVariant.id);

  if (thirdUpdateError) {
    console.error("Error updating current variant position:", thirdUpdateError);
    throw new Error("Failed to reorder variant");
  }

  redirect(`/admin/content/courses/${courseId}`);
}

export async function createModuleAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

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
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

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
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const courseId = getTrimmedString(formData, "courseId");
  const variantId = getTrimmedString(formData, "variantId");
  const moduleId = getTrimmedString(formData, "moduleId");
  const direction = getTrimmedString(formData, "direction");

  if (!courseId || !variantId || !moduleId) {
    throw new Error("Missing required fields");
  }

  if (direction !== "up" && direction !== "down") {
    throw new Error("Invalid move direction");
  }

  const supabase = await createClient();

  const { data: currentModule, error: currentError } = await supabase
    .from("modules")
    .select("id, course_variant_id, position")
    .eq("id", moduleId)
    .eq("course_variant_id", variantId)
    .maybeSingle();

  if (currentError || !currentModule) {
    console.error("Error loading current module:", currentError);
    throw new Error("Failed to load current module");
  }

  const targetPosition =
    direction === "up" ? currentModule.position - 1 : currentModule.position + 1;

  if (targetPosition < 1) {
    redirect(`/admin/content/courses/${courseId}/variants/${variantId}`);
  }

  const { data: swapModule, error: swapError } = await supabase
    .from("modules")
    .select("id, position")
    .eq("course_variant_id", variantId)
    .eq("position", targetPosition)
    .maybeSingle();

  if (swapError) {
    console.error("Error loading swap module:", swapError);
    throw new Error("Failed to load target module");
  }

  if (!swapModule) {
    redirect(`/admin/content/courses/${courseId}/variants/${variantId}`);
  }

  const { error: firstUpdateError } = await supabase
    .from("modules")
    .update({ position: 0 })
    .eq("id", currentModule.id);

  if (firstUpdateError) {
    console.error("Error setting temporary module position:", firstUpdateError);
    throw new Error("Failed to reorder module");
  }

  const { error: secondUpdateError } = await supabase
    .from("modules")
    .update({ position: currentModule.position })
    .eq("id", swapModule.id);

  if (secondUpdateError) {
    console.error("Error updating swap module position:", secondUpdateError);
    throw new Error("Failed to reorder module");
  }

  const { error: thirdUpdateError } = await supabase
    .from("modules")
    .update({ position: swapModule.position })
    .eq("id", currentModule.id);

  if (thirdUpdateError) {
    console.error("Error updating current module position:", thirdUpdateError);
    throw new Error("Failed to reorder module");
  }

  redirect(`/admin/content/courses/${courseId}/variants/${variantId}`);
}

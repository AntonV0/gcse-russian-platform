"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

  // Pass 1: temporary positions far away from normal range
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

  // Pass 2: final positions
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
    redirect(`/admin/content/courses/${courseId}/variants/${variantId}`);
  }

  const reordered = [...modules];
  const [movedItem] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, movedItem);

  // Pass 1: temporary negative positions
  for (let index = 0; index < reordered.length; index += 1) {
    const module = reordered[index];
    const temporaryPosition = -1 * (index + 1);

    const { error: tempError } = await supabase
      .from("modules")
      .update({ position: temporaryPosition })
      .eq("id", module.id)
      .eq("course_variant_id", variantId);

    if (tempError) {
      console.error("Error setting temporary module position:", tempError);
      throw new Error("Failed to reorder modules");
    }
  }

  // Pass 2: final positions
  for (let index = 0; index < reordered.length; index += 1) {
    const module = reordered[index];
    const finalPosition = index + 1;

    const { error: finalError } = await supabase
      .from("modules")
      .update({ position: finalPosition })
      .eq("id", module.id)
      .eq("course_variant_id", variantId);

    if (finalError) {
      console.error("Error setting final module position:", finalError);
      throw new Error("Failed to reorder modules");
    }
  }

  redirect(`/admin/content/courses/${courseId}/variants/${variantId}`);
}

"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { assertAdminAccess } from "@/lib/auth/admin-auth";
import { getBoolean, getOptionalString, getTrimmedString } from "./shared";

export async function createCourseAction(formData: FormData) {
  await assertAdminAccess();

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
  await assertAdminAccess();

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

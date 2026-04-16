"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";

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

export async function createTeachingGroupAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const name = getTrimmedString(formData, "name");
  const courseId = getOptionalString(formData, "courseId");
  const courseVariantId = getOptionalString(formData, "courseVariantId");
  const isActive = getBoolean(formData, "isActive");

  if (!name) {
    throw new Error("Teaching group name is required");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("teaching_groups")
    .insert({
      name,
      course_id: courseId,
      course_variant_id: courseVariantId,
      is_active: isActive,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating teaching group:", error);
    throw new Error(
      `Failed to create teaching group: ${error?.message ?? "unknown error"}`
    );
  }

  revalidatePath("/admin/teaching-groups");
  redirect(`/admin/teaching-groups/${data.id}`);
}

export async function updateTeachingGroupAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const groupId = getTrimmedString(formData, "groupId");
  const name = getTrimmedString(formData, "name");
  const courseId = getOptionalString(formData, "courseId");
  const courseVariantId = getOptionalString(formData, "courseVariantId");
  const isActive = getBoolean(formData, "isActive");

  if (!groupId || !name) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("teaching_groups")
    .update({
      name,
      course_id: courseId,
      course_variant_id: courseVariantId,
      is_active: isActive,
    })
    .eq("id", groupId);

  if (error) {
    console.error("Error updating teaching group:", error);
    throw new Error(
      `Failed to update teaching group: ${error.message ?? "unknown error"}`
    );
  }

  revalidatePath("/admin/teaching-groups");
  revalidatePath(`/admin/teaching-groups/${groupId}`);
  redirect(`/admin/teaching-groups/${groupId}`);
}

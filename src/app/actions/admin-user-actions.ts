"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

function getTrimmedString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function deactivateAccessGrantAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const grantId = getTrimmedString(formData, "grantId");

  if (!userId || !grantId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("user_access_grants")
    .update({ is_active: false })
    .eq("id", grantId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deactivating access grant:", { userId, grantId, error });
    throw new Error("Failed to deactivate access grant");
  }

  revalidatePath(`/admin/students/${userId}`);
  revalidatePath("/admin/students");
  redirect(`/admin/students/${userId}`);
}

export async function addStudentToTeachingGroupAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const groupId = getTrimmedString(formData, "groupId");

  if (!userId || !groupId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data: existingMembership, error: existingError } = await supabase
    .from("teaching_group_members")
    .select("user_id, group_id, member_role")
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .eq("member_role", "student")
    .maybeSingle();

  if (existingError) {
    console.error("Error checking existing student membership:", {
      userId,
      groupId,
      error: existingError,
    });
    throw new Error("Failed to check existing student membership");
  }

  if (!existingMembership) {
    const { error } = await supabase.from("teaching_group_members").insert({
      user_id: userId,
      group_id: groupId,
      member_role: "student",
    });

    if (error) {
      console.error("Error adding student to teaching group:", {
        userId,
        groupId,
        error,
      });
      throw new Error("Failed to add student to teaching group");
    }
  }

  revalidatePath(`/admin/students/${userId}`);
  revalidatePath(`/admin/teaching-groups/${groupId}`);
  redirect(`/admin/students/${userId}`);
}

export async function removeStudentFromTeachingGroupAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const groupId = getTrimmedString(formData, "groupId");

  if (!userId || !groupId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("teaching_group_members")
    .delete()
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .eq("member_role", "student");

  if (error) {
    console.error("Error removing student from teaching group:", {
      userId,
      groupId,
      error,
    });
    throw new Error("Failed to remove student from teaching group");
  }

  revalidatePath(`/admin/students/${userId}`);
  revalidatePath(`/admin/teaching-groups/${groupId}`);
  redirect(`/admin/students/${userId}`);
}

export async function addTeacherToTeachingGroupAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const groupId = getTrimmedString(formData, "groupId");

  if (!userId || !groupId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data: existingMembership, error: existingError } = await supabase
    .from("teaching_group_members")
    .select("user_id, group_id, member_role")
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .eq("member_role", "teacher")
    .maybeSingle();

  if (existingError) {
    console.error("Error checking existing teacher membership:", {
      userId,
      groupId,
      error: existingError,
    });
    throw new Error("Failed to check existing teacher membership");
  }

  if (!existingMembership) {
    const { error } = await supabase.from("teaching_group_members").insert({
      user_id: userId,
      group_id: groupId,
      member_role: "teacher",
    });

    if (error) {
      console.error("Error adding teacher to teaching group:", {
        userId,
        groupId,
        error,
      });
      throw new Error("Failed to add teacher to teaching group");
    }
  }

  revalidatePath(`/admin/teachers/${userId}`);
  revalidatePath(`/admin/teaching-groups/${groupId}`);
  redirect(`/admin/teachers/${userId}`);
}

export async function removeTeacherFromTeachingGroupAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const groupId = getTrimmedString(formData, "groupId");

  if (!userId || !groupId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("teaching_group_members")
    .delete()
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .eq("member_role", "teacher");

  if (error) {
    console.error("Error removing teacher from teaching group:", {
      userId,
      groupId,
      error,
    });
    throw new Error("Failed to remove teacher from teaching group");
  }

  revalidatePath(`/admin/teachers/${userId}`);
  revalidatePath(`/admin/teaching-groups/${groupId}`);
  redirect(`/admin/teachers/${userId}`);
}

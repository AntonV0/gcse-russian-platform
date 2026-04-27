"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { getTrimmedString } from "@/app/actions/shared/form-data";
import {
  getRedirectTo,
  redirectWithError,
  redirectWithSuccess,
} from "@/app/actions/admin/admin-user-action-shared";

type MembershipRole = "student" | "teacher";

function getUserRolePath(role: MembershipRole, userId: string) {
  return role === "student" ? `/admin/students/${userId}` : `/admin/teachers/${userId}`;
}

async function addUserToTeachingGroupAction(formData: FormData, role: MembershipRole) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const groupId = getTrimmedString(formData, "groupId");
  const redirectTo = getRedirectTo(formData, getUserRolePath(role, userId));

  if (!userId || !groupId) {
    redirectWithError(redirectTo, "Missing required fields");
  }

  const supabase = await createClient();

  const { data: existingMembership, error: existingError } = await supabase
    .from("teaching_group_members")
    .select("user_id, group_id, member_role")
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .eq("member_role", role)
    .maybeSingle();

  if (existingError) {
    console.error(`Error checking existing ${role} membership:`, {
      userId,
      groupId,
      error: existingError,
    });
    redirectWithError(
      redirectTo,
      `Failed to check existing ${role} membership: ${
        existingError.message ?? "unknown error"
      }`
    );
  }

  if (!existingMembership) {
    const { error } = await supabase.from("teaching_group_members").insert({
      user_id: userId,
      group_id: groupId,
      member_role: role,
    });

    if (error) {
      console.error(`Error adding ${role} to teaching group:`, {
        userId,
        groupId,
        error,
      });
      redirectWithError(
        redirectTo,
        `Failed to add ${role} to teaching group: ${error.message ?? "unknown error"}`
      );
    }
  }

  revalidatePath(getUserRolePath(role, userId));
  revalidatePath(`/admin/teaching-groups/${groupId}`);
  redirectWithSuccess(
    redirectTo,
    role === "student"
      ? "Student added to teaching group"
      : "Teacher added to teaching group"
  );
}

async function removeUserFromTeachingGroupAction(
  formData: FormData,
  role: MembershipRole
) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const groupId = getTrimmedString(formData, "groupId");
  const redirectTo = getRedirectTo(formData, getUserRolePath(role, userId));

  if (!userId || !groupId) {
    redirectWithError(redirectTo, "Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("teaching_group_members")
    .delete()
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .eq("member_role", role);

  if (error) {
    console.error(`Error removing ${role} from teaching group:`, {
      userId,
      groupId,
      error,
    });
    redirectWithError(
      redirectTo,
      `Failed to remove ${role} from teaching group: ${error.message ?? "unknown error"}`
    );
  }

  revalidatePath(getUserRolePath(role, userId));
  revalidatePath(`/admin/teaching-groups/${groupId}`);
  redirectWithSuccess(
    redirectTo,
    role === "student"
      ? "Student removed from teaching group"
      : "Teacher removed from teaching group"
  );
}

export async function addStudentToTeachingGroupAction(formData: FormData) {
  await addUserToTeachingGroupAction(formData, "student");
}

export async function removeStudentFromTeachingGroupAction(formData: FormData) {
  await removeUserFromTeachingGroupAction(formData, "student");
}

export async function addTeacherToTeachingGroupAction(formData: FormData) {
  await addUserToTeachingGroupAction(formData, "teacher");
}

export async function removeTeacherFromTeachingGroupAction(formData: FormData) {
  await removeUserFromTeachingGroupAction(formData, "teacher");
}

"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireCurrentUserCanManageAssignment } from "@/lib/auth/teacher-assignment-permissions";

export async function deleteTeacherAssignmentAction(assignmentId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "not_authenticated" as const };
  }

  if (!assignmentId) {
    return { success: false, error: "missing_assignment_id" as const };
  }

  const permission = await requireCurrentUserCanManageAssignment(supabase, assignmentId);

  if (!permission.success) {
    return { success: false, error: permission.error };
  }

  const { error } = await supabase.from("assignments").delete().eq("id", assignmentId);

  if (error) {
    console.error("Error deleting assignment:", error);
    return { success: false, error: "delete_failed" as const };
  }

  redirect("/teacher/assignments");
}

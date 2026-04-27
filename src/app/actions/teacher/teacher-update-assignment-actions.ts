"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  requireCurrentUserCanManageAssignment,
  requireCurrentUserCanManageTeachingGroupAssignments,
} from "@/lib/auth/teacher-assignment-permissions";

type UpdateTeacherAssignmentItemInput =
  | { type: "lesson"; lessonId: string }
  | { type: "question_set"; questionSetId: string }
  | { type: "custom_task"; customPrompt: string };

type UpdateTeacherAssignmentInput = {
  assignmentId: string;
  groupId: string;
  title: string;
  instructions?: string | null;
  dueAt?: string | null;
  items: UpdateTeacherAssignmentItemInput[];
  allowFileUpload?: boolean;
};

export async function updateTeacherAssignmentAction({
  assignmentId,
  groupId,
  title,
  instructions = null,
  dueAt = null,
  items,
  allowFileUpload = false,
}: UpdateTeacherAssignmentInput) {
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

  if (!title.trim()) {
    return { success: false, error: "missing_title" as const };
  }

  if (!groupId) {
    return { success: false, error: "missing_group" as const };
  }

  const cleanedItems = items.filter((item) => {
    if (item.type === "lesson") {
      return Boolean(item.lessonId);
    }

    if (item.type === "question_set") {
      return Boolean(item.questionSetId);
    }

    return Boolean(item.customPrompt.trim());
  });

  if (cleanedItems.length === 0) {
    return { success: false, error: "missing_items" as const };
  }

  const assignmentPermission = await requireCurrentUserCanManageAssignment(
    supabase,
    assignmentId
  );

  if (!assignmentPermission.success) {
    return { success: false, error: assignmentPermission.error };
  }

  const groupPermission = await requireCurrentUserCanManageTeachingGroupAssignments(
    supabase,
    groupId
  );

  if (!groupPermission.success) {
    return { success: false, error: groupPermission.error };
  }

  const assignmentItems = cleanedItems.map((item, index) => {
    if (item.type === "lesson") {
      return {
        item_type: "lesson",
        lesson_id: item.lessonId,
        question_set_id: null,
        custom_prompt: null,
        position: index + 1,
      };
    }

    if (item.type === "question_set") {
      return {
        item_type: "question_set",
        lesson_id: null,
        question_set_id: item.questionSetId,
        custom_prompt: null,
        position: index + 1,
      };
    }

    return {
      item_type: "custom_task",
      lesson_id: null,
      question_set_id: null,
      custom_prompt: item.customPrompt.trim(),
      position: index + 1,
    };
  });

  const { error: updateError } = await supabase.rpc("update_assignment_with_items", {
    target_assignment_id: assignmentId,
    target_group_id: groupId,
    target_title: title.trim(),
    target_instructions: instructions?.trim() || null,
    target_due_at: dueAt || null,
    target_allow_file_upload: allowFileUpload,
    target_items: assignmentItems,
  });

  if (updateError) {
    console.error("Error updating assignment with items:", updateError);
    return { success: false, error: "assignment_update_failed" as const };
  }

  redirect(`/teacher/assignments/${assignmentId}`);
}

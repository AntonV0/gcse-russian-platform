"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type UpdateTeacherAssignmentInput = {
  assignmentId: string;
  groupId: string;
  title: string;
  instructions?: string | null;
  dueAt?: string | null;
  lessonIds: string[];
  questionSetIds?: string[];
  customTask?: string | null;
  allowFileUpload?: boolean;
};

export async function updateTeacherAssignmentAction({
  assignmentId,
  groupId,
  title,
  instructions = null,
  dueAt = null,
  lessonIds,
  questionSetIds = [],
  customTask = null,
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

  const trimmedCustomTask = customTask?.trim() || null;

  if (lessonIds.length === 0 && questionSetIds.length === 0 && !trimmedCustomTask) {
    return { success: false, error: "missing_items" as const };
  }

  // 🔹 1. Update assignment
  const { error: updateError } = await supabase
    .from("assignments")
    .update({
      group_id: groupId,
      title: title.trim(),
      instructions: instructions?.trim() || null,
      due_at: dueAt || null,
      allow_file_upload: allowFileUpload,
    })
    .eq("id", assignmentId);

  if (updateError) {
    console.error("Error updating assignment:", updateError);
    return { success: false, error: "assignment_update_failed" as const };
  }

  // 🔹 2. Delete existing items
  const { error: deleteItemsError } = await supabase
    .from("assignment_items")
    .delete()
    .eq("assignment_id", assignmentId);

  if (deleteItemsError) {
    console.error("Error deleting assignment items:", deleteItemsError);
    return { success: false, error: "assignment_items_delete_failed" as const };
  }

  // 🔹 3. Recreate items (same logic as create)
  const lessonItems = lessonIds.map((lessonId, index) => ({
    assignment_id: assignmentId,
    item_type: "lesson",
    lesson_id: lessonId,
    question_set_id: null,
    custom_prompt: null,
    position: index + 1,
  }));

  const questionSetItems = questionSetIds.map((questionSetId, index) => ({
    assignment_id: assignmentId,
    item_type: "question_set",
    lesson_id: null,
    question_set_id: questionSetId,
    custom_prompt: null,
    position: lessonItems.length + index + 1,
  }));

  const customTaskItems = trimmedCustomTask
    ? [
        {
          assignment_id: assignmentId,
          item_type: "custom_task",
          lesson_id: null,
          question_set_id: null,
          custom_prompt: trimmedCustomTask,
          position: lessonItems.length + questionSetItems.length + 1,
        },
      ]
    : [];

  const assignmentItems = [...lessonItems, ...questionSetItems, ...customTaskItems];

  const { error: itemsError } = await supabase
    .from("assignment_items")
    .insert(assignmentItems);

  if (itemsError) {
    console.error("Error recreating assignment items:", itemsError);
    return { success: false, error: "assignment_items_create_failed" as const };
  }

  redirect(`/teacher/assignments/${assignmentId}`);
}

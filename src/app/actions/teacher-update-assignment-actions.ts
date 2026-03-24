"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  const { error: deleteItemsError } = await supabase
    .from("assignment_items")
    .delete()
    .eq("assignment_id", assignmentId);

  if (deleteItemsError) {
    console.error("Error deleting assignment items:", deleteItemsError);
    return { success: false, error: "assignment_items_delete_failed" as const };
  }

  const assignmentItems = cleanedItems.map((item, index) => {
    if (item.type === "lesson") {
      return {
        assignment_id: assignmentId,
        item_type: "lesson",
        lesson_id: item.lessonId,
        question_set_id: null,
        custom_prompt: null,
        position: index + 1,
      };
    }

    if (item.type === "question_set") {
      return {
        assignment_id: assignmentId,
        item_type: "question_set",
        lesson_id: null,
        question_set_id: item.questionSetId,
        custom_prompt: null,
        position: index + 1,
      };
    }

    return {
      assignment_id: assignmentId,
      item_type: "custom_task",
      lesson_id: null,
      question_set_id: null,
      custom_prompt: item.customPrompt.trim(),
      position: index + 1,
    };
  });

  const { error: itemsError } = await supabase
    .from("assignment_items")
    .insert(assignmentItems);

  if (itemsError) {
    console.error("Error recreating assignment items:", itemsError);
    return { success: false, error: "assignment_items_create_failed" as const };
  }

  redirect(`/teacher/assignments/${assignmentId}`);
}

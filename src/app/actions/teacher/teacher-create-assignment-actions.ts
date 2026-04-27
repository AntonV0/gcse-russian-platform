"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireCurrentUserCanManageTeachingGroupAssignments } from "@/lib/auth/teacher-assignment-permissions";

type CreateTeacherAssignmentItemInput =
  | { type: "lesson"; lessonId: string }
  | { type: "question_set"; questionSetId: string }
  | { type: "custom_task"; customPrompt: string };

type CreateTeacherAssignmentInput = {
  groupId: string;
  title: string;
  instructions?: string | null;
  dueAt?: string | null;
  items: CreateTeacherAssignmentItemInput[];
  allowFileUpload?: boolean;
};

export async function createTeacherAssignmentAction({
  groupId,
  title,
  instructions = null,
  dueAt = null,
  items,
  allowFileUpload = false,
}: CreateTeacherAssignmentInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "not_authenticated" as const };
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

  const permission = await requireCurrentUserCanManageTeachingGroupAssignments(
    supabase,
    groupId
  );

  if (!permission.success) {
    return { success: false, error: permission.error };
  }

  const { data: assignment, error: assignmentError } = await supabase
    .from("assignments")
    .insert({
      group_id: groupId,
      title: title.trim(),
      instructions: instructions?.trim() || null,
      due_at: dueAt || null,
      status: "published",
      created_by: permission.userId,
      allow_file_upload: allowFileUpload,
    })
    .select("id")
    .single();

  if (assignmentError || !assignment) {
    console.error("Error creating assignment:", assignmentError);
    return { success: false, error: "assignment_create_failed" as const };
  }

  const assignmentItems = cleanedItems.map((item, index) => {
    if (item.type === "lesson") {
      return {
        assignment_id: assignment.id,
        item_type: "lesson",
        lesson_id: item.lessonId,
        question_set_id: null,
        custom_prompt: null,
        position: index + 1,
      };
    }

    if (item.type === "question_set") {
      return {
        assignment_id: assignment.id,
        item_type: "question_set",
        lesson_id: null,
        question_set_id: item.questionSetId,
        custom_prompt: null,
        position: index + 1,
      };
    }

    return {
      assignment_id: assignment.id,
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
    console.error("Error creating assignment items:", itemsError);
    return { success: false, error: "assignment_items_create_failed" as const };
  }

  redirect("/teacher/assignments");
}

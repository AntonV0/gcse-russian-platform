"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type CreateTeacherAssignmentInput = {
  groupId: string;
  title: string;
  instructions?: string | null;
  dueAt?: string | null;
  lessonIds: string[];
  questionSetIds?: string[];
  customTask?: string | null;
  allowFileUpload?: boolean;
};

export async function createTeacherAssignmentAction({
  groupId,
  title,
  instructions = null,
  dueAt = null,
  lessonIds,
  questionSetIds = [],
  customTask = null,
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

  const trimmedCustomTask = customTask?.trim() || null;

  if (
    lessonIds.length === 0 &&
    questionSetIds.length === 0 &&
    !trimmedCustomTask
  ) {
    return { success: false, error: "missing_items" as const };
  }

  const { data: assignment, error: assignmentError } = await supabase
    .from("assignments")
    .insert({
      group_id: groupId,
      title: title.trim(),
      instructions: instructions?.trim() || null,
      due_at: dueAt || null,
      status: "published",
      created_by: user.id,
      allow_file_upload: allowFileUpload,
    })
    .select("id")
    .single();

  if (assignmentError || !assignment) {
    console.error("Error creating assignment:", assignmentError);
    return { success: false, error: "assignment_create_failed" as const };
  }

  const lessonItems = lessonIds.map((lessonId, index) => ({
    assignment_id: assignment.id,
    item_type: "lesson",
    lesson_id: lessonId,
    question_set_id: null,
    custom_prompt: null,
    position: index + 1,
  }));

  const questionSetItems = questionSetIds.map((questionSetId, index) => ({
    assignment_id: assignment.id,
    item_type: "question_set",
    lesson_id: null,
    question_set_id: questionSetId,
    custom_prompt: null,
    position: lessonItems.length + index + 1,
  }));

  const customTaskItems = trimmedCustomTask
    ? [
        {
          assignment_id: assignment.id,
          item_type: "custom_task",
          lesson_id: null,
          question_set_id: null,
          custom_prompt: trimmedCustomTask,
          position: lessonItems.length + questionSetItems.length + 1,
        },
      ]
    : [];

  const assignmentItems = [
    ...lessonItems,
    ...questionSetItems,
    ...customTaskItems,
  ];

  const { error: itemsError } = await supabase
    .from("assignment_items")
    .insert(assignmentItems);

  if (itemsError) {
    console.error("Error creating assignment items:", itemsError);
    return { success: false, error: "assignment_items_create_failed" as const };
  }

  redirect("/teacher/assignments");
}
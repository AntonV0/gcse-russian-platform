"use server";

import { createClient } from "@/lib/supabase/server";

type CreateTeacherAssignmentInput = {
  groupId: string;
  title: string;
  instructions?: string | null;
  dueAt?: string | null;
  lessonIds: string[];
};

export async function createTeacherAssignmentAction({
  groupId,
  title,
  instructions = null,
  dueAt = null,
  lessonIds,
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

  if (lessonIds.length === 0) {
    return { success: false, error: "missing_lessons" as const };
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
    })
    .select("id")
    .single();

  if (assignmentError || !assignment) {
    console.error("Error creating assignment:", assignmentError);
    return { success: false, error: "assignment_create_failed" as const };
  }

  const assignmentItems = lessonIds.map((lessonId, index) => ({
    assignment_id: assignment.id,
    item_type: "lesson",
    lesson_id: lessonId,
    position: index + 1,
  }));

  const { error: itemsError } = await supabase
    .from("assignment_items")
    .insert(assignmentItems);

  if (itemsError) {
    console.error("Error creating assignment items:", itemsError);
    return { success: false, error: "assignment_items_create_failed" as const };
  }

  return { success: true, assignmentId: assignment.id };
}
import { createClient } from "@/lib/supabase/server";

export type DbAssignment = {
  id: string;
  group_id: string;
  title: string;
  instructions: string | null;
  due_at: string | null;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type DbAssignmentItem = {
  id: string;
  assignment_id: string;
  item_type: string;
  lesson_id: string | null;
  question_set_id: string | null;
  custom_prompt: string | null;
  position: number;
};

export type DbAssignmentSubmission = {
  id: string;
  assignment_id: string;
  student_user_id: string;
  status: string;
  submitted_text: string | null;
  submitted_at: string | null;
  mark: number | null;
  feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
};

export async function getCurrentUserAssignmentsDb() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return [];

  const { data: memberships, error: membershipError } = await supabase
    .from("teaching_group_members")
    .select("group_id")
    .eq("user_id", user.id);

  if (membershipError || !memberships || memberships.length === 0) {
    return [];
  }

  const groupIds = memberships.map((m) => m.group_id);

  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .in("group_id", groupIds)
    .order("due_at", { ascending: true });

  if (error) {
    console.error("Error fetching current user assignments:", error);
    return [];
  }

  return (data ?? []) as DbAssignment[];
}

export async function getAssignmentItemsDb(assignmentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assignment_items")
    .select("*")
    .eq("assignment_id", assignmentId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching assignment items:", { assignmentId, error });
    return [];
  }

  return (data ?? []) as DbAssignmentItem[];
}

export async function getCurrentUserAssignmentSubmissionDb(assignmentId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data, error } = await supabase
    .from("assignment_submissions")
    .select("*")
    .eq("assignment_id", assignmentId)
    .eq("student_user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching current user assignment submission:", {
      assignmentId,
      error,
    });
    return null;
  }

  return (data as DbAssignmentSubmission | null) ?? null;
}
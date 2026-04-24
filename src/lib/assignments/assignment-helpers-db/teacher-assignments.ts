import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { isCurrentUserAdminDb } from "./auth";
import type {
  DbAssignment,
  DbAssignmentSubmission,
  TeacherAssignmentListItem,
  TeacherSubmissionReviewCard,
} from "./types";

export async function getAssignmentByIdDb(assignmentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("id", assignmentId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching assignment by id:", { assignmentId, error });
    return null;
  }

  return (data as DbAssignment | null) ?? null;
}

export async function getAssignmentSubmissionsForTeacherDb(assignmentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assignment_submissions")
    .select("*")
    .eq("assignment_id", assignmentId)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching assignment submissions for teacher:", {
      assignmentId,
      error,
    });
    return [];
  }

  const submissions = (data ?? []) as DbAssignmentSubmission[];

  const detailed = await Promise.all(
    submissions.map(async (submission) => {
      const [
        { data: student, error: studentError },
        { data: reviewer, error: reviewerError },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, display_name, email")
          .eq("id", submission.student_user_id)
          .maybeSingle(),
        submission.reviewed_by
          ? supabase
              .from("profiles")
              .select("id, full_name, display_name, email")
              .eq("id", submission.reviewed_by)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
      ]);

      if (studentError) {
        console.error("Error fetching student profile for submission:", {
          submissionId: submission.id,
          error: studentError,
        });
      }

      if (reviewerError) {
        console.error("Error fetching reviewer profile for submission:", {
          submissionId: submission.id,
          error: reviewerError,
        });
      }

      return {
        submission,
        student: student ?? null,
        reviewer: reviewer ?? null,
      };
    })
  );

  return detailed as TeacherSubmissionReviewCard[];
}

export async function getTeacherAssignmentsDb(): Promise<TeacherAssignmentListItem[]> {
  const supabase = await createClient();

  const user = await getCurrentUser();

  if (!user) return [];

  const isAdmin = await isCurrentUserAdminDb();

  let assignments: DbAssignment[] = [];

  if (isAdmin) {
    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .order("due_at", { ascending: true });

    if (error || !data) {
      console.error("Error fetching assignments for admin teacher view:", error);
      return [];
    }

    assignments = data as DbAssignment[];
  } else {
    const { data: memberships, error: membershipError } = await supabase
      .from("teaching_group_members")
      .select("group_id, member_role")
      .eq("user_id", user.id);

    if (membershipError || !memberships) {
      console.error("Error fetching teacher memberships:", membershipError);
      return [];
    }

    const teacherGroupIds = memberships
      .filter((m) => m.member_role === "teacher" || m.member_role === "assistant")
      .map((m) => m.group_id);

    if (teacherGroupIds.length === 0) return [];

    const { data, error: assignmentError } = await supabase
      .from("assignments")
      .select("*")
      .in("group_id", teacherGroupIds)
      .order("due_at", { ascending: true });

    if (assignmentError || !data) {
      console.error("Error fetching teacher assignments:", assignmentError);
      return [];
    }

    assignments = data as DbAssignment[];
  }

  const results = await Promise.all(
    assignments.map(async (assignment) => {
      const [
        { data: group },
        { count: submissionCount },
        { count: reviewedSubmissionCount },
      ] = await Promise.all([
        supabase
          .from("teaching_groups")
          .select("id, name")
          .eq("id", assignment.group_id)
          .maybeSingle(),
        supabase
          .from("assignment_submissions")
          .select("*", { count: "exact", head: true })
          .eq("assignment_id", assignment.id),
        supabase
          .from("assignment_submissions")
          .select("*", { count: "exact", head: true })
          .eq("assignment_id", assignment.id)
          .eq("status", "reviewed"),
      ]);

      return {
        assignment,
        group: group ?? null,
        submissionCount: submissionCount ?? 0,
        reviewedSubmissionCount: reviewedSubmissionCount ?? 0,
      };
    })
  );

  return results;
}

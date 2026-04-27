import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { isCurrentUserAdminDb } from "./auth";
import {
  ASSIGNMENT_PROFILE_SELECT,
  ASSIGNMENT_SELECT,
  ASSIGNMENT_SUBMISSION_SELECT,
} from "./types";
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
    .select(ASSIGNMENT_SELECT)
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
    .select(ASSIGNMENT_SUBMISSION_SELECT)
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
  const profileIds = Array.from(
    new Set(
      submissions
        .flatMap((submission) => [submission.student_user_id, submission.reviewed_by])
        .filter((profileId): profileId is string => Boolean(profileId))
    )
  );

  const { data: profiles, error: profileError } =
    profileIds.length > 0
      ? await supabase
          .from("profiles")
          .select(ASSIGNMENT_PROFILE_SELECT)
          .in("id", profileIds)
      : { data: [], error: null };

  if (profileError) {
    console.error("Error fetching profiles for assignment submissions:", {
      assignmentId,
      error: profileError,
    });
  }

  const profilesById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  const detailed = submissions.map((submission) => ({
    submission,
    student: profilesById.get(submission.student_user_id) ?? null,
    reviewer: submission.reviewed_by
      ? (profilesById.get(submission.reviewed_by) ?? null)
      : null,
  }));

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
      .select(ASSIGNMENT_SELECT)
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
      .select(ASSIGNMENT_SELECT)
      .in("group_id", teacherGroupIds)
      .order("due_at", { ascending: true });

    if (assignmentError || !data) {
      console.error("Error fetching teacher assignments:", assignmentError);
      return [];
    }

    assignments = data as DbAssignment[];
  }

  if (assignments.length === 0) {
    return [];
  }

  const groupIds = Array.from(
    new Set(assignments.map((assignment) => assignment.group_id))
  );
  const assignmentIds = assignments.map((assignment) => assignment.id);

  const [{ data: groups }, { data: submissions }] = await Promise.all([
    supabase.from("teaching_groups").select("id, name").in("id", groupIds),
    supabase
      .from("assignment_submissions")
      .select("assignment_id, status")
      .in("assignment_id", assignmentIds),
  ]);

  const groupsById = new Map((groups ?? []).map((group) => [group.id, group]));
  const submissionCounts = new Map<string, number>();
  const reviewedSubmissionCounts = new Map<string, number>();

  for (const submission of submissions ?? []) {
    submissionCounts.set(
      submission.assignment_id,
      (submissionCounts.get(submission.assignment_id) ?? 0) + 1
    );

    if (submission.status === "reviewed") {
      reviewedSubmissionCounts.set(
        submission.assignment_id,
        (reviewedSubmissionCounts.get(submission.assignment_id) ?? 0) + 1
      );
    }
  }

  return assignments.map((assignment) => ({
    assignment,
    group: groupsById.get(assignment.group_id) ?? null,
    submissionCount: submissionCounts.get(assignment.id) ?? 0,
    reviewedSubmissionCount: reviewedSubmissionCounts.get(assignment.id) ?? 0,
  }));
}

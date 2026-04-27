import { createClient } from "@/lib/supabase/server";
import {
  isTeacherAssignmentRole,
  TEACHER_ASSIGNMENT_ROLES,
} from "@/lib/auth/teacher-assignment-roles";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type PermissionError = "not_authenticated" | "not_authorized";

type AuthContext =
  | {
      success: true;
      userId: string;
      isAdmin: boolean;
    }
  | {
      success: false;
      error: PermissionError;
    };

export type TeacherAssignmentPermissionResult = AuthContext;

async function getTeacherAssignmentAuthContext(
  supabase: SupabaseServerClient
): Promise<AuthContext> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "not_authenticated" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Error checking teacher assignment admin permission:", profileError);
    return { success: false, error: "not_authorized" };
  }

  return {
    success: true,
    userId: user.id,
    isAdmin: Boolean(profile?.is_admin),
  };
}

async function canManageTeachingGroupForAuthContext(
  supabase: SupabaseServerClient,
  groupId: string,
  authContext: Extract<AuthContext, { success: true }>
) {
  if (authContext.isAdmin) {
    return true;
  }

  const { data, error } = await supabase
    .from("teaching_group_members")
    .select("member_role")
    .eq("group_id", groupId)
    .eq("user_id", authContext.userId)
    .in("member_role", TEACHER_ASSIGNMENT_ROLES)
    .limit(1);

  if (error) {
    console.error("Error checking teacher assignment group permission:", {
      groupId,
      error,
    });
    return false;
  }

  return Boolean(
    data?.some((membership) => isTeacherAssignmentRole(membership.member_role))
  );
}

export async function requireCurrentUserCanManageTeachingGroupAssignments(
  supabase: SupabaseServerClient,
  groupId: string
): Promise<TeacherAssignmentPermissionResult> {
  const authContext = await getTeacherAssignmentAuthContext(supabase);

  if (!authContext.success) {
    return authContext;
  }

  const canManageGroup = await canManageTeachingGroupForAuthContext(
    supabase,
    groupId,
    authContext
  );

  if (!canManageGroup) {
    return { success: false, error: "not_authorized" };
  }

  return authContext;
}

export async function requireCurrentUserCanManageAssignment(
  supabase: SupabaseServerClient,
  assignmentId: string
): Promise<TeacherAssignmentPermissionResult> {
  const authContext = await getTeacherAssignmentAuthContext(supabase);

  if (!authContext.success) {
    return authContext;
  }

  const { data: assignment, error: assignmentError } = await supabase
    .from("assignments")
    .select("id, group_id")
    .eq("id", assignmentId)
    .maybeSingle();

  if (assignmentError) {
    console.error("Error checking teacher assignment permission:", {
      assignmentId,
      error: assignmentError,
    });
    return { success: false, error: "not_authorized" };
  }

  if (!assignment) {
    return { success: false, error: "not_authorized" };
  }

  const canManageGroup = await canManageTeachingGroupForAuthContext(
    supabase,
    assignment.group_id,
    authContext
  );

  if (!canManageGroup) {
    return { success: false, error: "not_authorized" };
  }

  return authContext;
}

export async function requireCurrentUserCanManageAssignmentSubmission(
  supabase: SupabaseServerClient,
  submissionId: string
): Promise<TeacherAssignmentPermissionResult> {
  const authContext = await getTeacherAssignmentAuthContext(supabase);

  if (!authContext.success) {
    return authContext;
  }

  const { data: submission, error: submissionError } = await supabase
    .from("assignment_submissions")
    .select("id, assignment_id")
    .eq("id", submissionId)
    .maybeSingle();

  if (submissionError) {
    console.error("Error checking teacher assignment submission permission:", {
      submissionId,
      error: submissionError,
    });
    return { success: false, error: "not_authorized" };
  }

  if (!submission) {
    return { success: false, error: "not_authorized" };
  }

  const assignmentPermission = await requireCurrentUserCanManageAssignment(
    supabase,
    submission.assignment_id
  );

  if (!assignmentPermission.success) {
    return assignmentPermission;
  }

  return authContext;
}

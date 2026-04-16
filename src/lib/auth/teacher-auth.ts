import { createClient } from "@/lib/supabase/server";

async function isCurrentUserAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return false;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Error checking admin status:", profileError);
    return false;
  }

  return Boolean(profile?.is_admin);
}

export async function isCurrentUserTeacherForAnyGroup() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return false;
  }

  const isAdmin = await isCurrentUserAdmin();

  if (isAdmin) {
    return true;
  }

  const { data, error } = await supabase
    .from("teaching_group_members")
    .select("group_id")
    .eq("user_id", user.id)
    .in("member_role", ["teacher", "assistant"])
    .limit(1);

  if (error) {
    console.error("Error checking teacher membership:", error);
    return false;
  }

  return (data?.length ?? 0) > 0;
}

export async function canCurrentUserReviewAssignment(assignmentId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return false;
  }

  const isAdmin = await isCurrentUserAdmin();

  if (isAdmin) {
    return true;
  }

  const { data, error } = await supabase
    .from("assignments")
    .select(
      `
      id,
      group_id,
      teaching_groups!inner (
        id,
        teaching_group_members!inner (
          user_id,
          member_role
        )
      )
    `
    )
    .eq("id", assignmentId)
    .eq("teaching_groups.teaching_group_members.user_id", user.id)
    .in("teaching_groups.teaching_group_members.member_role", ["teacher", "assistant"])
    .maybeSingle();

  if (error) {
    console.error("Error checking assignment review permission:", error);
    return false;
  }

  return Boolean(data);
}

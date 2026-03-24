import { createClient } from "@/lib/supabase/server";

export type DbTeachingGroup = {
  id: string;
  name: string;
  course_id: string | null;
  course_variant_id: string | null;
  academic_year: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
};

export type DbTeachingGroupMember = {
  group_id: string;
  user_id: string;
  member_role: string;
  joined_at: string;
};

export async function getCurrentUserTeachingGroupMembershipsDb() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("teaching_group_members")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching current user teaching group memberships:", error);
    return [];
  }

  return (data ?? []) as DbTeachingGroupMember[];
}

export async function getTeachingGroupsForCurrentUserDb() {
  const memberships = await getCurrentUserTeachingGroupMembershipsDb();
  if (memberships.length === 0) return [];

  const groupIds = memberships.map((membership) => membership.group_id);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("teaching_groups")
    .select("*")
    .in("id", groupIds)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching teaching groups for current user:", error);
    return [];
  }

  return (data ?? []) as DbTeachingGroup[];
}

export async function getCurrentUserVolnaGroupsDb() {
  const memberships = await getCurrentUserTeachingGroupMembershipsDb();
  if (memberships.length === 0) {
    return {
      groups: [] as DbTeachingGroup[],
      memberships: [] as DbTeachingGroupMember[],
    };
  }

  const groupIds = memberships.map((membership) => membership.group_id);
  const supabase = await createClient();

  const { data: groups, error } = await supabase
    .from("teaching_groups")
    .select(
      `
      *,
      course_variants!left (
        slug
      )
    `
    )
    .in("id", groupIds)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching current user Volna groups:", error);
    return {
      groups: [] as DbTeachingGroup[],
      memberships: [] as DbTeachingGroupMember[],
    };
  }

  const volnaGroups = (groups ?? []).filter((group: any) => {
    const variantSlug = group.course_variants?.slug;
    return variantSlug === "volna";
  }) as DbTeachingGroup[];

  const volnaGroupIds = new Set(volnaGroups.map((group) => group.id));
  const volnaMemberships = memberships.filter((membership) =>
    volnaGroupIds.has(membership.group_id)
  );

  return {
    groups: volnaGroups,
    memberships: volnaMemberships,
  };
}

export async function getCurrentUserVolnaRoleForGroupDb(groupId: string) {
  const memberships = await getCurrentUserTeachingGroupMembershipsDb();
  const membership = memberships.find((m) => m.group_id === groupId);
  return membership?.member_role ?? null;
}

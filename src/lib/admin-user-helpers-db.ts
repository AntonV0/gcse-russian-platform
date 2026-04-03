import { createClient } from "@/lib/supabase/server";

export type AdminProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  is_admin: boolean;
  is_teacher: boolean;
  created_at: string;
};

export type AdminAccessGrantRow = {
  id: string;
  user_id: string;
  access_mode: string;
  is_active: boolean;
  product_id: string | null;
  starts_at: string | null;
  ends_at: string | null;
  products?: Array<{
    code: string | null;
    name: string | null;
  }> | null;
};

export type AdminTeachingGroupRow = {
  id: string;
  name: string;
  course_id: string | null;
  course_variant_id: string | null;
  is_active: boolean;
};

export type AdminTeachingGroupMemberRow = {
  user_id: string;
  group_id: string;
  member_role: string;
};

export type AdminVariantProgressSummaryRow = {
  course_slug: string;
  variant_slug: string;
  completed_lessons: number;
};

export type AdminProductRow = {
  id: string;
  code: string | null;
  name: string | null;
};

export async function getAdminProfileByIdDb(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, display_name, is_admin, is_teacher, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching admin profile by id:", { userId, error });
    return null;
  }

  return (data as AdminProfileRow | null) ?? null;
}

export async function getAdminAccessGrantsByUserIdDb(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_access_grants")
    .select(
      `
      id,
      user_id,
      access_mode,
      is_active,
      product_id,
      starts_at,
      ends_at,
      products (
        code,
        name
      )
    `
    )
    .eq("user_id", userId)
    .order("starts_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin access grants by user id:", { userId, error });
    return [];
  }

  return (data as unknown as AdminAccessGrantRow[]) ?? [];
}

export async function getAdminTeachingGroupsDb() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("teaching_groups")
    .select("id, name, course_id, course_variant_id, is_active")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching admin teaching groups:", error);
    return [];
  }

  return (data as AdminTeachingGroupRow[]) ?? [];
}

export async function getAdminTeachingGroupMembershipsByUserIdDb(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("teaching_group_members")
    .select("user_id, group_id, member_role")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching admin teaching group memberships by user id:", {
      userId,
      error,
    });
    return [];
  }

  return (data as AdminTeachingGroupMemberRow[]) ?? [];
}

export async function getAdminVariantProgressSummaryByUserIdDb(
  userId: string
): Promise<AdminVariantProgressSummaryRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("course_slug, variant_slug, completed")
    .eq("user_id", userId)
    .eq("completed", true);

  if (error) {
    console.error("Error fetching admin variant progress summary by user id:", {
      userId,
      error,
    });
    return [];
  }

  const rows =
    (data as Array<{
      course_slug: string;
      variant_slug: string;
      completed: boolean;
    }>) ?? [];

  const summaryMap = new Map<string, AdminVariantProgressSummaryRow>();

  for (const row of rows) {
    const key = `${row.course_slug}::${row.variant_slug}`;

    if (!summaryMap.has(key)) {
      summaryMap.set(key, {
        course_slug: row.course_slug,
        variant_slug: row.variant_slug,
        completed_lessons: 0,
      });
    }

    const current = summaryMap.get(key)!;
    current.completed_lessons += 1;
  }

  return Array.from(summaryMap.values()).sort((a, b) => {
    if (a.course_slug !== b.course_slug) {
      return a.course_slug.localeCompare(b.course_slug);
    }

    return a.variant_slug.localeCompare(b.variant_slug);
  });
}

export async function getAdminProductsDb(): Promise<AdminProductRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, code, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching admin products:", error);
    return [];
  }

  return (data as AdminProductRow[]) ?? [];
}

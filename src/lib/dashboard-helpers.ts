import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export type DashboardInfo = {
  role: "admin" | "teacher" | "student" | "guest";
  track: "foundation" | "higher" | "volna" | null;
  accessMode: "trial" | "full" | "volna" | null;
};

export async function getDashboardInfo(): Promise<DashboardInfo> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return {
      role: "guest",
      track: null,
      accessMode: null,
    };
  }

  // --- check admin first ---
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.is_admin) {
    return {
      role: "admin",
      track: null,
      accessMode: null,
    };
  }

  // --- check teacher ---
  const { data: teacherMembership } = await supabase
    .from("teaching_group_members")
    .select("group_id")
    .eq("user_id", user.id)
    .in("member_role", ["teacher", "assistant"])
    .limit(1);

  if ((teacherMembership?.length ?? 0) > 0) {
    return {
      role: "teacher",
      track: "volna",
      accessMode: "volna",
    };
  }

  // --- get access grants ---
  const { data: grants } = await supabase
    .from("user_access_grants")
    .select(`
      access_mode,
      products (
        code
      )
    `)
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!grants || grants.length === 0) {
    return {
      role: "student",
      track: null,
      accessMode: null,
    };
  }

  for (const grant of grants) {
    const code = (grant as any).products?.code;

    if (grant.access_mode === "volna") {
      return {
        role: "student",
        track: "volna",
        accessMode: "volna",
      };
    }

    if (code === "gcse-russian-higher-full") {
      return {
        role: "student",
        track: "higher",
        accessMode: "full",
      };
    }

    if (code === "gcse-russian-foundation-full") {
      return {
        role: "student",
        track: "foundation",
        accessMode: "full",
      };
    }

    if (code === "gcse-russian-higher-trial") {
      return {
        role: "student",
        track: "higher",
        accessMode: "trial",
      };
    }

    if (code === "gcse-russian-foundation-trial") {
      return {
        role: "student",
        track: "foundation",
        accessMode: "trial",
      };
    }
  }

  return {
    role: "student",
    track: null,
    accessMode: null,
  };
}
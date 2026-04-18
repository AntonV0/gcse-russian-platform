import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/auth";

export type DashboardInfo = {
  role: "admin" | "teacher" | "student" | "guest";
  track: "foundation" | "higher" | "volna" | null;
  accessMode: "trial" | "full" | "volna" | null;
};

type DashboardGrantRow = {
  access_mode: string;
  products:
    | {
        code: string | null;
      }
    | {
        code: string | null;
      }[]
    | null;
};

function getProductCodeFromGrant(grant: DashboardGrantRow): string | null {
  const product = Array.isArray(grant.products) ? grant.products[0] : grant.products;
  return product?.code ?? null;
}

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

  const { data: grants } = await supabase
    .from("user_access_grants")
    .select(
      `
      access_mode,
      products (
        code
      )
    `
    )
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!grants || grants.length === 0) {
    return {
      role: "student",
      track: null,
      accessMode: null,
    };
  }

  const typedGrants = grants as DashboardGrantRow[];

  // Volna access wins immediately for dashboard role/track display
  for (const grant of typedGrants) {
    if (grant.access_mode === "volna") {
      return {
        role: "student",
        track: "volna",
        accessMode: "volna",
      };
    }
  }

  // Prefer higher if the user owns both higher and foundation
  for (const grant of typedGrants) {
    const code = getProductCodeFromGrant(grant);

    if (code === "gcse-russian-higher") {
      return {
        role: "student",
        track: "higher",
        accessMode: grant.access_mode === "trial" ? "trial" : "full",
      };
    }
  }

  for (const grant of typedGrants) {
    const code = getProductCodeFromGrant(grant);

    if (code === "gcse-russian-foundation") {
      return {
        role: "student",
        track: "foundation",
        accessMode: grant.access_mode === "trial" ? "trial" : "full",
      };
    }
  }

  return {
    role: "student",
    track: null,
    accessMode: null,
  };
}

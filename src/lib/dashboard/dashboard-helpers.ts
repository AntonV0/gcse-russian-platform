import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { cache } from "react";

export type DashboardInfo = {
  role: "admin" | "teacher" | "student" | "guest";
  variant: "foundation" | "higher" | "volna" | null;
  accessMode: "trial" | "full" | "volna" | null;
  accessState:
    | "guest_preview"
    | "trial_needs_tier"
    | "trial"
    | "full_foundation"
    | "full_higher"
    | "volna"
    | "expired";
};

type DashboardGrantRow = {
  access_mode: string;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
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

function isGrantCurrentlyValid(grant: DashboardGrantRow, now = new Date()): boolean {
  if (grant.starts_at && new Date(grant.starts_at) > now) {
    return false;
  }

  if (grant.ends_at && new Date(grant.ends_at) < now) {
    return false;
  }

  return true;
}

export const getDashboardInfo = cache(
  async function getDashboardInfo(): Promise<DashboardInfo> {
    const supabase = await createClient();
    const user = await getCurrentUser();

    if (!user) {
      return {
        role: "guest",
        variant: null,
        accessMode: null,
        accessState: "guest_preview",
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
        variant: "volna",
        accessMode: "volna",
        accessState: "volna",
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
        variant: "volna",
        accessMode: "volna",
        accessState: "volna",
      };
    }

    const { data: grants } = await supabase
      .from("user_access_grants")
      .select(
        `
      access_mode,
      is_active,
      starts_at,
      ends_at,
      products (
        code
      )
    `
      )
      .eq("user_id", user.id);

    if (!grants || grants.length === 0) {
      return {
        role: "student",
        variant: null,
        accessMode: null,
        accessState: "trial_needs_tier",
      };
    }

    const now = new Date();
    const typedGrantRows = grants as (DashboardGrantRow & { is_active?: boolean })[];
    const typedGrants = typedGrantRows.filter(
      (grant) => grant.is_active !== false && isGrantCurrentlyValid(grant, now)
    );

    if (typedGrants.length === 0) {
      return {
        role: "student",
        variant: null,
        accessMode: null,
        accessState: "expired",
      };
    }

    for (const grant of typedGrants) {
      if (grant.access_mode === "volna") {
        return {
          role: "student",
          variant: "volna",
          accessMode: "volna",
          accessState: "volna",
        };
      }
    }

    for (const grant of typedGrants) {
      const code = getProductCodeFromGrant(grant);

      if (code === "gcse-russian-higher") {
        return {
          role: "student",
          variant: "higher",
          accessMode: grant.access_mode === "trial" ? "trial" : "full",
          accessState: grant.access_mode === "trial" ? "trial" : "full_higher",
        };
      }
    }

    for (const grant of typedGrants) {
      const code = getProductCodeFromGrant(grant);

      if (code === "gcse-russian-foundation") {
        return {
          role: "student",
          variant: "foundation",
          accessMode: grant.access_mode === "trial" ? "trial" : "full",
          accessState: grant.access_mode === "trial" ? "trial" : "full_foundation",
        };
      }
    }

    return {
      role: "student",
      variant: null,
      accessMode: null,
      accessState: "expired",
    };
  }
);

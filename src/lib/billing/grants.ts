import { createClient } from "@/lib/supabase/server";

export type GrantAccessMode = "trial" | "full" | "volna";
export type GrantSource = "stripe" | "admin" | "manual" | "migration";

export type DbUserAccessGrant = {
  id: string;
  user_id: string;
  product_id: string;
  access_mode: string;
  source: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  granted_by: string | null;
  created_at: string;
};

export type GrantProductAccessInput = {
  userId: string;
  productId: string;
  accessMode: GrantAccessMode;
  source: GrantSource;
  startsAt?: Date | string | null;
  endsAt?: Date | string | null;
  grantedBy?: string | null;
};

function toIsoOrNull(value?: Date | string | null): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}

function isGrantCurrentlyValid(grant: DbUserAccessGrant, now = new Date()): boolean {
  if (!grant.is_active) return false;

  if (grant.starts_at && new Date(grant.starts_at) > now) {
    return false;
  }

  if (grant.ends_at && new Date(grant.ends_at) < now) {
    return false;
  }

  return true;
}

/**
 * Returns all grants for a specific user/product pair, newest first.
 */
export async function getUserProductGrantsDb(
  userId: string,
  productId: string
): Promise<DbUserAccessGrant[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_access_grants")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user product grants:", {
      userId,
      productId,
      error,
    });
    return [];
  }

  return (data ?? []) as DbUserAccessGrant[];
}

/**
 * Returns the single active-and-currently-valid grant for a user/product pair.
 * If multiple valid active grants somehow exist, the newest one wins.
 */
export async function getActiveUserProductGrantDb(
  userId: string,
  productId: string
): Promise<DbUserAccessGrant | null> {
  const grants = await getUserProductGrantsDb(userId, productId);

  const validActiveGrant = grants.find((grant) => isGrantCurrentlyValid(grant));

  return validActiveGrant ?? null;
}

export async function hasActiveUserProductGrantDb(
  userId: string,
  productId: string
): Promise<boolean> {
  const grant = await getActiveUserProductGrantDb(userId, productId);
  return grant !== null;
}

/**
 * Deactivates all currently active grants for a user/product pair.
 * This enforces the "one active grant per product per user" rule.
 */
export async function deactivateActiveUserProductGrantsDb(
  userId: string,
  productId: string
): Promise<{ success: boolean; deactivatedCount: number }> {
  const supabase = await createClient();

  const activeGrants = await getUserProductGrantsDb(userId, productId);
  const activeIds = activeGrants
    .filter((grant) => grant.is_active)
    .map((grant) => grant.id);

  if (activeIds.length === 0) {
    return { success: true, deactivatedCount: 0 };
  }

  const { error } = await supabase
    .from("user_access_grants")
    .update({ is_active: false })
    .in("id", activeIds);

  if (error) {
    console.error("Error deactivating active user product grants:", {
      userId,
      productId,
      activeIds,
      error,
    });

    return { success: false, deactivatedCount: 0 };
  }

  return { success: true, deactivatedCount: activeIds.length };
}

/**
 * Creates a fresh grant after deactivating any existing active grants
 * for the same user/product pair.
 *
 * This preserves history while ensuring only one active grant exists
 * per product per user.
 */
export async function grantProductAccessDb(
  input: GrantProductAccessInput
): Promise<DbUserAccessGrant | null> {
  const supabase = await createClient();

  const startsAt = toIsoOrNull(input.startsAt);
  const endsAt = toIsoOrNull(input.endsAt);

  const deactivateResult = await deactivateActiveUserProductGrantsDb(
    input.userId,
    input.productId
  );

  if (!deactivateResult.success) {
    return null;
  }

  const insertPayload = {
    user_id: input.userId,
    product_id: input.productId,
    access_mode: input.accessMode,
    source: input.source,
    starts_at: startsAt,
    ends_at: endsAt,
    is_active: true,
    granted_by: input.grantedBy ?? null,
  };

  const { data, error } = await supabase
    .from("user_access_grants")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    console.error("Error granting product access:", {
      input,
      error,
    });
    return null;
  }

  return data as DbUserAccessGrant;
}

/**
 * Ends a grant immediately by setting it inactive.
 * Use this for manual revocation or hard cancellation flows.
 */
export async function deactivateGrantByIdDb(
  grantId: string
): Promise<DbUserAccessGrant | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_access_grants")
    .update({ is_active: false })
    .eq("id", grantId)
    .select("*")
    .single();

  if (error) {
    console.error("Error deactivating grant by id:", {
      grantId,
      error,
    });
    return null;
  }

  return data as DbUserAccessGrant;
}

/**
 * Useful for subscription-ending-at-period-end flows:
 * keep the grant active, but update its end date.
 */
export async function setGrantEndDateDb(
  grantId: string,
  endsAt: Date | string | null
): Promise<DbUserAccessGrant | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_access_grants")
    .update({ ends_at: toIsoOrNull(endsAt) })
    .eq("id", grantId)
    .select("*")
    .single();

  if (error) {
    console.error("Error setting grant end date:", {
      grantId,
      endsAt,
      error,
    });
    return null;
  }

  return data as DbUserAccessGrant;
}

/**
 * Returns all currently valid active grants for a user.
 * Helpful for future account/billing UI.
 */
export async function getActiveUserGrantsDb(
  userId: string
): Promise<DbUserAccessGrant[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_access_grants")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching active user grants:", {
      userId,
      error,
    });
    return [];
  }

  const grants = (data ?? []) as DbUserAccessGrant[];
  const now = new Date();

  return grants.filter((grant) => isGrantCurrentlyValid(grant, now));
}

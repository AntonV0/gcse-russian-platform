import { createAdminClient } from "@/lib/supabase/admin";

export type GrantAccessMode = "trial" | "full" | "volna";
export type GrantSource = "stripe" | "admin" | "manual" | "migration";

export type DbUserAccessGrant = {
  id: string;
  user_id: string;
  product_id: string;
  price_id: string | null;
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
  priceId?: string | null;
  accessMode: GrantAccessMode;
  source: GrantSource;
  startsAt?: Date | string | null;
  endsAt?: Date | string | null;
  grantedBy?: string | null;
};

const USER_ACCESS_GRANT_SELECT =
  "id, user_id, product_id, price_id, access_mode, source, starts_at, ends_at, is_active, granted_by, created_at";

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

function nullableStringsEqual(left: string | null, right: string | null): boolean {
  return left === right;
}

export async function getUserProductGrantsDb(
  userId: string,
  productId: string
): Promise<DbUserAccessGrant[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("user_access_grants")
    .select(USER_ACCESS_GRANT_SELECT)
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

export async function deactivateActiveUserProductGrantsDb(
  userId: string,
  productId: string
): Promise<{ success: boolean; deactivatedCount: number }> {
  const supabase = createAdminClient();

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

export async function deactivateActiveUserProductGrantsBySourceDb(
  userId: string,
  productId: string,
  source: GrantSource
): Promise<{ success: boolean; deactivatedCount: number }> {
  const supabase = createAdminClient();

  const { data: activeGrants, error: fetchError } = await supabase
    .from("user_access_grants")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .eq("source", source)
    .eq("is_active", true);

  if (fetchError) {
    console.error("Error fetching active user product grants by source:", {
      userId,
      productId,
      source,
      error: fetchError,
    });
    return { success: false, deactivatedCount: 0 };
  }

  const activeIds = (activeGrants ?? []).map((grant) => grant.id as string);

  if (activeIds.length === 0) {
    return { success: true, deactivatedCount: 0 };
  }

  const { error } = await supabase
    .from("user_access_grants")
    .update({ is_active: false })
    .in("id", activeIds);

  if (error) {
    console.error("Error deactivating active user product grants by source:", {
      userId,
      productId,
      source,
      activeIds,
      error,
    });

    return { success: false, deactivatedCount: 0 };
  }

  return { success: true, deactivatedCount: activeIds.length };
}

export async function grantProductAccessDb(
  input: GrantProductAccessInput
): Promise<DbUserAccessGrant | null> {
  const startsAt = toIsoOrNull(input.startsAt);
  const endsAt = toIsoOrNull(input.endsAt);
  const existingActiveGrant = await getActiveUserProductGrantDb(
    input.userId,
    input.productId
  );

  if (
    existingActiveGrant &&
    existingActiveGrant.access_mode === input.accessMode &&
    existingActiveGrant.source === input.source &&
    nullableStringsEqual(existingActiveGrant.price_id, input.priceId ?? null) &&
    nullableStringsEqual(existingActiveGrant.starts_at, startsAt) &&
    nullableStringsEqual(existingActiveGrant.ends_at, endsAt)
  ) {
    return existingActiveGrant;
  }

  const supabase = createAdminClient();

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
    price_id: input.priceId ?? null,
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
    .select(USER_ACCESS_GRANT_SELECT)
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

export async function deactivateGrantByIdDb(
  grantId: string
): Promise<DbUserAccessGrant | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("user_access_grants")
    .update({ is_active: false })
    .eq("id", grantId)
    .select(USER_ACCESS_GRANT_SELECT)
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

export async function setGrantEndDateDb(
  grantId: string,
  endsAt: Date | string | null
): Promise<DbUserAccessGrant | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("user_access_grants")
    .update({ ends_at: toIsoOrNull(endsAt) })
    .eq("id", grantId)
    .select(USER_ACCESS_GRANT_SELECT)
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

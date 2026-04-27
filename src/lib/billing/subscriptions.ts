import { createAdminClient } from "@/lib/supabase/admin";
export {
  isSubscriptionActiveStatus,
  shouldDeactivateStripeSubscriptionAccess,
} from "@/lib/billing/subscription-status";

export type DbSubscription = {
  id: string;
  user_id: string;
  product_id: string;
  price_id: string | null;
  provider: string;
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UpsertSubscriptionInput = {
  userId: string;
  productId: string;
  priceId?: string | null;
  provider?: string;
  providerCustomerId?: string | null;
  providerSubscriptionId?: string | null;
  status: string;
  currentPeriodStart?: Date | string | null;
  currentPeriodEnd?: Date | string | null;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: Date | string | null;
};

const SUBSCRIPTION_SELECT =
  "id, user_id, product_id, price_id, provider, provider_customer_id, provider_subscription_id, status, current_period_start, current_period_end, cancel_at_period_end, canceled_at, created_at, updated_at";

function toIsoOrNull(value?: Date | string | null): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}

export async function getSubscriptionByIdDb(
  subscriptionId: string
): Promise<DbSubscription | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select(SUBSCRIPTION_SELECT)
    .eq("id", subscriptionId)
    .single();

  if (error) {
    console.error("Error fetching subscription by id:", {
      subscriptionId,
      error,
    });
    return null;
  }

  return data as DbSubscription;
}

export async function getSubscriptionByProviderSubscriptionIdDb(
  providerSubscriptionId: string
): Promise<DbSubscription | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select(SUBSCRIPTION_SELECT)
    .eq("provider_subscription_id", providerSubscriptionId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching subscription by provider subscription id:", {
      providerSubscriptionId,
      error,
    });
    return null;
  }

  return (data ?? null) as DbSubscription | null;
}

export async function getUserProductSubscriptionsDb(
  userId: string,
  productId: string
): Promise<DbSubscription[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select(SUBSCRIPTION_SELECT)
    .eq("user_id", userId)
    .eq("product_id", productId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching user product subscriptions:", {
      userId,
      productId,
      error,
    });
    return [];
  }

  return (data ?? []) as DbSubscription[];
}

export async function getLatestUserProductSubscriptionDb(
  userId: string,
  productId: string
): Promise<DbSubscription | null> {
  const subscriptions = await getUserProductSubscriptionsDb(userId, productId);
  return subscriptions[0] ?? null;
}

async function findSubscriptionForUpsert(
  input: UpsertSubscriptionInput
): Promise<DbSubscription | null> {
  if (input.providerSubscriptionId) {
    const existingByProviderId = await getSubscriptionByProviderSubscriptionIdDb(
      input.providerSubscriptionId
    );

    if (existingByProviderId) {
      return existingByProviderId;
    }
  }

  return getLatestUserProductSubscriptionDb(input.userId, input.productId);
}

export async function upsertSubscriptionDb(
  input: UpsertSubscriptionInput
): Promise<DbSubscription | null> {
  const supabase = createAdminClient();

  const existing = await findSubscriptionForUpsert(input);

  const payload = {
    user_id: input.userId,
    product_id: input.productId,
    price_id: input.priceId ?? null,
    provider: input.provider ?? "stripe",
    provider_customer_id: input.providerCustomerId ?? null,
    provider_subscription_id: input.providerSubscriptionId ?? null,
    status: input.status,
    current_period_start: toIsoOrNull(input.currentPeriodStart),
    current_period_end: toIsoOrNull(input.currentPeriodEnd),
    cancel_at_period_end: input.cancelAtPeriodEnd ?? false,
    canceled_at: toIsoOrNull(input.canceledAt),
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    const { data, error } = await supabase
      .from("subscriptions")
      .update(payload)
      .eq("id", existing.id)
      .select(SUBSCRIPTION_SELECT)
      .single();

    if (error) {
      console.error("Error updating subscription:", {
        existingId: existing.id,
        input,
        error,
      });
      return null;
    }

    return data as DbSubscription;
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .insert(payload)
    .select(SUBSCRIPTION_SELECT)
    .single();

  if (error) {
    console.error("Error creating subscription:", {
      input,
      error,
    });
    return null;
  }

  return data as DbSubscription;
}

export async function cancelSubscriptionByProviderSubscriptionIdDb(
  providerSubscriptionId: string,
  canceledAt?: Date | string | null
): Promise<DbSubscription | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      cancel_at_period_end: false,
      canceled_at: toIsoOrNull(canceledAt) ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("provider_subscription_id", providerSubscriptionId)
    .select(SUBSCRIPTION_SELECT)
    .single();

  if (error) {
    console.error("Error canceling subscription by provider subscription id:", {
      providerSubscriptionId,
      canceledAt,
      error,
    });
    return null;
  }

  return data as DbSubscription;
}

export async function getActiveUserSubscriptionsDb(
  userId: string
): Promise<DbSubscription[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select(SUBSCRIPTION_SELECT)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching active user subscriptions:", {
      userId,
      error,
    });
    return [];
  }

  const subscriptions = (data ?? []) as DbSubscription[];

  return subscriptions.filter((subscription) =>
    isSubscriptionActiveStatus(subscription.status)
  );
}

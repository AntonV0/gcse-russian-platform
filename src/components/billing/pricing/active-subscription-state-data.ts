import { createClient } from "@/lib/supabase/server";
import { BILLING_TYPES, PRODUCT_CODES } from "@/lib/billing/catalog";
import { formatPriceLabel } from "@/lib/billing/pricing-ui";
import type {
  ActiveSubscriptionState,
  RenewalInfo,
} from "@/components/billing/pricing/types";

type ProductRow = {
  id: string;
  code: string;
};

type SubscriptionRow = {
  product_id: string;
  price_id: string | null;
  status: string;
  current_period_end: string | null;
  updated_at: string;
};

type SubscriptionPriceRow = {
  id: string;
  amount_gbp: number;
  billing_type: string;
  interval_unit: string | null;
  interval_count: number | null;
};

export async function getEmptySubscriptionState(): Promise<ActiveSubscriptionState> {
  return {
    foundation: null,
    higher: null,
  };
}

export async function getActiveSubscriptionStateForUser(
  userId: string
): Promise<ActiveSubscriptionState> {
  const supabase = await createClient();

  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select("product_id, price_id, status, current_period_end, updated_at")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .order("updated_at", { ascending: false });

  if (error || !subscriptions || subscriptions.length === 0) {
    return getEmptySubscriptionState();
  }

  const typedSubscriptions = subscriptions as SubscriptionRow[];
  const productIds = [...new Set(typedSubscriptions.map((row) => row.product_id))];
  const priceIds = [
    ...new Set(typedSubscriptions.map((row) => row.price_id).filter(Boolean)),
  ] as string[];

  const [{ data: products }, { data: prices }] = await Promise.all([
    supabase.from("products").select("id, code").in("id", productIds),
    priceIds.length > 0
      ? supabase
          .from("prices")
          .select("id, amount_gbp, billing_type, interval_unit, interval_count")
          .in("id", priceIds)
      : Promise.resolve({ data: [] as SubscriptionPriceRow[] | null }),
  ]);

  const productMap = new Map<string, ProductRow>(
    ((products ?? []) as ProductRow[]).map((product) => [product.id, product])
  );

  const priceMap = new Map<string, SubscriptionPriceRow>(
    ((prices ?? []) as SubscriptionPriceRow[]).map((price) => [price.id, price])
  );

  let foundation: RenewalInfo | null = null;
  let higher: RenewalInfo | null = null;

  for (const subscription of typedSubscriptions) {
    const product = productMap.get(subscription.product_id);
    const price = subscription.price_id ? priceMap.get(subscription.price_id) : null;

    if (!product || !price) continue;
    if (price.billing_type !== BILLING_TYPES.SUBSCRIPTION) continue;

    const renewalInfo: RenewalInfo = {
      currentPeriodEnd: subscription.current_period_end,
      amountLabel: formatPriceLabel(price),
    };

    if (product.code === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION && foundation === null) {
      foundation = renewalInfo;
    }

    if (product.code === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER && higher === null) {
      higher = renewalInfo;
    }
  }

  return {
    foundation,
    higher,
  };
}

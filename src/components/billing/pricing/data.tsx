import { createClient } from "@/lib/supabase/server";
import {
  BILLING_TYPES,
  INTERVAL_UNITS,
  PRODUCT_CODES,
  getActivePricesForProductDb,
  getActiveProductByCodeDb,
  matchPriceByBillingShape,
  resolveUpgradeQuoteDb,
} from "@/lib/billing/catalog";
import type {
  ActiveGrantProductCode,
  ActivePlanState,
  ActiveSubscriptionState,
  PlanPricing,
  RenewalInfo,
} from "@/components/billing/pricing/types";

type GrantRow = {
  product_id: string;
  price_id: string | null;
};

type ProductRow = {
  id: string;
  code: string;
};

type PriceRow = {
  id: string;
  billing_type: string;
  interval_unit: string | null;
  interval_count: number | null;
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

function formatSubscriptionAmountLabel(
  price: SubscriptionPriceRow | null
): string | null {
  if (!price) return null;

  const formattedAmount = `£${price.amount_gbp}`;

  if (price.billing_type === BILLING_TYPES.SUBSCRIPTION) {
    if (price.interval_unit === INTERVAL_UNITS.MONTH) {
      const count = price.interval_count ?? 1;

      if (count === 1) {
        return `${formattedAmount}/month`;
      }

      return `${formattedAmount}/${count} months`;
    }

    if (price.interval_unit === INTERVAL_UNITS.YEAR) {
      const count = price.interval_count ?? 1;

      if (count === 1) {
        return `${formattedAmount}/year`;
      }

      return `${formattedAmount}/${count} years`;
    }
  }

  return formattedAmount;
}

export async function getPlanPricing(productCode: string): Promise<PlanPricing> {
  const product = await getActiveProductByCodeDb(productCode);

  if (!product) {
    return {
      monthly: null,
      threeMonth: null,
      lifetime: null,
    };
  }

  const prices = await getActivePricesForProductDb(product.id);

  return {
    monthly: matchPriceByBillingShape(
      prices,
      BILLING_TYPES.SUBSCRIPTION,
      INTERVAL_UNITS.MONTH,
      1
    ),
    threeMonth: matchPriceByBillingShape(
      prices,
      BILLING_TYPES.SUBSCRIPTION,
      INTERVAL_UNITS.MONTH,
      3
    ),
    lifetime: matchPriceByBillingShape(prices, BILLING_TYPES.ONE_TIME, null, null),
  };
}

export async function getEmptyPlanState(): Promise<ActivePlanState> {
  return {
    ownedProductCodes: new Set<ActiveGrantProductCode>(),
    foundationMonthly: false,
    foundationThreeMonth: false,
    foundationLifetime: false,
    higherMonthly: false,
    higherThreeMonth: false,
    higherLifetime: false,
  };
}

export async function getActivePlanStateForUser(
  userId: string
): Promise<ActivePlanState> {
  const supabase = await createClient();

  const { data: grants, error } = await supabase
    .from("user_access_grants")
    .select("product_id, price_id")
    .eq("user_id", userId)
    .eq("is_active", true);

  if (error || !grants || grants.length === 0) {
    return getEmptyPlanState();
  }

  const typedGrants = grants as GrantRow[];
  const productIds = [...new Set(typedGrants.map((grant) => grant.product_id))];
  const priceIds = [
    ...new Set(typedGrants.map((grant) => grant.price_id).filter(Boolean)),
  ] as string[];

  const [{ data: products }, { data: prices }] = await Promise.all([
    supabase.from("products").select("id, code").in("id", productIds),
    priceIds.length > 0
      ? supabase
          .from("prices")
          .select("id, billing_type, interval_unit, interval_count")
          .in("id", priceIds)
      : Promise.resolve({ data: [] as PriceRow[] | null }),
  ]);

  const productMap = new Map<string, ProductRow>(
    ((products ?? []) as ProductRow[]).map((product) => [product.id, product])
  );

  const priceMap = new Map<string, PriceRow>(
    ((prices ?? []) as PriceRow[]).map((price) => [price.id, price])
  );

  const ownedProductCodes = new Set<ActiveGrantProductCode>();

  let foundationMonthly = false;
  let foundationThreeMonth = false;
  let foundationLifetime = false;
  let higherMonthly = false;
  let higherThreeMonth = false;
  let higherLifetime = false;

  for (const grant of typedGrants) {
    const product = productMap.get(grant.product_id);
    const price = grant.price_id ? priceMap.get(grant.price_id) : null;

    if (!product) continue;

    if (
      product.code === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION ||
      product.code === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER
    ) {
      ownedProductCodes.add(product.code as ActiveGrantProductCode);
    }

    if (!price) continue;

    const isMonthly =
      price.billing_type === BILLING_TYPES.SUBSCRIPTION &&
      price.interval_unit === INTERVAL_UNITS.MONTH &&
      (price.interval_count ?? 1) === 1;

    const isThreeMonth =
      price.billing_type === BILLING_TYPES.SUBSCRIPTION &&
      price.interval_unit === INTERVAL_UNITS.MONTH &&
      (price.interval_count ?? 1) === 3;

    const isLifetime = price.billing_type === BILLING_TYPES.ONE_TIME;

    if (product.code === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION) {
      foundationMonthly = foundationMonthly || isMonthly;
      foundationThreeMonth = foundationThreeMonth || isThreeMonth;
      foundationLifetime = foundationLifetime || isLifetime;
    }

    if (product.code === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER) {
      higherMonthly = higherMonthly || isMonthly;
      higherThreeMonth = higherThreeMonth || isThreeMonth;
      higherLifetime = higherLifetime || isLifetime;
    }
  }

  return {
    ownedProductCodes,
    foundationMonthly,
    foundationThreeMonth,
    foundationLifetime,
    higherMonthly,
    higherThreeMonth,
    higherLifetime,
  };
}

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
      amountLabel: formatSubscriptionAmountLabel(price),
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

export async function getPricingPageData(userId: string | null) {
  return Promise.all([
    getPlanPricing(PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION),
    getPlanPricing(PRODUCT_CODES.GCSE_RUSSIAN_HIGHER),
    userId ? getActivePlanStateForUser(userId) : getEmptyPlanState(),
    userId ? getActiveSubscriptionStateForUser(userId) : getEmptySubscriptionState(),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
          BILLING_TYPES.SUBSCRIPTION,
          INTERVAL_UNITS.MONTH,
          3
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
          BILLING_TYPES.ONE_TIME,
          null,
          null
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
          BILLING_TYPES.ONE_TIME,
          null,
          null
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.SUBSCRIPTION,
          INTERVAL_UNITS.MONTH,
          1
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.SUBSCRIPTION,
          INTERVAL_UNITS.MONTH,
          3
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.SUBSCRIPTION,
          INTERVAL_UNITS.MONTH,
          3
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.ONE_TIME,
          null,
          null
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.SUBSCRIPTION,
          INTERVAL_UNITS.MONTH,
          3
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.ONE_TIME,
          null,
          null
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.ONE_TIME,
          null,
          null
        )
      : Promise.resolve(null),
  ]).then(
    ([
      foundationPricing,
      higherPricing,
      planState,
      activeSubscriptions,
      foundationMonthlyToThreeMonthQuote,
      foundationMonthlyToFoundationLifetimeQuote,
      foundationThreeMonthToFoundationLifetimeQuote,
      foundationMonthlyToHigherMonthlyQuote,
      foundationMonthlyToHigherThreeMonthQuote,
      foundationThreeMonthToHigherThreeMonthQuote,
      foundationLifetimeToHigherLifetimeQuote,
      higherMonthlyToThreeMonthQuote,
      higherMonthlyToHigherLifetimeQuote,
      higherThreeMonthToHigherLifetimeQuote,
    ]) => ({
      foundationPricing,
      higherPricing,
      planState,
      activeSubscriptions,
      foundationMonthlyToThreeMonthQuote,
      foundationMonthlyToFoundationLifetimeQuote,
      foundationThreeMonthToFoundationLifetimeQuote,
      foundationMonthlyToHigherMonthlyQuote,
      foundationMonthlyToHigherThreeMonthQuote,
      foundationThreeMonthToHigherThreeMonthQuote,
      foundationLifetimeToHigherLifetimeQuote,
      higherMonthlyToThreeMonthQuote,
      higherMonthlyToHigherLifetimeQuote,
      higherThreeMonthToHigherLifetimeQuote,
    })
  );
}

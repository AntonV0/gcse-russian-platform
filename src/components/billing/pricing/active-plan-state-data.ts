import { createClient } from "@/lib/supabase/server";
import { BILLING_TYPES, INTERVAL_UNITS, PRODUCT_CODES } from "@/lib/billing/catalog";
import type {
  ActiveGrantProductCode,
  ActivePlanState,
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

import { createClient } from "@/lib/supabase/server";
import {
  BILLING_TYPES,
  INTERVAL_UNITS,
  PRODUCT_CODES,
  getUserGcseRussianPurchaseStateDb,
  resolveUpgradeQuoteDb,
  type UpgradeQuoteResolution,
} from "@/lib/billing/catalog";

type GrantRow = {
  id: string;
  product_id: string;
  price_id: string | null;
  access_mode: string;
  source: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
};

type ProductRow = {
  id: string;
  code: string;
  name: string;
};

type PriceRow = {
  id: string;
  billing_type: string;
  interval_unit: string | null;
  interval_count: number | null;
  amount_gbp: number;
};

export type CurrentPlanSummary = {
  hasPlan: boolean;
  productName: string | null;
  productCode: string | null;
  planLabel: string | null;
  amountLabel: string | null;
  accessMode: string | null;
  source: string | null;
  startsAt: string | null;
  endsAt: string | null;
  canUpgradeToHigher: boolean;
  resolvedUpgradeSummary: string | null;
};

function formatBillingShape(price: PriceRow | null): string | null {
  if (!price) return null;

  if (price.billing_type === "one_time") {
    return "Lifetime";
  }

  if (price.billing_type === "subscription") {
    const intervalUnit = price.interval_unit ?? "month";
    const intervalCount = price.interval_count ?? 1;

    if (intervalUnit === "month" && intervalCount === 1) {
      return "Monthly";
    }

    if (intervalUnit === "month" && intervalCount === 3) {
      return "3-month";
    }

    if (intervalUnit === "year" && intervalCount === 1) {
      return "Yearly";
    }

    return `${intervalCount}-${intervalUnit}`;
  }

  return null;
}

function formatAmountLabel(price: PriceRow | null): string | null {
  if (!price) return null;

  const base = `£${price.amount_gbp}`;

  if (price.billing_type === "one_time") {
    return base;
  }

  const intervalUnit = price.interval_unit ?? "month";
  const intervalCount = price.interval_count ?? 1;

  if (intervalUnit === "month" && intervalCount === 1) {
    return `${base}/month`;
  }

  if (intervalUnit === "month") {
    return `${base}/${intervalCount} months`;
  }

  if (intervalUnit === "year" && intervalCount === 1) {
    return `${base}/year`;
  }

  return `${base}/${intervalCount} ${intervalUnit}s`;
}

function formatUpgradeQuoteSummaryPart(
  label: string,
  quote: UpgradeQuoteResolution | null
): string | null {
  if (!quote?.eligible || quote.upgradeFeeAmountGbp == null) {
    return null;
  }

  return `${label} £${quote.upgradeFeeAmountGbp}`;
}

function buildUpgradeSummary(params: {
  monthly: UpgradeQuoteResolution | null;
  threeMonth: UpgradeQuoteResolution | null;
  lifetime: UpgradeQuoteResolution | null;
}): string | null {
  const parts = [
    formatUpgradeQuoteSummaryPart("Monthly", params.monthly),
    formatUpgradeQuoteSummaryPart("3-month", params.threeMonth),
    formatUpgradeQuoteSummaryPart("Lifetime", params.lifetime),
  ].filter(Boolean) as string[];

  if (parts.length === 0) {
    return null;
  }

  return parts.join(" · ");
}

function isGrantCurrentlyValid(grant: GrantRow, now = new Date()): boolean {
  if (!grant.is_active) {
    return false;
  }

  if (grant.starts_at && new Date(grant.starts_at) > now) {
    return false;
  }

  if (grant.ends_at && new Date(grant.ends_at) < now) {
    return false;
  }

  return true;
}

export async function getCurrentPlanSummaryForUserDb(
  userId: string
): Promise<CurrentPlanSummary> {
  const supabase = await createClient();

  const [
    { data: grants },
    purchaseState,
    higherMonthlyUpgrade,
    higherThreeMonthUpgrade,
    higherLifetimeUpgrade,
  ] = await Promise.all([
    supabase
      .from("user_access_grants")
      .select(
        "id, product_id, price_id, access_mode, source, starts_at, ends_at, is_active, created_at"
      )
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
    getUserGcseRussianPurchaseStateDb(userId),
    resolveUpgradeQuoteDb(
      userId,
      PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
      BILLING_TYPES.SUBSCRIPTION,
      INTERVAL_UNITS.MONTH,
      1
    ),
    resolveUpgradeQuoteDb(
      userId,
      PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
      BILLING_TYPES.SUBSCRIPTION,
      INTERVAL_UNITS.MONTH,
      3
    ),
    resolveUpgradeQuoteDb(
      userId,
      PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
      BILLING_TYPES.ONE_TIME,
      null,
      null
    ),
  ]);

  const upgradePricing = {
    monthly: higherMonthlyUpgrade,
    threeMonth: higherThreeMonthUpgrade,
    lifetime: higherLifetimeUpgrade,
  };

  const now = new Date();
  const typedGrants = ((grants ?? []) as GrantRow[]).filter((grant) =>
    isGrantCurrentlyValid(grant, now)
  );

  if (typedGrants.length === 0) {
    return {
      hasPlan: false,
      productName: null,
      productCode: null,
      planLabel: null,
      amountLabel: null,
      accessMode: null,
      source: null,
      startsAt: null,
      endsAt: null,
      canUpgradeToHigher: purchaseState.canUpgradeToHigher,
      resolvedUpgradeSummary: buildUpgradeSummary(upgradePricing),
    };
  }

  const productIds = [...new Set(typedGrants.map((grant) => grant.product_id))];
  const priceIds = [
    ...new Set(typedGrants.map((grant) => grant.price_id).filter(Boolean)),
  ] as string[];

  const [{ data: products }, { data: prices }] = await Promise.all([
    supabase.from("products").select("id, code, name").in("id", productIds),
    priceIds.length > 0
      ? supabase
          .from("prices")
          .select("id, billing_type, interval_unit, interval_count, amount_gbp")
          .in("id", priceIds)
      : Promise.resolve({ data: [] as PriceRow[] | null }),
  ]);

  const productMap = new Map<string, ProductRow>(
    ((products ?? []) as ProductRow[]).map((product) => [product.id, product])
  );

  const priceMap = new Map<string, PriceRow>(
    ((prices ?? []) as PriceRow[]).map((price) => [price.id, price])
  );

  const bestGrant = [...typedGrants].sort((a, b) => {
    const aProduct = productMap.get(a.product_id);
    const bProduct = productMap.get(b.product_id);

    const priorityByProductCode: Record<string, number> = {
      "gcse-russian-higher": 3,
      "gcse-russian-foundation": 2,
    };

    const aPriority = priorityByProductCode[aProduct?.code ?? ""] ?? 0;
    const bPriority = priorityByProductCode[bProduct?.code ?? ""] ?? 0;

    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  })[0];

  const product = productMap.get(bestGrant.product_id) ?? null;
  const price = bestGrant.price_id ? (priceMap.get(bestGrant.price_id) ?? null) : null;

  const productCode = product?.code ?? null;
  const productName = product?.name ?? null;
  const billingShape = formatBillingShape(price);
  const amountLabel = formatAmountLabel(price);

  let planLabel = productName;

  if (productCode === "gcse-russian-foundation" && billingShape) {
    planLabel = `Foundation ${billingShape}`;
  } else if (productCode === "gcse-russian-higher" && billingShape) {
    planLabel = `Higher ${billingShape}`;
  } else if (productName && billingShape) {
    planLabel = `${productName} ${billingShape}`;
  }

  return {
    hasPlan: true,
    productName,
    productCode,
    planLabel: planLabel ?? productName,
    amountLabel,
    accessMode: bestGrant.access_mode,
    source: bestGrant.source,
    startsAt: bestGrant.starts_at,
    endsAt: bestGrant.ends_at,
    canUpgradeToHigher: purchaseState.canUpgradeToHigher,
    resolvedUpgradeSummary: buildUpgradeSummary(upgradePricing),
  };
}

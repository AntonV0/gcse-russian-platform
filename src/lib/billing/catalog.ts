import { createClient } from "@/lib/supabase/server";
import {
  getActiveUserProductGrantDb,
  hasActiveUserProductGrantDb,
  type DbUserAccessGrant,
} from "@/lib/billing/grants";

export type DbProduct = {
  id: string;
  code: string;
  name: string;
  product_type: string;
  course_id: string | null;
  course_variant_id: string | null;
  is_active: boolean;
  created_at: string;
};

export type DbPrice = {
  id: string;
  product_id: string;
  billing_type: string;
  interval_unit: string | null;
  interval_count: number | null;
  amount_gbp: number;
  stripe_price_id: string | null;
  is_active: boolean;
  created_at: string;
};

export type PurchaseType = "standard" | "upgrade";
export type UpgradeFlow = "same_cadence" | "monthly_to_three_month" | "lifetime";

export type CheckoutCatalogResolution = {
  product: DbProduct;
  price: DbPrice;
  purchaseType: PurchaseType;
  upgradeFlow?: UpgradeFlow | null;
  upgradeFeeAmountGbp?: number | null;
};

export type UpgradeQuoteResolution = {
  eligible: boolean;
  sourceGrant: DbUserAccessGrant | null;
  sourceProduct: DbProduct | null;
  sourcePrice: DbPrice | null;
  targetProduct: DbProduct | null;
  targetPrice: DbPrice | null;
  upgradeFlow: UpgradeFlow | null;
  upgradeFeeAmountGbp: number | null;
};

export const PRODUCT_CODES = {
  GCSE_RUSSIAN_FOUNDATION: "gcse-russian-foundation",
  GCSE_RUSSIAN_HIGHER: "gcse-russian-higher",
} as const;

export const BILLING_TYPES = {
  ONE_TIME: "one_time",
  SUBSCRIPTION: "subscription",
} as const;

export const INTERVAL_UNITS = {
  MONTH: "month",
  YEAR: "year",
} as const;

export type SupportedIntervalUnit =
  | typeof INTERVAL_UNITS.MONTH
  | typeof INTERVAL_UNITS.YEAR;

export type ResolveCheckoutPriceInput = {
  userId: string;
  targetProductCode: string;
  billingType: string;
  intervalUnit?: SupportedIntervalUnit | null;
  intervalCount?: number | null;
  isUpgrade?: boolean;
};

export function getUpgradeProductCode(productCode: string): string {
  return `${productCode}-upgrade`;
}

export async function getActiveProductByCodeDb(
  productCode: string
): Promise<DbProduct | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("code", productCode)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching active product by code:", {
      productCode,
      error,
    });
    return null;
  }

  return (data as DbProduct | null) ?? null;
}

export async function getProductByIdDb(productId: string): Promise<DbProduct | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) {
    console.error("Error fetching product by id:", {
      productId,
      error,
    });
    return null;
  }

  return data as DbProduct;
}

export async function getActivePricesForProductDb(productId: string): Promise<DbPrice[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("prices")
    .select("*")
    .eq("product_id", productId)
    .eq("is_active", true)
    .order("amount_gbp", { ascending: true });

  if (error) {
    console.error("Error fetching active prices for product:", {
      productId,
      error,
    });
    return [];
  }

  return (data ?? []) as DbPrice[];
}

export async function getActivePriceByIdDb(priceId: string): Promise<DbPrice | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("prices")
    .select("*")
    .eq("id", priceId)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching active price by id:", {
      priceId,
      error,
    });
    return null;
  }

  return data as DbPrice;
}

export async function getActivePriceByStripePriceIdDb(
  stripePriceId: string
): Promise<DbPrice | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("prices")
    .select("*")
    .eq("stripe_price_id", stripePriceId)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching active price by Stripe price id:", {
      stripePriceId,
      error,
    });
    return null;
  }

  return data as DbPrice;
}

export function matchPriceByBillingShape(
  prices: DbPrice[],
  billingType: string,
  intervalUnit?: string | null,
  intervalCount?: number | null
): DbPrice | null {
  const matched = prices.find((price) => {
    if (price.billing_type !== billingType) return false;

    if (billingType === BILLING_TYPES.SUBSCRIPTION) {
      const expectedUnit = intervalUnit ?? null;
      const expectedCount = intervalCount ?? 1;

      return (
        price.interval_unit === expectedUnit &&
        (price.interval_count ?? 1) === expectedCount
      );
    }

    return true;
  });

  return matched ?? null;
}

function getFixedUpgradeFeeAmountGbp(sourcePrice: DbPrice, targetPrice: DbPrice): number {
  return Math.max(targetPrice.amount_gbp - sourcePrice.amount_gbp, 0);
}

export function getUpgradeFlowForPath(
  sourceProductCode: string,
  sourcePrice: DbPrice,
  targetProductCode: string,
  targetPrice: DbPrice
): UpgradeFlow | null {
  const sourceIsFoundation = sourceProductCode === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION;
  const sourceIsHigher = sourceProductCode === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER;
  const targetIsFoundation = targetProductCode === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION;
  const targetIsHigher = targetProductCode === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER;

  if (!sourceIsFoundation && !sourceIsHigher) {
    return null;
  }

  if (!targetIsFoundation && !targetIsHigher) {
    return null;
  }

  const sourceBillingType = sourcePrice.billing_type;
  const sourceIntervalUnit = sourcePrice.interval_unit;
  const sourceIntervalCount = sourcePrice.interval_count ?? 1;

  const targetBillingType = targetPrice.billing_type;
  const targetIntervalUnit = targetPrice.interval_unit;
  const targetIntervalCount = targetPrice.interval_count ?? 1;

  if (
    sourceIsFoundation &&
    sourceBillingType === BILLING_TYPES.ONE_TIME &&
    targetIsHigher &&
    targetBillingType === BILLING_TYPES.ONE_TIME
  ) {
    return "lifetime";
  }

  if (
    sourceBillingType === BILLING_TYPES.SUBSCRIPTION &&
    sourceIntervalUnit === INTERVAL_UNITS.MONTH &&
    sourceIntervalCount === 1 &&
    targetBillingType === BILLING_TYPES.SUBSCRIPTION &&
    targetIntervalUnit === INTERVAL_UNITS.MONTH &&
    targetIntervalCount === 1 &&
    sourceIsFoundation &&
    targetIsHigher
  ) {
    return "same_cadence";
  }

  if (
    sourceBillingType === BILLING_TYPES.SUBSCRIPTION &&
    sourceIntervalUnit === INTERVAL_UNITS.MONTH &&
    sourceIntervalCount === 3 &&
    targetBillingType === BILLING_TYPES.SUBSCRIPTION &&
    targetIntervalUnit === INTERVAL_UNITS.MONTH &&
    targetIntervalCount === 3 &&
    sourceIsFoundation &&
    targetIsHigher
  ) {
    return "same_cadence";
  }

  if (
    sourceBillingType === BILLING_TYPES.SUBSCRIPTION &&
    sourceIntervalUnit === INTERVAL_UNITS.MONTH &&
    sourceIntervalCount === 1 &&
    targetBillingType === BILLING_TYPES.SUBSCRIPTION &&
    targetIntervalUnit === INTERVAL_UNITS.MONTH &&
    targetIntervalCount === 3 &&
    ((sourceIsFoundation && targetIsFoundation) ||
      (sourceIsHigher && targetIsHigher) ||
      (sourceIsFoundation && targetIsHigher))
  ) {
    return "monthly_to_three_month";
  }

  return null;
}

async function getActiveUpgradeableGrantsDb(
  userId: string
): Promise<Array<{ grant: DbUserAccessGrant; product: DbProduct; price: DbPrice }>> {
  const [foundationProduct, higherProduct] = await Promise.all([
    getActiveProductByCodeDb(PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION),
    getActiveProductByCodeDb(PRODUCT_CODES.GCSE_RUSSIAN_HIGHER),
  ]);

  const candidates: Array<{
    grant: DbUserAccessGrant;
    product: DbProduct;
    price: DbPrice;
  }> = [];

  for (const product of [foundationProduct, higherProduct]) {
    if (!product) continue;

    const grant = await getActiveUserProductGrantDb(userId, product.id);

    if (!grant?.price_id) {
      continue;
    }

    const price = await getActivePriceByIdDb(grant.price_id);

    if (!price) {
      continue;
    }

    candidates.push({ grant, product, price });
  }

  return candidates;
}

export async function resolveUpgradeQuoteDb(
  userId: string,
  targetProductCode: string,
  billingType: string,
  intervalUnit?: SupportedIntervalUnit | null,
  intervalCount?: number | null
): Promise<UpgradeQuoteResolution> {
  const targetProduct = await getActiveProductByCodeDb(targetProductCode);

  if (!targetProduct) {
    return {
      eligible: false,
      sourceGrant: null,
      sourceProduct: null,
      sourcePrice: null,
      targetProduct: null,
      targetPrice: null,
      upgradeFlow: null,
      upgradeFeeAmountGbp: null,
    };
  }

  const targetPrices = await getActivePricesForProductDb(targetProduct.id);
  const targetPrice = matchPriceByBillingShape(
    targetPrices,
    billingType,
    intervalUnit ?? null,
    intervalCount ?? null
  );

  if (!targetPrice) {
    return {
      eligible: false,
      sourceGrant: null,
      sourceProduct: null,
      sourcePrice: null,
      targetProduct,
      targetPrice: null,
      upgradeFlow: null,
      upgradeFeeAmountGbp: null,
    };
  }

  const sourceCandidates = await getActiveUpgradeableGrantsDb(userId);

  const validCandidates = sourceCandidates
    .map((candidate) => {
      const upgradeFlow = getUpgradeFlowForPath(
        candidate.product.code,
        candidate.price,
        targetProduct.code,
        targetPrice
      );

      if (!upgradeFlow) {
        return null;
      }

      return {
        ...candidate,
        upgradeFlow,
        upgradeFeeAmountGbp: getFixedUpgradeFeeAmountGbp(candidate.price, targetPrice),
      };
    })
    .filter(Boolean) as Array<{
    grant: DbUserAccessGrant;
    product: DbProduct;
    price: DbPrice;
    upgradeFlow: UpgradeFlow;
    upgradeFeeAmountGbp: number;
  }>;

  if (validCandidates.length === 0) {
    return {
      eligible: false,
      sourceGrant: null,
      sourceProduct: null,
      sourcePrice: null,
      targetProduct,
      targetPrice,
      upgradeFlow: null,
      upgradeFeeAmountGbp: null,
    };
  }

  validCandidates.sort((a, b) => {
    const aSameProduct = a.product.code === targetProduct.code ? 1 : 0;
    const bSameProduct = b.product.code === targetProduct.code ? 1 : 0;
    return bSameProduct - aSameProduct;
  });

  const selected = validCandidates[0];

  return {
    eligible: true,
    sourceGrant: selected.grant,
    sourceProduct: selected.product,
    sourcePrice: selected.price,
    targetProduct,
    targetPrice,
    upgradeFlow: selected.upgradeFlow,
    upgradeFeeAmountGbp: selected.upgradeFeeAmountGbp,
  };
}

export async function canUpgradeFoundationToHigherDb(userId: string): Promise<boolean> {
  const [higherMonthly, higherThreeMonth, higherLifetime] = await Promise.all([
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

  return higherMonthly.eligible || higherThreeMonth.eligible || higherLifetime.eligible;
}

export async function resolveCheckoutCatalogDb(
  input: ResolveCheckoutPriceInput
): Promise<CheckoutCatalogResolution | null> {
  const targetProduct = await getActiveProductByCodeDb(input.targetProductCode);

  if (!targetProduct) {
    console.error("Target product not found for checkout resolution:", input);
    return null;
  }

  const targetPrices = await getActivePricesForProductDb(targetProduct.id);
  const targetPrice = matchPriceByBillingShape(
    targetPrices,
    input.billingType,
    input.intervalUnit ?? null,
    input.intervalCount ?? null
  );

  if (!targetPrice) {
    console.error("Target price not found for checkout resolution:", input);
    return null;
  }

  if (input.isUpgrade) {
    const quote = await resolveUpgradeQuoteDb(
      input.userId,
      input.targetProductCode,
      input.billingType,
      input.intervalUnit ?? null,
      input.intervalCount ?? null
    );

    if (!quote.eligible || !quote.upgradeFlow || quote.upgradeFeeAmountGbp == null) {
      console.error("User is not eligible for upgrade checkout:", {
        userId: input.userId,
        input,
        quote,
      });
      return null;
    }

    return {
      product: targetProduct,
      price: targetPrice,
      purchaseType: "upgrade",
      upgradeFlow: quote.upgradeFlow,
      upgradeFeeAmountGbp: quote.upgradeFeeAmountGbp,
    };
  }

  return {
    product: targetProduct,
    price: targetPrice,
    purchaseType: "standard",
    upgradeFlow: null,
    upgradeFeeAmountGbp: null,
  };
}

export async function getUserGcseRussianPurchaseStateDb(userId: string): Promise<{
  canBuyFoundation: boolean;
  canBuyHigher: boolean;
  canUpgradeToHigher: boolean;
}> {
  const foundationProduct = await getActiveProductByCodeDb(
    PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION
  );
  const higherProduct = await getActiveProductByCodeDb(PRODUCT_CODES.GCSE_RUSSIAN_HIGHER);

  if (!foundationProduct || !higherProduct) {
    return {
      canBuyFoundation: false,
      canBuyHigher: false,
      canUpgradeToHigher: false,
    };
  }

  const [hasFoundation, hasHigher, canUpgradeToHigher] = await Promise.all([
    hasActiveUserProductGrantDb(userId, foundationProduct.id),
    hasActiveUserProductGrantDb(userId, higherProduct.id),
    canUpgradeFoundationToHigherDb(userId),
  ]);

  return {
    canBuyFoundation: !hasFoundation,
    canBuyHigher: !hasHigher,
    canUpgradeToHigher,
  };
}

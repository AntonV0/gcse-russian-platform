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
  upgradeCheckoutPrice: DbPrice | null;
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

type UpgradeCandidate = {
  grant: DbUserAccessGrant;
  product: DbProduct;
  price: DbPrice;
  upgradeFlow: UpgradeFlow;
  upgradeFeeAmountGbp: number;
  upgradeCheckoutPrice: DbPrice;
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

function isFoundationProductCode(productCode: string): boolean {
  return productCode === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION;
}

function isHigherProductCode(productCode: string): boolean {
  return productCode === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER;
}

function isMonthlySubscriptionPrice(price: DbPrice): boolean {
  return (
    price.billing_type === BILLING_TYPES.SUBSCRIPTION &&
    price.interval_unit === INTERVAL_UNITS.MONTH &&
    (price.interval_count ?? 1) === 1
  );
}

function isThreeMonthSubscriptionPrice(price: DbPrice): boolean {
  return (
    price.billing_type === BILLING_TYPES.SUBSCRIPTION &&
    price.interval_unit === INTERVAL_UNITS.MONTH &&
    (price.interval_count ?? 1) === 3
  );
}

function isLifetimePrice(price: DbPrice): boolean {
  return price.billing_type === BILLING_TYPES.ONE_TIME;
}

export function getUpgradeFlowForPath(
  sourceProductCode: string,
  sourcePrice: DbPrice,
  targetProductCode: string,
  targetPrice: DbPrice
): UpgradeFlow | null {
  const sourceIsFoundation = isFoundationProductCode(sourceProductCode);
  const sourceIsHigher = isHigherProductCode(sourceProductCode);
  const targetIsFoundation = isFoundationProductCode(targetProductCode);
  const targetIsHigher = isHigherProductCode(targetProductCode);

  if (!sourceIsFoundation && !sourceIsHigher) {
    return null;
  }

  if (!targetIsFoundation && !targetIsHigher) {
    return null;
  }

  if (
    sourceIsFoundation &&
    isLifetimePrice(sourcePrice) &&
    targetIsHigher &&
    isLifetimePrice(targetPrice)
  ) {
    return "lifetime";
  }

  if (
    sourceIsFoundation &&
    isMonthlySubscriptionPrice(sourcePrice) &&
    targetIsHigher &&
    isMonthlySubscriptionPrice(targetPrice)
  ) {
    return "same_cadence";
  }

  if (
    sourceIsFoundation &&
    isThreeMonthSubscriptionPrice(sourcePrice) &&
    targetIsHigher &&
    isThreeMonthSubscriptionPrice(targetPrice)
  ) {
    return "same_cadence";
  }

  if (
    isMonthlySubscriptionPrice(sourcePrice) &&
    isThreeMonthSubscriptionPrice(targetPrice) &&
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

function sortUpgradeCandidates(
  candidates: UpgradeCandidate[],
  targetProductCode: string
): UpgradeCandidate[] {
  return [...candidates].sort((a, b) => {
    const aSameProduct = a.product.code === targetProductCode ? 1 : 0;
    const bSameProduct = b.product.code === targetProductCode ? 1 : 0;

    if (aSameProduct !== bSameProduct) {
      return bSameProduct - aSameProduct;
    }

    if (a.upgradeFeeAmountGbp !== b.upgradeFeeAmountGbp) {
      return a.upgradeFeeAmountGbp - b.upgradeFeeAmountGbp;
    }

    return 0;
  });
}

function matchLifetimeUpgradeCheckoutPrice(
  upgradePrices: DbPrice[],
  sourcePrice: DbPrice
): DbPrice | null {
  if (isMonthlySubscriptionPrice(sourcePrice)) {
    return (
      upgradePrices.find(
        (price) =>
          price.billing_type === BILLING_TYPES.ONE_TIME && price.amount_gbp === 350
      ) ?? null
    );
  }

  if (isThreeMonthSubscriptionPrice(sourcePrice)) {
    return (
      upgradePrices.find(
        (price) =>
          price.billing_type === BILLING_TYPES.ONE_TIME && price.amount_gbp === 270
      ) ?? null
    );
  }

  if (isLifetimePrice(sourcePrice)) {
    return (
      upgradePrices.find(
        (price) =>
          price.billing_type === BILLING_TYPES.ONE_TIME && price.amount_gbp === 100
      ) ?? null
    );
  }

  return null;
}

function matchUpgradeCheckoutPrice(params: {
  upgradePrices: DbPrice[];
  sourcePrice: DbPrice;
  targetPrice: DbPrice;
  upgradeFlow: UpgradeFlow;
}): DbPrice | null {
  if (params.upgradeFlow === "lifetime") {
    return matchLifetimeUpgradeCheckoutPrice(params.upgradePrices, params.sourcePrice);
  }

  return matchPriceByBillingShape(
    params.upgradePrices,
    params.targetPrice.billing_type,
    params.targetPrice.interval_unit,
    params.targetPrice.interval_count
  );
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
      upgradeCheckoutPrice: null,
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
      upgradeCheckoutPrice: null,
      upgradeFlow: null,
      upgradeFeeAmountGbp: null,
    };
  }

  const upgradeProduct = await getActiveProductByCodeDb(
    getUpgradeProductCode(targetProductCode)
  );
  const upgradePrices = upgradeProduct
    ? await getActivePricesForProductDb(upgradeProduct.id)
    : [];

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

      const upgradeCheckoutPrice = matchUpgradeCheckoutPrice({
        upgradePrices,
        sourcePrice: candidate.price,
        targetPrice,
        upgradeFlow,
      });

      if (!upgradeCheckoutPrice) {
        return null;
      }

      return {
        ...candidate,
        upgradeFlow,
        upgradeFeeAmountGbp: upgradeCheckoutPrice.amount_gbp,
        upgradeCheckoutPrice,
      };
    })
    .filter(Boolean) as UpgradeCandidate[];

  if (validCandidates.length === 0) {
    return {
      eligible: false,
      sourceGrant: null,
      sourceProduct: null,
      sourcePrice: null,
      targetProduct,
      targetPrice,
      upgradeCheckoutPrice: null,
      upgradeFlow: null,
      upgradeFeeAmountGbp: null,
    };
  }

  const selected = sortUpgradeCandidates(validCandidates, targetProduct.code)[0];

  return {
    eligible: true,
    sourceGrant: selected.grant,
    sourceProduct: selected.product,
    sourcePrice: selected.price,
    targetProduct,
    targetPrice,
    upgradeCheckoutPrice: selected.upgradeCheckoutPrice,
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

    if (
      !quote.eligible ||
      !quote.upgradeFlow ||
      quote.upgradeFeeAmountGbp == null ||
      !quote.upgradeCheckoutPrice
    ) {
      console.error("User is not eligible for upgrade checkout:", {
        userId: input.userId,
        input,
        quote,
      });
      return null;
    }

    return {
      product: targetProduct,
      price: quote.upgradeCheckoutPrice,
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

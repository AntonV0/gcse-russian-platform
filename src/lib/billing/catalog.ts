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

export type CheckoutCatalogResolution = {
  product: DbProduct;
  price: DbPrice;
  purchaseType: PurchaseType;
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

export async function canUpgradeFoundationToHigherDb(userId: string): Promise<boolean> {
  const foundationProduct = await getActiveProductByCodeDb(
    PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION
  );
  const higherProduct = await getActiveProductByCodeDb(PRODUCT_CODES.GCSE_RUSSIAN_HIGHER);

  if (!foundationProduct || !higherProduct) {
    return false;
  }

  const [hasFoundation, hasHigher] = await Promise.all([
    hasActiveUserProductGrantDb(userId, foundationProduct.id),
    hasActiveUserProductGrantDb(userId, higherProduct.id),
  ]);

  return hasFoundation && !hasHigher;
}

export async function resolveUpgradeEligibilityDb(
  userId: string,
  targetProductCode: string
): Promise<{
  eligible: boolean;
  sourceGrant: DbUserAccessGrant | null;
}> {
  if (targetProductCode !== PRODUCT_CODES.GCSE_RUSSIAN_HIGHER) {
    return {
      eligible: false,
      sourceGrant: null,
    };
  }

  const foundationProduct = await getActiveProductByCodeDb(
    PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION
  );

  if (!foundationProduct) {
    return {
      eligible: false,
      sourceGrant: null,
    };
  }

  const sourceGrant = await getActiveUserProductGrantDb(userId, foundationProduct.id);

  if (!sourceGrant) {
    return {
      eligible: false,
      sourceGrant: null,
    };
  }

  const canUpgrade = await canUpgradeFoundationToHigherDb(userId);

  return {
    eligible: canUpgrade,
    sourceGrant: canUpgrade ? sourceGrant : null,
  };
}

function isAllowedHigherUpgradePath(
  sourcePrice: DbPrice,
  targetShape: {
    billingType: string;
    intervalUnit?: string | null;
    intervalCount?: number | null;
  }
): boolean {
  const sourceBillingType = sourcePrice.billing_type;
  const sourceIntervalUnit = sourcePrice.interval_unit;
  const sourceIntervalCount = sourcePrice.interval_count ?? 1;

  const targetBillingType = targetShape.billingType;
  const targetIntervalUnit = targetShape.intervalUnit ?? null;
  const targetIntervalCount = targetShape.intervalCount ?? 1;

  if (sourceBillingType === BILLING_TYPES.ONE_TIME) {
    return targetBillingType === BILLING_TYPES.ONE_TIME;
  }

  if (sourceBillingType === BILLING_TYPES.SUBSCRIPTION) {
    if (targetBillingType === BILLING_TYPES.ONE_TIME) {
      return (
        sourceIntervalUnit === INTERVAL_UNITS.MONTH &&
        (sourceIntervalCount === 1 || sourceIntervalCount === 3)
      );
    }

    if (targetBillingType === BILLING_TYPES.SUBSCRIPTION) {
      return (
        sourceIntervalUnit === targetIntervalUnit &&
        sourceIntervalCount === targetIntervalCount
      );
    }
  }

  return false;
}

/**
 * Upgrade prices are stored on the "<target>-upgrade" product.
 *
 * They are selected by the requested target shape:
 * - monthly upgrade -> subscription month x1
 * - 3 month upgrade -> subscription month x3
 * - lifetime upgrade -> one_time
 *
 * Eligibility is also checked against the user's active Foundation grant price_id,
 * so unsupported paths are rejected.
 */
export async function resolveCheckoutCatalogDb(
  input: ResolveCheckoutPriceInput
): Promise<CheckoutCatalogResolution | null> {
  const targetProduct = await getActiveProductByCodeDb(input.targetProductCode);

  if (!targetProduct) {
    console.error("Target product not found for checkout resolution:", input);
    return null;
  }

  if (input.isUpgrade) {
    const eligibility = await resolveUpgradeEligibilityDb(
      input.userId,
      input.targetProductCode
    );

    if (!eligibility.eligible || !eligibility.sourceGrant?.price_id) {
      console.error("User is not eligible for price-aware upgrade pricing:", {
        userId: input.userId,
        targetProductCode: input.targetProductCode,
        sourceGrant: eligibility.sourceGrant,
      });
      return null;
    }

    const sourcePrice = await getActivePriceByIdDb(eligibility.sourceGrant.price_id);

    if (!sourcePrice) {
      console.error("Source Foundation price could not be loaded for upgrade:", {
        userId: input.userId,
        priceId: eligibility.sourceGrant.price_id,
      });
      return null;
    }

    const requestedShape = {
      billingType: input.billingType,
      intervalUnit: input.intervalUnit ?? null,
      intervalCount: input.intervalCount ?? null,
    };

    if (!isAllowedHigherUpgradePath(sourcePrice, requestedShape)) {
      console.error(
        "Requested upgrade path is not allowed for source Foundation price:",
        {
          userId: input.userId,
          sourcePrice,
          requestedShape,
        }
      );
      return null;
    }

    const upgradeProductCode = getUpgradeProductCode(input.targetProductCode);
    const upgradeProduct = await getActiveProductByCodeDb(upgradeProductCode);

    if (!upgradeProduct) {
      console.error("Upgrade product not found:", {
        targetProductCode: input.targetProductCode,
        upgradeProductCode,
      });
      return null;
    }

    const upgradePrices = await getActivePricesForProductDb(upgradeProduct.id);
    const upgradePrice = matchPriceByBillingShape(
      upgradePrices,
      input.billingType,
      input.intervalUnit ?? null,
      input.intervalCount ?? null
    );

    if (!upgradePrice) {
      console.error("Upgrade price not found:", {
        targetProductCode: input.targetProductCode,
        upgradeProductCode,
        billingType: input.billingType,
        intervalUnit: input.intervalUnit ?? null,
        intervalCount: input.intervalCount ?? null,
      });
      return null;
    }

    return {
      product: targetProduct,
      price: upgradePrice,
      purchaseType: "upgrade",
    };
  }

  const standardPrices = await getActivePricesForProductDb(targetProduct.id);
  const standardPrice = matchPriceByBillingShape(
    standardPrices,
    input.billingType,
    input.intervalUnit ?? null,
    input.intervalCount ?? null
  );

  if (!standardPrice) {
    console.error("Standard price not found:", {
      targetProductCode: input.targetProductCode,
      billingType: input.billingType,
      intervalUnit: input.intervalUnit ?? null,
      intervalCount: input.intervalCount ?? null,
    });
    return null;
  }

  return {
    product: targetProduct,
    price: standardPrice,
    purchaseType: "standard",
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

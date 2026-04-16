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
  isUpgrade?: boolean;
};

/**
 * Product-code convention for upgrade prices.
 *
 * Example:
 * - gcse-russian-higher
 * - gcse-russian-higher-upgrade
 */
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
    .single();

  if (error) {
    console.error("Error fetching active product by code:", {
      productCode,
      error,
    });
    return null;
  }

  return data as DbProduct;
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
  intervalUnit?: string | null
): DbPrice | null {
  const matched = prices.find((price) => {
    if (price.billing_type !== billingType) return false;

    if (billingType === BILLING_TYPES.SUBSCRIPTION) {
      return price.interval_unit === (intervalUnit ?? null);
    }

    return true;
  });

  return matched ?? null;
}

/**
 * Version 1 upgrade rule:
 * - Foundation and Higher are separate products.
 * - A user can buy Higher upgrade pricing only if they have active Foundation
 *   access and do not already have active Higher access.
 */
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

/**
 * Returns the target product a user is entitled to buy at upgrade pricing,
 * if eligible.
 *
 * Current version only supports:
 * foundation -> higher
 */
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

/**
 * Resolves the exact product + price the checkout flow should use.
 *
 * Standard purchase:
 * - product code stays as requested
 *
 * Upgrade purchase:
 * - price is looked up from "<target-product-code>-upgrade"
 * - grant still gets created for the REAL target product
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

    if (!eligibility.eligible) {
      console.error("User is not eligible for upgrade pricing:", {
        userId: input.userId,
        targetProductCode: input.targetProductCode,
      });
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
      input.intervalUnit
    );

    if (!upgradePrice) {
      console.error("Upgrade price not found:", {
        targetProductCode: input.targetProductCode,
        upgradeProductCode,
        billingType: input.billingType,
        intervalUnit: input.intervalUnit ?? null,
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
    input.intervalUnit
  );

  if (!standardPrice) {
    console.error("Standard price not found:", {
      targetProductCode: input.targetProductCode,
      billingType: input.billingType,
      intervalUnit: input.intervalUnit ?? null,
    });
    return null;
  }

  return {
    product: targetProduct,
    price: standardPrice,
    purchaseType: "standard",
  };
}

/**
 * Helpful for account pages / pricing UI:
 * gives the user all buyable product states we care about for v1.
 */
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

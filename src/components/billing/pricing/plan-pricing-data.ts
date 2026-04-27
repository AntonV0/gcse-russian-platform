import {
  BILLING_TYPES,
  INTERVAL_UNITS,
  getActivePricesForProductDb,
  getActiveProductByCodeDb,
  matchPriceByBillingShape,
} from "@/lib/billing/catalog";
import type { PlanPricing } from "@/components/billing/pricing/types";

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

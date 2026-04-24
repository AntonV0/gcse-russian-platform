import {
  BILLING_TYPES,
  INTERVAL_UNITS,
  PRODUCT_CODES,
  type DbPrice,
} from "./types";

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

export function isFoundationProductCode(productCode: string): boolean {
  return productCode === PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION;
}

export function isHigherProductCode(productCode: string): boolean {
  return productCode === PRODUCT_CODES.GCSE_RUSSIAN_HIGHER;
}

export function isMonthlySubscriptionPrice(price: DbPrice): boolean {
  return (
    price.billing_type === BILLING_TYPES.SUBSCRIPTION &&
    price.interval_unit === INTERVAL_UNITS.MONTH &&
    (price.interval_count ?? 1) === 1
  );
}

export function isThreeMonthSubscriptionPrice(price: DbPrice): boolean {
  return (
    price.billing_type === BILLING_TYPES.SUBSCRIPTION &&
    price.interval_unit === INTERVAL_UNITS.MONTH &&
    (price.interval_count ?? 1) === 3
  );
}

export function isLifetimePrice(price: DbPrice): boolean {
  return price.billing_type === BILLING_TYPES.ONE_TIME;
}

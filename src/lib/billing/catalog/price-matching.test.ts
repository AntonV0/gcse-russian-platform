import { describe, expect, it } from "vitest";
import {
  isLifetimePrice,
  isMonthlySubscriptionPrice,
  isThreeMonthSubscriptionPrice,
  matchPriceByBillingShape,
} from "@/lib/billing/catalog/price-matching";
import { BILLING_TYPES, INTERVAL_UNITS, type DbPrice } from "@/lib/billing/catalog/types";

function price(overrides: Partial<DbPrice>): DbPrice {
  return {
    id: overrides.id ?? "price",
    product_id: overrides.product_id ?? "product",
    billing_type: overrides.billing_type ?? BILLING_TYPES.SUBSCRIPTION,
    interval_unit: overrides.interval_unit ?? INTERVAL_UNITS.MONTH,
    interval_count: overrides.interval_count ?? 1,
    amount_gbp: overrides.amount_gbp ?? 19,
    stripe_price_id: overrides.stripe_price_id ?? null,
    is_active: overrides.is_active ?? true,
    created_at: overrides.created_at ?? "2026-01-01T00:00:00.000Z",
  };
}

describe("price matching helpers", () => {
  it("matches subscription prices by billing type, interval unit, and interval count", () => {
    const monthly = price({ id: "monthly", interval_count: 1 });
    const threeMonth = price({ id: "three-month", interval_count: 3 });

    expect(
      matchPriceByBillingShape(
        [monthly, threeMonth],
        BILLING_TYPES.SUBSCRIPTION,
        INTERVAL_UNITS.MONTH,
        3
      )
    ).toBe(threeMonth);
  });

  it("treats missing subscription interval count as one", () => {
    const implicitMonthly = price({ id: "implicit-monthly", interval_count: null });

    expect(
      matchPriceByBillingShape(
        [implicitMonthly],
        BILLING_TYPES.SUBSCRIPTION,
        INTERVAL_UNITS.MONTH,
        null
      )
    ).toBe(implicitMonthly);
  });

  it("matches one-time prices by billing type only", () => {
    const lifetime = price({
      id: "lifetime",
      billing_type: BILLING_TYPES.ONE_TIME,
      interval_unit: null,
      interval_count: null,
      amount_gbp: 399,
    });

    expect(matchPriceByBillingShape([lifetime], BILLING_TYPES.ONE_TIME)).toBe(
      lifetime
    );
  });

  it("classifies core billing shapes", () => {
    expect(isMonthlySubscriptionPrice(price({ interval_count: null }))).toBe(true);
    expect(isThreeMonthSubscriptionPrice(price({ interval_count: 3 }))).toBe(true);
    expect(
      isLifetimePrice(
        price({
          billing_type: BILLING_TYPES.ONE_TIME,
          interval_unit: null,
          interval_count: null,
        })
      )
    ).toBe(true);
  });
});

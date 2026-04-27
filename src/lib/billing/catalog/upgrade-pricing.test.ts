import { describe, expect, it } from "vitest";
import {
  getUpgradeFlowForPath,
  getUpgradeProductCode,
  matchUpgradeCheckoutPrice,
  sortUpgradeCandidates,
} from "@/lib/billing/catalog/upgrade-pricing";
import {
  BILLING_TYPES,
  INTERVAL_UNITS,
  PRODUCT_CODES,
  type DbPrice,
  type DbProduct,
  type UpgradeCandidate,
} from "@/lib/billing/catalog/types";

function price(overrides: Partial<DbPrice>): DbPrice {
  return {
    id: overrides.id ?? "price",
    product_id: overrides.product_id ?? "product",
    billing_type: overrides.billing_type ?? BILLING_TYPES.SUBSCRIPTION,
    interval_unit: overrides.interval_unit ?? INTERVAL_UNITS.MONTH,
    interval_count: overrides.interval_count ?? 1,
    amount_gbp: overrides.amount_gbp ?? 19,
    stripe_price_id: null,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  };
}

function product(code: string): DbProduct {
  return {
    id: code,
    code,
    name: code,
    product_type: "course",
    course_id: null,
    course_variant_id: null,
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  };
}

function candidate(overrides: {
  productCode: string;
  fee: number;
}): UpgradeCandidate {
  return {
    grant: {
      id: overrides.productCode,
      user_id: "user",
      product_id: overrides.productCode,
      price_id: null,
      access_mode: "full",
      source: "stripe",
      starts_at: null,
      ends_at: null,
      is_active: true,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    product: product(overrides.productCode),
    price: price({}),
    upgradeFlow: "same_cadence",
    upgradeFeeAmountGbp: overrides.fee,
    upgradeCheckoutPrice: price({ amount_gbp: overrides.fee }),
  };
}

describe("upgrade pricing helpers", () => {
  it("builds upgrade product codes from target product codes", () => {
    expect(getUpgradeProductCode(PRODUCT_CODES.GCSE_RUSSIAN_HIGHER)).toBe(
      "gcse-russian-higher-upgrade"
    );
  });

  it("detects same-cadence foundation to higher subscription upgrades", () => {
    expect(
      getUpgradeFlowForPath(
        PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
        price({ interval_count: 1 }),
        PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
        price({ interval_count: 1 })
      )
    ).toBe("same_cadence");
  });

  it("detects monthly to three-month upgrades", () => {
    expect(
      getUpgradeFlowForPath(
        PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
        price({ interval_count: 1 }),
        PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
        price({ interval_count: 3 })
      )
    ).toBe("monthly_to_three_month");
  });

  it("matches fixed lifetime upgrade checkout prices", () => {
    const checkoutPrice = price({
      id: "foundation-monthly-to-higher-lifetime",
      billing_type: BILLING_TYPES.ONE_TIME,
      interval_unit: null,
      interval_count: null,
      amount_gbp: 349,
    });

    expect(
      matchUpgradeCheckoutPrice({
        upgradePrices: [checkoutPrice],
        sourceProductCode: PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
        targetProductCode: PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
        sourcePrice: price({ interval_count: 1 }),
        targetPrice: price({
          billing_type: BILLING_TYPES.ONE_TIME,
          interval_unit: null,
          interval_count: null,
          amount_gbp: 399,
        }),
        upgradeFlow: "lifetime",
      })
    ).toBe(checkoutPrice);
  });

  it("prefers same-product candidates, then cheaper fees", () => {
    const sorted = sortUpgradeCandidates(
      [
        candidate({ productCode: PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION, fee: 9 }),
        candidate({ productCode: PRODUCT_CODES.GCSE_RUSSIAN_HIGHER, fee: 19 }),
        candidate({ productCode: PRODUCT_CODES.GCSE_RUSSIAN_HIGHER, fee: 5 }),
      ],
      PRODUCT_CODES.GCSE_RUSSIAN_HIGHER
    );

    expect(sorted.map((entry) => entry.upgradeFeeAmountGbp)).toEqual([5, 19, 9]);
  });
});

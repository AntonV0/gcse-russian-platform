import { describe, expect, it } from "vitest";
import {
  BILLING_TYPES,
  PRODUCT_CODES,
  type CheckoutCatalogResolution,
  type DbPrice,
  type DbProduct,
} from "@/lib/billing/catalog/types";
import {
  validateCheckoutRequestBody,
  validateCheckoutResolvedStripePrice,
} from "@/lib/billing/checkout-validation";

const product: DbProduct = {
  id: "product_foundation",
  code: PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
  name: "GCSE Russian Foundation",
  product_type: "course",
  course_id: null,
  course_variant_id: null,
  is_active: true,
  created_at: "2026-04-27T12:00:00.000Z",
};

const price: DbPrice = {
  id: "price_monthly",
  product_id: product.id,
  billing_type: BILLING_TYPES.SUBSCRIPTION,
  interval_unit: "month",
  interval_count: 1,
  amount_gbp: 25,
  stripe_price_id: "price_stripe_monthly",
  is_active: true,
  created_at: "2026-04-27T12:00:00.000Z",
};

function buildResolution(
  overrides: Partial<CheckoutCatalogResolution> = {}
): CheckoutCatalogResolution {
  return {
    product,
    price,
    purchaseType: "standard",
    upgradeFlow: null,
    upgradeFeeAmountGbp: null,
    ...overrides,
  };
}

describe("validateCheckoutRequestBody", () => {
  it("accepts supported checkout body inputs and normalizes defaults", () => {
    expect(
      validateCheckoutRequestBody({
        productCode: PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
        billingType: BILLING_TYPES.SUBSCRIPTION,
      })
    ).toEqual({
      ok: true,
      productCode: PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
      billingType: BILLING_TYPES.SUBSCRIPTION,
      intervalUnit: null,
      intervalCount: null,
      isUpgrade: false,
      successPath: "/account",
      cancelPath: "/account",
    });
  });

  it("rejects invalid product, billing type, interval unit, and interval count", () => {
    expect(
      validateCheckoutRequestBody({
        productCode: "",
        billingType: BILLING_TYPES.SUBSCRIPTION,
      })
    ).toEqual({ ok: false, error: "Invalid or missing productCode" });

    expect(
      validateCheckoutRequestBody({
        productCode: PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
        billingType: "installments",
      })
    ).toEqual({ ok: false, error: "Invalid or missing billingType" });

    expect(
      validateCheckoutRequestBody({
        productCode: PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
        billingType: BILLING_TYPES.SUBSCRIPTION,
        intervalUnit: "week" as never,
      })
    ).toEqual({ ok: false, error: "Invalid intervalUnit" });

    expect(
      validateCheckoutRequestBody({
        productCode: PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
        billingType: BILLING_TYPES.SUBSCRIPTION,
        intervalCount: 0,
      })
    ).toEqual({ ok: false, error: "Invalid intervalCount" });
  });

  it("rejects malformed checkout JSON before reading typed fields", () => {
    expect(validateCheckoutRequestBody(null)).toEqual({
      ok: false,
      error: "Invalid or missing productCode",
    });
    expect(validateCheckoutRequestBody([])).toEqual({
      ok: false,
      error: "Invalid or missing productCode",
    });
  });

  it("rejects non-boolean upgrade flags", () => {
    expect(
      validateCheckoutRequestBody({
        productCode: PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
        billingType: BILLING_TYPES.ONE_TIME,
        isUpgrade: "true" as never,
      })
    ).toEqual({ ok: false, error: "Invalid isUpgrade" });
  });

  it("rejects unsafe redirect paths before checkout session creation", () => {
    expect(
      validateCheckoutRequestBody({
        productCode: PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
        billingType: BILLING_TYPES.ONE_TIME,
        successPath: "https://evil.example/after-checkout",
      })
    ).toEqual({ ok: false, error: "Invalid successPath" });

    expect(
      validateCheckoutRequestBody({
        productCode: PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
        billingType: BILLING_TYPES.ONE_TIME,
        cancelPath: "//evil.example/pricing",
      })
    ).toEqual({ ok: false, error: "Invalid cancelPath" });
  });
});

describe("validateCheckoutResolvedStripePrice", () => {
  it("rejects standard checkout prices without Stripe price ids", () => {
    expect(
      validateCheckoutResolvedStripePrice(
        buildResolution({
          price: { ...price, stripe_price_id: null },
        })
      )
    ).toEqual({
      ok: false,
      error: "Resolved standard price is missing Stripe price id",
    });
  });

  it("rejects recurring upgrade targets without Stripe price ids", () => {
    expect(
      validateCheckoutResolvedStripePrice(
        buildResolution({
          purchaseType: "upgrade",
          price: {
            ...price,
            billing_type: BILLING_TYPES.SUBSCRIPTION,
            stripe_price_id: null,
          },
        })
      )
    ).toEqual({
      ok: false,
      error: "Target recurring price is missing Stripe price id",
    });
  });

  it("allows one-time upgrade checkout prices to use a custom amount", () => {
    expect(
      validateCheckoutResolvedStripePrice(
        buildResolution({
          purchaseType: "upgrade",
          price: {
            ...price,
            billing_type: BILLING_TYPES.ONE_TIME,
            interval_unit: null,
            interval_count: null,
            stripe_price_id: null,
          },
          upgradeFeeAmountGbp: 15,
        })
      )
    ).toEqual({ ok: true });
  });
});

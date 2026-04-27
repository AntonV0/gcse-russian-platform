import {
  BILLING_TYPES,
  INTERVAL_UNITS,
  PRODUCT_CODES,
  type CheckoutCatalogResolution,
  type SupportedIntervalUnit,
} from "@/lib/billing/catalog/types";
import {
  DEFAULT_CHECKOUT_CANCEL_PATH,
  DEFAULT_CHECKOUT_SUCCESS_PATH,
  resolveOptionalInternalRedirectPath,
} from "@/lib/billing/redirect-paths";

export type CheckoutRequestBody = {
  productCode: string;
  billingType: string;
  intervalUnit?: SupportedIntervalUnit | null;
  intervalCount?: number | null;
  isUpgrade?: boolean;
  successPath?: string;
  cancelPath?: string;
};

export type CheckoutRequestValidationResult =
  | {
      ok: true;
      productCode: string;
      billingType: string;
      intervalUnit: SupportedIntervalUnit | null;
      intervalCount: number | null;
      isUpgrade: boolean;
      successPath: string;
      cancelPath: string;
    }
  | { ok: false; error: string };

export type CheckoutResolvedPriceValidationResult =
  | { ok: true }
  | { ok: false; error: string };

function isSupportedProductCode(value: string): boolean {
  return Object.values(PRODUCT_CODES).includes(
    value as (typeof PRODUCT_CODES)[keyof typeof PRODUCT_CODES]
  );
}

function isSupportedBillingType(value: string): boolean {
  return Object.values(BILLING_TYPES).includes(
    value as (typeof BILLING_TYPES)[keyof typeof BILLING_TYPES]
  );
}

function isSupportedIntervalUnit(value: string | null | undefined): boolean {
  if (!value) return true;

  return Object.values(INTERVAL_UNITS).includes(
    value as (typeof INTERVAL_UNITS)[keyof typeof INTERVAL_UNITS]
  );
}

function isSupportedIntervalCount(value: number | null | undefined): boolean {
  if (value == null) return true;
  return Number.isInteger(value) && value > 0;
}

export function validateCheckoutRequestBody(
  body: CheckoutRequestBody
): CheckoutRequestValidationResult {
  if (!body.productCode || !isSupportedProductCode(body.productCode)) {
    return { ok: false, error: "Invalid or missing productCode" };
  }

  if (!body.billingType || !isSupportedBillingType(body.billingType)) {
    return { ok: false, error: "Invalid or missing billingType" };
  }

  if (!isSupportedIntervalUnit(body.intervalUnit)) {
    return { ok: false, error: "Invalid intervalUnit" };
  }

  if (!isSupportedIntervalCount(body.intervalCount)) {
    return { ok: false, error: "Invalid intervalCount" };
  }

  const successPath = resolveOptionalInternalRedirectPath(
    body.successPath,
    DEFAULT_CHECKOUT_SUCCESS_PATH
  );
  const cancelPath = resolveOptionalInternalRedirectPath(
    body.cancelPath,
    DEFAULT_CHECKOUT_CANCEL_PATH
  );

  if (!successPath) {
    return { ok: false, error: "Invalid successPath" };
  }

  if (!cancelPath) {
    return { ok: false, error: "Invalid cancelPath" };
  }

  return {
    ok: true,
    productCode: body.productCode,
    billingType: body.billingType,
    intervalUnit: body.intervalUnit ?? null,
    intervalCount: body.intervalCount ?? null,
    isUpgrade: body.isUpgrade ?? false,
    successPath,
    cancelPath,
  };
}

export function validateCheckoutResolvedStripePrice(
  resolved: CheckoutCatalogResolution
): CheckoutResolvedPriceValidationResult {
  if (resolved.purchaseType === "standard" && !resolved.price.stripe_price_id) {
    return {
      ok: false,
      error: "Resolved standard price is missing Stripe price id",
    };
  }

  if (
    resolved.purchaseType === "upgrade" &&
    resolved.price.billing_type === BILLING_TYPES.SUBSCRIPTION &&
    !resolved.price.stripe_price_id
  ) {
    return {
      ok: false,
      error: "Target recurring price is missing Stripe price id",
    };
  }

  return { ok: true };
}

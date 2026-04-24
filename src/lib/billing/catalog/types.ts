import type { DbUserAccessGrant } from "@/lib/billing/grants";

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

export type UpgradeCandidate = {
  grant: DbUserAccessGrant;
  product: DbProduct;
  price: DbPrice;
  upgradeFlow: UpgradeFlow;
  upgradeFeeAmountGbp: number;
  upgradeCheckoutPrice: DbPrice;
};

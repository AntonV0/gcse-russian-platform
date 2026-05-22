import type { DbPrice, UpgradeQuoteResolution } from "@/lib/billing/catalog";
import type { SupportedCourseProductCode } from "@/lib/billing/catalog/product-context";

export type PlanPricing = {
  monthly: DbPrice | null;
  threeMonth: DbPrice | null;
  lifetime: DbPrice | null;
};

export type ActiveGrantProductCode = SupportedCourseProductCode;

export type ActivePlanState = {
  ownedProductCodes: Set<ActiveGrantProductCode>;
  foundationMonthly: boolean;
  foundationThreeMonth: boolean;
  foundationLifetime: boolean;
  higherMonthly: boolean;
  higherThreeMonth: boolean;
  higherLifetime: boolean;
};

export type RenewalInfo = {
  currentPeriodEnd: string | null;
  amountLabel: string | null;
};

export type ActiveSubscriptionState = {
  foundation: RenewalInfo | null;
  higher: RenewalInfo | null;
};

export type FoundationPlanPanelProps = {
  user: { id: string } | null;
  pricing: PlanPricing;
  planState: ActivePlanState;
  activeSubscriptions: ActiveSubscriptionState;
  foundationMonthlyToThreeMonthQuote: UpgradeQuoteResolution | null;
  foundationMonthlyToFoundationLifetimeQuote: UpgradeQuoteResolution | null;
  foundationThreeMonthToFoundationLifetimeQuote: UpgradeQuoteResolution | null;
};

export type HigherPlanPanelProps = {
  user: { id: string } | null;
  pricing: PlanPricing;
  foundationPricing: PlanPricing;
  planState: ActivePlanState;
  activeSubscriptions: ActiveSubscriptionState;
  foundationMonthlyToHigherMonthlyQuote: UpgradeQuoteResolution | null;
  foundationMonthlyToHigherThreeMonthQuote: UpgradeQuoteResolution | null;
  foundationThreeMonthToHigherThreeMonthQuote: UpgradeQuoteResolution | null;
  foundationLifetimeToHigherLifetimeQuote: UpgradeQuoteResolution | null;
  higherMonthlyToThreeMonthQuote: UpgradeQuoteResolution | null;
  higherMonthlyToHigherLifetimeQuote: UpgradeQuoteResolution | null;
  higherThreeMonthToHigherLifetimeQuote: UpgradeQuoteResolution | null;
};

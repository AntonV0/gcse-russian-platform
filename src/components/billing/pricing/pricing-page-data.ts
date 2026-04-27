import {
  BILLING_TYPES,
  INTERVAL_UNITS,
  PRODUCT_CODES,
  resolveUpgradeQuoteDb,
} from "@/lib/billing/catalog";
import {
  getActivePlanStateForUser,
  getEmptyPlanState,
} from "@/components/billing/pricing/active-plan-state-data";
import {
  getActiveSubscriptionStateForUser,
  getEmptySubscriptionState,
} from "@/components/billing/pricing/active-subscription-state-data";
import { getPlanPricing } from "@/components/billing/pricing/plan-pricing-data";

export async function getPricingPageData(userId: string | null) {
  return Promise.all([
    getPlanPricing(PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION),
    getPlanPricing(PRODUCT_CODES.GCSE_RUSSIAN_HIGHER),
    userId ? getActivePlanStateForUser(userId) : getEmptyPlanState(),
    userId ? getActiveSubscriptionStateForUser(userId) : getEmptySubscriptionState(),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
          BILLING_TYPES.SUBSCRIPTION,
          INTERVAL_UNITS.MONTH,
          3
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
          BILLING_TYPES.ONE_TIME,
          null,
          null
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
          BILLING_TYPES.ONE_TIME,
          null,
          null
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.SUBSCRIPTION,
          INTERVAL_UNITS.MONTH,
          1
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.SUBSCRIPTION,
          INTERVAL_UNITS.MONTH,
          3
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.SUBSCRIPTION,
          INTERVAL_UNITS.MONTH,
          3
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.ONE_TIME,
          null,
          null
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.SUBSCRIPTION,
          INTERVAL_UNITS.MONTH,
          3
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.ONE_TIME,
          null,
          null
        )
      : Promise.resolve(null),
    userId
      ? resolveUpgradeQuoteDb(
          userId,
          PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
          BILLING_TYPES.ONE_TIME,
          null,
          null
        )
      : Promise.resolve(null),
  ]).then(
    ([
      foundationPricing,
      higherPricing,
      planState,
      activeSubscriptions,
      foundationMonthlyToThreeMonthQuote,
      foundationMonthlyToFoundationLifetimeQuote,
      foundationThreeMonthToFoundationLifetimeQuote,
      foundationMonthlyToHigherMonthlyQuote,
      foundationMonthlyToHigherThreeMonthQuote,
      foundationThreeMonthToHigherThreeMonthQuote,
      foundationLifetimeToHigherLifetimeQuote,
      higherMonthlyToThreeMonthQuote,
      higherMonthlyToHigherLifetimeQuote,
      higherThreeMonthToHigherLifetimeQuote,
    ]) => ({
      foundationPricing,
      higherPricing,
      planState,
      activeSubscriptions,
      foundationMonthlyToThreeMonthQuote,
      foundationMonthlyToFoundationLifetimeQuote,
      foundationThreeMonthToFoundationLifetimeQuote,
      foundationMonthlyToHigherMonthlyQuote,
      foundationMonthlyToHigherThreeMonthQuote,
      foundationThreeMonthToHigherThreeMonthQuote,
      foundationLifetimeToHigherLifetimeQuote,
      higherMonthlyToThreeMonthQuote,
      higherMonthlyToHigherLifetimeQuote,
      higherThreeMonthToHigherLifetimeQuote,
    })
  );
}

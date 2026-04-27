import type { HigherPlanPanelProps } from "@/components/billing/pricing/types";

export function getHigherPlanUpgradeVisibility({
  foundationMonthlyToHigherMonthlyQuote,
  foundationMonthlyToHigherThreeMonthQuote,
  foundationThreeMonthToHigherThreeMonthQuote,
  foundationLifetimeToHigherLifetimeQuote,
  higherMonthlyToThreeMonthQuote,
  higherMonthlyToHigherLifetimeQuote,
  higherThreeMonthToHigherLifetimeQuote,
}: HigherPlanPanelProps) {
  const canShowHigherMonthlyToThreeMonthUpgrade =
    higherMonthlyToThreeMonthQuote?.eligible &&
    higherMonthlyToThreeMonthQuote.sourceProduct?.code === "gcse-russian-higher" &&
    higherMonthlyToThreeMonthQuote.sourcePrice?.billing_type === "subscription" &&
    (higherMonthlyToThreeMonthQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowHigherMonthlyToHigherLifetimeUpgrade =
    higherMonthlyToHigherLifetimeQuote?.eligible &&
    higherMonthlyToHigherLifetimeQuote.sourceProduct?.code === "gcse-russian-higher" &&
    higherMonthlyToHigherLifetimeQuote.upgradeFlow === "lifetime" &&
    higherMonthlyToHigherLifetimeQuote.sourcePrice?.billing_type === "subscription" &&
    (higherMonthlyToHigherLifetimeQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowHigherThreeMonthToHigherLifetimeUpgrade =
    higherThreeMonthToHigherLifetimeQuote?.eligible &&
    higherThreeMonthToHigherLifetimeQuote.sourceProduct?.code ===
      "gcse-russian-higher" &&
    higherThreeMonthToHigherLifetimeQuote.upgradeFlow === "lifetime" &&
    higherThreeMonthToHigherLifetimeQuote.sourcePrice?.billing_type ===
      "subscription" &&
    (higherThreeMonthToHigherLifetimeQuote.sourcePrice?.interval_count ?? 1) === 3;

  const canShowFoundationMonthlyToHigherMonthlyUpgrade =
    foundationMonthlyToHigherMonthlyQuote?.eligible &&
    foundationMonthlyToHigherMonthlyQuote.sourceProduct?.code ===
      "gcse-russian-foundation" &&
    foundationMonthlyToHigherMonthlyQuote.upgradeFlow === "same_cadence" &&
    (foundationMonthlyToHigherMonthlyQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowFoundationMonthlyToHigherThreeMonthUpgrade =
    foundationMonthlyToHigherThreeMonthQuote?.eligible &&
    foundationMonthlyToHigherThreeMonthQuote.sourceProduct?.code ===
      "gcse-russian-foundation" &&
    foundationMonthlyToHigherThreeMonthQuote.upgradeFlow ===
      "monthly_to_three_month" &&
    (foundationMonthlyToHigherThreeMonthQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowFoundationThreeMonthToHigherThreeMonthUpgrade =
    foundationThreeMonthToHigherThreeMonthQuote?.eligible &&
    foundationThreeMonthToHigherThreeMonthQuote.sourceProduct?.code ===
      "gcse-russian-foundation" &&
    foundationThreeMonthToHigherThreeMonthQuote.upgradeFlow === "same_cadence" &&
    (foundationThreeMonthToHigherThreeMonthQuote.sourcePrice?.interval_count ?? 1) ===
      3;

  const canShowFoundationLifetimeToHigherLifetimeUpgrade =
    foundationLifetimeToHigherLifetimeQuote?.eligible &&
    foundationLifetimeToHigherLifetimeQuote.sourceProduct?.code ===
      "gcse-russian-foundation" &&
    foundationLifetimeToHigherLifetimeQuote.upgradeFlow === "lifetime";

  return {
    canShowHigherMonthlyToThreeMonthUpgrade,
    canShowHigherMonthlyToHigherLifetimeUpgrade,
    canShowHigherThreeMonthToHigherLifetimeUpgrade,
    canShowFoundationMonthlyToHigherMonthlyUpgrade,
    canShowFoundationMonthlyToHigherThreeMonthUpgrade,
    canShowFoundationThreeMonthToHigherThreeMonthUpgrade,
    canShowFoundationLifetimeToHigherLifetimeUpgrade,
  };
}

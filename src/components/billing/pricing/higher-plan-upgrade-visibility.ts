import type { HigherPlanPanelProps } from "@/components/billing/pricing/types";
import { isFoundationProductCode, isHigherProductCode } from "@/lib/billing/catalog";

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
    isHigherProductCode(higherMonthlyToThreeMonthQuote.sourceProduct?.code ?? "") &&
    higherMonthlyToThreeMonthQuote.sourcePrice?.billing_type === "subscription" &&
    (higherMonthlyToThreeMonthQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowHigherMonthlyToHigherLifetimeUpgrade =
    higherMonthlyToHigherLifetimeQuote?.eligible &&
    isHigherProductCode(higherMonthlyToHigherLifetimeQuote.sourceProduct?.code ?? "") &&
    higherMonthlyToHigherLifetimeQuote.upgradeFlow === "lifetime" &&
    higherMonthlyToHigherLifetimeQuote.sourcePrice?.billing_type === "subscription" &&
    (higherMonthlyToHigherLifetimeQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowHigherThreeMonthToHigherLifetimeUpgrade =
    higherThreeMonthToHigherLifetimeQuote?.eligible &&
    isHigherProductCode(
      higherThreeMonthToHigherLifetimeQuote.sourceProduct?.code ?? ""
    ) &&
    higherThreeMonthToHigherLifetimeQuote.upgradeFlow === "lifetime" &&
    higherThreeMonthToHigherLifetimeQuote.sourcePrice?.billing_type === "subscription" &&
    (higherThreeMonthToHigherLifetimeQuote.sourcePrice?.interval_count ?? 1) === 3;

  const canShowFoundationMonthlyToHigherMonthlyUpgrade =
    foundationMonthlyToHigherMonthlyQuote?.eligible &&
    isFoundationProductCode(
      foundationMonthlyToHigherMonthlyQuote.sourceProduct?.code ?? ""
    ) &&
    foundationMonthlyToHigherMonthlyQuote.upgradeFlow === "same_cadence" &&
    (foundationMonthlyToHigherMonthlyQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowFoundationMonthlyToHigherThreeMonthUpgrade =
    foundationMonthlyToHigherThreeMonthQuote?.eligible &&
    isFoundationProductCode(
      foundationMonthlyToHigherThreeMonthQuote.sourceProduct?.code ?? ""
    ) &&
    foundationMonthlyToHigherThreeMonthQuote.upgradeFlow === "monthly_to_three_month" &&
    (foundationMonthlyToHigherThreeMonthQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowFoundationThreeMonthToHigherThreeMonthUpgrade =
    foundationThreeMonthToHigherThreeMonthQuote?.eligible &&
    isFoundationProductCode(
      foundationThreeMonthToHigherThreeMonthQuote.sourceProduct?.code ?? ""
    ) &&
    foundationThreeMonthToHigherThreeMonthQuote.upgradeFlow === "same_cadence" &&
    (foundationThreeMonthToHigherThreeMonthQuote.sourcePrice?.interval_count ?? 1) === 3;

  const canShowFoundationLifetimeToHigherLifetimeUpgrade =
    foundationLifetimeToHigherLifetimeQuote?.eligible &&
    isFoundationProductCode(
      foundationLifetimeToHigherLifetimeQuote.sourceProduct?.code ?? ""
    ) &&
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

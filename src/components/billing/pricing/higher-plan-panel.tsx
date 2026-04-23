import CheckoutButton from "@/components/billing/checkout-button";
import {
  LockedOption,
  OwnedButton,
  RenewalMessage,
  UpgradeOffer,
} from "@/components/billing/pricing/plan-state-elements";
import type { HigherPlanPanelProps } from "@/components/billing/pricing/types";
import { formatPriceLabel, getUpgradeFeeLabel } from "@/lib/billing/pricing-ui";

export default function HigherPlanPanel({
  user,
  pricing,
  planState,
  activeSubscriptions,
  foundationMonthlyToHigherMonthlyQuote,
  foundationMonthlyToHigherThreeMonthQuote,
  foundationThreeMonthToHigherThreeMonthQuote,
  foundationLifetimeToHigherLifetimeQuote,
  higherMonthlyToThreeMonthQuote,
  higherMonthlyToHigherLifetimeQuote,
  higherThreeMonthToHigherLifetimeQuote,
}: HigherPlanPanelProps) {
  const higherMonthlyStandardLabel =
    formatPriceLabel(pricing.monthly) ?? "Monthly unavailable";
  const higherThreeMonthStandardLabel =
    formatPriceLabel(pricing.threeMonth) ?? "3-month unavailable";
  const higherLifetimeStandardLabel =
    formatPriceLabel(pricing.lifetime) ?? "Lifetime unavailable";

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
    higherThreeMonthToHigherLifetimeQuote.sourceProduct?.code === "gcse-russian-higher" &&
    higherThreeMonthToHigherLifetimeQuote.upgradeFlow === "lifetime" &&
    higherThreeMonthToHigherLifetimeQuote.sourcePrice?.billing_type === "subscription" &&
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
    foundationMonthlyToHigherThreeMonthQuote.upgradeFlow === "monthly_to_three_month" &&
    (foundationMonthlyToHigherThreeMonthQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowFoundationThreeMonthToHigherThreeMonthUpgrade =
    foundationThreeMonthToHigherThreeMonthQuote?.eligible &&
    foundationThreeMonthToHigherThreeMonthQuote.sourceProduct?.code ===
      "gcse-russian-foundation" &&
    foundationThreeMonthToHigherThreeMonthQuote.upgradeFlow === "same_cadence" &&
    (foundationThreeMonthToHigherThreeMonthQuote.sourcePrice?.interval_count ?? 1) === 3;

  const canShowFoundationLifetimeToHigherLifetimeUpgrade =
    foundationLifetimeToHigherLifetimeQuote?.eligible &&
    foundationLifetimeToHigherLifetimeQuote.sourceProduct?.code ===
      "gcse-russian-foundation" &&
    foundationLifetimeToHigherLifetimeQuote.upgradeFlow === "lifetime";

  const higherOwned = planState.ownedProductCodes.has("gcse-russian-higher");

  if (!user) {
    return (
      <>
        <CheckoutButton
          productCode="gcse-russian-higher"
          billingType="subscription"
          intervalUnit="month"
          intervalCount={1}
        >
          Buy Higher Monthly ({higherMonthlyStandardLabel})
        </CheckoutButton>

        <CheckoutButton
          productCode="gcse-russian-higher"
          billingType="subscription"
          intervalUnit="month"
          intervalCount={3}
        >
          Buy Higher 3 Months ({higherThreeMonthStandardLabel})
        </CheckoutButton>

        <CheckoutButton productCode="gcse-russian-higher" billingType="one_time">
          Buy Higher Lifetime ({higherLifetimeStandardLabel})
        </CheckoutButton>
      </>
    );
  }

  if (planState.higherLifetime) {
    return (
      <>
        <LockedOption
          label="Higher Monthly unavailable"
          message="Monthly plans aren’t needed because you already have Higher lifetime access."
        />

        <LockedOption
          label="Higher 3-Month unavailable"
          message="3-month plans aren’t needed because you already have Higher lifetime access."
        />

        <OwnedButton label="Higher Lifetime active" />

        <p className="text-xs text-[var(--text-secondary)]">
          Your account already has active Higher lifetime access.
        </p>
      </>
    );
  }

  if (planState.higherThreeMonth) {
    return (
      <>
        <LockedOption
          label="Higher Monthly unavailable"
          message="Monthly plans can’t be selected while your current 3-month Higher plan is active."
        />

        <OwnedButton label="Higher 3-Month active" />
        <RenewalMessage renewal={activeSubscriptions.higher} />

        {canShowHigherThreeMonthToHigherLifetimeUpgrade ? (
          <UpgradeOffer
            quote={higherThreeMonthToHigherLifetimeQuote}
            targetPrice={pricing.lifetime}
            targetStandardLabel={higherLifetimeStandardLabel}
          >
            <CheckoutButton
              productCode="gcse-russian-higher"
              billingType="one_time"
              isUpgrade
            >
              Upgrade to Higher Lifetime (
              {getUpgradeFeeLabel(higherThreeMonthToHigherLifetimeQuote)})
            </CheckoutButton>
          </UpgradeOffer>
        ) : null}
      </>
    );
  }

  if (planState.higherMonthly) {
    return (
      <>
        <OwnedButton label="Higher Monthly active" />
        <RenewalMessage renewal={activeSubscriptions.higher} />

        {canShowHigherMonthlyToThreeMonthUpgrade ? (
          <UpgradeOffer
            quote={higherMonthlyToThreeMonthQuote}
            targetPrice={pricing.threeMonth}
            targetStandardLabel={higherThreeMonthStandardLabel}
          >
            <CheckoutButton
              productCode="gcse-russian-higher"
              billingType="subscription"
              intervalUnit="month"
              intervalCount={3}
              isUpgrade
            >
              Upgrade to Higher 3 Months (
              {getUpgradeFeeLabel(higherMonthlyToThreeMonthQuote)})
            </CheckoutButton>
          </UpgradeOffer>
        ) : null}

        {canShowHigherMonthlyToHigherLifetimeUpgrade ? (
          <UpgradeOffer
            quote={higherMonthlyToHigherLifetimeQuote}
            targetPrice={pricing.lifetime}
            targetStandardLabel={higherLifetimeStandardLabel}
          >
            <CheckoutButton
              productCode="gcse-russian-higher"
              billingType="one_time"
              isUpgrade
            >
              Upgrade to Higher Lifetime (
              {getUpgradeFeeLabel(higherMonthlyToHigherLifetimeQuote)})
            </CheckoutButton>
          </UpgradeOffer>
        ) : null}
      </>
    );
  }

  if (planState.foundationLifetime) {
    return (
      <>
        <LockedOption
          label="Higher Monthly unavailable"
          message="Monthly plans are not available from Foundation lifetime. You can upgrade straight to Higher lifetime instead."
        />

        <LockedOption
          label="Higher 3-Month unavailable"
          message="3-month Higher plans are not available from Foundation lifetime. You can upgrade straight to Higher lifetime instead."
        />

        {canShowFoundationLifetimeToHigherLifetimeUpgrade ? (
          <UpgradeOffer
            quote={foundationLifetimeToHigherLifetimeQuote}
            targetPrice={pricing.lifetime}
            targetStandardLabel={higherLifetimeStandardLabel}
          >
            <CheckoutButton
              productCode="gcse-russian-higher"
              billingType="one_time"
              isUpgrade
            >
              Upgrade to Higher Lifetime (
              {getUpgradeFeeLabel(foundationLifetimeToHigherLifetimeQuote)})
            </CheckoutButton>
          </UpgradeOffer>
        ) : null}
      </>
    );
  }

  if (planState.foundationThreeMonth) {
    return (
      <>
        <LockedOption
          label="Higher Monthly unavailable"
          message="You can move to Higher on the same 3-month schedule, but not down to a monthly plan while your current 3-month access is active."
        />

        {canShowFoundationThreeMonthToHigherThreeMonthUpgrade ? (
          <UpgradeOffer
            quote={foundationThreeMonthToHigherThreeMonthQuote}
            targetPrice={pricing.threeMonth}
            targetStandardLabel={higherThreeMonthStandardLabel}
          >
            <CheckoutButton
              productCode="gcse-russian-higher"
              billingType="subscription"
              intervalUnit="month"
              intervalCount={3}
              isUpgrade
            >
              Upgrade to Higher 3 Months (
              {getUpgradeFeeLabel(foundationThreeMonthToHigherThreeMonthQuote)})
            </CheckoutButton>
          </UpgradeOffer>
        ) : null}

        {canShowFoundationLifetimeToHigherLifetimeUpgrade ? (
          <UpgradeOffer
            quote={foundationLifetimeToHigherLifetimeQuote}
            targetPrice={pricing.lifetime}
            targetStandardLabel={higherLifetimeStandardLabel}
          >
            <CheckoutButton
              productCode="gcse-russian-higher"
              billingType="one_time"
              isUpgrade
            >
              Upgrade to Higher Lifetime (
              {getUpgradeFeeLabel(foundationLifetimeToHigherLifetimeQuote)})
            </CheckoutButton>
          </UpgradeOffer>
        ) : null}
      </>
    );
  }

  if (planState.foundationMonthly) {
    return (
      <>
        <OwnedButton label="Foundation Monthly active" />
        <RenewalMessage renewal={activeSubscriptions.foundation} />

        {canShowFoundationMonthlyToHigherMonthlyUpgrade ? (
          <UpgradeOffer
            quote={foundationMonthlyToHigherMonthlyQuote}
            targetPrice={pricing.monthly}
            targetStandardLabel={higherMonthlyStandardLabel}
          >
            <CheckoutButton
              productCode="gcse-russian-higher"
              billingType="subscription"
              intervalUnit="month"
              intervalCount={1}
              isUpgrade
            >
              Upgrade to Higher Monthly (
              {getUpgradeFeeLabel(foundationMonthlyToHigherMonthlyQuote)})
            </CheckoutButton>
          </UpgradeOffer>
        ) : null}

        {canShowFoundationMonthlyToHigherThreeMonthUpgrade ? (
          <UpgradeOffer
            quote={foundationMonthlyToHigherThreeMonthQuote}
            targetPrice={pricing.threeMonth}
            targetStandardLabel={higherThreeMonthStandardLabel}
          >
            <CheckoutButton
              productCode="gcse-russian-higher"
              billingType="subscription"
              intervalUnit="month"
              intervalCount={3}
              isUpgrade
            >
              Upgrade to Higher 3 Months (
              {getUpgradeFeeLabel(foundationMonthlyToHigherThreeMonthQuote)})
            </CheckoutButton>
          </UpgradeOffer>
        ) : null}

        {canShowFoundationLifetimeToHigherLifetimeUpgrade ? (
          <UpgradeOffer
            quote={foundationLifetimeToHigherLifetimeQuote}
            targetPrice={pricing.lifetime}
            targetStandardLabel={higherLifetimeStandardLabel}
          >
            <CheckoutButton
              productCode="gcse-russian-higher"
              billingType="one_time"
              isUpgrade
            >
              Upgrade to Higher Lifetime (
              {getUpgradeFeeLabel(foundationLifetimeToHigherLifetimeQuote)})
            </CheckoutButton>
          </UpgradeOffer>
        ) : null}
      </>
    );
  }

  if (higherOwned) {
    return (
      <>
        <OwnedButton label="Higher already owned" />

        <p className="text-xs text-[var(--text-secondary)]">
          Your account already has active Higher access.
        </p>
      </>
    );
  }

  return (
    <>
      <CheckoutButton
        productCode="gcse-russian-higher"
        billingType="subscription"
        intervalUnit="month"
        intervalCount={1}
      >
        Buy Higher Monthly ({higherMonthlyStandardLabel})
      </CheckoutButton>

      <CheckoutButton
        productCode="gcse-russian-higher"
        billingType="subscription"
        intervalUnit="month"
        intervalCount={3}
      >
        Buy Higher 3 Months ({higherThreeMonthStandardLabel})
      </CheckoutButton>

      <CheckoutButton productCode="gcse-russian-higher" billingType="one_time">
        Buy Higher Lifetime ({higherLifetimeStandardLabel})
      </CheckoutButton>
    </>
  );
}

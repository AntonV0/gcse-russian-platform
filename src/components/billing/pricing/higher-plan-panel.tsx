import {
  ActionGroup,
  LockedOption,
  OwnedButton,
  RenewalMessage,
} from "@/components/billing/pricing/plan-state-elements";
import HigherPlanPurchaseOptions from "@/components/billing/pricing/higher-plan-purchase-options";
import HigherPlanUpgradeOffer from "@/components/billing/pricing/higher-plan-upgrade-offer";
import { getHigherPlanUpgradeVisibility } from "@/components/billing/pricing/higher-plan-upgrade-visibility";
import type { HigherPlanPanelProps } from "@/components/billing/pricing/types";
import { BILLING_TYPES, INTERVAL_UNITS } from "@/lib/billing/catalog";
import { formatPriceLabel } from "@/lib/billing/pricing-ui";

export default function HigherPlanPanel({
  user,
  pricing,
  foundationPricing,
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

  const {
    canShowHigherMonthlyToThreeMonthUpgrade,
    canShowHigherMonthlyToHigherLifetimeUpgrade,
    canShowHigherThreeMonthToHigherLifetimeUpgrade,
    canShowFoundationMonthlyToHigherMonthlyUpgrade,
    canShowFoundationMonthlyToHigherThreeMonthUpgrade,
    canShowFoundationThreeMonthToHigherThreeMonthUpgrade,
    canShowFoundationLifetimeToHigherLifetimeUpgrade,
  } = getHigherPlanUpgradeVisibility({
    user,
    pricing,
    foundationPricing,
    planState,
    activeSubscriptions,
    foundationMonthlyToHigherMonthlyQuote,
    foundationMonthlyToHigherThreeMonthQuote,
    foundationThreeMonthToHigherThreeMonthQuote,
    foundationLifetimeToHigherLifetimeQuote,
    higherMonthlyToThreeMonthQuote,
    higherMonthlyToHigherLifetimeQuote,
    higherThreeMonthToHigherLifetimeQuote,
  });

  const higherOwned = planState.ownedProductCodes.has("gcse-russian-higher");

  if (!user) {
    return (
      <HigherPlanPurchaseOptions
        monthlyLabel={higherMonthlyStandardLabel}
        threeMonthLabel={higherThreeMonthStandardLabel}
        lifetimeLabel={higherLifetimeStandardLabel}
      />
    );
  }

  if (planState.higherLifetime) {
    return (
      <div className="space-y-3">
        <LockedOption
          label="Higher Monthly unavailable"
          message="Monthly plans aren’t needed because you already have Higher lifetime access."
        />

        <LockedOption
          label="Higher 3-Month unavailable"
          message="3-month plans aren’t needed because you already have Higher lifetime access."
        />

        <ActionGroup title="Current plan" variant="compact">
          <OwnedButton label="Higher Lifetime active" />
          <p className="text-xs leading-5 text-[var(--text-secondary)]">
            Your account already has active Higher lifetime access.
          </p>
        </ActionGroup>
      </div>
    );
  }

  if (planState.higherThreeMonth) {
    return (
      <div className="space-y-3">
        <LockedOption
          label="Higher Monthly unavailable"
          message="Monthly plans can’t be selected while your current 3-month Higher plan is active."
        />

        <ActionGroup title="Current plan" variant="compact">
          <OwnedButton label="Higher 3-Month active" />
          <RenewalMessage renewal={activeSubscriptions.higher} />
        </ActionGroup>

        {canShowHigherThreeMonthToHigherLifetimeUpgrade ? (
          <ActionGroup title="Upgrade options" variant="compact">
            <HigherPlanUpgradeOffer
              quote={higherThreeMonthToHigherLifetimeQuote}
              targetPrice={pricing.lifetime}
              targetStandardLabel={higherLifetimeStandardLabel}
              label="Upgrade to Higher Lifetime"
              billingType={BILLING_TYPES.ONE_TIME}
            />
          </ActionGroup>
        ) : null}
      </div>
    );
  }

  if (planState.higherMonthly) {
    return (
      <div className="space-y-3">
        <ActionGroup title="Current plan" variant="compact">
          <OwnedButton label="Higher Monthly active" />
          <RenewalMessage renewal={activeSubscriptions.higher} />
        </ActionGroup>

        {canShowHigherMonthlyToThreeMonthUpgrade ||
        canShowHigherMonthlyToHigherLifetimeUpgrade ? (
          <ActionGroup title="Upgrade options" variant="compact">
            {canShowHigherMonthlyToThreeMonthUpgrade ? (
              <HigherPlanUpgradeOffer
                quote={higherMonthlyToThreeMonthQuote}
                targetPrice={pricing.threeMonth}
                targetStandardLabel={higherThreeMonthStandardLabel}
                label="Upgrade to Higher 3 Months"
                billingType={BILLING_TYPES.SUBSCRIPTION}
                intervalUnit={INTERVAL_UNITS.MONTH}
                intervalCount={3}
              />
            ) : null}

            {canShowHigherMonthlyToHigherLifetimeUpgrade ? (
              <HigherPlanUpgradeOffer
                quote={higherMonthlyToHigherLifetimeQuote}
                targetPrice={pricing.lifetime}
                targetStandardLabel={higherLifetimeStandardLabel}
                label="Upgrade to Higher Lifetime"
                billingType={BILLING_TYPES.ONE_TIME}
              />
            ) : null}
          </ActionGroup>
        ) : null}
      </div>
    );
  }

  if (planState.foundationLifetime) {
    return (
      <div className="space-y-3">
        <LockedOption
          label="Higher Monthly unavailable"
          message="Monthly plans are not available from Foundation lifetime. You can upgrade straight to Higher lifetime instead."
        />

        <LockedOption
          label="Higher 3-Month unavailable"
          message="3-month Higher plans are not available from Foundation lifetime. You can upgrade straight to Higher lifetime instead."
        />

        {canShowFoundationLifetimeToHigherLifetimeUpgrade ? (
          <ActionGroup title="Upgrade options" variant="compact">
            <HigherPlanUpgradeOffer
              quote={foundationLifetimeToHigherLifetimeQuote}
              targetPrice={pricing.lifetime}
              targetStandardLabel={higherLifetimeStandardLabel}
              label="Upgrade to Higher Lifetime"
              billingType={BILLING_TYPES.ONE_TIME}
            />
          </ActionGroup>
        ) : null}
      </div>
    );
  }

  if (planState.foundationThreeMonth) {
    return (
      <div className="space-y-3">
        <LockedOption
          label="Higher Monthly unavailable"
          message="You can move to Higher on the same 3-month schedule, but not down to a monthly plan while your current 3-month access is active."
        />

        {canShowFoundationThreeMonthToHigherThreeMonthUpgrade ||
        canShowFoundationLifetimeToHigherLifetimeUpgrade ? (
          <ActionGroup title="Upgrade options" variant="compact">
            {canShowFoundationThreeMonthToHigherThreeMonthUpgrade ? (
              <HigherPlanUpgradeOffer
                quote={foundationThreeMonthToHigherThreeMonthQuote}
                targetPrice={pricing.threeMonth}
                targetStandardLabel={higherThreeMonthStandardLabel}
                label="Upgrade to Higher 3 Months"
                billingType={BILLING_TYPES.SUBSCRIPTION}
                intervalUnit={INTERVAL_UNITS.MONTH}
                intervalCount={3}
              />
            ) : null}

            {canShowFoundationLifetimeToHigherLifetimeUpgrade ? (
              <HigherPlanUpgradeOffer
                quote={foundationLifetimeToHigherLifetimeQuote}
                targetPrice={pricing.lifetime}
                targetStandardLabel={higherLifetimeStandardLabel}
                label="Upgrade to Higher Lifetime"
                billingType={BILLING_TYPES.ONE_TIME}
              />
            ) : null}
          </ActionGroup>
        ) : null}
      </div>
    );
  }

  if (planState.foundationMonthly) {
    return (
      <div className="space-y-3">
        <ActionGroup title="Current plan" variant="compact">
          <OwnedButton label="Foundation Monthly active" />
          <RenewalMessage renewal={activeSubscriptions.foundation} />
        </ActionGroup>

        {canShowFoundationMonthlyToHigherMonthlyUpgrade ||
        canShowFoundationMonthlyToHigherThreeMonthUpgrade ||
        canShowFoundationLifetimeToHigherLifetimeUpgrade ? (
          <ActionGroup title="Upgrade options" variant="compact">
            {canShowFoundationMonthlyToHigherMonthlyUpgrade ? (
              <HigherPlanUpgradeOffer
                quote={foundationMonthlyToHigherMonthlyQuote}
                targetPrice={pricing.monthly}
                targetStandardLabel={higherMonthlyStandardLabel}
                label="Upgrade to Higher Monthly"
                billingType={BILLING_TYPES.SUBSCRIPTION}
                intervalUnit={INTERVAL_UNITS.MONTH}
                intervalCount={1}
              />
            ) : null}

            {canShowFoundationMonthlyToHigherThreeMonthUpgrade ? (
              <HigherPlanUpgradeOffer
                quote={foundationMonthlyToHigherThreeMonthQuote}
                targetPrice={pricing.threeMonth}
                targetStandardLabel={higherThreeMonthStandardLabel}
                label="Upgrade to Higher 3 Months"
                billingType={BILLING_TYPES.SUBSCRIPTION}
                intervalUnit={INTERVAL_UNITS.MONTH}
                intervalCount={3}
              />
            ) : null}

            {canShowFoundationLifetimeToHigherLifetimeUpgrade ? (
              <HigherPlanUpgradeOffer
                quote={foundationLifetimeToHigherLifetimeQuote}
                targetPrice={pricing.lifetime}
                targetStandardLabel={higherLifetimeStandardLabel}
                label="Upgrade to Higher Lifetime"
                billingType={BILLING_TYPES.ONE_TIME}
              />
            ) : null}
          </ActionGroup>
        ) : null}
      </div>
    );
  }

  if (higherOwned) {
    return (
      <ActionGroup title="Current plan" variant="compact">
        <OwnedButton label="Higher already owned" />

        <p className="text-xs leading-5 text-[var(--text-secondary)]">
          Your account already has active Higher access.
        </p>
      </ActionGroup>
    );
  }

  return (
    <HigherPlanPurchaseOptions
      monthlyLabel={higherMonthlyStandardLabel}
      threeMonthLabel={higherThreeMonthStandardLabel}
      lifetimeLabel={higherLifetimeStandardLabel}
    />
  );
}

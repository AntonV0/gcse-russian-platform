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
import { BILLING_TYPES, INTERVAL_UNITS, PRODUCT_CODES } from "@/lib/billing/catalog";
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

  const higherOwned = planState.ownedProductCodes.has(PRODUCT_CODES.GCSE_RUSSIAN_HIGHER);

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
          label="Higher Monthly"
          message="You have Higher lifetime, so there are no monthly renewals to manage."
        />

        <LockedOption
          label="Higher 3-Month"
          message="You have Higher lifetime, so there are no 3-month renewals to manage."
        />

        <ActionGroup title="Your plan" variant="compact">
          <OwnedButton label="Higher Lifetime active" />
          <p className="text-xs leading-5 text-[var(--text-secondary)]">
            You are all set with Higher lifetime.
          </p>
        </ActionGroup>
      </div>
    );
  }

  if (planState.higherThreeMonth) {
    return (
      <div className="space-y-3">
        <LockedOption
          label="Higher Monthly"
          message="Your Higher 3-month plan is already active."
        />

        <ActionGroup title="Your plan" variant="compact">
          <OwnedButton label="Higher 3-Month active" />
          <RenewalMessage renewal={activeSubscriptions.higher} />
        </ActionGroup>

        {canShowHigherThreeMonthToHigherLifetimeUpgrade ? (
          <ActionGroup title="Ways to upgrade" variant="compact">
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
        <ActionGroup title="Your plan" variant="compact">
          <OwnedButton label="Higher Monthly active" />
          <RenewalMessage renewal={activeSubscriptions.higher} />
        </ActionGroup>

        {canShowHigherMonthlyToThreeMonthUpgrade ||
        canShowHigherMonthlyToHigherLifetimeUpgrade ? (
          <ActionGroup title="Ways to upgrade" variant="compact">
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
          label="Higher Monthly"
          message="From Foundation lifetime, the best next step is straight to Higher lifetime."
        />

        <LockedOption
          label="Higher 3-Month"
          message="From Foundation lifetime, the best next step is straight to Higher lifetime."
        />

        {canShowFoundationLifetimeToHigherLifetimeUpgrade ? (
          <ActionGroup title="Ways to upgrade" variant="compact">
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
          label="Higher Monthly"
          message="You can move to Higher on the same 3-month plan. To keep billing clear, monthly switches wait until your Foundation plan finishes."
        />

        {canShowFoundationThreeMonthToHigherThreeMonthUpgrade ||
        canShowFoundationLifetimeToHigherLifetimeUpgrade ? (
          <ActionGroup title="Ways to upgrade" variant="compact">
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
        <ActionGroup title="Your plan" variant="compact">
          <OwnedButton label="Foundation Monthly active" />
          <RenewalMessage renewal={activeSubscriptions.foundation} />
        </ActionGroup>

        {canShowFoundationMonthlyToHigherMonthlyUpgrade ||
        canShowFoundationMonthlyToHigherThreeMonthUpgrade ||
        canShowFoundationLifetimeToHigherLifetimeUpgrade ? (
          <ActionGroup title="Ways to upgrade" variant="compact">
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
      <ActionGroup title="Your plan" variant="compact">
        <OwnedButton label="Higher already yours" />

        <p className="text-xs leading-5 text-[var(--text-secondary)]">
          You already have Higher in your GCSE Russian dashboard.
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

import CheckoutButton from "@/components/billing/checkout-button";
import CheckoutOptionRow from "@/components/billing/checkout-option-row";
import {
  ActionGroup,
  LockedOption,
  OwnedButton,
  RenewalMessage,
  UpgradeOffer,
} from "@/components/billing/pricing/plan-state-elements";
import type { FoundationPlanPanelProps } from "@/components/billing/pricing/types";
import { formatPriceLabel, getUpgradeFeeLabel } from "@/lib/billing/pricing-ui";

export default function FoundationPlanPanel({
  user,
  pricing,
  planState,
  activeSubscriptions,
  foundationMonthlyToThreeMonthQuote,
  foundationMonthlyToFoundationLifetimeQuote,
  foundationThreeMonthToFoundationLifetimeQuote,
}: FoundationPlanPanelProps) {
  const foundationMonthlyLabel =
    formatPriceLabel(pricing.monthly) ?? "Monthly unavailable";
  const foundationThreeMonthLabel =
    formatPriceLabel(pricing.threeMonth) ?? "3-month unavailable";
  const foundationLifetimeLabel =
    formatPriceLabel(pricing.lifetime) ?? "Lifetime unavailable";

  const canShowFoundationMonthlyToThreeMonthUpgrade =
    foundationMonthlyToThreeMonthQuote?.eligible &&
    foundationMonthlyToThreeMonthQuote.sourceProduct?.code ===
      "gcse-russian-foundation" &&
    foundationMonthlyToThreeMonthQuote.sourcePrice?.billing_type === "subscription" &&
    (foundationMonthlyToThreeMonthQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowFoundationMonthlyToFoundationLifetimeUpgrade =
    foundationMonthlyToFoundationLifetimeQuote?.eligible &&
    foundationMonthlyToFoundationLifetimeQuote.sourceProduct?.code ===
      "gcse-russian-foundation" &&
    foundationMonthlyToFoundationLifetimeQuote.upgradeFlow === "lifetime" &&
    foundationMonthlyToFoundationLifetimeQuote.sourcePrice?.billing_type ===
      "subscription" &&
    (foundationMonthlyToFoundationLifetimeQuote.sourcePrice?.interval_count ?? 1) === 1;

  const canShowFoundationThreeMonthToFoundationLifetimeUpgrade =
    foundationThreeMonthToFoundationLifetimeQuote?.eligible &&
    foundationThreeMonthToFoundationLifetimeQuote.sourceProduct?.code ===
      "gcse-russian-foundation" &&
    foundationThreeMonthToFoundationLifetimeQuote.upgradeFlow === "lifetime" &&
    foundationThreeMonthToFoundationLifetimeQuote.sourcePrice?.billing_type ===
      "subscription" &&
    (foundationThreeMonthToFoundationLifetimeQuote.sourcePrice?.interval_count ?? 1) ===
      3;

  const foundationOwned = planState.ownedProductCodes.has("gcse-russian-foundation");

  if (!user) {
    return (
      <ActionGroup variant="compact">
        <CheckoutOptionRow
          productCode="gcse-russian-foundation"
          billingType="subscription"
          intervalUnit="month"
          intervalCount={1}
          label="Start monthly"
          priceLabel={foundationMonthlyLabel}
          meta="Flexible monthly plan"
        />

        <CheckoutOptionRow
          productCode="gcse-russian-foundation"
          billingType="subscription"
          intervalUnit="month"
          intervalCount={3}
          label="Choose 3 months"
          priceLabel={foundationThreeMonthLabel}
          meta="Good for a study term"
        />

        <CheckoutOptionRow
          productCode="gcse-russian-foundation"
          billingType="one_time"
          label="Choose lifetime"
          priceLabel={foundationLifetimeLabel}
          meta="Best value, no renewals"
          recommended
        />
      </ActionGroup>
    );
  }

  if (planState.higherLifetime) {
    return (
      <ActionGroup title="Higher already covers this" variant="compact">
        <LockedOption
          label="Foundation Monthly"
          message="You already have Higher lifetime, which gives you the fuller course without renewals."
        />

        <LockedOption
          label="Foundation 3-Month"
          message="You already have Higher lifetime, which gives you the fuller course without renewals."
        />

        <LockedOption
          label="Foundation Lifetime"
          message="You already have Higher lifetime, which gives you the fuller course without renewals."
        />
      </ActionGroup>
    );
  }

  if (planState.higherThreeMonth) {
    return (
      <ActionGroup title="Higher already covers this" variant="compact">
        <LockedOption
          label="Foundation Monthly"
          message="Your Higher 3-month plan already gives you the stronger course route."
        />

        <LockedOption
          label="Foundation 3-Month"
          message="Your Higher 3-month plan already gives you the stronger course route."
        />

        <LockedOption
          label="Foundation Lifetime"
          message="Your Higher 3-month plan already gives you the stronger course route."
        />
      </ActionGroup>
    );
  }

  if (planState.higherMonthly) {
    return (
      <ActionGroup title="Higher already covers this" variant="compact">
        <LockedOption
          label="Foundation"
          message="Your Higher plan already gives you the stronger course route."
        />
      </ActionGroup>
    );
  }

  if (planState.foundationMonthly) {
    return (
      <div className="space-y-3">
        <ActionGroup title="Your plan" variant="compact">
          <OwnedButton label="Foundation Monthly active" />
          <RenewalMessage renewal={activeSubscriptions.foundation} />
        </ActionGroup>

        {canShowFoundationMonthlyToThreeMonthUpgrade ||
        canShowFoundationMonthlyToFoundationLifetimeUpgrade ? (
          <ActionGroup title="Ways to upgrade" variant="compact">
            {canShowFoundationMonthlyToThreeMonthUpgrade ? (
              <UpgradeOffer
                quote={foundationMonthlyToThreeMonthQuote}
                targetPrice={pricing.threeMonth}
                targetStandardLabel={foundationThreeMonthLabel}
              >
                <CheckoutButton
                  productCode="gcse-russian-foundation"
                  billingType="subscription"
                  intervalUnit="month"
                  intervalCount={3}
                  isUpgrade
                >
                  Upgrade to Foundation 3 Months (
                  {getUpgradeFeeLabel(foundationMonthlyToThreeMonthQuote)})
                </CheckoutButton>
              </UpgradeOffer>
            ) : null}

            {canShowFoundationMonthlyToFoundationLifetimeUpgrade ? (
              <UpgradeOffer
                quote={foundationMonthlyToFoundationLifetimeQuote}
                targetPrice={pricing.lifetime}
                targetStandardLabel={foundationLifetimeLabel}
              >
                <CheckoutButton
                  productCode="gcse-russian-foundation"
                  billingType="one_time"
                  isUpgrade
                >
                  Upgrade to Foundation Lifetime (
                  {getUpgradeFeeLabel(foundationMonthlyToFoundationLifetimeQuote)})
                </CheckoutButton>
              </UpgradeOffer>
            ) : null}
          </ActionGroup>
        ) : null}
      </div>
    );
  }

  if (planState.foundationThreeMonth) {
    return (
      <div className="space-y-3">
        <LockedOption
          label="Foundation Monthly"
          message="Your Foundation 3-month plan is already active."
        />

        <ActionGroup title="Your plan" variant="compact">
          <OwnedButton label="Foundation 3-Month active" />
          <RenewalMessage renewal={activeSubscriptions.foundation} />
        </ActionGroup>

        {canShowFoundationThreeMonthToFoundationLifetimeUpgrade ? (
          <ActionGroup title="Ways to upgrade" variant="compact">
            <UpgradeOffer
              quote={foundationThreeMonthToFoundationLifetimeQuote}
              targetPrice={pricing.lifetime}
              targetStandardLabel={foundationLifetimeLabel}
            >
              <CheckoutButton
                productCode="gcse-russian-foundation"
                billingType="one_time"
                isUpgrade
              >
                Upgrade to Foundation Lifetime (
                {getUpgradeFeeLabel(foundationThreeMonthToFoundationLifetimeQuote)})
              </CheckoutButton>
            </UpgradeOffer>
          </ActionGroup>
        ) : null}
      </div>
    );
  }

  if (planState.foundationLifetime) {
    return (
      <div className="space-y-3">
        <LockedOption
          label="Foundation Monthly"
          message="You have Foundation lifetime, so there are no monthly renewals to manage."
        />

        <LockedOption
          label="Foundation 3-Month"
          message="You have Foundation lifetime, so there are no 3-month renewals to manage."
        />

        <ActionGroup title="Your plan" variant="compact">
          <OwnedButton label="Foundation Lifetime active" />
          <p className="text-xs leading-5 text-[var(--text-secondary)]">
            You are all set with Foundation lifetime.
          </p>
        </ActionGroup>
      </div>
    );
  }

  if (foundationOwned) {
    return (
      <ActionGroup title="Your plan" variant="compact">
        <OwnedButton label="Foundation already yours" />
        <p className="text-xs leading-5 text-[var(--text-secondary)]">
          You already have Foundation in your GCSE Russian dashboard.
        </p>
      </ActionGroup>
    );
  }

  return (
    <ActionGroup variant="compact">
      <CheckoutOptionRow
        productCode="gcse-russian-foundation"
        billingType="subscription"
        intervalUnit="month"
        intervalCount={1}
        label="Start monthly"
        priceLabel={foundationMonthlyLabel}
        meta="Flexible monthly plan"
      />

      <CheckoutOptionRow
        productCode="gcse-russian-foundation"
        billingType="subscription"
        intervalUnit="month"
        intervalCount={3}
        label="Choose 3 months"
        priceLabel={foundationThreeMonthLabel}
        meta="Good for a study term"
      />

      <CheckoutOptionRow
        productCode="gcse-russian-foundation"
        billingType="one_time"
        label="Choose lifetime"
        priceLabel={foundationLifetimeLabel}
        meta="Best value, no renewals"
        recommended
      />
    </ActionGroup>
  );
}

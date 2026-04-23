import CheckoutButton from "@/components/billing/checkout-button";
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
      <ActionGroup title="Choose access" variant="compact">
        <CheckoutButton
          productCode="gcse-russian-foundation"
          billingType="subscription"
          intervalUnit="month"
          intervalCount={1}
        >
          Buy Foundation Monthly ({foundationMonthlyLabel})
        </CheckoutButton>

        <CheckoutButton
          productCode="gcse-russian-foundation"
          billingType="subscription"
          intervalUnit="month"
          intervalCount={3}
        >
          Buy Foundation 3 Months ({foundationThreeMonthLabel})
        </CheckoutButton>

        <CheckoutButton productCode="gcse-russian-foundation" billingType="one_time">
          Buy Foundation Lifetime ({foundationLifetimeLabel})
        </CheckoutButton>
      </ActionGroup>
    );
  }

  if (planState.higherLifetime) {
    return (
      <ActionGroup title="Unavailable while Higher is active" variant="compact">
        <LockedOption
          label="Foundation Monthly unavailable"
          message="Foundation plans aren’t needed because you already have Higher lifetime access."
        />

        <LockedOption
          label="Foundation 3-Month unavailable"
          message="Foundation plans aren’t needed because you already have Higher lifetime access."
        />

        <LockedOption
          label="Foundation Lifetime unavailable"
          message="Foundation plans aren’t needed because you already have Higher lifetime access."
        />
      </ActionGroup>
    );
  }

  if (planState.higherThreeMonth) {
    return (
      <ActionGroup title="Unavailable while Higher is active" variant="compact">
        <LockedOption
          label="Foundation Monthly unavailable"
          message="Foundation plans aren’t available while your active Higher 3-month plan is in place."
        />

        <LockedOption
          label="Foundation 3-Month unavailable"
          message="Foundation plans aren’t available while your active Higher 3-month plan is in place."
        />

        <LockedOption
          label="Foundation Lifetime unavailable"
          message="Foundation plans aren’t available while your active Higher 3-month plan is in place."
        />
      </ActionGroup>
    );
  }

  if (planState.higherMonthly) {
    return (
      <ActionGroup title="Unavailable while Higher is active" variant="compact">
        <LockedOption
          label="Foundation unavailable"
          message="Foundation plans aren’t available while you already have active Higher access."
        />
      </ActionGroup>
    );
  }

  if (planState.foundationMonthly) {
    return (
      <div className="space-y-3">
        <ActionGroup title="Current plan" variant="compact">
          <OwnedButton label="Foundation Monthly active" />
          <RenewalMessage renewal={activeSubscriptions.foundation} />
        </ActionGroup>

        {canShowFoundationMonthlyToThreeMonthUpgrade ||
        canShowFoundationMonthlyToFoundationLifetimeUpgrade ? (
          <ActionGroup title="Upgrade options" variant="compact">
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
          label="Foundation Monthly unavailable"
          message="Monthly plans can’t be selected while your current 3-month Foundation plan is active."
        />

        <ActionGroup title="Current plan" variant="compact">
          <OwnedButton label="Foundation 3-Month active" />
          <RenewalMessage renewal={activeSubscriptions.foundation} />
        </ActionGroup>

        {canShowFoundationThreeMonthToFoundationLifetimeUpgrade ? (
          <ActionGroup title="Upgrade options" variant="compact">
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
          label="Foundation Monthly unavailable"
          message="Monthly plans aren’t needed because you already have Foundation lifetime access."
        />

        <LockedOption
          label="Foundation 3-Month unavailable"
          message="3-month plans aren’t needed because you already have Foundation lifetime access."
        />

        <ActionGroup title="Current plan" variant="compact">
          <OwnedButton label="Foundation Lifetime active" />
          <p className="text-xs leading-5 text-[var(--text-secondary)]">
            Your account already has active Foundation lifetime access.
          </p>
        </ActionGroup>
      </div>
    );
  }

  if (foundationOwned) {
    return (
      <ActionGroup title="Current plan" variant="compact">
        <OwnedButton label="Foundation already owned" />
        <p className="text-xs leading-5 text-[var(--text-secondary)]">
          Your account already has active Foundation access.
        </p>
      </ActionGroup>
    );
  }

  return (
    <ActionGroup title="Choose access" variant="compact">
      <CheckoutButton
        productCode="gcse-russian-foundation"
        billingType="subscription"
        intervalUnit="month"
        intervalCount={1}
      >
        Buy Foundation Monthly ({foundationMonthlyLabel})
      </CheckoutButton>

      <CheckoutButton
        productCode="gcse-russian-foundation"
        billingType="subscription"
        intervalUnit="month"
        intervalCount={3}
      >
        Buy Foundation 3 Months ({foundationThreeMonthLabel})
      </CheckoutButton>

      <CheckoutButton productCode="gcse-russian-foundation" billingType="one_time">
        Buy Foundation Lifetime ({foundationLifetimeLabel})
      </CheckoutButton>
    </ActionGroup>
  );
}

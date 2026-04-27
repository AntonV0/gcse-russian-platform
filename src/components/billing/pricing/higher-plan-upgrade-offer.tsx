import CheckoutButton from "@/components/billing/checkout-button";
import { UpgradeOffer } from "@/components/billing/pricing/plan-state-elements";
import {
  BILLING_TYPES,
  INTERVAL_UNITS,
  type DbPrice,
  type UpgradeQuoteResolution,
} from "@/lib/billing/catalog";
import { getUpgradeFeeLabel } from "@/lib/billing/pricing-ui";

type HigherPlanUpgradeOfferProps = {
  quote: UpgradeQuoteResolution | null;
  targetPrice: DbPrice | null;
  targetStandardLabel: string;
  label: string;
  billingType: typeof BILLING_TYPES.SUBSCRIPTION | typeof BILLING_TYPES.ONE_TIME;
  intervalUnit?: typeof INTERVAL_UNITS.MONTH;
  intervalCount?: number;
};

export default function HigherPlanUpgradeOffer({
  quote,
  targetPrice,
  targetStandardLabel,
  label,
  billingType,
  intervalUnit,
  intervalCount,
}: HigherPlanUpgradeOfferProps) {
  return (
    <UpgradeOffer
      quote={quote}
      targetPrice={targetPrice}
      targetStandardLabel={targetStandardLabel}
    >
      <CheckoutButton
        productCode="gcse-russian-higher"
        billingType={billingType}
        intervalUnit={intervalUnit}
        intervalCount={intervalCount}
        isUpgrade
      >
        {label} ({getUpgradeFeeLabel(quote)})
      </CheckoutButton>
    </UpgradeOffer>
  );
}

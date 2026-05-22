import CheckoutOptionRow from "@/components/billing/checkout-option-row";
import { ActionGroup } from "@/components/billing/pricing/plan-state-elements";
import { PRODUCT_CODES } from "@/lib/billing/catalog";

type HigherPlanPurchaseOptionsProps = {
  monthlyLabel: string;
  threeMonthLabel: string;
  lifetimeLabel: string;
};

export default function HigherPlanPurchaseOptions({
  monthlyLabel,
  threeMonthLabel,
  lifetimeLabel,
}: HigherPlanPurchaseOptionsProps) {
  const higherProductCode = PRODUCT_CODES.GCSE_RUSSIAN_HIGHER;

  return (
    <ActionGroup variant="compact">
      <CheckoutOptionRow
        productCode={higherProductCode}
        billingType="subscription"
        intervalUnit="month"
        intervalCount={1}
        label="Start monthly"
        priceLabel={monthlyLabel}
        meta="Flexible monthly plan"
      />

      <CheckoutOptionRow
        productCode={higherProductCode}
        billingType="subscription"
        intervalUnit="month"
        intervalCount={3}
        label="Choose 3 months"
        priceLabel={threeMonthLabel}
        meta="Good for a study term"
      />

      <CheckoutOptionRow
        productCode={higherProductCode}
        billingType="one_time"
        label="Choose lifetime"
        priceLabel={lifetimeLabel}
        meta="Best value, no renewals"
        recommended
      />
    </ActionGroup>
  );
}

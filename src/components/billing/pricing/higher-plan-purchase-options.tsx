import CheckoutOptionRow from "@/components/billing/checkout-option-row";
import { ActionGroup } from "@/components/billing/pricing/plan-state-elements";

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
  return (
    <ActionGroup title="Choose your plan" variant="compact">
      <CheckoutOptionRow
        productCode="gcse-russian-higher"
        billingType="subscription"
        intervalUnit="month"
        intervalCount={1}
        label="Monthly"
        priceLabel={monthlyLabel}
        meta="Flexible monthly plan"
      />

      <CheckoutOptionRow
        productCode="gcse-russian-higher"
        billingType="subscription"
        intervalUnit="month"
        intervalCount={3}
        label="3 Months"
        priceLabel={threeMonthLabel}
        meta="Good for a study term"
      />

      <CheckoutOptionRow
        productCode="gcse-russian-higher"
        billingType="one_time"
        label="Lifetime"
        priceLabel={lifetimeLabel}
        meta="One payment, no renewals"
        recommended
      />
    </ActionGroup>
  );
}

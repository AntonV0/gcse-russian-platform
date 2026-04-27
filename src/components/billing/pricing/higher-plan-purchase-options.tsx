import CheckoutButton from "@/components/billing/checkout-button";
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
    <ActionGroup title="Choose access" variant="compact">
      <CheckoutButton
        productCode="gcse-russian-higher"
        billingType="subscription"
        intervalUnit="month"
        intervalCount={1}
      >
        Buy Higher Monthly ({monthlyLabel})
      </CheckoutButton>

      <CheckoutButton
        productCode="gcse-russian-higher"
        billingType="subscription"
        intervalUnit="month"
        intervalCount={3}
      >
        Buy Higher 3 Months ({threeMonthLabel})
      </CheckoutButton>

      <CheckoutButton productCode="gcse-russian-higher" billingType="one_time">
        Buy Higher Lifetime ({lifetimeLabel})
      </CheckoutButton>
    </ActionGroup>
  );
}

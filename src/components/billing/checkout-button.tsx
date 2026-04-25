"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import FeedbackBanner from "@/components/ui/feedback-banner";

type CheckoutButtonProps = {
  productCode: string;
  billingType: "subscription" | "one_time";
  intervalUnit?: "month" | "year";
  intervalCount?: number;
  isUpgrade?: boolean;
  children: React.ReactNode;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function CheckoutButton({
  productCode,
  billingType,
  intervalUnit,
  intervalCount,
  isUpgrade = false,
  children,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCheckout() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productCode,
          billingType,
          intervalUnit,
          intervalCount,
          isUpgrade,
          successPath: "/account",
          cancelPath: "/account/billing",
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      window.location.href = data.url;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setErrorMessage(message);
      setIsLoading(false);
    }
  }

  return (
    <div className="dev-marker-host relative space-y-2">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="CheckoutButton"
          filePath="src/components/billing/checkout-button.tsx"
          tier="semantic"
          componentRole="Stripe checkout action control with loading and error feedback"
          bestFor="Billing flows where a pricing option or upgrade needs to create a checkout session."
          usageExamples={[
            "Foundation monthly purchase",
            "Higher lifetime checkout",
            "Foundation to Higher upgrade",
            "Billing/pricing/access UI",
          ]}
          notes="Use only for Stripe checkout redirects. Use the shared Button component for ordinary navigation or form actions."
        />
      ) : null}

      <Button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        variant="primary"
        className="w-full"
      >
        {isLoading ? "Redirecting..." : children}
      </Button>

      {errorMessage ? (
        <FeedbackBanner tone="danger" description={errorMessage} />
      ) : null}
    </div>
  );
}

"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import type { ButtonVariant } from "@/components/ui/button-styles";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import FeedbackBanner from "@/components/ui/feedback-banner";

type CheckoutButtonProps = {
  productCode: string;
  billingType: "subscription" | "one_time";
  intervalUnit?: "month" | "year";
  intervalCount?: number;
  isUpgrade?: boolean;
  variant?: ButtonVariant;
  helperText?: string;
  recommendedLabel?: string;
  children: React.ReactNode;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function CheckoutButton({
  productCode,
  billingType,
  intervalUnit,
  intervalCount,
  isUpgrade = false,
  variant = "primary",
  helperText,
  recommendedLabel,
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
          successPath: "/account/billing",
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

      {recommendedLabel ? (
        <div className="flex justify-end">
          <span className="inline-flex rounded-full border border-[var(--accent-selected-border)] [background:var(--accent-gradient-selected)] px-2.5 py-1 text-[11px] font-bold text-[var(--accent-on-soft)]">
            {recommendedLabel}
          </span>
        </div>
      ) : null}

      <Button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        variant={variant}
        className="w-full"
        icon={isUpgrade ? "billing" : "next"}
        iconPosition="right"
        loading={isLoading}
        loadingLabel="Redirecting..."
      >
        {children}
      </Button>

      {helperText ? (
        <p className="text-xs leading-5 text-[var(--text-secondary)]">{helperText}</p>
      ) : null}

      {errorMessage ? <FeedbackBanner tone="danger" description={errorMessage} /> : null}
    </div>
  );
}

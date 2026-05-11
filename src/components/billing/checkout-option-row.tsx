"use client";

import { useState } from "react";
import { PricingOptionButton } from "@/components/billing/pricing/pricing-option-button";
import FeedbackBanner from "@/components/ui/feedback-banner";

type CheckoutOptionRowProps = {
  productCode: string;
  billingType: "subscription" | "one_time";
  intervalUnit?: "month" | "year";
  intervalCount?: number;
  label: string;
  priceLabel: string;
  meta: string;
  recommended?: boolean;
};

export default function CheckoutOptionRow({
  productCode,
  billingType,
  intervalUnit,
  intervalCount,
  label,
  priceLabel,
  meta,
  recommended = false,
}: CheckoutOptionRowProps) {
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
    <div className="space-y-2">
      <PricingOptionButton
        onClick={handleCheckout}
        disabled={isLoading}
        label={label}
        meta={meta}
        badgeLabel={recommended ? "Recommended" : undefined}
        trailingLabel={priceLabel}
        recommended={recommended}
        loading={isLoading}
        loadingLabel="Opening checkout..."
      />

      {errorMessage ? <FeedbackBanner tone="danger" description={errorMessage} /> : null}
    </div>
  );
}

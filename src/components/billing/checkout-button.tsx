"use client";

import { useState } from "react";

type CheckoutButtonProps = {
  productCode: string;
  billingType: "subscription" | "one_time";
  intervalUnit?: "month" | "year";
  intervalCount?: number;
  isUpgrade?: boolean;
  children: React.ReactNode;
};

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
          cancelPath: "/pricing",
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
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Redirecting..." : children}
      </button>

      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
    </div>
  );
}

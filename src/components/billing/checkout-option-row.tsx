"use client";

import { useState } from "react";
import AppIcon from "@/components/ui/app-icon";
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
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className={[
          "app-focus-ring group flex w-full flex-col gap-3 rounded-xl border px-3.5 py-3 text-left transition sm:flex-row sm:items-center sm:justify-between",
          isLoading
            ? "cursor-not-allowed opacity-70"
            : "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
          recommended
            ? "border-[var(--accent-selected-border)] [background:var(--accent-gradient-selected)] shadow-[0_10px_24px_color-mix(in_srgb,var(--accent)_10%,transparent)]"
            : "border-[var(--border-subtle)] bg-[var(--background-elevated)] hover:border-[var(--border-strong)]",
        ].join(" ")}
      >
        <span className="min-w-0 space-y-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-[var(--text-primary)]">{label}</span>
            {recommended ? (
              <span className="rounded-full [background:var(--accent-gradient-fill)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--accent-on-fill)]">
                Best value
              </span>
            ) : null}
          </span>
          <span className="block text-xs leading-5 text-[var(--text-secondary)]">
            {meta}
          </span>
        </span>

        <span className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
          <span className="text-sm font-extrabold text-[var(--text-primary)]">
            {priceLabel}
          </span>
          <span
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition",
              recommended
                ? "border-transparent [background:var(--accent-gradient-fill)] text-[var(--accent-on-fill)]"
                : "border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-secondary)] group-hover:text-[var(--accent-ink)]",
            ].join(" ")}
            aria-hidden="true"
          >
            <AppIcon icon={isLoading ? "refresh" : "next"} size={15} />
          </span>
        </span>
      </button>

      {errorMessage ? <FeedbackBanner tone="danger" description={errorMessage} /> : null}
    </div>
  );
}

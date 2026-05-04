"use client";

import { useId, useState } from "react";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";

export default function BillingPortalButton({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const disabledReasonId = useId();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const showDisabledReason = disabled && !isLoading;
  const disabledReason =
    "You do not have an active monthly or 3-month plan to manage yet.";

  async function openBillingPortal() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to open plan management");
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
      <span title={showDisabledReason ? disabledReason : undefined}>
        <Button
          type="button"
          variant="secondary"
          icon="settings"
          onClick={openBillingPortal}
          disabled={disabled || isLoading}
          aria-describedby={showDisabledReason ? disabledReasonId : undefined}
          title={showDisabledReason ? disabledReason : undefined}
        >
          {isLoading ? "Opening..." : showDisabledReason ? "No plan to manage" : "Manage plan"}
        </Button>
      </span>

      {showDisabledReason ? (
        <p
          id={disabledReasonId}
          className="max-w-xs text-xs leading-5 text-[var(--text-secondary)]"
        >
          Choose a monthly or 3-month plan first, then you can manage renewals here.
        </p>
      ) : null}

      {errorMessage ? <FeedbackBanner tone="danger" description={errorMessage} /> : null}
    </div>
  );
}

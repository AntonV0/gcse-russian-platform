"use client";

import { useEffect } from "react";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";

type RouteErrorPanelProps = {
  area: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RouteErrorPanel({
  area,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  error,
  reset,
}: RouteErrorPanelProps) {
  useEffect(() => {
    console.error(`${area} route error`, {
      message: error.message,
      digest: error.digest,
    });
  }, [area, error]);

  return (
    <main className="mx-auto flex min-h-[52vh] w-full max-w-3xl items-center px-4 py-10 sm:px-6">
      <FeedbackBanner tone="danger" title={title} description={description}>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="primary" icon="refresh" onClick={reset}>
            Try again
          </Button>
          <Button href={primaryHref} variant="secondary" icon="dashboard">
            {primaryLabel}
          </Button>
          {secondaryHref && secondaryLabel ? (
            <Button href={secondaryHref} variant="quiet" icon="home">
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      </FeedbackBanner>
    </main>
  );
}

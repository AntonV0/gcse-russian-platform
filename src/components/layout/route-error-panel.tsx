"use client";

import { useEffect } from "react";
import LearningSheet, {
  LearningSheetSection,
} from "@/components/ui/learning-sheet";
import OperationsWorkspace, {
  OperationsSection,
} from "@/components/ui/operations-workspace";
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
  variant?: "learning" | "operations";
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
  variant = "learning",
}: RouteErrorPanelProps) {
  useEffect(() => {
    console.error(`${area} route error`, {
      message: error.message,
      digest: error.digest,
    });
  }, [area, error]);

  const content = (
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
  );

  if (variant === "operations") {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <OperationsWorkspace>
          <OperationsSection divided={false}>{content}</OperationsSection>
        </OperationsWorkspace>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <LearningSheet>
        <LearningSheetSection divided={false}>{content}</LearningSheetSection>
      </LearningSheet>
    </main>
  );
}

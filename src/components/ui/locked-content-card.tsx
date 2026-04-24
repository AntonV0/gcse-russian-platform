"use client";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type LockedContentCardProps = {
  title: string;
  description: string;
  accessLabel?: string;
  statusLabel?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function LockedContentCard({
  title,
  description,
  accessLabel = "Full access",
  statusLabel = "Locked",
  primaryActionLabel = "Unlock full course",
  secondaryActionLabel = "Compare access",
  className,
}: LockedContentCardProps) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="LockedContentCard"
          filePath="src/components/ui/locked-content-card.tsx"
          tier="semantic"
          componentRole="Locked access and upgrade prompt surface"
          bestFor="Locked course content, upgrade prompts, trial limitations, and student access conversion moments."
          usageExamples={[
            "Higher tier locked lesson",
            "Trial access limit prompt",
            "Full course upgrade card",
            "Locked mock exam card",
          ]}
          notes="Use for access/funnel moments only. Avoid using it for general warnings, empty states, or normal lesson cards."
        />
      ) : null}

      <Card
        className="border-[color-mix(in_srgb,var(--brand-blue)_18%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand-blue)_8%,transparent)_0%,var(--background-elevated)_52%,color-mix(in_srgb,var(--brand-red)_5%,transparent)_100%)]"
        interactive
      >
        <CardBody className="space-y-4 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                Access / funnel
              </div>
              <h3 className="font-semibold leading-6 text-[var(--text-primary)]">
                {title}
              </h3>
            </div>

            <div className="flex shrink-0 flex-wrap justify-end gap-2">
              <Badge tone="default" icon="info">
                {accessLabel}
              </Badge>
              <Badge tone="warning" icon="pending">
                {statusLabel}
              </Badge>
            </div>
          </div>

          <p className="text-sm leading-6 text-[var(--text-secondary)]">{description}</p>

          <div className="flex flex-wrap gap-2.5">
            <Button variant="inverse" icon="next" iconPosition="right">
              {primaryActionLabel}
            </Button>
            <Button variant="secondary" icon="preview">
              {secondaryActionLabel}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

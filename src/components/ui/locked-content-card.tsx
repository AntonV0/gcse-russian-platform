"use client";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
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
        />
      ) : null}

      <div className="app-surface-brand p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] app-text-soft">
              Access / funnel
            </div>
            <div className="font-semibold text-[var(--text-primary)]">{title}</div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Badge tone="default" icon="info">
              {accessLabel}
            </Badge>
            <Badge tone="warning" icon="pending">
              {statusLabel}
            </Badge>
          </div>
        </div>

        <p className="text-sm app-text-muted">{description}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="inverse" icon="next" iconPosition="right">
            {primaryActionLabel}
          </Button>
          <Button variant="secondary" icon="preview">
            {secondaryActionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

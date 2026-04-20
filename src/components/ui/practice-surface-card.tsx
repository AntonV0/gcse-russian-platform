"use client";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type PracticeSurfaceCardProps = {
  title: string;
  description: string;
  statusLabel?: string;
  themeLabel?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function PracticeSurfaceCard({
  title,
  description,
  statusLabel = "In progress",
  themeLabel = "Theme 2",
  primaryActionLabel = "Start practice",
  secondaryActionLabel = "Back to module",
  className,
}: PracticeSurfaceCardProps) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="PracticeSurfaceCard"
          filePath="src/components/ui/practice-surface-card.tsx"
        />
      ) : null}

      <div className="app-surface p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] app-text-soft">
              Practice flow
            </div>
            <div className="font-semibold text-[var(--text-primary)]">{title}</div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Badge tone="warning" icon="pending">
              {statusLabel}
            </Badge>
            <Badge tone="default" icon="courses">
              {themeLabel}
            </Badge>
          </div>
        </div>

        <p className="text-sm app-text-muted">{description}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="primary" icon="create">
            {primaryActionLabel}
          </Button>
          <Button variant="secondary" icon="back">
            {secondaryActionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

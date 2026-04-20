"use client";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type AssessmentSurfaceCardProps = {
  title: string;
  description: string;
  typeLabel?: string;
  metaLabel?: string;
  urgencyLabel?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function AssessmentSurfaceCard({
  title,
  description,
  typeLabel = "Mock exam",
  metaLabel = "12 questions",
  urgencyLabel = "Timed",
  primaryActionLabel = "Start assessment",
  secondaryActionLabel = "View instructions",
  className,
}: AssessmentSurfaceCardProps) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="AssessmentSurfaceCard"
          filePath="src/components/ui/assessment-surface-card.tsx"
        />
      ) : null}

      <div className="app-surface-muted p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] app-text-soft">
              Assessment
            </div>
            <div className="font-semibold text-[var(--text-primary)]">{title}</div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Badge tone="danger" icon="warning">
              {urgencyLabel}
            </Badge>
            <Badge tone="muted" icon="file">
              {metaLabel}
            </Badge>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          <Badge tone="default" icon="courses">
            {typeLabel}
          </Badge>
        </div>

        <p className="text-sm app-text-muted">{description}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="accent" icon="create">
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

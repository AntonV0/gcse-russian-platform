"use client";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type LessonSurfaceCardProps = {
  title: string;
  description: string;
  levelLabel?: string;
  metaLabel?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function LessonSurfaceCard({
  title,
  description,
  levelLabel = "Higher",
  metaLabel = "6 sections",
  primaryActionLabel = "Open lesson",
  secondaryActionLabel = "Preview content",
  className,
}: LessonSurfaceCardProps) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="LessonSurfaceCard"
          filePath="src/components/ui/lesson-surface-card.tsx"
        />
      ) : null}

      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] app-text-soft">
                Lesson content
              </div>
              <div className="font-semibold text-[var(--text-primary)]">{title}</div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Badge tone="info" icon="preview">
                {levelLabel}
              </Badge>
              <Badge tone="muted" icon="file">
                {metaLabel}
              </Badge>
            </div>
          </div>

          <p className="text-sm app-text-muted">{description}</p>

          <div className="flex flex-wrap gap-3">
            <Button variant="soft" icon="next" iconPosition="right">
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

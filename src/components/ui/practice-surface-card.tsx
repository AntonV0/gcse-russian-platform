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
          tier="semantic"
          componentRole="Student practice flow surface"
          bestFor="Practice activities, question flows, module practice prompts, and student skill-building entry points."
          usageExamples={[
            "Start vocabulary practice",
            "Continue grammar drill",
            "Theme practice card",
            "Module practice entry",
          ]}
          notes="Use for active practice flows. Use LessonSurfaceCard for lesson previews and AssessmentSurfaceCard for exam-style tasks."
        />
      ) : null}

      <Card
        className="border-[color-mix(in_srgb,var(--warning)_16%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--warning)_6%,transparent)_0%,var(--background-elevated)_65%,color-mix(in_srgb,var(--brand-blue)_3%,transparent)_100%)]"
        interactive
      >
        <CardBody className="space-y-4 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                Practice flow
              </div>
              <h3 className="font-semibold leading-6 text-[var(--text-primary)]">
                {title}
              </h3>
            </div>

            <div className="flex shrink-0 flex-wrap justify-end gap-2">
              <Badge tone="warning" icon="pending">
                {statusLabel}
              </Badge>
              <Badge tone="default" icon="courses">
                {themeLabel}
              </Badge>
            </div>
          </div>

          <p className="text-sm leading-6 text-[var(--text-secondary)]">{description}</p>

          <div className="flex flex-wrap gap-2.5">
            <Button variant="primary" icon="create">
              {primaryActionLabel}
            </Button>
            <Button variant="secondary" icon="back">
              {secondaryActionLabel}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

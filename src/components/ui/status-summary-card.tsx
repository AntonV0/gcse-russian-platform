"use client";

import Badge from "@/components/ui/badge";
import Card, { CardBody } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type StatusSummaryCardProps = {
  title: string;
  description: string;
  badgeTone: "default" | "info" | "success" | "warning" | "danger" | "muted";
  badgeLabel: string;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function StatusSummaryCard({
  title,
  description,
  badgeTone,
  badgeLabel,
  className,
}: StatusSummaryCardProps) {
  return (
    <div className="dev-marker-host relative">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="StatusSummaryCard"
          filePath="src/components/ui/status-summary-card.tsx"
          tier="semantic"
          componentRole="Compact status summary card"
          bestFor="Small state explanations, admin readiness cards, review states, progress summaries, and status-led guidance blocks."
          usageExamples={[
            "Publishing ready card",
            "Review required summary",
            "Student progress status",
            "Admin readiness checklist item",
          ]}
          notes="Use when a short description needs a visible status label. For numeric metrics, use SummaryStatCard. For page-level messages, use FeedbackBanner."
        />
      ) : null}

      <Card className={className}>
        <CardBody className="p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0 font-semibold text-[var(--text-primary)]">
              {title}
            </div>
            <Badge tone={badgeTone}>{badgeLabel}</Badge>
          </div>

          <p className="text-sm leading-6 app-text-muted">{description}</p>
        </CardBody>
      </Card>
    </div>
  );
}

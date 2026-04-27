import Badge from "@/components/ui/badge";
import Card, { CardBody } from "@/components/ui/card";
import { DevOnlyComponentMarker } from "@/components/ui/dev-component-marker";
import { Heading, type HeadingLevel } from "@/components/ui/heading";

type StatusSummaryCardProps = {
  title: string;
  description: string;
  badgeTone: "default" | "info" | "success" | "warning" | "danger" | "muted";
  badgeLabel: string;
  headingLevel?: HeadingLevel;
  className?: string;
};

export default function StatusSummaryCard({
  title,
  description,
  badgeTone,
  badgeLabel,
  headingLevel = 3,
  className,
}: StatusSummaryCardProps) {
  return (
    <div className="dev-marker-host relative">
      <DevOnlyComponentMarker
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

      <Card className={className}>
        <CardBody className="p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <Heading level={headingLevel} className="min-w-0 app-heading-card">
              {title}
            </Heading>
            <Badge tone={badgeTone}>{badgeLabel}</Badge>
          </div>

          <p className="app-text-body-muted">{description}</p>
        </CardBody>
      </Card>
    </div>
  );
}

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
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
          tier="semantic"
          componentRole="Assessment and exam-style task surface"
          bestFor="Mock exams, timed assessments, exam-style question sets, and higher-stakes student tasks."
          usageExamples={[
            "Mock exam entry card",
            "Timed assessment prompt",
            "Exam-style question set",
            "Speaking or writing assessment",
          ]}
          notes="Use when the task has exam/assessment weight. Avoid using it for casual practice or normal lesson previews."
        />
      ) : null}

      <Card
        className="border-[var(--danger-border)] bg-[var(--danger-surface)]"
        interactive
      >
        <CardBody className="space-y-4 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                Assessment
              </div>
              <h3 className="font-semibold leading-6 text-[var(--text-primary)]">
                {title}
              </h3>
            </div>

            <div className="flex shrink-0 flex-wrap justify-end gap-2">
              <Badge tone="danger" icon="warning">
                {urgencyLabel}
              </Badge>
              <Badge tone="muted" icon="file">
                {metaLabel}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge tone="default" icon="courses">
              {typeLabel}
            </Badge>
          </div>

          <p className="text-sm leading-6 text-[var(--text-secondary)]">{description}</p>

          <div className="flex flex-wrap gap-2.5">
            <Button variant="accent" icon="create">
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

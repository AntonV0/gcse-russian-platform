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
          tier="semantic"
          componentRole="Student lesson entry surface"
          bestFor="Lesson previews, module lesson cards, student course content cards, and lesson entry points."
          usageExamples={[
            "Student module lesson card",
            "Course lesson preview",
            "Recommended next lesson",
            "Lesson content overview",
          ]}
          notes="Use for lesson entry/preview surfaces. Avoid using it for practice flows, assessments, or locked access prompts."
        />
      ) : null}

      <Card
        className="app-section-tone-student"
        interactive
      >
        <CardBody className="space-y-4 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-1 app-text-meta">
                Lesson content
              </div>
              <h3 className="app-heading-card">
                {title}
              </h3>
            </div>

            <div className="flex shrink-0 flex-wrap justify-end gap-2">
              <Badge tone="info" icon="preview">
                {levelLabel}
              </Badge>
              <Badge tone="muted" icon="file">
                {metaLabel}
              </Badge>
            </div>
          </div>

          <p className="app-text-body-muted">{description}</p>

          <div className="flex flex-wrap gap-2.5">
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

import { STATUS_BADGE_EXAMPLES } from "@/components/admin/ui-lab-feedback-data";
import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import Card, { CardBody } from "@/components/ui/card";
import StatusBadge from "@/components/ui/status-badge";

const CARD_TITLE_CLASS = "font-semibold text-[var(--text-primary)]";
const SECTION_HEADING_CLASS = "mb-3 text-sm font-semibold text-[var(--text-primary)]";

function StatusBadgeExampleCard({
  title,
  status,
  description,
}: {
  title: string;
  status: "not_started" | "submitted" | "reviewed" | "returned";
  description: string;
}) {
  return (
    <Card>
      <CardBody className="space-y-3 p-4">
        <div className={CARD_TITLE_CLASS}>{title}</div>
        <StatusBadge status={status} />
        <p className="text-sm app-text-muted">{description}</p>
      </CardBody>
    </Card>
  );
}

function DemoBadgeHierarchy() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="app-card p-4">
        <div className={SECTION_HEADING_CLASS}>Core tones</div>
        <div className="flex flex-wrap gap-3">
          <Badge tone="muted">Muted</Badge>
          <Badge tone="default">Default</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>
      </div>

      <div className="app-card p-4">
        <div className={SECTION_HEADING_CLASS}>With icons</div>
        <div className="flex flex-wrap gap-3">
          <Badge tone="muted" icon="file">
            Draft
          </Badge>
          <Badge tone="info" icon="preview">
            Published
          </Badge>
          <Badge tone="success" icon="completed">
            Complete
          </Badge>
          <Badge tone="warning" icon="pending">
            In progress
          </Badge>
          <Badge tone="danger" icon="warning">
            Needs attention
          </Badge>
          <Badge tone="default" icon="info">
            Selected
          </Badge>
        </div>
      </div>

      <div className="app-card p-4">
        <div className={SECTION_HEADING_CLASS}>Real UI labels</div>
        <div className="flex flex-wrap gap-3">
          <Badge tone="info" icon="preview">
            Higher only
          </Badge>
          <Badge tone="default" icon="courses">
            Theme 1
          </Badge>
          <Badge tone="muted" icon="file">
            6 blocks
          </Badge>
          <Badge tone="success" icon="completed">
            Marked
          </Badge>
        </div>
      </div>
    </div>
  );
}

function DemoHighEmphasisBadges() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="app-card p-4">
        <div className={SECTION_HEADING_CLASS}>Access + availability</div>
        <div className="flex flex-wrap gap-3">
          <Badge tone="info" icon="preview">
            Trial access
          </Badge>
          <Badge tone="default" icon="courses">
            Foundation
          </Badge>
          <Badge tone="warning" icon="pending">
            Limited
          </Badge>
        </div>
      </div>

      <div className="app-card p-4">
        <div className={SECTION_HEADING_CLASS}>Student progress moments</div>
        <div className="flex flex-wrap gap-3">
          <Badge tone="success" icon="completed">
            Marked correct
          </Badge>
          <Badge tone="warning" icon="pending">
            Needs revision
          </Badge>
          <Badge tone="danger" icon="warning">
            Missing work
          </Badge>
        </div>
      </div>

      <div className="app-card p-4">
        <div className={SECTION_HEADING_CLASS}>Publishing + workflow</div>
        <div className="flex flex-wrap gap-3">
          <Badge tone="muted" icon="file">
            Draft
          </Badge>
          <Badge tone="info" icon="preview">
            Ready to publish
          </Badge>
          <Badge tone="success" icon="completed">
            Live now
          </Badge>
        </div>
      </div>
    </div>
  );
}

function DemoDarkSurfaceBadges() {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(135deg,var(--dark-surface-elevated)_0%,var(--dark-surface-muted)_100%)] p-5 shadow-[0_14px_30px_rgba(16,32,51,0.22)]">
      <div className="mb-3 text-sm font-semibold text-white">
        Dark-surface badge check
      </div>
      <div className="flex flex-wrap gap-3">
        <Badge tone="muted" icon="file">
          Draft
        </Badge>
        <Badge tone="default" icon="info">
          Selected
        </Badge>
        <Badge tone="info" icon="preview">
          Published
        </Badge>
        <Badge tone="success" icon="completed">
          Complete
        </Badge>
        <Badge tone="warning" icon="pending">
          Waiting
        </Badge>
        <Badge tone="danger" icon="warning">
          Blocked
        </Badge>
      </div>
    </div>
  );
}

export function UiLabFeedbackBadgeSections() {
  return (
    <>
      <UiLabSection
        id="badges"
        title="Badge hierarchy"
        description="Use badges for compact state, metadata, and short semantic emphasis. They should feel more polished than plain labels, but less dominant than buttons."
      >
        <DemoBadgeHierarchy />
      </UiLabSection>

      <UiLabSection
        title="High-emphasis badge usage"
        description="These examples show where badges should stand out more because they communicate access, urgency, or progression at a glance."
      >
        <DemoHighEmphasisBadges />
      </UiLabSection>

      <UiLabSection
        id="status-badges"
        title="Status badge mappings"
        description="Use StatusBadge where the underlying state is semantic and repeatable, so pages do not have to reimplement label and tone logic."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STATUS_BADGE_EXAMPLES.map((example) => (
            <StatusBadgeExampleCard
              key={example.status}
              title={example.title}
              status={example.status}
              description={example.description}
            />
          ))}
        </div>
      </UiLabSection>

      <UiLabSection
        title="Badges on darker surfaces"
        description="This section helps validate contrast when badges sit inside darker cards, dashboards, or high-emphasis surfaces."
      >
        <DemoDarkSurfaceBadges />
      </UiLabSection>
    </>
  );
}

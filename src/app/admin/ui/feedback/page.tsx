import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { appIcons } from "@/lib/shared/icons";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import EmptyState from "@/components/ui/empty-state";
import Button from "@/components/ui/button";
import AppIcon from "@/components/ui/app-icon";
import Card, { CardBody } from "@/components/ui/card";

function FeedbackBanner({
  tone,
  title,
  description,
}: {
  tone: "info" | "success" | "warning" | "danger";
  title: string;
  description: string;
}) {
  const styles = {
    info: {
      wrapper:
        "border-[color:rgba(37,99,235,0.18)] bg-[var(--info-soft)] text-[var(--info)]",
      icon: "info",
    },
    success: {
      wrapper:
        "border-[color:rgba(31,138,76,0.18)] bg-[var(--success-soft)] text-[var(--success)]",
      icon: "completed",
    },
    warning: {
      wrapper:
        "border-[color:rgba(183,121,31,0.18)] bg-[var(--warning-soft)] text-[var(--warning)]",
      icon: "warning",
    },
    danger: {
      wrapper:
        "border-[color:rgba(194,59,59,0.18)] bg-[var(--danger-soft)] text-[var(--danger)]",
      icon: "alert",
    },
  } as const;

  const style = styles[tone];

  return (
    <div className={`rounded-2xl border px-4 py-4 ${style.wrapper}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <AppIcon icon={style.icon} size={18} />
        </div>

        <div className="min-w-0">
          <div className="font-semibold">{title}</div>
          <p className="mt-1 text-sm opacity-90">{description}</p>
        </div>
      </div>
    </div>
  );
}

function StatusSummaryCard({
  title,
  description,
  badgeTone,
  badgeLabel,
}: {
  title: string;
  description: string;
  badgeTone: "default" | "info" | "success" | "warning" | "danger" | "muted";
  badgeLabel: string;
}) {
  return (
    <Card>
      <CardBody className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="font-semibold text-[var(--text-primary)]">{title}</div>
          <Badge tone={badgeTone}>{badgeLabel}</Badge>
        </div>

        <p className="text-sm app-text-muted">{description}</p>
      </CardBody>
    </Card>
  );
}

export default async function AdminUiFeedbackPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Feedback"
      description="Compare badges, banners, alerts, empty states, and status messaging patterns used across the platform."
      currentPath="/admin/ui/feedback"
    >
      <UiLabSection
        title="Status badges"
        description="Use badges for compact states, visibility, and metadata. Keep labels short and consistent."
      >
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
      </UiLabSection>

      <UiLabSection
        title="Banner patterns"
        description="Use banners for page-level feedback, save results, warnings, or important next-step guidance."
      >
        <div className="space-y-4">
          <FeedbackBanner
            tone="info"
            title="Informational update"
            description="This lesson is visible to Higher students only and includes shared sections linked by canonical key."
          />
          <FeedbackBanner
            tone="success"
            title="Changes saved"
            description="Your course settings were updated successfully and are now available across the platform."
          />
          <FeedbackBanner
            tone="warning"
            title="Still in progress"
            description="Some lesson sections are still unpublished, so students will not see them yet."
          />
          <FeedbackBanner
            tone="danger"
            title="Action needed"
            description="A required field is missing. Review the section metadata before publishing."
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Empty states"
        description="Empty states should explain what is missing, why it matters, and what the next useful action is."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <EmptyState
            title="No modules yet"
            description="Create your first module to start structuring this course variant."
            icon="courses"
            action={
              <Button variant="primary" icon="create">
                Add module
              </Button>
            }
          />

          <EmptyState
            title="No assignments to review"
            description="Once students submit work, it will appear here for marking and feedback."
            icon="assignments"
            action={
              <Button variant="secondary" icon="search">
                View submissions
              </Button>
            }
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Status summary cards"
        description="Use these when a page needs more context than a badge alone can provide."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatusSummaryCard
            title="Publishing"
            description="Use when content is ready for students."
            badgeTone="info"
            badgeLabel="Published"
          />
          <StatusSummaryCard
            title="Progress"
            description="Use when work is still being built or reviewed."
            badgeTone="warning"
            badgeLabel="In progress"
          />
          <StatusSummaryCard
            title="Completion"
            description="Use when a workflow or task is fully done."
            badgeTone="success"
            badgeLabel="Complete"
          />
          <StatusSummaryCard
            title="Attention"
            description="Use sparingly for problems that block progress."
            badgeTone="danger"
            badgeLabel="Required"
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Guidance"
        description="These rules keep feedback patterns consistent across admin and platform pages."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardBody className="p-4">
              <div className="mb-2 font-semibold text-[var(--text-primary)]">
                Prefer badges for compact state
              </div>
              <p className="text-sm app-text-muted">
                Use badges inside cards, tables, and list items where space is limited.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-2 font-semibold text-[var(--text-primary)]">
                Use banners for page-level messaging
              </div>
              <p className="text-sm app-text-muted">
                Save results, warnings, and important guidance should be easier to notice
                than a badge.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-2 font-semibold text-[var(--text-primary)]">
                Empty states need a next action
              </div>
              <p className="text-sm app-text-muted">
                Avoid dead ends. Give users a clear first step wherever possible.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-2 font-semibold text-[var(--text-primary)]">
                Reserve danger for real blockers
              </div>
              <p className="text-sm app-text-muted">
                Overusing destructive colour weakens hierarchy and makes interfaces feel
                noisy.
              </p>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}

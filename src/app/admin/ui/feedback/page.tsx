import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { appIcons } from "@/lib/shared/icons";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import EmptyState from "@/components/ui/empty-state";
import Button from "@/components/ui/button";
import AppIcon from "@/components/ui/app-icon";

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
      icon: appIcons.info,
    },
    success: {
      wrapper:
        "border-[color:rgba(31,138,76,0.18)] bg-[var(--success-soft)] text-[var(--success)]",
      icon: appIcons.completed,
    },
    warning: {
      wrapper:
        "border-[color:rgba(183,121,31,0.18)] bg-[var(--warning-soft)] text-[var(--warning)]",
      icon: appIcons.warning,
    },
    danger: {
      wrapper:
        "border-[color:rgba(194,59,59,0.18)] bg-[var(--danger-soft)] text-[var(--danger)]",
      icon: appIcons.alert,
    },
  } as const;

  const style = styles[tone];

  return (
    <div className={`rounded-xl border p-4 ${style.wrapper}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <AppIcon icon={style.icon} size={18} />
        </div>

        <div>
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
  badgeTone: "info" | "success" | "warning" | "danger" | "muted";
  badgeLabel: string;
}) {
  return (
    <div className="app-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="font-semibold text-[var(--text-primary)]">{title}</div>
        <Badge tone={badgeTone}>{badgeLabel}</Badge>
      </div>

      <p className="text-sm app-text-muted">{description}</p>
    </div>
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
        <div className="flex flex-wrap gap-2">
          <Badge tone="muted" icon={appIcons.file}>
            Draft
          </Badge>
          <Badge tone="info" icon={appIcons.preview}>
            Published
          </Badge>
          <Badge tone="success" icon={appIcons.completed}>
            Complete
          </Badge>
          <Badge tone="warning" icon={appIcons.pending}>
            In progress
          </Badge>
          <Badge tone="danger" icon={appIcons.alert}>
            Action needed
          </Badge>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Feedback banners"
        description="Use banners for important page-level feedback after actions such as save, publish, validation, or review workflows."
      >
        <div className="space-y-3">
          <FeedbackBanner
            tone="info"
            title="Draft updated"
            description="Your content changes were saved successfully and are visible in the admin workspace."
          />

          <FeedbackBanner
            tone="success"
            title="Lesson published"
            description="The lesson is now available to students with the correct access permissions."
          />

          <FeedbackBanner
            tone="warning"
            title="Some sections still need review"
            description="One or more lesson sections are incomplete or still in draft state."
          />

          <FeedbackBanner
            tone="danger"
            title="Publishing failed"
            description="Please check required fields and try again before publishing this item."
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Summary cards with feedback states"
        description="These are useful for dashboards, admin overviews, and progress summaries."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatusSummaryCard
            title="Course status"
            description="This course is visible and active for learners."
            badgeTone="success"
            badgeLabel="Published"
          />

          <StatusSummaryCard
            title="Lesson builder"
            description="This lesson is still being edited and needs final checks."
            badgeTone="warning"
            badgeLabel="In progress"
          />

          <StatusSummaryCard
            title="Assignments"
            description="A teacher review action is required before students can continue."
            badgeTone="danger"
            badgeLabel="Attention"
          />

          <StatusSummaryCard
            title="Resources"
            description="Additional support materials can be added later."
            badgeTone="muted"
            badgeLabel="Optional"
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Empty states"
        description="Empty states should be helpful, calm, and action-oriented rather than feeling like dead ends."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <EmptyState
            title="No lessons yet"
            description="Create your first lesson to start building out this module."
            action={
              <Button variant="primary" icon={appIcons.create}>
                Add lesson
              </Button>
            }
          />

          <EmptyState
            title="No results match your filters"
            description="Try adjusting your filters or search terms to broaden the results."
            action={
              <Button variant="secondary" icon={appIcons.refresh}>
                Reset filters
              </Button>
            }
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Action confirmation patterns"
        description="Destructive and important actions should feel intentional, not alarming by default."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="app-card p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Publish flow</h3>
              <p className="mt-1 text-sm app-text-muted">
                Example of a safe action with clear confirmation messaging.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-4 text-sm app-text-muted">
              This lesson is ready to publish. Students with access will be able to open
              it once you continue.
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary" icon={appIcons.preview}>
                Publish lesson
              </Button>
              <Button variant="secondary" icon={appIcons.back}>
                Cancel
              </Button>
            </div>
          </div>

          <div className="app-card p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Delete flow</h3>
              <p className="mt-1 text-sm app-text-muted">
                Example of a destructive action that still stays readable and controlled.
              </p>
            </div>

            <div className="rounded-xl border border-[color:rgba(194,59,59,0.18)] bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger)]">
              Deleting this lesson will remove it from this module and may affect linked
              progress and admin workflows.
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="danger" icon={appIcons.delete}>
                Delete lesson
              </Button>
              <Button variant="secondary" icon={appIcons.back}>
                Keep lesson
              </Button>
            </div>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Readiness"
        description="A quick summary of where feedback patterns feel strong and where future refinement would help."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon={appIcons.completed} size={18} className="app-brand-text" />
              <div className="font-semibold">Strong already</div>
            </div>
            <div className="space-y-1 text-sm app-text-muted">
              <p>Status badges</p>
              <p>Basic action states</p>
              <p>Neutral empty-state structure</p>
            </div>
          </div>

          <div className="app-card p-4">
            <div className="mb-2">
              <Badge tone="warning">Needs refinement</Badge>
            </div>
            <div className="space-y-1 text-sm app-text-muted">
              <p>Standardized feedback banners</p>
              <p>Helper text consistency</p>
              <p>Admin confirmation copy patterns</p>
            </div>
          </div>

          <div className="app-card p-4">
            <div className="mb-2">
              <Badge tone="muted">Future additions</Badge>
            </div>
            <div className="space-y-1 text-sm app-text-muted">
              <p>Toast notifications</p>
              <p>Inline validation summaries</p>
              <p>Autosave / sync state indicators</p>
            </div>
          </div>
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}

import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import EmptyState from "@/components/ui/empty-state";
import Button from "@/components/ui/button";
import AppIcon from "@/components/ui/app-icon";
import Card, { CardBody } from "@/components/ui/card";
import StatusBadge from "@/components/ui/status-badge";

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
        "border-[color:rgba(37,99,235,0.18)] bg-[var(--info-soft)] text-[var(--info)] [data-theme='dark']:&:border-[rgba(118,167,255,0.2)] [data-theme='dark']:&:bg-[linear-gradient(135deg,rgba(118,167,255,0.22)_0%,rgba(23,42,70,0.98)_100%)] [data-theme='dark']:&:text-[#dce9ff]",
      icon: "info",
    },
    success: {
      wrapper:
        "border-[color:rgba(31,138,76,0.18)] bg-[var(--success-soft)] text-[var(--success)] [data-theme='dark']:&:border-[rgba(34,197,94,0.22)] [data-theme='dark']:&:bg-[linear-gradient(135deg,rgba(34,197,94,0.18)_0%,rgba(16,46,31,0.96)_100%)] [data-theme='dark']:&:text-[#86efac]",
      icon: "completed",
    },
    warning: {
      wrapper:
        "border-[color:rgba(183,121,31,0.18)] bg-[var(--warning-soft)] text-[var(--warning)] [data-theme='dark']:&:border-[rgba(245,158,11,0.24)] [data-theme='dark']:&:bg-[linear-gradient(135deg,rgba(245,158,11,0.18)_0%,rgba(61,38,10,0.96)_100%)] [data-theme='dark']:&:text-[#fbbf24]",
      icon: "warning",
    },
    danger: {
      wrapper:
        "border-[color:rgba(194,59,59,0.18)] bg-[var(--danger-soft)] text-[var(--danger)] [data-theme='dark']:&:border-[rgba(239,68,68,0.22)] [data-theme='dark']:&:bg-[linear-gradient(135deg,rgba(239,68,68,0.18)_0%,rgba(66,22,28,0.96)_100%)] [data-theme='dark']:&:text-[#fca5a5]",
      icon: "alert",
    },
  } as const;

  const style = styles[tone];

  return (
    <div
      className={`rounded-2xl border px-4 py-4 shadow-[0_8px_20px_rgba(16,32,51,0.05)] ${style.wrapper}`}
    >
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
        title="Badge hierarchy"
        description="Use badges for compact state, metadata, and short semantic emphasis. They should feel more polished than plain labels, but less dominant than buttons."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="app-card p-4">
            <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              Core tones
            </div>
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
            <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              With icons
            </div>
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
            <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              Real UI labels
            </div>
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
      </UiLabSection>

      <UiLabSection
        title="Status badge mappings"
        description="Use StatusBadge where the underlying state is semantic and repeatable, so pages do not have to reimplement label and tone logic."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardBody className="space-y-3 p-4">
              <div className="font-semibold text-[var(--text-primary)]">Not started</div>
              <StatusBadge status="not_started" />
              <p className="text-sm app-text-muted">Default state before work begins.</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3 p-4">
              <div className="font-semibold text-[var(--text-primary)]">Submitted</div>
              <StatusBadge status="submitted" />
              <p className="text-sm app-text-muted">Use for work waiting on review.</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3 p-4">
              <div className="font-semibold text-[var(--text-primary)]">Reviewed</div>
              <StatusBadge status="reviewed" />
              <p className="text-sm app-text-muted">
                Use when a marking workflow is done.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3 p-4">
              <div className="font-semibold text-[var(--text-primary)]">Returned</div>
              <StatusBadge status="returned" />
              <p className="text-sm app-text-muted">
                Use when feedback has gone back to the student.
              </p>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Badges on darker surfaces"
        description="This section helps validate contrast when badges sit inside darker cards, dashboards, or high-emphasis surfaces."
      >
        <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(135deg,#0b1a30_0%,#142742_100%)] p-5 shadow-[0_14px_30px_rgba(16,32,51,0.22)]">
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
        <div className="space-y-6">
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

          <div className="grid gap-4 xl:grid-cols-2">
            <EmptyState
              title="No vocabulary matches your search"
              description="Try a broader keyword, remove one of the active filters, or switch to another theme."
              icon="search"
              action={
                <Button variant="secondary" icon="refresh">
                  Reset filters
                </Button>
              }
            />

            <EmptyState
              title="No uploaded work yet"
              description="Students can upload speaking recordings, written answers, and revision tasks here."
              icon="upload"
              action={
                <Button variant="soft" icon="next" iconPosition="right">
                  View upload guide
                </Button>
              }
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <EmptyState
              title="Start your first lesson"
              description="There is no progress yet. Open a lesson to begin building your revision streak."
              icon="next"
              action={
                <Button variant="primary" icon="create">
                  Begin revision
                </Button>
              }
            />

            <EmptyState
              title="Higher tier content locked"
              description="This section is available only to Higher students or users with upgraded access."
              icon="lock"
              action={
                <Button variant="accent" icon="next" iconPosition="right">
                  Unlock access
                </Button>
              }
            />

            <EmptyState
              title="Could not load submissions"
              description="Something went wrong while loading this area. Try refreshing or come back in a moment."
              icon="alert"
              action={
                <Button variant="secondary" icon="refresh">
                  Retry
                </Button>
              }
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <EmptyState
              title="No mock exams scheduled"
              description="Create a mock exam window to give students a timed practice session and markable submission flow."
              icon="calendar"
              action={
                <Button variant="primary" icon="create">
                  Schedule mock exam
                </Button>
              }
            />

            <EmptyState
              title="No messages yet"
              description="Teacher notes, feedback updates, and revision reminders will appear here once the course is active."
              icon="chat"
              action={
                <Button variant="quiet" icon="info">
                  How messaging works
                </Button>
              }
            />
          </div>
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

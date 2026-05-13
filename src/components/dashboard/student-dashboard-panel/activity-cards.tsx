import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import type {
  StudentDashboardAction,
  StudentDashboardActivity,
  StudentDashboardFeedbackItem,
  StudentDashboardMockAttemptItem,
  StudentDashboardWin,
} from "@/lib/dashboard/student-next-actions";

import { formatDueDate, formatShortDate, getFeedbackPreview } from "./formatting";

export function NextActionQueueCard({
  actions,
}: {
  actions: StudentDashboardAction[];
}) {
  return (
    <DashboardCard title="Next actions" headingLevel={3} className="h-full">
      <div className="space-y-3">
        {actions.slice(0, 4).map((action, index) => (
          <ActionRow key={action.id} action={action} index={index} />
        ))}
      </div>
    </DashboardCard>
  );
}

function ActionRow({
  action,
  index,
}: {
  action: StudentDashboardAction;
  index: number;
}) {
  return (
    <div className="app-tactile-row rounded-xl border p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--text-secondary)]">
              <AppIcon icon={action.icon} size={15} />
            </span>
            <Badge tone={action.badgeTone} icon={action.icon}>
              {index === 0 ? "Next up" : action.badgeLabel}
            </Badge>
            {action.metaLabel ? <Badge tone="muted">{action.metaLabel}</Badge> : null}
          </div>

          <div className="mt-2 min-w-0">
            <div className="app-heading-card">{action.title}</div>
            <p className="mt-1 line-clamp-2 app-text-body-muted">
              {action.description}
            </p>
          </div>
        </div>

        <Button
          href={action.href}
          variant={index === 0 ? "journey" : "secondary"}
          size="sm"
          icon={action.icon}
          ariaLabel={`${action.label}: ${action.title}`}
          className="w-full sm:w-auto"
        >
          {action.label}
        </Button>
      </div>
    </div>
  );
}

export function RecentWinsCard({ wins }: { wins: StudentDashboardWin[] }) {
  return (
    <DashboardCard title="Recent wins" headingLevel={3} className="h-full">
      <div className="space-y-3">
        {wins.map((win) => (
          <div key={win.id} className="app-tactile-row rounded-xl border p-3">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--success-surface)] text-[var(--success-text)]">
                <AppIcon icon={win.icon} size={16} />
              </span>
              <div className="min-w-0">
                <Badge tone={win.badgeTone} icon={win.icon}>
                  {win.badgeLabel}
                </Badge>
                <div className="mt-2 app-heading-card">{win.title}</div>
                <p className="mt-1 app-text-body-muted">{win.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function RecentFeedbackCard({
  feedbackItems,
}: {
  feedbackItems: StudentDashboardFeedbackItem[];
}) {
  if (feedbackItems.length === 0) {
    return (
      <DashboardCard title="Recent feedback" headingLevel={3} className="h-full">
        <DashboardEmptyBlock
          icon="feedback"
          title="No new feedback yet"
          description="Reviewed assignments and marked mock attempts will appear here when there is something useful to revisit."
          action={
            <Button href="/assignments" variant="secondary" size="sm" icon="assignments">
              Check assignments
            </Button>
          }
        />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Recent feedback" headingLevel={3} className="h-full">
      <div className="space-y-3">
        {feedbackItems.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-[var(--success-border)] bg-[var(--success-surface)] p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="success" icon="feedback">
                {item.badgeLabel}
              </Badge>
              {item.reviewedAt ? (
                <Badge tone="muted">{formatShortDate(item.reviewedAt)}</Badge>
              ) : null}
            </div>

            <div className="mt-2 app-heading-card">{item.title}</div>
            <p className="mt-1 app-text-body-muted">
              {item.feedbackPreview
                ? getFeedbackPreview(item.feedbackPreview)
                : item.description}
            </p>

            <Button
              href={item.href}
              className="mt-3"
              variant="secondary"
              size="sm"
              icon="feedback"
              ariaLabel={`Review feedback for ${item.title}`}
            >
              Review feedback
            </Button>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function AssignmentFocusCard({
  activity,
}: {
  activity: StudentDashboardActivity;
}) {
  const assignmentsToShow = activity.pendingAssignments.slice(0, 3);

  if (assignmentsToShow.length === 0) {
    return (
      <DashboardCard title="Assignments" headingLevel={3} className="h-full">
        <DashboardEmptyBlock
          icon="assignments"
          title={
            activity.stats.submittedAssignments > 0
              ? "Assignments submitted"
              : "No pending assignments"
          }
          description={
            activity.stats.submittedAssignments > 0
              ? "Your submitted work is waiting for review. New teacher-set tasks will appear here."
              : "When your teacher sets work, this panel will become your homework launch point."
          }
          action={
            <Button href="/assignments" variant="secondary" size="sm" icon="assignments">
              Open assignments
            </Button>
          }
        />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Pending assignments" headingLevel={3} className="h-full">
      <div className="space-y-3">
        {assignmentsToShow.map(({ assignment, items }) => (
          <div key={assignment.id} className="app-tactile-row rounded-xl border p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="warning" icon="assignments">
                    To submit
                  </Badge>
                  <Badge tone="muted">{formatDueDate(assignment.due_at)}</Badge>
                </div>
                <div className="mt-2 app-heading-card">{assignment.title}</div>
                <p className="mt-1 app-text-body-muted">
                  {items.length} {items.length === 1 ? "item" : "items"} assigned
                </p>
              </div>

              <Button
                href={`/assignments/${assignment.id}`}
                variant="secondary"
                size="sm"
                icon="assignments"
                ariaLabel={`Open assignment: ${assignment.title}`}
              >
                Open
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function MockAttemptFocusCard({
  activity,
}: {
  activity: StudentDashboardActivity;
}) {
  const attemptsToShow = [
    ...activity.draftMockAttempts,
    ...activity.markedMockAttempts,
  ].slice(0, 3);

  if (attemptsToShow.length === 0) {
    return (
      <DashboardCard title="Mock exams" headingLevel={3} className="h-full">
        <DashboardEmptyBlock
          icon="mockExam"
          title="No unfinished mocks"
          description="Start a GCSE-style mock when you want exam-condition practice; draft attempts will be saved here."
          action={
            <Button href="/mock-exams" variant="secondary" size="sm" icon="mockExam">
              Open mock exams
            </Button>
          }
        />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Mock attempts" headingLevel={3} className="h-full">
      <div className="space-y-3">
        {attemptsToShow.map((item) => (
          <MockAttemptRow key={item.attempt.id} item={item} />
        ))}
      </div>
    </DashboardCard>
  );
}

function MockAttemptRow({ item }: { item: StudentDashboardMockAttemptItem }) {
  const isDraft = item.attempt.status === "draft";

  return (
    <div className="app-tactile-row rounded-xl border p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={isDraft ? "warning" : "success"} icon="mockExam">
              {isDraft ? "Draft" : "Marked"}
            </Badge>
            <Badge tone="muted">
              {item.attempt.awarded_marks ?? "-"} / {item.attempt.total_marks_snapshot}
            </Badge>
          </div>
          <div className="mt-2 app-heading-card">{item.exam.title}</div>
          <p className="mt-1 app-text-body-muted">
            {isDraft
              ? `Started ${formatShortDate(item.attempt.started_at)}`
              : `Submitted ${formatShortDate(item.attempt.submitted_at)}`}
          </p>
        </div>

        <Button
          href={item.href}
          variant="secondary"
          size="sm"
          icon={isDraft ? "next" : "feedback"}
          ariaLabel={`${isDraft ? "Resume" : "Review"} mock attempt: ${item.exam.title}`}
        >
          {isDraft ? "Resume" : "Review"}
        </Button>
      </div>
    </div>
  );
}

function DashboardEmptyBlock({
  icon,
  title,
  description,
  action,
}: {
  icon: StudentDashboardAction["icon"];
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="app-empty-dashed-warm rounded-2xl border px-4 py-6 text-center">
      <div className="mb-4 flex justify-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-elevated)] text-[var(--text-secondary)]">
          <AppIcon icon={icon} size={18} />
        </span>
      </div>
      <div className="app-heading-card">{title}</div>
      <p className="mx-auto mt-2 max-w-[24rem] app-text-body-muted">{description}</p>
      <div className="mt-5 flex justify-center">{action}</div>
    </div>
  );
}

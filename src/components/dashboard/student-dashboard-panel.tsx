import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getDashboardAccessLabel,
  getDashboardNextStep,
  getDashboardProgressMessage,
  getDashboardVariantLabel,
  type StudentLearningPlan,
} from "@/lib/dashboard/learning-plan";
import {
  getStudentDashboardActionQueue,
  type StudentDashboardAction,
  type StudentDashboardActivity,
  type StudentDashboardFeedbackItem,
  type StudentDashboardMockAttemptItem,
} from "@/lib/dashboard/student-next-actions";

type DashboardNextStep = ReturnType<typeof getDashboardNextStep>;

export function StudentDashboardPanel({
  dashboard,
  completedLessons,
  learningPlan,
  nextStep,
  activity,
}: {
  dashboard: DashboardInfo;
  completedLessons: number;
  learningPlan: StudentLearningPlan;
  nextStep: DashboardNextStep;
  activity: StudentDashboardActivity;
}) {
  const nextActions = getStudentDashboardActionQueue(activity, nextStep);
  const primaryAction = nextActions[0];

  return (
    <>
      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] xl:items-start">
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge tone="info" icon="school">
                  GCSE Russian
                </Badge>

                <Badge tone="muted" icon="learning">
                  {getDashboardVariantLabel(dashboard.variant)}
                </Badge>

                <Badge tone="muted" icon="student">
                  {getDashboardAccessLabel(dashboard.accessMode)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge tone={primaryAction.badgeTone} icon={primaryAction.icon}>
                    {primaryAction.badgeLabel}
                  </Badge>
                  {primaryAction.metaLabel ? (
                    <Badge tone="muted">{primaryAction.metaLabel}</Badge>
                  ) : null}
                </div>

                <h2 className="app-heading-hero max-w-3xl">{primaryAction.title}</h2>
                <p className="app-subtitle max-w-2xl">{primaryAction.description}</p>
              </div>
            </div>

            <div className="app-mobile-action-stack flex flex-wrap gap-3">
              <Button
                href={primaryAction.href}
                variant="primary"
                icon={primaryAction.icon}
              >
                {primaryAction.label}
              </Button>

              {primaryAction.href !== nextStep.href ? (
                <Button href={nextStep.href} variant="secondary" icon={nextStep.icon}>
                  {nextStep.label}
                </Button>
              ) : null}

              <Button href="/mock-exams" variant="secondary" icon="mockExam">
                Mock exams
              </Button>
            </div>
          </div>

          <LearningSnapshotCard
            dashboard={dashboard}
            completedLessons={completedLessons}
            learningPlan={learningPlan}
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryStatCard
          title="Lessons complete"
          value={learningPlan.completedLessons}
          description={
            learningPlan.totalLessons > 0
              ? `${learningPlan.progressPercent}% of your path`
              : "Ready when content opens"
          }
          icon="completed"
          tone="brand"
          compact
        />
        <SummaryStatCard
          title="Assignments"
          value={activity.stats.pendingAssignments}
          description="waiting to start"
          icon="assignments"
          tone={activity.stats.pendingAssignments > 0 ? "warning" : "default"}
          compact
        />
        <SummaryStatCard
          title="Draft mocks"
          value={activity.stats.draftMockAttempts}
          description="unfinished attempts"
          icon="mockExam"
          tone={activity.stats.draftMockAttempts > 0 ? "warning" : "default"}
          compact
        />
        <SummaryStatCard
          title="Feedback"
          value={activity.stats.recentFeedback}
          description="recent reviews"
          icon="feedback"
          tone={activity.stats.recentFeedback > 0 ? "success" : "default"}
          compact
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <NextActionQueueCard actions={nextActions} />
        <RecentFeedbackCard feedbackItems={activity.recentFeedback} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <AssignmentFocusCard activity={activity} />
        <MockAttemptFocusCard activity={activity} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardLinkCard
          title="Course path"
          href="/courses"
          linkLabel="Open courses"
          description="Continue lessons in order and keep your GCSE Russian progress moving."
        />
        <DashboardLinkCard
          title="Grammar reference"
          href="/grammar"
          linkLabel="Open grammar"
          description="Check grammar explanations, sentence patterns, and exam-useful rules."
        />
        <DashboardLinkCard
          title="Exam practice"
          href="/mock-exams"
          linkLabel="Open mock exams"
          description="Resume draft attempts, review marked work, or start a new GCSE-style mock."
        />
      </section>

      <StudentSupportCard accessMode={dashboard.accessMode} />
    </>
  );
}

function LearningSnapshotCard({
  dashboard,
  completedLessons,
  learningPlan,
}: {
  dashboard: DashboardInfo;
  completedLessons: number;
  learningPlan: StudentLearningPlan;
}) {
  const completedLessonCount =
    learningPlan.totalLessons > 0 ? learningPlan.completedLessons : completedLessons;

  return (
    <DashboardCard title="Learning snapshot" headingLevel={3} className="h-full">
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-[var(--text-primary)]">
              {learningPlan.progressPercent}% complete
            </span>
            <span className="app-text-muted">
              {completedLessonCount} of {learningPlan.totalLessons || "-"}
            </span>
          </div>
          <div className="app-progress-track">
            <div
              className="app-progress-bar"
              style={{ width: `${learningPlan.progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid gap-3">
          <div className="app-stat-tile">
            <div className="app-stat-label">Completed lessons</div>
            <div className="app-stat-value">{String(completedLessonCount)}</div>
          </div>

          <div className="app-stat-tile">
            <div className="app-stat-label">Next lesson</div>
            <div className="app-stat-value">
              {learningPlan.nextLesson?.title ?? "Choose a lesson"}
            </div>
          </div>

          <div className="app-stat-tile">
            <div className="app-stat-label">Study time</div>
            <div className="app-stat-value">
              {learningPlan.nextLesson?.estimatedMinutes
                ? `${learningPlan.nextLesson.estimatedMinutes} min`
                : "Self-paced"}
            </div>
          </div>
        </div>

        <p className="text-sm app-text-muted">
          {getDashboardProgressMessage(dashboard.accessMode, completedLessonCount)}
        </p>
      </div>
    </DashboardCard>
  );
}

function NextActionQueueCard({ actions }: { actions: StudentDashboardAction[] }) {
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

function ActionRow({ action, index }: { action: StudentDashboardAction; index: number }) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3">
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
            <p className="mt-1 line-clamp-2 app-text-body-muted">{action.description}</p>
          </div>
        </div>

        <Button
          href={action.href}
          variant={index === 0 ? "primary" : "secondary"}
          size="sm"
          icon={action.icon}
        >
          {action.label}
        </Button>
      </div>
    </div>
  );
}

function RecentFeedbackCard({
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
            className="rounded-2xl border border-[var(--success-border)] bg-[var(--success-surface)] p-3"
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

            <Link
              href={item.href}
              className="mt-3 inline-flex items-center gap-2 font-medium app-brand-text"
            >
              Review feedback
              <AppIcon icon="next" size={14} />
            </Link>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

function AssignmentFocusCard({ activity }: { activity: StudentDashboardActivity }) {
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
          <div
            key={assignment.id}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3"
          >
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

function MockAttemptFocusCard({ activity }: { activity: StudentDashboardActivity }) {
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
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3">
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
        >
          {isDraft ? "Resume" : "Review"}
        </Button>
      </div>
    </div>
  );
}

function DashboardLinkCard({
  title,
  description,
  href,
  linkLabel,
}: {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <DashboardCard title={title}>
      <div className="space-y-3">
        <p>{description}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 font-medium app-brand-text"
        >
          {linkLabel}
          <AppIcon icon="next" size={14} />
        </Link>
      </div>
    </DashboardCard>
  );
}

function StudentSupportCard({ accessMode }: { accessMode: DashboardInfo["accessMode"] }) {
  return (
    <DashboardCard title={accessMode === "volna" ? "Assignments" : "Live support"}>
      <div className="space-y-3">
        {accessMode === "volna" ? (
          <>
            <p>
              Your Volna student area includes teacher-led assignments and guided support.
            </p>

            <Link
              href="/assignments"
              className="inline-flex items-center gap-2 font-medium app-brand-text"
            >
              View assignments
              <AppIcon icon="next" size={14} />
            </Link>
          </>
        ) : (
          <>
            <p>
              Looking for live support as well as self-study? Explore Volna School&apos;s
              online GCSE Russian classes.
            </p>

            <Link
              href="/online-classes"
              className="inline-flex items-center gap-2 font-medium app-brand-text"
            >
              Explore online classes
              <AppIcon icon="next" size={14} />
            </Link>
          </>
        )}
      </div>
    </DashboardCard>
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
    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-6 text-center">
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

function formatShortDate(value: string | null) {
  if (!value) return "Recently";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function formatDueDate(value: string | null) {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function getFeedbackPreview(value: string) {
  const trimmed = value.trim();

  if (trimmed.length <= 110) return trimmed;

  return `${trimmed.slice(0, 107)}...`;
}

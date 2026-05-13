import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getDashboardProgressMessage,
  type StudentLearningPlan,
} from "@/lib/dashboard/learning-plan";
import {
  getLearningMilestone,
  type MasterySignal,
} from "@/lib/dashboard/mastery-signals";
import type {
  StudentDashboardAction,
  StudentDashboardStudyPrompt,
} from "@/lib/dashboard/student-next-actions";

export function TodayFocusSteps({
  action,
  prompts,
}: {
  action: StudentDashboardAction;
  prompts: StudentDashboardStudyPrompt[];
}) {
  return (
    <div className="grid gap-2 rounded-2xl border border-[var(--surface-accent-border)] bg-[var(--surface-accent-bg)] p-3 text-sm shadow-[var(--surface-accent-shadow)] sm:grid-cols-3">
      <FocusStep index={1} title="Start" description={action.label} icon={action.icon} />
      <FocusStep
        index={2}
        title="Recall"
        description={prompts[0]?.label ?? "Practice vocabulary"}
        icon="vocabulary"
      />
      <FocusStep
        index={3}
        title="Review"
        description={prompts[1]?.label ?? "Open grammar"}
        icon="grammar"
      />
    </div>
  );
}

function FocusStep({
  index,
  title,
  description,
  icon,
}: {
  index: number;
  title: string;
  description: string;
  icon: StudentDashboardAction["icon"];
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl bg-[var(--background-elevated)]/80 p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--accent-ink)]">
        <AppIcon icon={icon} size={16} />
      </span>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase text-[var(--text-secondary)]">
          {index}. {title}
        </div>
        <div className="truncate font-semibold text-[var(--text-primary)]">
          {description}
        </div>
      </div>
    </div>
  );
}

export function AccessFocusCard({ dashboard }: { dashboard: DashboardInfo }) {
  const accessCopy = getAccessFocusCopy(dashboard);

  return (
    <DashboardCard title={accessCopy.title} headingLevel={3}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between xl:flex-col">
        <p>{accessCopy.description}</p>
        <Button
          href={accessCopy.href}
          variant="secondary"
          size="sm"
          icon={accessCopy.icon}
          className="w-full sm:w-auto"
        >
          {accessCopy.label}
        </Button>
      </div>
    </DashboardCard>
  );
}

function getAccessFocusCopy(dashboard: DashboardInfo) {
  if (dashboard.accessMode === "trial") {
    return {
      title: "Trial focus",
      description:
        "Use this trial to test lessons, vocabulary, grammar, and exam practice before choosing the right long-term route.",
      href: "/account/billing",
      label: "Review options",
      icon: "billing" as const,
    };
  }

  if (dashboard.accessMode === "volna") {
    return {
      title: "Volna focus",
      description:
        "Balance your teacher-led assignments with the next lesson so classwork and independent practice stay connected.",
      href: "/assignments",
      label: "View assignments",
      icon: "assignments" as const,
    };
  }

  if (dashboard.accessState === "full_foundation") {
    return {
      title: "Foundation focus",
      description:
        "Keep building accuracy first. Higher sampling is available when you want a stretch task.",
      href: "/account/billing",
      label: "Upgrade options",
      icon: "billing" as const,
    };
  }

  return {
    title: "Full access",
    description:
      "Your course path, revision resources, and exam practice are open. Follow the next action first.",
    href: "/courses",
    label: "Open course path",
    icon: "courses" as const,
  };
}

export function getWeakestMasterySignals(masterySignals: MasterySignal[]) {
  return [...masterySignals]
    .sort((a, b) => {
      if (a.tone === "warning" && b.tone !== "warning") return -1;
      if (b.tone === "warning" && a.tone !== "warning") return 1;
      return a.value - b.value;
    })
    .slice(0, 2);
}

export function WeakAreasCard({ weakAreas }: { weakAreas: MasterySignal[] }) {
  return (
    <DashboardCard title="Weak areas to nudge" headingLevel={3} className="h-full">
      <div className="space-y-3">
        {weakAreas.map((signal) => (
          <div key={signal.title} className="app-tactile-row rounded-xl border p-3">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--text-secondary)]">
                <AppIcon icon={signal.icon} size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="app-heading-card">{signal.title}</div>
                  <Badge tone={signal.tone === "warning" ? "warning" : "muted"}>
                    {signal.value}%
                  </Badge>
                </div>
                <p className="mt-1 app-text-body-muted">{signal.label}</p>
                <p className="mt-1 app-text-caption">{signal.evidence}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function StudyPromptCard({
  prompts,
}: {
  prompts: StudentDashboardStudyPrompt[];
}) {
  return (
    <DashboardCard
      title="Recommended practice prompts"
      headingLevel={3}
      className="h-full"
    >
      <div className="grid gap-3 md:grid-cols-3">
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            className="app-tactile-row flex h-full flex-col rounded-xl border p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={prompt.badgeTone} icon={prompt.icon}>
                {prompt.badgeLabel}
              </Badge>
              {prompt.metaLabel ? <Badge tone="muted">{prompt.metaLabel}</Badge> : null}
            </div>
            <div className="mt-3 app-heading-card">{prompt.title}</div>
            <p className="mt-1 flex-1 app-text-body-muted">{prompt.description}</p>
            <Button
              href={prompt.href}
              variant="secondary"
              size="sm"
              icon={prompt.icon}
              className="mt-4 w-full"
            >
              {prompt.label}
            </Button>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function SkillReadinessCard({
  masterySignals,
}: {
  masterySignals: MasterySignal[];
}) {
  return (
    <DashboardCard title="Skill readiness" headingLevel={3} className="h-full">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
        {masterySignals.map((signal) => (
          <div key={signal.title} className="app-tactile-row rounded-xl border p-3">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--text-secondary)]">
                <AppIcon icon={signal.icon} size={16} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate font-semibold text-[var(--text-primary)]">
                    {signal.title}
                  </div>
                  <div className="shrink-0 font-semibold text-[var(--accent-ink)]">
                    {signal.value}%
                  </div>
                </div>

                <div
                  className="app-progress-track mt-2 h-1.5"
                  role="progressbar"
                  aria-label={`${signal.title} readiness`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={signal.value}
                >
                  <div
                    className="app-progress-bar"
                    style={{ width: `${signal.value}%` }}
                  />
                </div>

                <p className="mt-2 app-text-caption">{signal.evidence}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function LearningMilestoneCard({
  milestone,
}: {
  milestone: ReturnType<typeof getLearningMilestone>;
}) {
  const badgeTone = milestone.tone === "brand" ? "info" : milestone.tone;

  return (
    <DashboardCard title="Next milestone" headingLevel={3} className="h-full">
      <div className="app-soft-panel p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-elevated)] text-[var(--accent-ink)]">
            <AppIcon icon={milestone.icon} size={19} />
          </span>

          <div>
            <Badge tone={badgeTone} icon={milestone.icon}>
              {milestone.badge}
            </Badge>
            <div className="mt-3 app-heading-card">{milestone.title}</div>
            <p className="mt-1 app-text-body-muted">{milestone.description}</p>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

export function LearningSnapshotCard({
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
  const progressMessage =
    learningPlan.totalLessons === 0 && dashboard.variant
      ? "Your course path is set up. Published lessons will appear here as content opens; use the course hub to browse what is available now."
      : getDashboardProgressMessage(dashboard.accessMode, completedLessonCount);

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
          <div
            className="app-progress-track"
            role="progressbar"
            aria-label="Course path progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={learningPlan.progressPercent}
          >
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

        <p className="text-sm app-text-muted">{progressMessage}</p>
      </div>
    </DashboardCard>
  );
}

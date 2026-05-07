import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getDashboardAccessLabel,
  getDashboardNextStep,
  getDashboardVariantLabel,
  type StudentLearningPlan,
} from "@/lib/dashboard/learning-plan";
import {
  getLearningMilestone,
  getMasterySignals,
  type MasterySignal,
} from "@/lib/dashboard/mastery-signals";
import {
  getStudentDashboardActionQueue,
  type StudentDashboardActivity,
} from "@/lib/dashboard/student-next-actions";

type DashboardNextStep = ReturnType<typeof getDashboardNextStep>;

type AccountLearningMomentumPanelProps = {
  dashboard: DashboardInfo;
  learningPlan: StudentLearningPlan;
  nextStep: DashboardNextStep;
  activity: StudentDashboardActivity;
};

export function AccountLearningMomentumPanel({
  dashboard,
  learningPlan,
  nextStep,
  activity,
}: AccountLearningMomentumPanelProps) {
  const actions = getStudentDashboardActionQueue(activity, nextStep);
  const primaryAction = actions[0];
  const masterySignals = getMasterySignals({ learningPlan, activity });
  const milestone = getLearningMilestone({ learningPlan, activity });

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <div className="app-feature-panel">
        <div className="app-feature-panel-grid xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="app-feature-panel-main">
            <div className="flex flex-wrap gap-2">
              <Badge tone={primaryAction.badgeTone} icon={primaryAction.icon}>
                Today&apos;s study plan
              </Badge>
              <Badge tone="muted" icon="learning">
                {getDashboardVariantLabel(dashboard.variant)}
              </Badge>
              <Badge tone="muted" icon="userCheck">
                {getDashboardAccessLabel(dashboard.accessMode)}
              </Badge>
            </div>

            <div>
              <h2 className="app-heading-section">{primaryAction.title}</h2>
              <p className="mt-2 max-w-2xl app-text-body-muted">
                {primaryAction.description}
              </p>
            </div>

            <div className="app-mobile-action-stack flex flex-wrap gap-3">
              <Button
                href={primaryAction.href}
                variant="primary"
                icon={primaryAction.icon}
              >
                {primaryAction.label}
              </Button>

              <Button href="/courses" variant="secondary" icon="courses">
                Course path
              </Button>

              <Button href="/mock-exams" variant="secondary" icon="mockExam">
                Exam practice
              </Button>
            </div>
          </div>

          <div className="app-feature-panel-preview p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="app-text-caption">Course progress</div>
                <div className="mt-1 app-heading-card">
                  {learningPlan.progressPercent}% complete
                </div>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--background-elevated)] text-[var(--accent-ink)]">
                <AppIcon icon="brain" size={20} />
              </span>
            </div>

            <div
              className="app-progress-track mt-4"
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

            <div className="mt-4 grid gap-2">
              <LearningPlanLine
                label="Next lesson"
                value={learningPlan.nextLesson?.title ?? "Choose a lesson"}
              />
              <LearningPlanLine
                label="Study time"
                value={
                  learningPlan.nextLesson?.estimatedMinutes
                    ? `${learningPlan.nextLesson.estimatedMinutes} min`
                    : "Self-paced"
                }
              />
            </div>
          </div>
        </div>
      </div>

      <DashboardCard title="Next milestone" headingLevel={3} className="h-full">
        <div className="space-y-4">
          <div className="app-soft-panel p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-elevated)] text-[var(--accent-ink)]">
                <AppIcon icon={milestone.icon} size={19} />
              </span>
              <div>
                <Badge
                  tone={milestone.tone === "brand" ? "info" : milestone.tone}
                  icon={milestone.icon}
                >
                  {milestone.badge}
                </Badge>
                <div className="mt-3 app-heading-card">{milestone.title}</div>
                <p className="mt-1 app-text-body-muted">{milestone.description}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 app-text-caption">Mastery focus</div>
            <div className="space-y-2">
              {masterySignals.slice(0, 3).map((signal) => (
                <MasterySignalRow key={signal.title} signal={signal} compact />
              ))}
            </div>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard
        title="Skill readiness"
        headingLevel={3}
        className="xl:col-span-2"
      >
        <div className="space-y-3">
          {masterySignals.map((signal) => (
            <MasterySignalRow key={signal.title} signal={signal} />
          ))}
        </div>
      </DashboardCard>

      <section className="grid gap-4 xl:col-span-2 sm:grid-cols-2 xl:grid-cols-5">
        {masterySignals.map((signal) => (
          <SummaryStatCard
            key={signal.title}
            title={signal.title}
            value={`${signal.value}%`}
            description={signal.label}
            icon={signal.icon}
            tone={signal.tone}
            compact
          />
        ))}
      </section>
    </section>
  );
}

function LearningPlanLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-plain-bg)] px-3 py-2">
      <div className="app-text-caption">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold text-[var(--text-primary)]">
        {value}
      </div>
    </div>
  );
}

function MasterySignalRow({
  signal,
  compact = false,
}: {
  signal: MasterySignal;
  compact?: boolean;
}) {
  return (
    <div className="app-tactile-row rounded-xl border p-3">
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

          <div className="app-progress-track mt-2 h-1.5">
            <div className="app-progress-bar" style={{ width: `${signal.value}%` }} />
          </div>

          <p className="mt-2 app-text-caption">
            {compact ? signal.label : signal.evidence}
          </p>
        </div>
      </div>
    </div>
  );
}

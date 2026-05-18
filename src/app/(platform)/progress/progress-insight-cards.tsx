import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import {
  getLearningMilestone,
  type MasterySignal,
} from "@/lib/dashboard/mastery-signals";
import type { StudentDashboardAction } from "@/lib/dashboard/student-next-actions";
import type {
  ProgressDomainSummary,
  ProgressRecentWin,
  ProgressWeakArea,
} from "@/lib/progress/progress-insights";

import { ProgressEmptyBlock } from "./progress-empty-states";

export function SkillReadinessList({ signals }: { signals: MasterySignal[] }) {
  return (
    <DashboardCard title="Skill readiness" headingLevel={2} className="h-full">
      <div className="grid gap-3 md:grid-cols-2">
        {signals.map((signal) => (
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

export function DomainProgressGrid({ domains }: { domains: ProgressDomainSummary[] }) {
  return (
    <section className="grid gap-4 lg:grid-cols-3" aria-label="Progress by study area">
      {domains.map((domain) => (
        <DashboardCard key={domain.id} title={domain.title} headingLevel={2}>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--text-secondary)]">
                <AppIcon icon={domain.icon} size={18} />
              </span>
              <Badge tone={domain.tone} icon={domain.icon}>
                {domain.value}%
              </Badge>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-[var(--text-primary)]">
                  {domain.label}
                </span>
                <span className="app-text-muted">{domain.value}% ready</span>
              </div>
              <div
                className="app-progress-track h-1.5"
                role="progressbar"
                aria-label={`${domain.title} readiness`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={domain.value}
              >
                <div className="app-progress-bar" style={{ width: `${domain.value}%` }} />
              </div>
            </div>

            <p className="app-text-body-muted">{domain.evidence}</p>
            <Button
              href={domain.href}
              variant="secondary"
              size="sm"
              icon={domain.icon}
              className="w-full sm:w-auto"
            >
              {domain.actionLabel}
            </Button>
          </div>
        </DashboardCard>
      ))}
    </section>
  );
}

export function WeakAreasCard({ weakAreas }: { weakAreas: ProgressWeakArea[] }) {
  return (
    <DashboardCard title="Practice focus" headingLevel={2} className="h-full">
      {weakAreas.length === 0 ? (
        <ProgressEmptyBlock
          icon="success"
          title="No priority focus yet"
          description="Keep the next lesson moving. This space will point to vocabulary, grammar, or exam practice when your activity shows a clear pattern."
          action={
            <Button href="/courses" variant="secondary" size="sm" icon="courses">
              Open course path
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {weakAreas.map((area) => (
            <div key={area.id} className="app-tactile-row rounded-xl border p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={area.tone} icon={area.icon}>
                      Focus
                    </Badge>
                  </div>
                  <div className="mt-2 app-heading-card">{area.title}</div>
                  <p className="mt-1 app-text-body-muted">{area.description}</p>
                </div>

                <Button
                  href={area.href}
                  variant="secondary"
                  size="sm"
                  icon={area.icon}
                  className="w-full sm:w-auto sm:shrink-0"
                  ariaLabel={`${area.actionLabel}: ${area.title}`}
                >
                  {area.actionLabel}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

export function RecentWinsCard({ wins }: { wins: ProgressRecentWin[] }) {
  return (
    <DashboardCard title="Recent wins" headingLevel={2} className="h-full">
      {wins.length === 0 ? (
        <ProgressEmptyBlock
          icon="star"
          title="First win is ready"
          description="Complete a lesson, submit work, or finish a mock and this space will start recording progress evidence."
          action={
            <Button href="/courses" variant="secondary" size="sm" icon="next">
              Start a lesson
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {wins.map((win) => (
            <div key={win.id} className="app-tactile-row rounded-xl border p-3">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--text-secondary)]">
                  <AppIcon icon={win.icon} size={16} />
                </span>

                <div className="min-w-0">
                  <Badge tone={win.tone} icon={win.icon}>
                    Win
                  </Badge>
                  <div className="mt-2 app-heading-card">{win.title}</div>
                  <p className="mt-1 app-text-body-muted">{win.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

export function NewStudentKickstartCard({ action }: { action: StudentDashboardAction }) {
  const steps = [
    {
      title: "Start one lesson",
      description: "Open the first available lesson and complete the core task.",
      icon: "lessons" as const,
    },
    {
      title: "Do one recall check",
      description: "Use vocabulary or grammar practice to make the lesson stick.",
      icon: "brain" as const,
    },
    {
      title: "Check the next action",
      description: "Return here after each session to see the clearest follow-up.",
      icon: "next" as const,
    },
  ];

  return (
    <DashboardCard title="First progress steps" headingLevel={2}>
      <div className="grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="app-soft-panel p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-elevated)] text-[var(--accent-ink)]">
                <AppIcon icon={step.icon} size={16} />
              </span>
              <div>
                <Badge tone={index === 0 ? "info" : "muted"}>Step {index + 1}</Badge>
                <div className="mt-2 app-heading-card">{step.title}</div>
                <p className="mt-1 app-text-body-muted">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        href={action.href}
        variant="journey"
        icon={action.icon}
        className="mt-4 w-full sm:w-auto"
        ariaLabel={`${action.label}: ${action.title}`}
      >
        {action.label}
      </Button>
    </DashboardCard>
  );
}

export function ProgressMilestoneCard({
  milestone,
}: {
  milestone: ReturnType<typeof getLearningMilestone>;
}) {
  return (
    <DashboardCard title="Next milestone" headingLevel={2} className="h-full">
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
    </DashboardCard>
  );
}

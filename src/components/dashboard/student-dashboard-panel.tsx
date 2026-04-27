import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getDashboardAccessLabel,
  getDashboardNextStep,
  getDashboardProgressMessage,
  getDashboardVariantLabel,
  type StudentLearningPlan,
} from "@/lib/dashboard/learning-plan";

type DashboardNextStep = ReturnType<typeof getDashboardNextStep>;

export function StudentDashboardPanel({
  dashboard,
  completedLessons,
  learningPlan,
  nextStep,
}: {
  dashboard: DashboardInfo;
  completedLessons: number;
  learningPlan: StudentLearningPlan;
  nextStep: DashboardNextStep;
}) {
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
                <h2 className="app-heading-hero max-w-3xl">{nextStep.title}</h2>
                <p className="app-subtitle max-w-2xl">{nextStep.description}</p>
              </div>
            </div>

            <div className="app-mobile-action-stack flex flex-wrap gap-3">
              <Button href={nextStep.href} variant="primary" icon={nextStep.icon}>
                {nextStep.label}
              </Button>

              <Button href="/vocabulary" variant="secondary" icon="vocabulary">
                Revise vocabulary
              </Button>

              <Button href="/grammar" variant="secondary" icon="grammar">
                Review grammar
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

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardLinkCard
          title="Course path"
          href="/courses"
          linkLabel="Open courses"
          description="Continue lessons in order and keep your GCSE Russian progress moving."
        />
        <DashboardLinkCard
          title="Vocabulary revision"
          href="/vocabulary"
          linkLabel="Open vocabulary"
          description="Review topic vocabulary for reading, writing, listening, and speaking."
        />
        <DashboardLinkCard
          title="Grammar reference"
          href="/grammar"
          linkLabel="Open grammar"
          description="Check grammar explanations, sentence patterns, and exam-useful rules."
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <DashboardLinkCard
          title="Exam practice"
          href="/past-papers"
          linkLabel="Open past papers"
          description="Use past papers and exam-style material when you are ready to test recall under more realistic conditions."
        />
        <StudentSupportCard accessMode={dashboard.accessMode} />
      </section>
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
  return (
    <DashboardCard title="Learning snapshot" headingLevel={3} className="h-full">
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-[var(--text-primary)]">
              {learningPlan.progressPercent}% complete
            </span>
            <span className="app-text-muted">
              {completedLessons} of {learningPlan.totalLessons || "-"}
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
            <div className="app-stat-value">{String(completedLessons)}</div>
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
          {getDashboardProgressMessage(dashboard.accessMode, completedLessons)}
        </p>
      </div>
    </DashboardCard>
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
        <Link href={href} className="inline-flex items-center gap-2 font-medium app-brand-text">
          {linkLabel}
          <AppIcon icon="next" size={14} />
        </Link>
      </div>
    </DashboardCard>
  );
}

function StudentSupportCard({
  accessMode,
}: {
  accessMode: DashboardInfo["accessMode"];
}) {
  return (
    <DashboardCard title={accessMode === "volna" ? "Assignments" : "Live support"}>
      <div className="space-y-3">
        {accessMode === "volna" ? (
          <>
            <p>
              Your Volna student area includes teacher-led assignments and guided
              support.
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
              Looking for live support as well as self-study? Explore Volna
              School&apos;s online GCSE Russian classes.
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

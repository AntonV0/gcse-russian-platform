import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import AppIcon from "@/components/ui/app-icon";
import DashboardCard from "@/components/ui/dashboard-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";
import { getCourseProgressSummary } from "@/lib/progress/progress";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  formatDashboardLabel,
  getDashboardAccessLabel,
  getDashboardNextStep,
  getDashboardProgressMessage,
  getDashboardVariantLabel,
  getStudentLearningPlan,
} from "@/lib/dashboard/learning-plan";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();
  const dashboard = await getDashboardInfo();

  const progressSummary =
    dashboard.variant && dashboard.role === "student"
      ? await getCourseProgressSummary("gcse-russian", dashboard.variant)
      : { completedLessons: 0 };
  const learningPlan =
    dashboard.role === "student"
      ? await getStudentLearningPlan(
          dashboard.variant,
          progressSummary.completedLessons
        )
      : {
          totalLessons: 0,
          completedLessons: progressSummary.completedLessons,
          progressPercent: 0,
          nextLesson: null,
        };

  const welcomeName = profile?.full_name ? `, ${profile.full_name}` : "";
  const nextStep = getDashboardNextStep(
    dashboard.variant,
    dashboard.accessMode,
    progressSummary.completedLessons,
    learningPlan
  );

  return (
    <main className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={
          user
            ? `Welcome back${welcomeName}.`
            : "Your learning dashboard and quick access hub."
        }
      />

      {dashboard.role === "guest" ? (
        <EmptyState
          title="You are not signed in"
          description="Log in to view your dashboard, learning progress, and course access."
          visual={
            <VisualPlaceholder
              category="learningPath"
              ariaLabel="Dashboard sign-in placeholder"
            />
          }
          action={
            <div className="flex flex-wrap gap-3">
              <Button href="/login" variant="primary" icon="user">
                Log in
              </Button>
              <Button href="/signup" variant="secondary" icon="create">
                Sign up
              </Button>
            </div>
          }
        />
      ) : null}

      {dashboard.role === "student" ? (
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
                    <p className="app-subtitle max-w-2xl">
                      {nextStep.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
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

              <DashboardCard
                title="Learning snapshot"
                headingLevel={3}
                className="h-full"
              >
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-[var(--text-primary)]">
                        {learningPlan.progressPercent}% complete
                      </span>
                      <span className="app-text-muted">
                        {progressSummary.completedLessons} of {learningPlan.totalLessons || "-"}
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
                      <div className="app-stat-label">
                        Completed lessons
                      </div>
                      <div className="app-stat-value">
                        {String(progressSummary.completedLessons)}
                      </div>
                    </div>

                    <div className="app-stat-tile">
                      <div className="app-stat-label">
                        Next lesson
                      </div>
                      <div className="app-stat-value">
                        {learningPlan.nextLesson?.title ?? "Choose a lesson"}
                      </div>
                    </div>

                    <div className="app-stat-tile">
                      <div className="app-stat-label">
                        Study time
                      </div>
                      <div className="app-stat-value">
                        {learningPlan.nextLesson?.estimatedMinutes
                          ? `${learningPlan.nextLesson.estimatedMinutes} min`
                          : "Self-paced"}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm app-text-muted">
                    {getDashboardProgressMessage(
                      dashboard.accessMode,
                      progressSummary.completedLessons
                    )}
                  </p>
                </div>
              </DashboardCard>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <DashboardCard title="Course path">
              <div className="space-y-3">
                <p>
                  Continue lessons in order and keep your GCSE Russian progress moving.
                </p>

                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  Open courses
                  <AppIcon icon="next" size={14} />
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard title="Vocabulary revision">
              <div className="space-y-3">
                <p>
                  Review topic vocabulary for reading, writing, listening, and speaking.
                </p>

                <Link
                  href="/vocabulary"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  Open vocabulary
                  <AppIcon icon="next" size={14} />
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard title="Grammar reference">
              <div className="space-y-3">
                <p>
                  Check grammar explanations, sentence patterns, and exam-useful rules.
                </p>

                <Link
                  href="/grammar"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  Open grammar
                  <AppIcon icon="next" size={14} />
                </Link>
              </div>
            </DashboardCard>
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <DashboardCard title="Exam practice">
              <div className="space-y-3">
                <p>
                  Use past papers and exam-style material when you are ready to test
                  recall under more realistic conditions.
                </p>

                <Link
                  href="/past-papers"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  Open past papers
                  <AppIcon icon="next" size={14} />
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard
              title={dashboard.accessMode === "volna" ? "Assignments" : "Live support"}
            >
              <div className="space-y-3">
                {dashboard.accessMode === "volna" ? (
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
          </section>

        </>
      ) : null}

      {dashboard.role === "teacher" ? (
        <>
          <section className="app-surface-brand app-section-padding-lg">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge tone="info" icon="teacher">
                  Teacher workspace
                </Badge>
                <Badge tone="muted" icon="school">
                  Volna
                </Badge>
              </div>

              <div className="space-y-2">
                <h2 className="app-heading-hero max-w-3xl">Teacher dashboard</h2>
                <p className="app-subtitle max-w-2xl">
                  Manage assignments, review submissions, and support students through
                  their teacher-led learning workflow.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button href="/teacher/assignments" variant="primary" icon="assignments">
                  Open assignments
                </Button>

                <Button href="/teacher/assignments/new" variant="secondary" icon="create">
                  Create assignment
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <DashboardCard title="Role">{formatDashboardLabel(dashboard.role)}</DashboardCard>

            <DashboardCard title="Variant">
              {getDashboardVariantLabel(dashboard.variant)}
            </DashboardCard>

            <DashboardCard title="Access">
              {getDashboardAccessLabel(dashboard.accessMode)}
            </DashboardCard>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <DashboardCard title="Assignments">
              <div className="space-y-3">
                <p>
                  View, create, and manage teacher assignments for your student groups.
                </p>

                <Link
                  href="/teacher/assignments"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  Open teacher assignments
                  <AppIcon icon="next" size={14} />
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard title="Account">
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-[var(--text-primary)]">Email:</span>{" "}
                  {user?.email ?? "Not logged in"}
                </div>

                <div>
                  <span className="font-medium text-[var(--text-primary)]">Role:</span>{" "}
                  {formatDashboardLabel(dashboard.role)}
                </div>
              </div>
            </DashboardCard>
          </section>
        </>
      ) : null}

      {dashboard.role === "admin" ? (
        <>
          <section className="app-surface-brand app-section-padding-lg">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge tone="info" icon="admin">
                  Admin workspace
                </Badge>
              </div>

              <div className="space-y-2">
                <h2 className="app-heading-hero max-w-3xl">Admin control center</h2>
                <p className="app-subtitle max-w-2xl">
                  Open content, question, template, user, and lesson-builder tools from
                  one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button href="/admin" variant="primary" icon="dashboard">
                  Open admin
                </Button>

                <Button href="/admin/content" variant="secondary" icon="courses">
                  Content
                </Button>

                <Button href="/admin/question-sets" variant="secondary" icon="question">
                  Question sets
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <DashboardCard title="Role">{formatDashboardLabel(dashboard.role)}</DashboardCard>

            <DashboardCard title="Variant">
              {getDashboardVariantLabel(dashboard.variant)}
            </DashboardCard>

            <DashboardCard title="Access">
              {getDashboardAccessLabel(dashboard.accessMode)}
            </DashboardCard>
          </section>
        </>
      ) : null}
    </main>
  );
}

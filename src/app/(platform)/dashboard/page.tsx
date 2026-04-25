import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import AppIcon from "@/components/ui/app-icon";
import DashboardCard from "@/components/ui/dashboard-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";
import { getCourseProgressSummary } from "@/lib/progress/progress";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";

function formatLabel(value: string | null) {
  if (!value) return "-";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getVariantLabel(variant: "foundation" | "higher" | "volna" | null) {
  if (!variant) return "No active variant";
  if (variant === "volna") return "Volna";
  if (variant === "foundation") return "Foundation";
  return "Higher";
}

function getAccessLabel(accessMode: "trial" | "full" | "volna" | null) {
  if (!accessMode) return "No active access";
  if (accessMode === "full") return "Full access";
  if (accessMode === "trial") return "Trial access";
  return "Volna access";
}

function getProgressMessage(
  accessMode: "trial" | "full" | "volna" | null,
  completedLessons: number
) {
  if (accessMode === "trial") {
    return "You are currently exploring the platform with trial access. Use this time to sample lessons, resources, and the overall learning experience.";
  }

  if (accessMode === "volna") {
    if (completedLessons === 0) {
      return "Your learning is guided through lessons and assignments. Start with your assigned work and lesson content.";
    }

    return "Your learning is guided through lessons and assignments. Keep following your teacher-led path and build steady progress.";
  }

  if (completedLessons === 0) {
    return "Start your first lesson to begin building progress on your current course path.";
  }

  return "Keep going - steady lesson progress builds stronger confidence for GCSE Russian.";
}

function getNextStep(
  variant: "foundation" | "higher" | "volna" | null,
  accessMode: "trial" | "full" | "volna" | null,
  completedLessons: number
) {
  if (accessMode === "volna") {
    return {
      title: "Continue your guided work",
      description:
        "Open your assignments and continue through the lesson content linked to your teacher-led learning.",
      href: "/assignments",
      label: "Open assignments",
      icon: "assignments" as const,
    };
  }

  if (accessMode === "trial") {
    return {
      title: "Explore the platform",
      description:
        "Browse lessons, vocabulary, grammar, and past papers to see how the full learning experience is structured.",
      href: "/courses",
      label: "Explore lessons",
      icon: "courses" as const,
    };
  }

  if (variant && completedLessons > 0) {
    return {
      title: "Keep your momentum going",
      description:
        "Continue your current course path and keep building progress through lessons and revision resources.",
      href: "/courses",
      label: "Continue learning",
      icon: "next" as const,
    };
  }

  if (variant) {
    return {
      title: "Start your course path",
      description:
        "Begin working through your lessons and use the platform as your main GCSE Russian study hub.",
      href: "/courses",
      label: "Start learning",
      icon: "courses" as const,
    };
  }

  return {
    title: "Get started",
    description: "Browse available course content and begin exploring the platform.",
    href: "/courses",
    label: "Browse courses",
    icon: "courses" as const,
  };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();
  const dashboard = await getDashboardInfo();

  const progressSummary =
    dashboard.variant && dashboard.role === "student"
      ? await getCourseProgressSummary("gcse-russian", dashboard.variant)
      : { completedLessons: 0 };

  const welcomeName = profile?.full_name ? `, ${profile.full_name}` : "";
  const nextStep = getNextStep(
    dashboard.variant,
    dashboard.accessMode,
    progressSummary.completedLessons
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
                      {getVariantLabel(dashboard.variant)}
                    </Badge>

                    <Badge tone="muted" icon="student">
                      {getAccessLabel(dashboard.accessMode)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h2 className="app-title max-w-3xl">
                      {progressSummary.completedLessons > 0
                        ? "Continue where you left off"
                        : "Start your GCSE Russian path"}
                    </h2>
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

              <DashboardCard title="Learning snapshot" className="h-full">
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <div className="rounded-xl bg-[var(--background-muted)] p-3">
                      <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                        Completed lessons
                      </div>
                      <div className="font-semibold text-[var(--text-primary)]">
                        {String(progressSummary.completedLessons)}
                      </div>
                    </div>

                    <div className="rounded-xl bg-[var(--background-muted)] p-3">
                      <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                        Course path
                      </div>
                      <div className="font-semibold text-[var(--text-primary)]">
                        {getVariantLabel(dashboard.variant)}
                      </div>
                    </div>

                    <div className="rounded-xl bg-[var(--background-muted)] p-3">
                      <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                        Access
                      </div>
                      <div className="font-semibold text-[var(--text-primary)]">
                        {getAccessLabel(dashboard.accessMode)}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm app-text-muted">
                    {getProgressMessage(
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
                <h2 className="app-title max-w-3xl">Teacher dashboard</h2>
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
            <DashboardCard title="Role">{formatLabel(dashboard.role)}</DashboardCard>

            <DashboardCard title="Variant">
              {getVariantLabel(dashboard.variant)}
            </DashboardCard>

            <DashboardCard title="Access">
              {getAccessLabel(dashboard.accessMode)}
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
                  {formatLabel(dashboard.role)}
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
                <h2 className="app-title max-w-3xl">Admin control center</h2>
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
            <DashboardCard title="Role">{formatLabel(dashboard.role)}</DashboardCard>

            <DashboardCard title="Variant">
              {getVariantLabel(dashboard.variant)}
            </DashboardCard>

            <DashboardCard title="Access">
              {getAccessLabel(dashboard.accessMode)}
            </DashboardCard>
          </section>
        </>
      ) : null}
    </main>
  );
}

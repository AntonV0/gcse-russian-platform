import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { appIcons } from "@/lib/shared/icons";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";
import { getCourseProgressSummary } from "@/lib/progress/progress";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";

function formatLabel(value: string | null) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getTrackLabel(track: "foundation" | "higher" | "volna" | null) {
  if (!track) return "No active track";
  if (track === "volna") return "Volna";
  if (track === "foundation") return "Foundation";
  return "Higher";
}

function getAccessLabel(accessMode: "trial" | "full" | "volna" | null) {
  if (!accessMode) return "No active access";
  if (accessMode === "full") return "Full access";
  if (accessMode === "trial") return "Trial access";
  return "Volna access";
}

function getStudentIntro(track: "foundation" | "higher" | "volna" | null) {
  if (track === "foundation") {
    return "You are currently on the Foundation learning path, with structured lessons and revision support designed to build confidence step by step.";
  }

  if (track === "higher") {
    return "You are currently on the Higher learning path, with more advanced language work, exam preparation, and deeper revision support.";
  }

  if (track === "volna") {
    return "You are currently using the Volna student learning experience, with teacher-led support, assignments, and guided progress.";
  }

  return "Your account is ready, but no active GCSE Russian track has been detected yet.";
}

function getStudentPrimaryAction(
  track: "foundation" | "higher" | "volna" | null,
  accessMode: "trial" | "full" | "volna" | null
) {
  if (accessMode === "volna") {
    return {
      href: "/assignments",
      label: "Open assignments",
      icon: appIcons.assignments,
    };
  }

  if (track) {
    return {
      href: "/courses",
      label: "Continue learning",
      icon: appIcons.next,
    };
  }

  return {
    href: "/courses",
    label: "Browse courses",
    icon: appIcons.courses,
  };
}

function getStudentSecondaryAction(accessMode: "trial" | "full" | "volna" | null) {
  if (accessMode === "volna") {
    return {
      href: "/courses",
      label: "Open lessons",
      icon: appIcons.courses,
    };
  }

  return {
    href: "/online-classes",
    label: "Explore online classes",
    icon: appIcons.school,
  };
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

  return "Keep going — steady lesson progress builds stronger confidence for GCSE Russian.";
}

function getNextStep(
  track: "foundation" | "higher" | "volna" | null,
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
      icon: appIcons.assignments,
    };
  }

  if (accessMode === "trial") {
    return {
      title: "Explore the platform",
      description:
        "Browse lessons, vocabulary, grammar, and past papers to see how the full learning experience is structured.",
      href: "/courses",
      label: "Explore lessons",
      icon: appIcons.courses,
    };
  }

  if (track && completedLessons > 0) {
    return {
      title: "Keep your momentum going",
      description:
        "Continue your current course path and keep building progress through lessons and revision resources.",
      href: "/courses",
      label: "Continue learning",
      icon: appIcons.next,
    };
  }

  if (track) {
    return {
      title: "Start your course path",
      description:
        "Begin working through your lessons and use the platform as your main GCSE Russian study hub.",
      href: "/courses",
      label: "Start learning",
      icon: appIcons.courses,
    };
  }

  return {
    title: "Get started",
    description: "Browse available course content and begin exploring the platform.",
    href: "/courses",
    label: "Browse courses",
    icon: appIcons.courses,
  };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();
  const dashboard = await getDashboardInfo();

  const progressSummary =
    dashboard.track && dashboard.role === "student"
      ? await getCourseProgressSummary("gcse-russian", dashboard.track)
      : { completedLessons: 0 };

  const welcomeName = profile?.full_name ? `, ${profile.full_name}` : "";
  const primaryAction = getStudentPrimaryAction(dashboard.track, dashboard.accessMode);
  const secondaryAction = getStudentSecondaryAction(dashboard.accessMode);
  const nextStep = getNextStep(
    dashboard.track,
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
              <Button href="/login" variant="primary" icon={appIcons.user}>
                Log in
              </Button>
              <Button href="/signup" variant="secondary" icon={appIcons.create}>
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
                    <Badge tone="info" icon={appIcons.school}>
                      GCSE Russian
                    </Badge>

                    <Badge tone="muted" icon={appIcons.layers}>
                      {getTrackLabel(dashboard.track)}
                    </Badge>

                    <Badge tone="muted" icon={appIcons.userCheck}>
                      {getAccessLabel(dashboard.accessMode)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h2 className="app-title max-w-3xl">Your student hub</h2>
                    <p className="app-subtitle max-w-2xl">
                      {getStudentIntro(dashboard.track)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    href={primaryAction.href}
                    variant="primary"
                    icon={primaryAction.icon}
                  >
                    {primaryAction.label}
                  </Button>

                  <Button
                    href={secondaryAction.href}
                    variant="secondary"
                    icon={secondaryAction.icon}
                  >
                    {secondaryAction.label}
                  </Button>

                  <Button href="/profile" variant="secondary" icon={appIcons.user}>
                    View profile
                  </Button>
                </div>
              </div>

              <DashboardCard title="At a glance" className="h-full">
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-[var(--background-muted)] p-3">
                      <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                        Track
                      </div>
                      <div className="font-semibold text-[var(--text-primary)]">
                        {getTrackLabel(dashboard.track)}
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
                        Account
                      </div>
                      <div className="font-semibold text-[var(--text-primary)]">
                        {user?.email ?? "Not logged in"}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm app-text-muted">
                    This dashboard will continue growing into the main place for progress,
                    resources, revision, and next steps.
                  </p>
                </div>
              </DashboardCard>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <DashboardCard title="Your progress">
              <div className="space-y-3">
                <div className="text-2xl font-semibold text-[var(--text-primary)]">
                  {progressSummary.completedLessons} lessons completed
                </div>

                <p className="text-sm app-text-muted">
                  {getProgressMessage(
                    dashboard.accessMode,
                    progressSummary.completedLessons
                  )}
                </p>
              </div>
            </DashboardCard>

            <DashboardCard title={nextStep.title}>
              <div className="space-y-3">
                <p>{nextStep.description}</p>

                <Button href={nextStep.href} variant="secondary" icon={nextStep.icon}>
                  {nextStep.label}
                </Button>
              </div>
            </DashboardCard>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <DashboardCard title="Courses">
              <div className="space-y-3">
                <p>
                  Continue through your lesson structure, revisit modules, and keep your
                  GCSE Russian study moving forward.
                </p>

                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  Open courses
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard title="Vocabulary">
              <div className="space-y-3">
                <p>
                  Build topic vocabulary, revise key words, and prepare for reading,
                  writing, listening, and speaking tasks.
                </p>

                <Link
                  href="/vocabulary"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  Open vocabulary
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard title="Grammar">
              <div className="space-y-3">
                <p>
                  Review grammar explanations, sentence patterns, and language rules that
                  support stronger exam performance.
                </p>

                <Link
                  href="/grammar"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  Open grammar
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </DashboardCard>
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <DashboardCard title="Past papers and exam practice">
              <div className="space-y-3">
                <p>
                  Practice with exam-style material, revision tasks, and future past paper
                  tools designed to support GCSE preparation.
                </p>

                <Link
                  href="/past-papers"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  Open past papers
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard title="Important">
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
                      <span aria-hidden="true">→</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <p>
                      Looking for live support as well as self-study? Explore Volna
                      School’s online GCSE Russian classes.
                    </p>

                    <Link
                      href="/online-classes"
                      className="inline-flex items-center gap-2 font-medium app-brand-text"
                    >
                      Explore online classes
                      <span aria-hidden="true">→</span>
                    </Link>
                  </>
                )}
              </div>
            </DashboardCard>
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <DashboardCard title="Your account">
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-[var(--text-primary)]">Email:</span>{" "}
                  {user?.email ?? "Not logged in"}
                </div>

                <div>
                  <span className="font-medium text-[var(--text-primary)]">Role:</span>{" "}
                  {formatLabel(dashboard.role)}
                </div>

                <div>
                  <span className="font-medium text-[var(--text-primary)]">
                    Learning track:
                  </span>{" "}
                  {getTrackLabel(dashboard.track)}
                </div>

                <div>
                  <span className="font-medium text-[var(--text-primary)]">Access:</span>{" "}
                  {getAccessLabel(dashboard.accessMode)}
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Quick actions">
              <div className="flex flex-col gap-3">
                <Button href="/courses" variant="secondary" icon={appIcons.courses}>
                  Browse courses
                </Button>

                <Button href="/vocabulary" variant="secondary" icon={appIcons.language}>
                  Vocabulary
                </Button>

                <Button href="/grammar" variant="secondary" icon={appIcons.lessonContent}>
                  Grammar
                </Button>

                <Button href="/past-papers" variant="secondary" icon={appIcons.file}>
                  Past papers
                </Button>

                {dashboard.accessMode === "volna" ? (
                  <Button
                    href="/assignments"
                    variant="secondary"
                    icon={appIcons.assignments}
                  >
                    Open assignments
                  </Button>
                ) : (
                  <Button
                    href="/online-classes"
                    variant="secondary"
                    icon={appIcons.school}
                  >
                    Online classes
                  </Button>
                )}

                <Button href="/settings" variant="secondary" icon={appIcons.settings}>
                  Settings
                </Button>
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
                <Badge tone="info" icon={appIcons.users}>
                  Teacher workspace
                </Badge>
                <Badge tone="muted" icon={appIcons.school}>
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
                <Button
                  href="/teacher/assignments"
                  variant="primary"
                  icon={appIcons.assignments}
                >
                  Open assignments
                </Button>

                <Button
                  href="/teacher/assignments/new"
                  variant="secondary"
                  icon={appIcons.create}
                >
                  Create assignment
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <DashboardCard title="Role">{formatLabel(dashboard.role)}</DashboardCard>

            <DashboardCard title="Track">{getTrackLabel(dashboard.track)}</DashboardCard>

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
                  <span aria-hidden="true">→</span>
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
                <Badge tone="info" icon={appIcons.dashboard}>
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
                <Button href="/admin" variant="primary" icon={appIcons.dashboard}>
                  Open admin
                </Button>

                <Button href="/admin/content" variant="secondary" icon={appIcons.courses}>
                  Content
                </Button>

                <Button
                  href="/admin/question-sets"
                  variant="secondary"
                  icon={appIcons.question}
                >
                  Question sets
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <DashboardCard title="Role">{formatLabel(dashboard.role)}</DashboardCard>

            <DashboardCard title="Track">{getTrackLabel(dashboard.track)}</DashboardCard>

            <DashboardCard title="Access">
              {getAccessLabel(dashboard.accessMode)}
            </DashboardCard>
          </section>
        </>
      ) : null}
    </main>
  );
}

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
    return "You are currently on the Foundation learning path.";
  }

  if (track === "higher") {
    return "You are currently on the Higher learning path.";
  }

  if (track === "volna") {
    return "You are currently using the Volna student learning experience.";
  }

  return "Your account is ready, but no active GCSE Russian track has been detected yet.";
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
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)] xl:items-start">
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
                    <h2 className="app-title max-w-3xl">Continue your learning</h2>
                    <p className="app-subtitle max-w-2xl">
                      {getStudentIntro(dashboard.track)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button href="/courses" variant="primary" icon={appIcons.next}>
                    Continue learning
                  </Button>

                  <Button href="/courses" variant="secondary" icon={appIcons.courses}>
                    Browse courses
                  </Button>

                  {dashboard.accessMode === "volna" ? (
                    <Button
                      href="/assignments"
                      variant="secondary"
                      icon={appIcons.assignments}
                    >
                      View assignments
                    </Button>
                  ) : null}
                </div>
              </div>

              <DashboardCard title="Progress overview" className="h-full">
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
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
                  </div>

                  <p className="text-sm app-text-muted">
                    This will become the main place for progress, next steps, and learning
                    continuity as more dashboard features are added.
                  </p>
                </div>
              </DashboardCard>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <DashboardCard title="Lessons">
              <div className="space-y-3">
                <p>
                  Open your course content and continue working through structured GCSE
                  Russian lessons.
                </p>

                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  Open lessons
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard title="Practice">
              <div className="space-y-3">
                <p>
                  Build confidence with translation, listening, and revision-focused
                  practice activities.
                </p>

                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  Go to practice
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard title="Progress">
              <div className="space-y-3">
                <p>
                  Track what you have completed and keep your revision moving in the right
                  direction.
                </p>

                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  View progress
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </DashboardCard>
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.85fr)]">
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
              </div>
            </DashboardCard>

            <DashboardCard title="Quick actions">
              <div className="flex flex-col gap-3">
                <Button href="/courses" variant="secondary" icon={appIcons.courses}>
                  Browse courses
                </Button>

                {dashboard.accessMode === "volna" ? (
                  <Button
                    href="/assignments"
                    variant="secondary"
                    icon={appIcons.assignments}
                  >
                    Open assignments
                  </Button>
                ) : null}

                <Button href="/account" variant="secondary" icon={appIcons.user}>
                  Account settings
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
                  Open admin panel
                </Button>

                <Button href="/admin/content" variant="secondary" icon={appIcons.courses}>
                  Manage content
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <DashboardCard title="Current course">GCSE Russian</DashboardCard>
            <DashboardCard title="Account">
              {user?.email ?? "Not logged in"}
            </DashboardCard>
            <DashboardCard title="Role">{formatLabel(dashboard.role)}</DashboardCard>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <DashboardCard title="Content">
              <div className="space-y-3">
                <p>Courses, variants, modules, lessons, and lesson-builder workflows.</p>
                <Link
                  href="/admin/content"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  Open content tools
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard title="Questions">
              <div className="space-y-3">
                <p>Question sets, question authoring, and reusable template workflows.</p>
                <Link
                  href="/admin/question-sets"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  Open question tools
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard title="Users">
              <div className="space-y-3">
                <p>Students, teachers, teaching groups, and access-management views.</p>
                <Link
                  href="/admin/students"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  Open user tools
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </DashboardCard>
          </section>
        </>
      ) : null}
    </main>
  );
}

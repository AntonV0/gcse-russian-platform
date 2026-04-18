import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import { appIcons } from "@/lib/shared/icons";
import {
  getCurrentCourseAccess,
  getCurrentProfile,
  getCurrentUser,
} from "@/lib/auth/auth";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";

function formatRoleLabel(role: string | null | undefined) {
  if (!role) return "No role found";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function formatAccessLabel(accessMode: string | null | undefined) {
  if (!accessMode) return "No access found";
  if (accessMode === "full") return "Full access";
  if (accessMode === "trial") return "Trial access";
  if (accessMode === "volna") return "Volna access";
  return accessMode;
}

function getTrackLabel(track: "foundation" | "higher" | "volna" | null) {
  if (!track) return "No active track";
  if (track === "foundation") return "Foundation";
  if (track === "higher") return "Higher";
  return "Volna";
}

function getAccountSummaryText(
  track: "foundation" | "higher" | "volna" | null,
  accessMode: "trial" | "full" | "volna" | null
) {
  if (accessMode === "volna") {
    return "Your account is set up for the Volna student experience, including teacher-linked learning and assignments.";
  }

  if (track === "foundation") {
    return "Your account is currently focused on the Foundation learning path.";
  }

  if (track === "higher") {
    return "Your account is currently focused on the Higher learning path.";
  }

  return "Your account is ready, and more personalisation and learning tools can be managed from here.";
}

export default async function AccountPage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();
  const courseAccess = await getCurrentCourseAccess("gcse-russian", "foundation");
  const dashboard = await getDashboardInfo();

  if (!user) {
    return (
      <main className="space-y-8">
        <PageHeader
          title="Account"
          description="Your account overview, profile details, and settings hub."
        />

        <EmptyState
          title="You are not signed in"
          description="Log in to view your account overview and settings."
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
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <PageHeader
        title="Account"
        description="Your account overview, profile details, and settings hub."
      />

      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_320px] xl:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon={appIcons.user}>
                Account overview
              </Badge>

              <Badge tone="muted" icon={appIcons.layers}>
                {getTrackLabel(dashboard.track)}
              </Badge>

              <Badge tone="muted" icon={appIcons.userCheck}>
                {formatAccessLabel(dashboard.accessMode)}
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="app-title">Manage your student account</h2>
              <p className="app-subtitle max-w-2xl">
                {getAccountSummaryText(dashboard.track, dashboard.accessMode)}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/profile" variant="primary" icon={appIcons.user}>
                Open profile
              </Button>

              <Button href="/settings" variant="secondary" icon={appIcons.settings}>
                Open settings
              </Button>

              <Button href="/dashboard" variant="secondary" icon={appIcons.dashboard}>
                Back to dashboard
              </Button>
            </div>
          </div>

          <DashboardCard title="At a glance" className="h-full">
            <div className="space-y-4">
              <div className="rounded-xl bg-[var(--background-muted)] p-3">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                  Full name
                </div>
                <div className="font-semibold text-[var(--text-primary)]">
                  {profile?.full_name ?? "No name saved"}
                </div>
              </div>

              <div className="rounded-xl bg-[var(--background-muted)] p-3">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                  Email
                </div>
                <div className="font-semibold text-[var(--text-primary)]">
                  {user.email ?? "Not logged in"}
                </div>
              </div>

              <div className="rounded-xl bg-[var(--background-muted)] p-3">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                  Role
                </div>
                <div className="font-semibold text-[var(--text-primary)]">
                  {formatRoleLabel(dashboard.role)}
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Profile">
          <div className="space-y-3">
            <p>
              Update your display name, full name, and preset avatar from your profile
              area.
            </p>

            <Link
              href="/profile"
              className="inline-flex items-center gap-2 font-medium app-brand-text"
            >
              Open profile
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard title="Settings">
          <div className="space-y-3">
            <p>
              Manage your password and future account security settings from one place.
            </p>

            <Link
              href="/settings"
              className="inline-flex items-center gap-2 font-medium app-brand-text"
            >
              Open settings
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard title="Courses">
          <div className="space-y-3">
            <p>
              Return to your learning content, modules, and lessons whenever you are
              ready.
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

        <DashboardCard title="Dashboard">
          <div className="space-y-3">
            <p>
              Go back to your main student hub for progress, quick links, and next steps.
            </p>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 font-medium app-brand-text"
            >
              Open dashboard
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <DashboardCard title="Account details">
          <div className="space-y-3">
            <div>
              <span className="font-medium text-[var(--text-primary)]">Full name:</span>{" "}
              {profile?.full_name ?? "No name saved"}
            </div>

            <div>
              <span className="font-medium text-[var(--text-primary)]">
                Display name:
              </span>{" "}
              {profile?.display_name ?? "No display name saved"}
            </div>

            <div>
              <span className="font-medium text-[var(--text-primary)]">Email:</span>{" "}
              {user.email ?? "Not logged in"}
            </div>

            <div>
              <span className="font-medium text-[var(--text-primary)]">Role:</span>{" "}
              {formatRoleLabel(dashboard.role)}
            </div>

            <div>
              <span className="font-medium text-[var(--text-primary)]">
                Learning track:
              </span>{" "}
              {getTrackLabel(dashboard.track)}
            </div>

            <div>
              <span className="font-medium text-[var(--text-primary)]">Access mode:</span>{" "}
              {formatAccessLabel(courseAccess?.access_mode ?? dashboard.accessMode)}
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="What this page is for">
          <div className="space-y-3">
            <p>
              Account is now your overview page, while Profile and Settings handle the
              main editable parts of your student account.
            </p>

            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>• Profile for names and avatar</li>
              <li>• Settings for password and future security tools</li>
              <li>• Dashboard for learning progress and quick actions</li>
            </ul>
          </div>
        </DashboardCard>
      </section>
    </main>
  );
}

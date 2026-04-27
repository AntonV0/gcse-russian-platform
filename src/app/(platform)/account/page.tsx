import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import {
  getCurrentCourseAccess,
  getCurrentProfile,
  getCurrentUser,
} from "@/lib/auth/auth";
import { getCurrentPlanSummaryForUserDb } from "@/lib/billing/account-helpers";
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

function getVariantLabel(variant: "foundation" | "higher" | "volna" | null) {
  if (!variant) return "No active variant";
  if (variant === "foundation") return "Foundation";
  if (variant === "higher") return "Higher";
  return "Volna";
}

function getAccountSummaryText(
  variant: "foundation" | "higher" | "volna" | null,
  accessMode: "trial" | "full" | "volna" | null
) {
  if (accessMode === "volna") {
    return "Your account is set up for the Volna student experience, including teacher-linked learning and assignments.";
  }

  if (variant === "foundation") {
    return "Your account is currently focused on the Foundation learning path.";
  }

  if (variant === "higher") {
    return "Your account is currently focused on the Higher learning path.";
  }

  return "Your account is ready, and more personalisation and learning tools can be managed from here.";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB");
}

export default async function AccountPage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();
  const dashboard = await getDashboardInfo();
  const courseAccess = await getCurrentCourseAccess(
    "gcse-russian",
    dashboard.variant ?? "foundation"
  );

  if (!user) {
    return (
      <main className="space-y-8">
        <PageHeader
          title="Account"
          description="Overview, profile, and settings all live together in your account area."
        />

        <EmptyState
          title="You are not signed in"
          description="Log in to view your account overview and manage your student settings."
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
      </main>
    );
  }

  const currentPlan = await getCurrentPlanSummaryForUserDb(user.id);

  return (
    <main className="space-y-8">
      <PageHeader
        title="Account"
        description="Overview, profile, and settings all live together in your account area."
      />

      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_320px] xl:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="dashboard">
                Overview
              </Badge>

              <Badge tone="muted" icon="layers">
                {getVariantLabel(dashboard.variant)}
              </Badge>

              <Badge tone="muted" icon="userCheck">
                {formatAccessLabel(dashboard.accessMode)}
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="app-heading-hero">Your account overview</h2>
              <p className="app-subtitle max-w-2xl">
                {getAccountSummaryText(dashboard.variant, dashboard.accessMode)}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/profile" variant="primary" icon="user">
                Open profile
              </Button>

              <Button href="/settings" variant="secondary" icon="settings">
                Open settings
              </Button>

              <Button href="/dashboard" variant="secondary" icon="dashboard">
                Back to dashboard
              </Button>
            </div>
          </div>

          <DashboardCard title="At a glance" headingLevel={3} className="h-full">
            <div className="space-y-4">
              <div className="app-stat-tile">
                <div className="app-stat-label">Full name</div>
                <div className="app-stat-value">
                  {profile?.full_name ?? "No name saved"}
                </div>
              </div>

              <div className="app-stat-tile">
                <div className="app-stat-label">Email</div>
                <div className="app-stat-value">{user.email ?? "Not logged in"}</div>
              </div>

              <div className="app-stat-tile">
                <div className="app-stat-label">Role</div>
                <div className="app-stat-value">{formatRoleLabel(dashboard.role)}</div>
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
              Manage your password, appearance, and future account preferences from one
              place.
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
                Learning variant:
              </span>{" "}
              {getVariantLabel(dashboard.variant)}
            </div>

            <div>
              <span className="font-medium text-[var(--text-primary)]">Access mode:</span>{" "}
              {formatAccessLabel(courseAccess?.access_mode ?? dashboard.accessMode)}
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="How this area is organised">
          <div className="space-y-3">
            <p>
              Account is the overview page for this section, while Profile and Settings
              handle the main editable parts of your student account.
            </p>

            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>• Overview for account summary, access, and quick links</li>
              <li>• Profile for names and avatar</li>
              <li>• Settings for password, appearance, and future preferences</li>
            </ul>
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <DashboardCard title="Current plan">
          <div className="space-y-3">
            {currentPlan.hasPlan ? (
              <>
                <div>
                  <span className="font-medium text-[var(--text-primary)]">Plan:</span>{" "}
                  {currentPlan.planLabel ?? currentPlan.productName ?? "Unknown plan"}
                </div>

                <div>
                  <span className="font-medium text-[var(--text-primary)]">Price:</span>{" "}
                  {currentPlan.amountLabel ?? "—"}
                </div>

                <div>
                  <span className="font-medium text-[var(--text-primary)]">
                    Access mode:
                  </span>{" "}
                  {formatAccessLabel(currentPlan.accessMode)}
                </div>

                <div>
                  <span className="font-medium text-[var(--text-primary)]">Source:</span>{" "}
                  {currentPlan.source ?? "—"}
                </div>

                <div>
                  <span className="font-medium text-[var(--text-primary)]">Started:</span>{" "}
                  {formatDate(currentPlan.startsAt)}
                </div>

                <div>
                  <span className="font-medium text-[var(--text-primary)]">
                    Renews/ends:
                  </span>{" "}
                  {formatDate(currentPlan.endsAt)}
                </div>
              </>
            ) : (
              <p>You do not currently have an active paid course plan on this account.</p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard title="Upgrade status">
          <div className="space-y-3">
            {currentPlan.canUpgradeToHigher ? (
              <>
                <p>
                  Your account is currently eligible to upgrade from Foundation to Higher.
                </p>

                <div>
                  <span className="font-medium text-[var(--text-primary)]">
                    Available upgrade pricing:
                  </span>{" "}
                  {currentPlan.resolvedUpgradeSummary ?? "Upgrade pricing not resolved"}
                </div>

                <Link
                  href="/account/billing"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  View upgrade options
                  <span aria-hidden="true">→</span>
                </Link>
              </>
            ) : (
              <>
                <p>
                  No active Higher upgrade path is currently available for this account.
                </p>

                <Link
                  href="/account/billing"
                  className="inline-flex items-center gap-2 font-medium app-brand-text"
                >
                  View pricing
                  <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </div>
        </DashboardCard>
      </section>
    </main>
  );
}

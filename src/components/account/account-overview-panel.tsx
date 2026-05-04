import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import type { CurrentPlanSummary } from "@/lib/billing/account-helpers";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  formatAccessLabel,
  formatRoleLabel,
  getAccountSummaryText,
  getVariantLabel,
} from "./account-formatters";

export type AccountProfileSummary = {
  fullName: string | null;
  displayName: string | null;
};

export function AccountOverviewPanel({
  dashboard,
  profile,
  email,
  currentPlan,
}: {
  dashboard: DashboardInfo;
  profile: AccountProfileSummary;
  email: string | null | undefined;
  currentPlan: CurrentPlanSummary;
}) {
  const displayName = profile.displayName ?? profile.fullName ?? "Student";
  const profileStatus = profile.fullName && profile.displayName ? "Complete" : "Needs details";
  const planStatus = currentPlan.hasPlan
    ? (currentPlan.planLabel ?? currentPlan.productName ?? "Active plan")
    : "No paid plan";

  return (
    <section className="app-surface-brand app-section-padding-lg">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_360px] xl:items-start">
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

          <div className="grid gap-3 sm:grid-cols-2 xl:max-w-3xl">
            <div className="app-stat-tile">
              <div className="app-stat-label">Profile</div>
              <div className="app-stat-value">{profileStatus}</div>
            </div>

            <div className="app-stat-tile">
              <div className="app-stat-label">Plan</div>
              <div className="app-stat-value">{planStatus}</div>
            </div>

            <div className="app-stat-tile">
              <div className="app-stat-label">Course path</div>
              <div className="app-stat-value">{getVariantLabel(dashboard.variant)}</div>
            </div>

            <div className="app-stat-tile">
              <div className="app-stat-label">Access</div>
              <div className="app-stat-value">
                {formatAccessLabel(dashboard.accessMode)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/profile" variant="primary" icon="user">
              Open profile
            </Button>

            <Button href="/account/billing" variant="secondary" icon="billing">
              Manage billing
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
              <div className="app-stat-label">Display name</div>
              <div className="app-stat-value">{displayName}</div>
            </div>

            <div className="app-stat-tile">
              <div className="app-stat-label">Email</div>
              <div className="app-stat-value">{email ?? "Not logged in"}</div>
            </div>

            <div className="app-stat-tile">
              <div className="app-stat-label">Role</div>
              <div className="app-stat-value">{formatRoleLabel(dashboard.role)}</div>
            </div>

            <div className="rounded-xl border border-[var(--accent-decorative-border)] [background:var(--accent-gradient-soft)] p-3">
              <div className="text-sm font-bold text-[var(--text-primary)]">
                Next best action
              </div>
              <p className="mt-1 text-sm app-text-muted">
                {currentPlan.hasPlan
                  ? "Check your dashboard and keep learning from the next suggested step."
                  : "Choose the course access that matches your GCSE target."}
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </section>
  );
}

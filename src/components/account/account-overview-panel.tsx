import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
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
}: {
  dashboard: DashboardInfo;
  profile: AccountProfileSummary;
  email: string | null | undefined;
}) {
  return (
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
                {profile.fullName ?? "No name saved"}
              </div>
            </div>

            <div className="app-stat-tile">
              <div className="app-stat-label">Email</div>
              <div className="app-stat-value">{email ?? "Not logged in"}</div>
            </div>

            <div className="app-stat-tile">
              <div className="app-stat-label">Role</div>
              <div className="app-stat-value">{formatRoleLabel(dashboard.role)}</div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </section>
  );
}

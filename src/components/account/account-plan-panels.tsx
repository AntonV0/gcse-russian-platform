import Link from "next/link";
import type { ReactNode } from "react";
import AppIcon from "@/components/ui/app-icon";
import DashboardCard from "@/components/ui/dashboard-card";
import type { CurrentPlanSummary } from "@/lib/billing/account-helpers";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import { formatDate } from "./account-formatters";

export function AccountPlanPanels({
  currentPlan,
  dashboard,
}: {
  currentPlan: CurrentPlanSummary;
  dashboard: DashboardInfo;
}) {
  const planName =
    currentPlan.planLabel ?? currentPlan.productName ?? "Active course plan";
  const hasVolnaAccess = dashboard.accessMode === "volna";

  return (
    <section>
      <DashboardCard title="Course plan">
        {currentPlan.hasPlan ? (
          <div className="space-y-4">
            <div className="app-soft-panel p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-[var(--accent-ink)]">
                  <AppIcon icon="pricing" size={19} />
                </span>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{planName}</p>
                  <p className="mt-1 text-sm app-text-muted">
                    Your course plan is active. Billing details and upgrade options live
                    on the Billing page.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <PlanDetail label="Price">{currentPlan.amountLabel ?? "-"}</PlanDetail>
              <PlanDetail label="Renews/ends">
                {formatDate(currentPlan.endsAt)}
              </PlanDetail>
            </div>

            {currentPlan.canUpgradeToHigher ? (
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted-bg)] p-4">
                <p className="text-sm app-text-muted">
                  You can upgrade from Foundation to Higher from the Billing page.
                </p>
              </div>
            ) : null}

            <AccountBillingLink label="Manage course plan" />
          </div>
        ) : hasVolnaAccess ? (
          <div className="app-soft-panel p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-[var(--accent-ink)]">
                <AppIcon icon="school" size={19} />
              </span>
              <div>
                <p>Volna school access is active.</p>
                <p className="mt-1 text-sm app-text-muted">
                  No separate self-study plan is needed while you study through Volna.
                </p>
                <div className="mt-3">
                  <AccountBillingLink label="View course plan options" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="app-soft-panel p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-[var(--accent-ink)]">
                <AppIcon icon="pricing" size={19} />
              </span>
              <div>
                <p>No self-study plan is active yet.</p>
                <p className="mt-1 text-sm app-text-muted">
                  Compare Foundation, Higher, and Volna options when you are ready.
                </p>
                <div className="mt-3">
                  <AccountBillingLink label="Choose a course plan" />
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardCard>
    </section>
  );
}

function PlanDetail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="app-stat-tile">
      <div className="app-stat-label">{label}</div>
      <div className="app-stat-value">{children}</div>
    </div>
  );
}

function AccountBillingLink({ label }: { label: string }) {
  return (
    <Link
      href="/account/billing"
      className="inline-flex items-center gap-2 font-medium app-brand-text"
    >
      {label}
      <AppIcon icon="arrowRight" size={15} />
    </Link>
  );
}

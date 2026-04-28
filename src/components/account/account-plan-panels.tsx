import Link from "next/link";
import type { ReactNode } from "react";
import DashboardCard from "@/components/ui/dashboard-card";
import type { CurrentPlanSummary } from "@/lib/billing/account-helpers";
import { formatAccessLabel, formatDate } from "./account-formatters";

export function AccountPlanPanels({ currentPlan }: { currentPlan: CurrentPlanSummary }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <DashboardCard title="Current plan">
        <div className="space-y-3">
          {currentPlan.hasPlan ? (
            <>
              <PlanDetail label="Plan">
                {currentPlan.planLabel ?? currentPlan.productName ?? "Unknown plan"}
              </PlanDetail>
              <PlanDetail label="Price">{currentPlan.amountLabel ?? "-"}</PlanDetail>
              <PlanDetail label="Access mode">
                {formatAccessLabel(currentPlan.accessMode)}
              </PlanDetail>
              <PlanDetail label="Source">{currentPlan.source ?? "-"}</PlanDetail>
              <PlanDetail label="Started">{formatDate(currentPlan.startsAt)}</PlanDetail>
              <PlanDetail label="Renews/ends">
                {formatDate(currentPlan.endsAt)}
              </PlanDetail>
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

              <PlanDetail label="Available upgrade pricing">
                {currentPlan.resolvedUpgradeSummary ?? "Upgrade pricing not resolved"}
              </PlanDetail>

              <AccountBillingLink label="View upgrade options" />
            </>
          ) : (
            <>
              <p>
                No active Higher upgrade path is currently available for this account.
              </p>
              <AccountBillingLink label="View pricing" />
            </>
          )}
        </div>
      </DashboardCard>
    </section>
  );
}

function PlanDetail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className="font-medium text-[var(--text-primary)]">{label}:</span> {children}
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
      <span aria-hidden="true">-&gt;</span>
    </Link>
  );
}

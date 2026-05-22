import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import type { CurrentPlanSummary } from "@/lib/billing/account-helpers";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import type { AppIconKey } from "@/lib/shared/icons";
import { getAccountSummaryText, getStudyRouteLabel } from "./account-formatters";

export type AccountProfileSummary = {
  fullName: string | null;
  displayName: string | null;
  parentGuardianName?: string | null;
  parentGuardianEmail?: string | null;
  parentGuardianConsentConfirmed?: boolean;
};

export function AccountOverviewPanel({
  dashboard,
  profile,
  currentPlan,
}: {
  dashboard: DashboardInfo;
  profile: AccountProfileSummary;
  currentPlan: CurrentPlanSummary;
}) {
  const isProfileComplete = Boolean(profile.fullName && profile.displayName);
  const profileStatus = isProfileComplete ? "Complete" : "Needs details";
  const planStatus = currentPlan.hasPlan
    ? (currentPlan.planLabel ?? currentPlan.productName ?? "Active plan")
    : dashboard.accessMode === "volna"
      ? "Included through Volna"
      : "No self-study plan yet";
  const studyRoute = getStudyRouteLabel(dashboard.variant, dashboard.accessMode);
  const nextAction = getAccountNextAction({
    isProfileComplete,
    hasPlan: currentPlan.hasPlan,
    accessMode: dashboard.accessMode,
  });
  const nextActionVariant = nextAction.href === "/dashboard" ? "journey" : "primary";

  return (
    <section className="app-surface-strong app-section-padding-lg">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <Badge tone="info" icon="dashboard">
            Account hub
          </Badge>
        </div>

        <div className="space-y-2">
          <h1 className="app-heading-hero">Your GCSE Russian account</h1>
          <p className="app-subtitle max-w-3xl">
            {getAccountSummaryText(dashboard.variant, dashboard.accessMode)}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="app-stat-tile">
            <div className="app-stat-label">Profile</div>
            <div className="app-stat-value">{profileStatus}</div>
          </div>

          <div className="app-stat-tile">
            <div className="app-stat-label">Course plan</div>
            <div className="app-stat-value">{planStatus}</div>
          </div>

          <div className="app-stat-tile">
            <div className="app-stat-label">Study route</div>
            <div className="app-stat-value">{studyRoute}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]/78 p-4 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="app-stat-label">Next best action</div>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {nextAction.description}
            </p>
          </div>

          <Button
            href={nextAction.href}
            variant={nextActionVariant}
            icon={nextAction.icon}
            className="shrink-0"
          >
            {nextAction.label}
          </Button>
        </div>
      </div>
    </section>
  );
}

function getAccountNextAction({
  isProfileComplete,
  hasPlan,
  accessMode,
}: {
  isProfileComplete: boolean;
  hasPlan: boolean;
  accessMode: DashboardInfo["accessMode"];
}): {
  label: string;
  href: string;
  icon: AppIconKey;
  description: string;
} {
  if (!isProfileComplete) {
    return {
      label: "Finish profile",
      href: "/profile",
      icon: "user",
      description: "Add the name and avatar you want to see while studying.",
    };
  }

  if (accessMode === "volna") {
    return {
      label: "Go to dashboard",
      href: "/dashboard",
      icon: "dashboard",
      description: "Continue with lessons, assignments, and teacher-linked study.",
    };
  }

  if (!hasPlan) {
    return {
      label: "Choose a course plan",
      href: "/account/billing",
      icon: "billing",
      description: "Compare Foundation, Higher, and Volna options when you are ready.",
    };
  }

  return {
    label: "Continue learning",
    href: "/dashboard",
    icon: "dashboard",
    description: "Head back to your dashboard and pick up from the next useful step.",
  };
}

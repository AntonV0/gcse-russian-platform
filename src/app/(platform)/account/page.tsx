import { AccountDetailsPanels } from "@/components/account/account-details-panels";
import { AccountOverviewPanel } from "@/components/account/account-overview-panel";
import { AccountPlanPanels } from "@/components/account/account-plan-panels";
import { AccountQuickLinks } from "@/components/account/account-quick-links";
import { SignedOutAccountPanel } from "@/components/account/signed-out-account-panel";
import PageHeader from "@/components/layout/page-header";
import {
  getCurrentCourseAccess,
  getCurrentProfile,
  getCurrentUser,
} from "@/lib/auth/auth";
import { getCurrentPlanSummaryForUserDb } from "@/lib/billing/account-helpers";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";

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

        <SignedOutAccountPanel />
      </main>
    );
  }

  const currentPlan = await getCurrentPlanSummaryForUserDb(user.id);
  const profileSummary = {
    fullName: profile?.full_name ?? null,
    displayName: profile?.display_name ?? null,
  };

  return (
    <main className="space-y-8">
      <PageHeader
        title="Account"
        description="Overview, profile, and settings all live together in your account area."
      />

      <AccountOverviewPanel
        dashboard={dashboard}
        profile={profileSummary}
        email={user.email}
      />

      <AccountQuickLinks />

      <AccountDetailsPanels
        dashboard={dashboard}
        profile={profileSummary}
        email={user.email}
        courseAccessMode={courseAccess?.access_mode}
      />

      <AccountPlanPanels currentPlan={currentPlan} />
    </main>
  );
}

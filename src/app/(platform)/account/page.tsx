import { AccountDetailsPanels } from "@/components/account/account-details-panels";
import { AccountOverviewPanel } from "@/components/account/account-overview-panel";
import { AccountPlanPanels } from "@/components/account/account-plan-panels";
import { AccountQuickLinks } from "@/components/account/account-quick-links";
import { SignedOutAccountPanel } from "@/components/account/signed-out-account-panel";
import PageHeader from "@/components/layout/page-header";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";
import { getCurrentPlanSummaryForUserDb } from "@/lib/billing/account-helpers";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";

export default async function AccountPage() {
  const [user, profile, dashboard] = await Promise.all([
    getCurrentUser(),
    getCurrentProfile(),
    getDashboardInfo(),
  ]);

  if (!user) {
    return (
      <main className="space-y-8">
        <PageHeader
          title="Account overview"
          description="A quick place to check your profile, course plan, billing, and settings."
        />

        <SignedOutAccountPanel />
      </main>
    );
  }

  const profileSummary = {
    fullName: profile?.full_name ?? null,
    displayName: profile?.display_name ?? null,
  };
  const currentPlan = await getCurrentPlanSummaryForUserDb(user.id);

  return (
    <main className="space-y-8">
      <AccountOverviewPanel
        dashboard={dashboard}
        profile={profileSummary}
        currentPlan={currentPlan}
      />

      <AccountQuickLinks />

      <AccountDetailsPanels
        dashboard={dashboard}
        profile={profileSummary}
        email={user.email}
        courseAccessMode={dashboard.accessMode}
      />

      <AccountPlanPanels currentPlan={currentPlan} dashboard={dashboard} />
    </main>
  );
}

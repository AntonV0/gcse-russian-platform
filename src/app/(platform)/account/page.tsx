import { AccountDetailsPanels } from "@/components/account/account-details-panels";
import { AccountOverviewPanel } from "@/components/account/account-overview-panel";
import { AccountPlanPanels } from "@/components/account/account-plan-panels";
import { AccountQuickLinks } from "@/components/account/account-quick-links";
import { SignedOutAccountPanel } from "@/components/account/signed-out-account-panel";
import LearningSheet, {
  LearningSheetHeader,
  LearningSheetSection,
} from "@/components/ui/learning-sheet";
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
      <main>
        <LearningSheet>
          <LearningSheetHeader
            eyebrow="Account"
            title="Account overview"
            description="A quick place to check your profile, course plan, billing, and settings."
          />

          <LearningSheetSection>
            <SignedOutAccountPanel />
          </LearningSheetSection>
        </LearningSheet>
      </main>
    );
  }

  const profileSummary = {
    fullName: profile?.full_name ?? null,
    displayName: profile?.display_name ?? null,
    parentGuardianName: profile?.parent_guardian_name ?? null,
    parentGuardianEmail: profile?.parent_guardian_email ?? null,
    parentGuardianPhone: profile?.parent_guardian_phone ?? null,
    parentGuardianConsentConfirmed: Boolean(profile?.parent_guardian_consent_confirmed),
  };
  const currentPlan = await getCurrentPlanSummaryForUserDb(user.id);

  return (
    <main>
      <LearningSheet>
        <LearningSheetSection divided={false}>
          <AccountOverviewPanel
            dashboard={dashboard}
            profile={profileSummary}
            currentPlan={currentPlan}
          />
        </LearningSheetSection>

        <LearningSheetSection>
          <AccountQuickLinks />
        </LearningSheetSection>

        <LearningSheetSection>
          <AccountDetailsPanels
            dashboard={dashboard}
            profile={profileSummary}
            email={user.email}
            courseAccessMode={dashboard.accessMode}
          />
        </LearningSheetSection>

        <LearningSheetSection>
          <AccountPlanPanels currentPlan={currentPlan} dashboard={dashboard} />
        </LearningSheetSection>
      </LearningSheet>
    </main>
  );
}

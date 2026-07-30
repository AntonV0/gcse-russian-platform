import AppShell from "@/components/layout/app-shell";
import PageContainer from "@/components/layout/page-container";
import PlatformSidebar from "@/components/layout/platform-sidebar";
import AppearancePreferenceSync from "@/components/providers/appearance-preference-sync";
import PublicAccentOverride from "@/components/providers/public-accent-override";
import { DevMarkerProvider } from "@/components/providers/dev-marker-provider";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";
import {
  getCurrentAppearancePreferences,
  getCurrentProfile,
  getCurrentUser,
} from "@/lib/auth/auth";
import { getDashboardInfo, type DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import { getPlatformSidebarNextUp } from "@/lib/dashboard/sidebar-next-up";

function ResourceAccessBanner({ dashboard }: { dashboard: DashboardInfo }) {
  if (dashboard.role === "guest") {
    return (
      <FeedbackBanner
        tone="info"
        icon="preview"
        title="Explore the platform before creating an account"
        description="Public resources are open to browse. Create an account when you want trial lessons, saved progress, mock attempts, and account tools."
      >
        <div className="app-mobile-action-stack flex flex-wrap gap-2">
          <Button href="/signup?from=app" variant="primary" size="sm" icon="create">
            Start trial
          </Button>
          <Button href="/login?from=app" variant="secondary" size="sm" icon="user">
            Log in
          </Button>
        </div>
      </FeedbackBanner>
    );
  }

  if (dashboard.role === "student" && dashboard.accessMode === "trial") {
    return (
      <FeedbackBanner
        tone="info"
        icon="unlocked"
        title="Trial access"
        description="You can explore trial-visible content and public resources. Full course lessons, richer exam practice, and tier-specific access unlock from Billing."
      >
        <Button href="/account/billing" variant="secondary" size="sm" icon="billing">
          Review access
        </Button>
      </FeedbackBanner>
    );
  }

  if (dashboard.role === "student" && !dashboard.accessMode) {
    return (
      <FeedbackBanner
        tone="warning"
        icon="lock"
        title="No active course access"
        description="You can still browse public resources. Choose a course plan to unlock lessons, progress tracking, and account-based practice."
      >
        <Button href="/account/billing" variant="primary" size="sm" icon="billing">
          Choose access
        </Button>
      </FeedbackBanner>
    );
  }

  return null;
}

export default async function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, dashboard, profile, appearancePreferences] = await Promise.all([
    getCurrentUser(),
    getDashboardInfo(),
    getCurrentProfile(),
    getCurrentAppearancePreferences(),
  ]);
  const userShell = user ? { email: user.email, variant: dashboard.variant } : null;
  const sidebarNextUp = await getPlatformSidebarNextUp(dashboard);
  const appShell = (
    <AppShell user={userShell}>
      <PageContainer>
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <div className="lg:sticky lg:top-[var(--sticky-site-offset)] lg:max-h-[calc(100dvh_-_var(--sticky-site-offset)_-_1rem)] lg:self-start">
            <PlatformSidebar
              role={dashboard.role}
              accessMode={dashboard.accessMode}
              variant={dashboard.variant}
              userEmail={user?.email}
              userDisplayName={profile?.display_name || profile?.full_name}
              nextUp={sidebarNextUp}
            />
          </div>

          <section className="min-w-0 space-y-4">
            <ResourceAccessBanner dashboard={dashboard} />
            {children}
          </section>
        </div>
      </PageContainer>
    </AppShell>
  );

  return (
    <DevMarkerProvider isAdmin={dashboard.role === "admin"}>
      <AppearancePreferenceSync
        themePreference={appearancePreferences?.theme_preference}
        accentPreference={appearancePreferences?.accent_preference}
      />
      {user ? (
        appShell
      ) : (
        <div data-accent="blue">
          <PublicAccentOverride />
          {appShell}
        </div>
      )}
    </DevMarkerProvider>
  );
}

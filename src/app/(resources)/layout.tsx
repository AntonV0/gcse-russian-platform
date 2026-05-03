import AppShell from "@/components/layout/app-shell";
import PageContainer from "@/components/layout/page-container";
import PlatformSidebar from "@/components/layout/platform-sidebar";
import { DevMarkerProvider } from "@/components/providers/dev-marker-provider";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";
import { getCurrentUser } from "@/lib/auth/auth";
import { getDashboardInfo, type DashboardInfo } from "@/lib/dashboard/dashboard-helpers";

function ResourceAccessBanner({ dashboard }: { dashboard: DashboardInfo }) {
  if (dashboard.role === "guest") {
    return (
      <FeedbackBanner
        tone="info"
        icon="preview"
        title="Explore the platform before creating an account"
        description="Public resources are open to browse. Create an account when you want trial lessons, saved progress, mock attempts, and account tools."
      >
        <div className="flex flex-wrap gap-2">
          <Button href="/signup" variant="primary" size="sm" icon="create">
            Start trial
          </Button>
          <Button href="/login" variant="secondary" size="sm" icon="user">
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
  const [user, dashboard] = await Promise.all([
    getCurrentUser(),
    getDashboardInfo(),
  ]);
  const userShell = user ? { email: user.email } : null;

  return (
    <DevMarkerProvider isAdmin={dashboard.role === "admin"}>
      <AppShell user={userShell}>
        <PageContainer>
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            <div className="lg:sticky lg:top-[var(--sticky-site-offset)] lg:max-h-[calc(100dvh-var(--sticky-site-offset)-1rem)] lg:self-start">
              <PlatformSidebar
                role={dashboard.role}
                accessMode={dashboard.accessMode}
              />
            </div>

            <section className="min-w-0 space-y-4">
              <ResourceAccessBanner dashboard={dashboard} />
              {children}
            </section>
          </div>
        </PageContainer>
      </AppShell>
    </DevMarkerProvider>
  );
}

import type { Metadata } from "next";
import AppShell from "@/components/layout/app-shell";
import PageContainer from "@/components/layout/page-container";
import PlatformSidebar from "@/components/layout/platform-sidebar";
import { DevMarkerProvider } from "@/components/providers/dev-marker-provider";
import { getCurrentUser } from "@/lib/auth/auth";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import { noIndexRobots } from "@/lib/seo/site";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, dashboard] = await Promise.all([getCurrentUser(), getDashboardInfo()]);

  return (
    <DevMarkerProvider isAdmin={dashboard.role === "admin"}>
      <AppShell user={user ? { email: user.email } : null}>
        <PageContainer>
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            <div className="lg:sticky lg:top-[var(--sticky-site-offset)] lg:max-h-[calc(100dvh-var(--sticky-site-offset)-1rem)] lg:self-start">
              <PlatformSidebar role={dashboard.role} accessMode={dashboard.accessMode} />
            </div>

            <section className="min-w-0">{children}</section>
          </div>
        </PageContainer>
      </AppShell>
    </DevMarkerProvider>
  );
}

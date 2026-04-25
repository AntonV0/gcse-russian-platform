import type { Metadata } from "next";
import { redirect } from "next/navigation";
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

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const dashboard = await getDashboardInfo();

  return (
    <DevMarkerProvider isAdmin={dashboard.role === "admin"}>
      <AppShell user={{ email: user.email }}>
        <PageContainer>
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            <div className="lg:sticky lg:top-[var(--sticky-site-offset)]">
              <PlatformSidebar role={dashboard.role} accessMode={dashboard.accessMode} />
            </div>

            <section className="min-w-0">{children}</section>
          </div>
        </PageContainer>
      </AppShell>
    </DevMarkerProvider>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageContainer from "@/components/layout/page-container";
import PlatformSidebar from "@/components/layout/platform-sidebar";
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
    <PageContainer>
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <div className="lg:sticky lg:top-6">
          <PlatformSidebar role={dashboard.role} accessMode={dashboard.accessMode} />
        </div>

        <section className="min-w-0">{children}</section>
      </div>
    </PageContainer>
  );
}

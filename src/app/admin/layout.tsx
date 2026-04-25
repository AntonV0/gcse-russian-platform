import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminRouteTracker from "@/components/admin/admin-route-tracker";
import { noIndexRobots } from "@/lib/seo/site";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const isAdmin = await requireAdminAccess();

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="overflow-x-clip bg-[var(--background-muted)]">
      <AdminRouteTracker />

      <div className="grid min-h-[calc(100vh-var(--site-header-height))] grid-cols-[272px_minmax(0,1fr)]">
        <div className="sticky top-[var(--site-header-height)] h-[calc(100vh-var(--site-header-height))] border-r border-[var(--border)] bg-[var(--background-elevated)]">
          <AdminSidebar />
        </div>

        <main className="min-w-0 px-5 py-5 md:px-7 md:py-6 xl:px-10 2xl:px-14">
          {children}
        </main>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminRouteTracker from "@/components/admin/admin-route-tracker";
import AppShell from "@/components/layout/app-shell";
import { DevMarkerProvider } from "@/components/providers/dev-marker-provider";
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
    <DevMarkerProvider isAdmin>
      <AppShell user={{ email: user.email }}>
        <div className="overflow-x-clip bg-[var(--background-muted)]">
          <AdminRouteTracker />

          <div className="border-b border-[var(--border)] bg-[var(--background-muted)] px-4 py-4 lg:hidden">
            <details className="app-card overflow-hidden">
              <summary className="app-focus-ring flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--text-primary)]">
                <span>Admin navigation</span>
                <span className="text-xs font-medium uppercase tracking-[0.12em] app-text-soft">
                  Menu
                </span>
              </summary>

              <div className="max-h-[72vh] overflow-y-auto border-t border-[var(--border-subtle)]">
                <AdminSidebar />
              </div>
            </details>
          </div>

          <div className="grid min-h-[calc(100vh-var(--site-header-height))] lg:grid-cols-[272px_minmax(0,1fr)]">
            <div className="sticky top-[var(--site-header-height)] hidden h-[calc(100vh-var(--site-header-height))] border-r border-[var(--border)] bg-[var(--background-elevated)] lg:block">
              <AdminSidebar />
            </div>

            <main className="min-w-0 px-4 py-4 sm:px-5 md:px-7 md:py-6 xl:px-10 2xl:px-14">
              {children}
            </main>
          </div>
        </div>
      </AppShell>
    </DevMarkerProvider>
  );
}

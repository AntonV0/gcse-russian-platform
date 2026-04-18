import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import AdminSidebar from "@/components/admin/admin-sidebar";

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
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="grid min-h-screen md:grid-cols-[260px_minmax(0,1fr)]">
        <AdminSidebar />

        <main className="min-w-0 bg-[var(--background-muted)] px-6 py-6 xl:px-10 2xl:px-14">
          {children}
        </main>
      </div>
    </div>
  );
}

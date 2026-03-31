import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { requireAdminAccess } from "@/lib/admin-auth";
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
    <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
      <AdminSidebar />
      <main className="bg-gray-50 p-6">{children}</main>
    </div>
  );
}

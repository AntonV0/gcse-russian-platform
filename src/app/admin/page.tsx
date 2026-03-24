import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { requireAdminAccess } from "@/lib/admin-auth";

export default async function AdminPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <main>
      <PageHeader
        title="Admin Panel"
        description="Internal content and platform management tools."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/question-sets" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Question Sets">
              Create and manage reusable question sets.
            </DashboardCard>
          </div>
        </Link>
        <Link href="/admin/question-sets/templates" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Question Set Templates">
              Create and reuse structured content templates.
            </DashboardCard>
          </div>
        </Link>
      </section>
    </main>
  );
}

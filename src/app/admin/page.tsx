import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";

export default async function AdminPage() {
  return (
    <main>
      <PageHeader
        title="Admin Panel"
        description="Internal content and platform management tools."
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* CONTENT (NEW - VERY IMPORTANT) */}
        <Link href="/admin/content" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Content">
              Manage courses, modules, and lessons.
            </DashboardCard>
          </div>
        </Link>

        {/* EXISTING */}
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

        {/* FUTURE (placeholders - optional but recommended) */}
        <Link href="/admin/assignments" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Assignments">
              Manage homework and submissions.
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/teaching-groups" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Teaching Groups">
              Organise students and classes.
            </DashboardCard>
          </div>
        </Link>
      </section>
    </main>
  );
}

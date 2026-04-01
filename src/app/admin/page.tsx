import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";

export default async function AdminPage() {
  return (
    <main>
      <PageHeader
        title="Admin Panel"
        description="Internal content, users, and teaching management tools."
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/content" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Content">
              Manage courses, variants, modules, and lessons.
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/question-sets" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Question Sets">
              Create and manage reusable question sets.
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/question-sets/templates" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Templates">
              Manage reusable question set templates.
            </DashboardCard>
          </div>
        </Link>

        <Link href="/teacher/assignments" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Assignments">
              Review and manage teacher assignments.
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/teaching-groups" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Teaching Groups">
              View teaching groups, membership, and structure.
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/students" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Students">
              View student accounts and access groupings.
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/teachers" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Teachers">
              View admin and teaching accounts.
            </DashboardCard>
          </div>
        </Link>
      </section>
    </main>
  );
}

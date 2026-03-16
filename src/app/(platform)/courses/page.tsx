import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";

export default function CoursesPage() {
  return (
    <main>
      <PageHeader
        title="Courses"
        description="Choose a course to continue learning."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <Link href="/courses/gcse-russian" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="GCSE Russian">
              The main live course for this platform MVP.
            </DashboardCard>
          </div>
        </Link>

        <DashboardCard title="A-Level Russian">
          Planned for later using the same platform structure.
        </DashboardCard>
      </section>
    </main>
  );
}
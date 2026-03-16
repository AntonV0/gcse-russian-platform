import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";

export default function DashboardPage() {
  return (
    <main>
      <PageHeader
        title="Dashboard"
        description="This will become the student dashboard for progress, lessons, and revision."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardCard title="Current course">
          GCSE Russian
        </DashboardCard>

        <DashboardCard title="Progress">
          No lessons completed yet.
        </DashboardCard>

        <DashboardCard title="Next step">
          Build the first course and lesson structure.
        </DashboardCard>
      </section>
    </main>
  );
}
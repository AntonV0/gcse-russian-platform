import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";

export default function FamilyModulePage() {
  return (
    <main>
      <PageHeader
        title="Family and relationships"
        description="Example topic module for GCSE Russian content."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <DashboardCard title="Lesson 1: Talking about family">
          Placeholder lesson card.
        </DashboardCard>

        <DashboardCard title="Lesson 2: Describing relationships">
          Placeholder lesson card.
        </DashboardCard>
      </section>
    </main>
  );
}
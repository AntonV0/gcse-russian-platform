import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";

export default function GrammarPage() {
  return (
    <main className="space-y-6">
      <PageHeader
        title="Grammar"
        description="Grammar explanations, examples, and future reference materials will live here."
      />

      <DashboardCard title="Coming soon">
        This page will become the home for grammar notes, explanations, and structured
        revision.
      </DashboardCard>
    </main>
  );
}

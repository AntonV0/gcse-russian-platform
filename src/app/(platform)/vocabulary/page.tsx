import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";

export default function VocabularyPage() {
  return (
    <main className="space-y-6">
      <PageHeader
        title="Vocabulary"
        description="Word lists, topic vocabulary, and future revision tools will live here."
      />

      <DashboardCard title="Coming soon">
        This page will become the home for vocabulary lists, topic sets, and revision
        support.
      </DashboardCard>
    </main>
  );
}

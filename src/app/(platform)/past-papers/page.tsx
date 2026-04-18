import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";

export default function PastPapersPage() {
  return (
    <main className="space-y-6">
      <PageHeader
        title="Past Papers"
        description="Exam-style practice, paper navigation, and revision material will live here."
      />

      <DashboardCard title="Coming soon">
        This page will become the home for past papers, exam practice, and revision
        resources.
      </DashboardCard>
    </main>
  );
}

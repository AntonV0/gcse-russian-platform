import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";

export default function SettingsPage() {
  return (
    <main className="space-y-6">
      <PageHeader
        title="Settings"
        description="Account settings, email updates, and password management will live here."
      />

      <DashboardCard title="Coming soon">
        This page will become the home for account settings and security controls.
      </DashboardCard>
    </main>
  );
}

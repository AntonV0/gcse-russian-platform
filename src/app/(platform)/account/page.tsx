import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";

export default function AccountPage() {
  return (
    <main>
      <PageHeader
        title="Account"
        description="This page will later contain profile, billing, and access details."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <DashboardCard title="Plan">
          No subscription connected yet.
        </DashboardCard>

        <DashboardCard title="Access mode">
          Development mode only.
        </DashboardCard>
      </section>
    </main>
  );
}
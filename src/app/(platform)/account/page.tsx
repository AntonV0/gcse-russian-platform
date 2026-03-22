import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { getCurrentCourseAccess, getCurrentProfile, getCurrentUser } from "@/lib/auth";
import { getDashboardInfo } from "@/lib/dashboard-helpers";

export default async function AccountPage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();
  const courseAccess = await getCurrentCourseAccess("gcse-russian", "foundation");
  const dashboard = await getDashboardInfo();

  return (
    <main>
      <PageHeader
        title="Account"
        description="Your profile and access information."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <DashboardCard title="Full name">
          {profile?.full_name ?? "No name saved"}
        </DashboardCard>

        <DashboardCard title="Email">
          {user?.email ?? "Not logged in"}
        </DashboardCard>

        <DashboardCard title="Role">
          {dashboard?.role ?? "No role found"}
        </DashboardCard>

        <DashboardCard title="Access mode">
          {courseAccess?.access_mode ?? "No access found"}
        </DashboardCard>
      </section>
    </main>
  );
}
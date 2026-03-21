import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";
import { getCourseProgressSummary } from "@/lib/progress";
import { getDashboardInfo } from "@/lib/dashboard-helpers";

function formatLabel(value: string | null) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();
  const dashboard = await getDashboardInfo();

  const progressSummary =
    dashboard.track && dashboard.role === "student"
      ? await getCourseProgressSummary("gcse-russian", dashboard.track)
      : { completedLessons: 0 };

  return (
    <main>
      <PageHeader
        title="Dashboard"
        description={
          user
            ? `Welcome back${profile?.full_name ? `, ${profile.full_name}` : ""}.`
            : "Dashboard"
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        {/* Always show */}
        <DashboardCard title="Current course">
          GCSE Russian
        </DashboardCard>

        <DashboardCard title="Account">
          {user?.email ?? "Not logged in"}
        </DashboardCard>

        {/* Role */}
        <DashboardCard title="Role">
          {formatLabel(dashboard.role)}
        </DashboardCard>

        {/* Student-only cards */}
        {dashboard.role === "student" && (
          <>
            <DashboardCard title="Learning track">
              {formatLabel(dashboard.track)}
            </DashboardCard>

            <DashboardCard title="Access type">
              {formatLabel(dashboard.accessMode)}
            </DashboardCard>

            <DashboardCard title="Completed lessons">
              {String(progressSummary.completedLessons)}
            </DashboardCard>
          </>
        )}
      </section>
    </main>
  );
}
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import {
  getCurrentCourseAccess,
  getCurrentProfile,
  getCurrentUser,
} from "@/lib/auth";
import { getCourseProgressSummary } from "@/lib/progress";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();
  const courseAccess = await getCurrentCourseAccess("gcse-russian");
  const progressSummary = await getCourseProgressSummary("gcse-russian");

  return (
    <main>
      <PageHeader
        title="Dashboard"
        description={
          user
            ? `Welcome back${profile?.full_name ? `, ${profile.full_name}` : ""}.`
            : "This will become the student dashboard for progress, lessons, and revision."
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardCard title="Current course">GCSE Russian</DashboardCard>

        <DashboardCard title="Access type">
          {courseAccess
            ? courseAccess.access_mode.charAt(0).toUpperCase() +
              courseAccess.access_mode.slice(1)
            : "No access found"}
        </DashboardCard>

        <DashboardCard title="Account">
          {user?.email ?? "Not logged in"}
        </DashboardCard>

        <DashboardCard title="Completed lessons">
          {String(progressSummary.completedLessons)}
        </DashboardCard>
      </section>
    </main>
  );
}
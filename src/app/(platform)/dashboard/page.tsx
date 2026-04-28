import { AdminDashboardPanel } from "@/components/dashboard/admin-dashboard-panel";
import { GuestDashboardPanel } from "@/components/dashboard/guest-dashboard-panel";
import { StudentDashboardPanel } from "@/components/dashboard/student-dashboard-panel";
import { TeacherDashboardPanel } from "@/components/dashboard/teacher-dashboard-panel";
import PageHeader from "@/components/layout/page-header";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getDashboardNextStep,
  getStudentLearningPlan,
} from "@/lib/dashboard/learning-plan";
import { getStudentDashboardActivity } from "@/lib/dashboard/student-next-actions";
import { getCourseProgressSummary } from "@/lib/progress/progress";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();
  const dashboard = await getDashboardInfo();

  const progressSummary =
    dashboard.variant && dashboard.role === "student"
      ? await getCourseProgressSummary("gcse-russian", dashboard.variant)
      : { completedLessons: 0 };

  const [learningPlan, dashboardActivity] =
    dashboard.role === "student"
      ? await Promise.all([
          getStudentLearningPlan(dashboard.variant, progressSummary.completedLessons),
          getStudentDashboardActivity(user?.id),
        ])
      : [
          {
            totalLessons: 0,
            completedLessons: progressSummary.completedLessons,
            progressPercent: 0,
            nextLesson: null,
          },
          null,
        ];

  const welcomeName = profile?.full_name ? `, ${profile.full_name}` : "";
  const nextStep = getDashboardNextStep(
    dashboard.variant,
    dashboard.accessMode,
    progressSummary.completedLessons,
    learningPlan
  );

  return (
    <main className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={
          user
            ? `Welcome back${welcomeName}.`
            : "Your learning dashboard and quick access hub."
        }
      />

      {dashboard.role === "guest" ? <GuestDashboardPanel /> : null}

      {dashboard.role === "student" ? (
        <StudentDashboardPanel
          dashboard={dashboard}
          completedLessons={progressSummary.completedLessons}
          learningPlan={learningPlan}
          nextStep={nextStep}
          activity={dashboardActivity!}
        />
      ) : null}

      {dashboard.role === "teacher" ? (
        <TeacherDashboardPanel dashboard={dashboard} userEmail={user?.email} />
      ) : null}

      {dashboard.role === "admin" ? <AdminDashboardPanel dashboard={dashboard} /> : null}
    </main>
  );
}

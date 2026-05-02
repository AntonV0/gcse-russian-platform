import { AdminDashboardPanel } from "@/components/dashboard/admin-dashboard-panel";
import { GuestDashboardPanel } from "@/components/dashboard/guest-dashboard-panel";
import { StudentDashboardPanel } from "@/components/dashboard/student-dashboard-panel";
import { TeacherDashboardPanel } from "@/components/dashboard/teacher-dashboard-panel";
import { TrialTierChoicePanel } from "@/components/dashboard/trial-tier-choice-panel";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
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
  const hasActiveStudentPath =
    dashboard.role === "student" &&
    dashboard.variant !== null &&
    dashboard.accessState !== "trial_needs_tier" &&
    dashboard.accessState !== "expired";

  const progressSummary = hasActiveStudentPath
    ? await getCourseProgressSummary("gcse-russian", dashboard.variant!)
    : { completedLessons: 0 };

  const [learningPlan, dashboardActivity] = hasActiveStudentPath
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
            : "Preview the GCSE Russian learning dashboard before creating a trial account."
        }
      />

      {dashboard.role === "guest" ? <GuestDashboardPanel /> : null}

      {dashboard.role === "student" && dashboard.accessState === "trial_needs_tier" ? (
        <TrialTierChoicePanel />
      ) : null}

      {dashboard.role === "student" && dashboard.accessState === "expired" ? (
        <ExpiredAccessPanel />
      ) : null}

      {hasActiveStudentPath ? (
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

function ExpiredAccessPanel() {
  return (
    <EmptyState
      icon="lock"
      iconTone="warning"
      title="Your course access is not active"
      description="This account has previous access history, so it is not treated as a fresh trial. Review billing to restore Foundation or Higher access."
      action={
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/account/billing" variant="primary" icon="billing">
            Review billing
          </Button>
          <Button href="/past-papers" variant="secondary" icon="pastPapers">
            Open past papers
          </Button>
        </div>
      }
    />
  );
}

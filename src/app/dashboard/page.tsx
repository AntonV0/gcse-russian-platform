import { GuestDashboardPanel } from "@/components/dashboard/guest-dashboard-panel";
import OnboardingEventTracker from "@/components/onboarding/onboarding-event-tracker";
import { StudentDashboardPanel } from "@/components/dashboard/student-dashboard-panel";
import { TeacherDashboardPanel } from "@/components/dashboard/teacher-dashboard-panel";
import { TrialTierChoicePanel } from "@/components/dashboard/trial-tier-choice-panel";
import { redirect } from "next/navigation";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import LearningSheet, {
  LearningSheetHeader,
  LearningSheetSection,
} from "@/components/ui/learning-sheet";
import { getCurrentUser } from "@/lib/auth/auth";
import { getDefaultActiveCourseSlug } from "@/lib/courses/active-course";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getDashboardNextStep,
  getStudentLearningPlan,
} from "@/lib/dashboard/learning-plan";
import { getStudentDashboardActivity } from "@/lib/dashboard/student-next-actions";
import { getCourseProgressSummary } from "@/lib/progress/progress";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const dashboard = await getDashboardInfo();

  if (dashboard.role === "admin") {
    redirect("/admin");
  }

  const activeCourseSlug = getDefaultActiveCourseSlug();
  const hasActiveStudentPath =
    dashboard.role === "student" &&
    dashboard.variant !== null &&
    dashboard.accessState !== "trial_needs_tier" &&
    dashboard.accessState !== "expired";

  const progressSummary = hasActiveStudentPath
    ? await getCourseProgressSummary(activeCourseSlug, dashboard.variant!)
    : { completedLessons: 0 };

  const [learningPlan, dashboardActivity] = hasActiveStudentPath
    ? await Promise.all([
        getStudentLearningPlan(
          dashboard.variant,
          progressSummary.completedLessons,
          activeCourseSlug
        ),
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

  const nextStep = getDashboardNextStep(
    dashboard.variant,
    dashboard.accessMode,
    progressSummary.completedLessons,
    learningPlan
  );

  return (
    <main>
      {hasActiveStudentPath ? (
        <OnboardingEventTracker eventName="dashboard_arrived" onlyExistingJourney />
      ) : null}
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
    </main>
  );
}

function ExpiredAccessPanel() {
  return (
    <LearningSheet>
      <LearningSheetHeader
        eyebrow="Access paused"
        title="Your course access is not active"
        description="Restore your course plan to bring back the focused dashboard, saved progress prompts, and next lesson recommendations."
        actions={
          <>
            <Button href="/account/billing" variant="primary" icon="billing">
              Review billing
            </Button>
            <Button href="/past-papers" variant="secondary" icon="pastPapers">
              Open past papers
            </Button>
          </>
        }
      />

      <LearningSheetSection>
        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCard title="Keep revising">
            <div className="space-y-3">
              <p>Public resources remain available while access is restored.</p>
              <Button href="/grammar" variant="secondary" size="sm" icon="grammar">
                Open grammar
              </Button>
            </div>
          </DashboardCard>
          <DashboardCard title="Practise papers">
            <div className="space-y-3">
              <p>Use official paper links for exam-style practice and review.</p>
              <Button href="/past-papers" variant="secondary" size="sm" icon="pastPapers">
                Past papers
              </Button>
            </div>
          </DashboardCard>
          <DashboardCard title="Restore focus">
            <div className="space-y-3">
              <p>Billing options reopen the full next-step dashboard experience.</p>
              <Button
                href="/account/billing"
                variant="secondary"
                size="sm"
                icon="billing"
              >
                Billing
              </Button>
            </div>
          </DashboardCard>
        </div>
      </LearningSheetSection>
    </LearningSheet>
  );
}

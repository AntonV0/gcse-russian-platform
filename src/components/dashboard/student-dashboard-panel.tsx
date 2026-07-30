import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import LearningSheet, {
  LearningSheetHeader,
  LearningSheetSection,
} from "@/components/ui/learning-sheet";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import { getActiveCoursePath } from "@/lib/access/routes";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getDashboardAccessLabel,
  getDashboardNextStep,
  getDashboardVariantLabel,
  type StudentLearningPlan,
} from "@/lib/dashboard/learning-plan";
import {
  getLearningMilestone,
  getMasterySignals,
} from "@/lib/dashboard/mastery-signals";
import {
  getStudentDashboardActionQueue,
  getStudentDashboardStudyPrompts,
  getStudentDashboardWins,
  type StudentDashboardActivity,
} from "@/lib/dashboard/student-next-actions";

import {
  AssignmentFocusCard,
  MockAttemptFocusCard,
  NextActionQueueCard,
  RecentFeedbackCard,
  RecentWinsCard,
} from "./student-dashboard-panel/activity-cards";
import {
  AccessFocusCard,
  getWeakestMasterySignals,
  LearningMilestoneCard,
  LearningSnapshotCard,
  SkillReadinessCard,
  StudyPromptCard,
  TodayFocusSteps,
  WeakAreasCard,
} from "./student-dashboard-panel/focus-cards";
import {
  DashboardLinkCard,
  StudentSupportCard,
} from "./student-dashboard-panel/link-cards";

type DashboardNextStep = ReturnType<typeof getDashboardNextStep>;

export function StudentDashboardPanel({
  dashboard,
  completedLessons,
  learningPlan,
  nextStep,
  activity,
}: {
  dashboard: DashboardInfo;
  completedLessons: number;
  learningPlan: StudentLearningPlan;
  nextStep: DashboardNextStep;
  activity: StudentDashboardActivity;
}) {
  const nextActions = getStudentDashboardActionQueue(activity, nextStep, {
    preferLearningPlan: dashboard.accessMode === "volna",
  });
  const primaryAction = nextActions[0];
  const masterySignals = getMasterySignals({ learningPlan, activity });
  const milestone = getLearningMilestone({ learningPlan, activity });
  const weakAreas = getWeakestMasterySignals(masterySignals);
  const studyPrompts = getStudentDashboardStudyPrompts(activity, learningPlan);
  const recentWins = getStudentDashboardWins(activity, learningPlan);

  return (
    <LearningSheet>
      <LearningSheetHeader
        eyebrow="Dashboard"
        title={`Today's focus: ${primaryAction.title}`}
        description={primaryAction.description}
        badges={
          <>
                <Badge tone="info" icon="school">
                  GCSE Russian
                </Badge>

                <Badge tone="muted" icon="learning">
                  {getDashboardVariantLabel(dashboard.variant)}
                </Badge>

                <Badge tone="muted" icon="student">
                  {getDashboardAccessLabel(dashboard.accessMode)}
                </Badge>
                <Badge tone={primaryAction.badgeTone} icon={primaryAction.icon}>
                  {primaryAction.badgeLabel}
                </Badge>
                {primaryAction.metaLabel ? (
                  <Badge tone="muted">{primaryAction.metaLabel}</Badge>
                ) : null}
          </>
        }
        actions={
          <>
              <Button
                href={primaryAction.href}
                variant="journey"
                icon={primaryAction.icon}
              >
                {primaryAction.label}
              </Button>

              {primaryAction.href !== nextStep.href ? (
                <Button href={nextStep.href} variant="secondary" icon={nextStep.icon}>
                  {nextStep.label}
                </Button>
              ) : null}

              {dashboard.accessState === "trial" &&
              (dashboard.variant === "foundation" || dashboard.variant === "higher") ? (
                <Button
                  href={getActiveCoursePath(
                    dashboard.variant === "foundation" ? "higher" : "foundation"
                  )}
                  variant="secondary"
                  icon="preview"
                >
                  Sample {dashboard.variant === "foundation" ? "Higher" : "Foundation"}
                </Button>
              ) : null}

              {dashboard.accessState === "full_foundation" ? (
                <Button href="/account/billing" variant="secondary" icon="billing">
                  Upgrade to Higher
                </Button>
              ) : null}

              <Button href="/mock-exams" variant="secondary" icon="mockExam">
                Mock exams
              </Button>
          </>
        }
      >
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] xl:items-start">
          <TodayFocusSteps action={primaryAction} prompts={studyPrompts} />
          <div className="grid gap-4">
            <LearningSnapshotCard
              dashboard={dashboard}
              completedLessons={completedLessons}
              learningPlan={learningPlan}
            />
            <AccessFocusCard dashboard={dashboard} />
          </div>
        </div>
      </LearningSheetHeader>

      <LearningSheetSection>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryStatCard
          title="Lessons complete"
          value={learningPlan.completedLessons}
          description={
            learningPlan.totalLessons > 0
              ? `${learningPlan.progressPercent}% of your path`
              : "Ready when content opens"
          }
          icon="completed"
          tone="brand"
          compact
        />
        <SummaryStatCard
          title="Assignments"
          value={activity.stats.pendingAssignments}
          description="waiting to start"
          icon="assignments"
          tone={activity.stats.pendingAssignments > 0 ? "warning" : "default"}
          compact
        />
        <SummaryStatCard
          title="Draft mocks"
          value={activity.stats.draftMockAttempts}
          description="unfinished attempts"
          icon="mockExam"
          tone={activity.stats.draftMockAttempts > 0 ? "warning" : "default"}
          compact
        />
        <SummaryStatCard
          title="Feedback"
          value={activity.stats.recentFeedback}
          description="recent reviews"
          icon="feedback"
          tone={activity.stats.recentFeedback > 0 ? "success" : "default"}
          compact
        />
        </div>
      </LearningSheetSection>

      <LearningSheetSection>
        <div className="grid gap-4 xl:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.15fr)]">
        <WeakAreasCard weakAreas={weakAreas} />
        <StudyPromptCard prompts={studyPrompts} />
        </div>
      </LearningSheetSection>

      <LearningSheetSection>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <SkillReadinessCard masterySignals={masterySignals} />
        <LearningMilestoneCard milestone={milestone} />
        </div>
      </LearningSheetSection>

      <LearningSheetSection>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.7fr)_minmax(300px,0.8fr)]">
        <NextActionQueueCard actions={nextActions} />
        <RecentWinsCard wins={recentWins} />
        <RecentFeedbackCard feedbackItems={activity.recentFeedback} />
        </div>
      </LearningSheetSection>

      <LearningSheetSection>
        <div className="grid gap-4 xl:grid-cols-2">
        <AssignmentFocusCard activity={activity} />
        <MockAttemptFocusCard activity={activity} />
        </div>
      </LearningSheetSection>

      <LearningSheetSection>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardLinkCard
          title="Course path"
          href="/courses"
          linkLabel="Open courses"
          description="Continue lessons in order and keep your GCSE Russian progress moving."
        />
        <DashboardLinkCard
          title="Vocabulary"
          href="/vocabulary"
          linkLabel="Practise words"
          description="Build recall with short vocabulary sessions before lessons or homework."
        />
        <DashboardLinkCard
          title="Grammar reference"
          href="/grammar"
          linkLabel="Open grammar"
          description="Check grammar explanations, sentence patterns, and exam-useful rules."
        />
        <DashboardLinkCard
          title="Exam practice"
          href="/mock-exams"
          linkLabel="Open mock exams"
          description="Resume draft attempts, review marked work, or start a new GCSE-style mock."
        />
        </div>
      </LearningSheetSection>

      <LearningSheetSection muted>
        <StudentSupportCard accessMode={dashboard.accessMode} />
      </LearningSheetSection>
    </LearningSheet>
  );
}

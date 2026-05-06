import type { AppIconKey } from "@/lib/shared/icons";
import type { StudentLearningPlan } from "./learning-plan";
import type { StudentDashboardActivity } from "./student-next-actions";

export type MasterySignal = {
  title: string;
  value: number;
  label: string;
  evidence: string;
  icon: AppIconKey;
  tone: "brand" | "success" | "warning" | "default";
};

export type LearningMilestone = {
  title: string;
  description: string;
  badge: string;
  icon: AppIconKey;
  tone: "brand" | "success" | "warning" | "default";
};

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getReviewedAssignmentPercent(activity: StudentDashboardActivity) {
  if (activity.stats.totalAssignments === 0) return 100;
  return clampPercent(
    (activity.stats.reviewedAssignments / activity.stats.totalAssignments) * 100
  );
}

function getMockTotal(activity: StudentDashboardActivity) {
  return (
    activity.stats.draftMockAttempts +
    activity.stats.submittedMockAttempts +
    activity.stats.markedMockAttempts
  );
}

function getMarkedMockPercent(activity: StudentDashboardActivity) {
  const mockTotal = getMockTotal(activity);
  if (mockTotal === 0) return 0;
  return clampPercent((activity.stats.markedMockAttempts / mockTotal) * 100);
}

function getRecentFeedbackPercent(activity: StudentDashboardActivity) {
  return clampPercent(activity.stats.recentFeedback * 25);
}

function getReadinessTone(value: number, hasWarning = false): MasterySignal["tone"] {
  if (hasWarning) return "warning";
  if (value >= 72) return "success";
  if (value >= 36) return "brand";
  return "default";
}

export function getMasterySignals({
  learningPlan,
  activity,
}: {
  learningPlan: StudentLearningPlan;
  activity: StudentDashboardActivity;
}): MasterySignal[] {
  const lessonProgress = learningPlan.progressPercent;
  const assignmentPercent = getReviewedAssignmentPercent(activity);
  const mockPercent = getMarkedMockPercent(activity);
  const feedbackPercent = getRecentFeedbackPercent(activity);
  const vocabularyValue = clampPercent(
    lessonProgress * 0.68 + assignmentPercent * 0.22 + feedbackPercent * 0.1
  );
  const grammarValue = clampPercent(
    lessonProgress * 0.58 + assignmentPercent * 0.27 + feedbackPercent * 0.15
  );
  const listeningValue = clampPercent(
    mockPercent * 0.5 + lessonProgress * 0.32 + feedbackPercent * 0.18
  );
  const speakingValue = clampPercent(
    assignmentPercent * 0.5 + lessonProgress * 0.3 + feedbackPercent * 0.2
  );
  const examValue = clampPercent(
    mockPercent * 0.56 + assignmentPercent * 0.22 + lessonProgress * 0.22
  );

  return [
    {
      title: "Vocabulary",
      value: vocabularyValue,
      label:
        learningPlan.totalLessons > 0
          ? `${learningPlan.completedLessons} of ${learningPlan.totalLessons} lessons`
          : "Ready when lessons open",
      evidence: "Lesson exposure, assignments, and recent review.",
      icon: "vocabulary",
      tone: getReadinessTone(vocabularyValue),
    },
    {
      title: "Grammar",
      value: grammarValue,
      label:
        activity.stats.reviewedAssignments > 0
          ? `${activity.stats.reviewedAssignments} reviewed task${
              activity.stats.reviewedAssignments === 1 ? "" : "s"
            }`
          : "Build through lessons",
      evidence: "Course progress with teacher-reviewed evidence.",
      icon: "grammar",
      tone: getReadinessTone(grammarValue),
    },
    {
      title: "Listening",
      value: listeningValue,
      label:
        activity.stats.markedMockAttempts > 0
          ? `${activity.stats.markedMockAttempts} marked mock${
              activity.stats.markedMockAttempts === 1 ? "" : "s"
            }`
          : "Practise with audio tasks",
      evidence: "Mock evidence plus listening lesson exposure.",
      icon: "listening",
      tone: getReadinessTone(listeningValue),
    },
    {
      title: "Speaking",
      value: speakingValue,
      label:
        activity.stats.pendingAssignments > 0
          ? `${activity.stats.pendingAssignments} task${
              activity.stats.pendingAssignments === 1 ? "" : "s"
            } waiting`
          : "Ready for phrase practice",
      evidence: "Assignments, lesson recall, and feedback loops.",
      icon: "speaking",
      tone: getReadinessTone(speakingValue, activity.stats.pendingAssignments > 0),
    },
    {
      title: "Exam technique",
      value: examValue,
      label:
        getMockTotal(activity) > 0
          ? `${getMockTotal(activity)} mock attempt${
              getMockTotal(activity) === 1 ? "" : "s"
            }`
          : "Mocks ready when needed",
      evidence: "Mock attempts, reviewed work, and course coverage.",
      icon: "exam",
      tone: getReadinessTone(examValue, activity.stats.draftMockAttempts > 0),
    },
  ];
}

export function getLearningMilestone({
  learningPlan,
  activity,
}: {
  learningPlan: StudentLearningPlan;
  activity: StudentDashboardActivity;
}): LearningMilestone {
  if (activity.stats.recentFeedback > 0) {
    return {
      title: "Feedback secured",
      description:
        "You have recent reviewed work to revisit. Use it to turn corrections into marks.",
      badge: `${activity.stats.recentFeedback} recent review${
        activity.stats.recentFeedback === 1 ? "" : "s"
      }`,
      icon: "feedback",
      tone: "success",
    };
  }

  if (learningPlan.completedLessons > 0) {
    return {
      title: "Lesson momentum",
      description:
        "Your course path is moving. The next milestone is another completed lesson and one round of active recall.",
      badge: `${learningPlan.completedLessons} lesson${
        learningPlan.completedLessons === 1 ? "" : "s"
      } secured`,
      icon: "completed",
      tone: "brand",
    };
  }

  if (activity.stats.pendingAssignments > 0) {
    return {
      title: "Assignment ready",
      description:
        "A teacher-set task is waiting. Completing it creates the clearest next evidence of progress.",
      badge: `${activity.stats.pendingAssignments} waiting`,
      icon: "assignments",
      tone: "warning",
    };
  }

  return {
    title: "First milestone ready",
    description:
      "Start the next lesson, open the practice, and mark it complete when the core phrases feel steady.",
    badge: "Start today",
    icon: "star",
    tone: "default",
  };
}

import { getStudentAssignmentsWithDetailsDb } from "@/lib/assignments/assignment-helpers-db";
import { getDueDateStatus } from "@/lib/assignments/assignment-status";
import type {
  AssignmentSubmissionStatus,
  StudentAssignmentCard,
} from "@/lib/assignments/assignment-helpers-db";
import { getMockExamSetByIdDb } from "@/lib/mock-exams/queries";
import { normalizeMockExamAttempt } from "@/lib/mock-exams/normalizers";
import { MOCK_EXAM_ATTEMPT_SELECT } from "@/lib/mock-exams/selects";
import type { DbMockExamAttempt, DbMockExamSet } from "@/lib/mock-exams/types";
import type { AppIconKey } from "@/lib/shared/icons";
import { createClient } from "@/lib/supabase/server";
import type { StudentLearningPlan } from "./learning-plan";

type ActionTone = "info" | "success" | "warning" | "danger" | "muted";

export type StudentDashboardAction = {
  id: string;
  title: string;
  description: string;
  href: string;
  label: string;
  icon: AppIconKey;
  badgeLabel: string;
  badgeTone: ActionTone;
  metaLabel?: string;
};

export type StudentDashboardFeedbackItem = {
  id: string;
  source: "assignment" | "mock_exam";
  title: string;
  description: string;
  href: string;
  badgeLabel: string;
  reviewedAt: string | null;
  feedbackPreview: string | null;
};

export type StudentDashboardMockAttemptItem = {
  attempt: DbMockExamAttempt;
  exam: DbMockExamSet;
  href: string;
};

export type StudentDashboardActivity = {
  assignments: StudentAssignmentCard[];
  pendingAssignments: StudentAssignmentCard[];
  submittedAssignments: StudentAssignmentCard[];
  reviewedAssignments: StudentAssignmentCard[];
  draftMockAttempts: StudentDashboardMockAttemptItem[];
  submittedMockAttempts: StudentDashboardMockAttemptItem[];
  markedMockAttempts: StudentDashboardMockAttemptItem[];
  recentFeedback: StudentDashboardFeedbackItem[];
  stats: {
    totalAssignments: number;
    pendingAssignments: number;
    submittedAssignments: number;
    reviewedAssignments: number;
    draftMockAttempts: number;
    submittedMockAttempts: number;
    markedMockAttempts: number;
    recentFeedback: number;
  };
};

export type StudentDashboardFallbackAction = {
  title: string;
  description: string;
  href: string;
  label: string;
  icon: AppIconKey;
};

export type StudentDashboardStudyPrompt = StudentDashboardAction & {
  kind: "vocabulary" | "grammar" | "exam";
};

export type StudentDashboardWin = {
  id: string;
  title: string;
  description: string;
  icon: AppIconKey;
  badgeLabel: string;
  badgeTone: ActionTone;
};

function getSubmissionStatus(
  assignment: StudentAssignmentCard
): AssignmentSubmissionStatus {
  return assignment.submission?.status ?? "not_started";
}

function getTimeValue(value: string | null | undefined) {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getAssignmentDueValue({ assignment }: StudentAssignmentCard) {
  if (!assignment.due_at) return Number.MAX_SAFE_INTEGER;
  return getTimeValue(assignment.due_at);
}

function sortAssignmentsByUrgency(a: StudentAssignmentCard, b: StudentAssignmentCard) {
  const statusOrder = {
    overdue: 0,
    soon: 1,
    normal: 2,
    none: 3,
  };
  const aStatus = getDueDateStatus(a.assignment.due_at);
  const bStatus = getDueDateStatus(b.assignment.due_at);
  const statusDiff = statusOrder[aStatus] - statusOrder[bStatus];

  if (statusDiff !== 0) return statusDiff;

  return getAssignmentDueValue(a) - getAssignmentDueValue(b);
}

function getDueBadge(assignment: StudentAssignmentCard) {
  const status = getDueDateStatus(assignment.assignment.due_at);

  if (status === "overdue") {
    return { label: "Overdue", tone: "danger" as const };
  }

  if (status === "soon") {
    return { label: "Due soon", tone: "warning" as const };
  }

  if (status === "none") {
    return { label: "No due date", tone: "muted" as const };
  }

  return { label: "Assigned", tone: "info" as const };
}

function getAssignmentAction(assignment: StudentAssignmentCard): StudentDashboardAction {
  const dueBadge = getDueBadge(assignment);
  const itemCount = assignment.items.length;

  return {
    id: `assignment-${assignment.assignment.id}`,
    title: assignment.assignment.title,
    description:
      assignment.assignment.instructions ??
      `${itemCount} ${itemCount === 1 ? "task" : "tasks"} ready for your next homework session.`,
    href: `/assignments/${assignment.assignment.id}`,
    label: "Open assignment",
    icon: "assignments",
    badgeLabel: dueBadge.label,
    badgeTone: dueBadge.tone,
    metaLabel: `${itemCount} ${itemCount === 1 ? "item" : "items"}`,
  };
}

function getMockAttemptAction(
  item: StudentDashboardMockAttemptItem
): StudentDashboardAction {
  return {
    id: `mock-${item.attempt.id}`,
    title: item.exam.title,
    description:
      item.attempt.status === "draft"
        ? "A mock exam attempt is saved as a draft. Continue it while the context is fresh."
        : "Your mock exam has been submitted and is ready to review.",
    href: item.href,
    label: item.attempt.status === "draft" ? "Resume mock" : "Review attempt",
    icon: "mockExam",
    badgeLabel: item.attempt.status === "draft" ? "Draft mock" : "Mock feedback",
    badgeTone: item.attempt.status === "draft" ? "warning" : "success",
    metaLabel: `${item.attempt.awarded_marks ?? "-"} / ${
      item.attempt.total_marks_snapshot
    } marks`,
  };
}

function getFeedbackAction(
  feedback: StudentDashboardFeedbackItem
): StudentDashboardAction {
  return {
    id: `feedback-${feedback.id}`,
    title: feedback.title,
    description: feedback.description,
    href: feedback.href,
    label: "Review feedback",
    icon: "feedback",
    badgeLabel: feedback.badgeLabel,
    badgeTone: "success",
    metaLabel: feedback.feedbackPreview ?? undefined,
  };
}

function getFallbackAction(
  fallback: StudentDashboardFallbackAction
): StudentDashboardAction {
  return {
    id: "learning-plan",
    title: fallback.title,
    description: fallback.description,
    href: fallback.href,
    label: fallback.label,
    icon: fallback.icon,
    badgeLabel: "Course path",
    badgeTone: "info",
  };
}

function isUrgentAction(
  action: StudentDashboardAction | null
): action is StudentDashboardAction {
  return action?.badgeLabel === "Overdue" || action?.badgeLabel === "Due soon";
}

async function getStudentMockAttemptItems(
  userId: string | null | undefined
): Promise<StudentDashboardMockAttemptItem[]> {
  if (!userId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mock_exam_attempts")
    .select(MOCK_EXAM_ATTEMPT_SELECT)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("Error fetching dashboard mock attempts:", { userId, error });
    return [];
  }

  const attempts = (data ?? []).map(normalizeMockExamAttempt);
  const examIds = [...new Set(attempts.map((attempt) => attempt.mock_exam_id))];
  const examEntries = await Promise.all(
    examIds.map(async (examId) => [examId, await getMockExamSetByIdDb(examId)] as const)
  );
  const examsById = new Map(examEntries.filter((entry) => entry[1] !== null));

  return attempts.flatMap((attempt) => {
    const exam = examsById.get(attempt.mock_exam_id);

    if (!exam) return [];

    return [
      {
        attempt,
        exam,
        href: `/mock-exams/${exam.slug}/attempts/${attempt.id}`,
      },
    ];
  });
}

function getAssignmentFeedbackItems(
  assignments: StudentAssignmentCard[]
): StudentDashboardFeedbackItem[] {
  return assignments
    .filter((assignment) => {
      const submission = assignment.submission;
      return (
        submission?.status === "reviewed" ||
        submission?.feedback != null ||
        submission?.mark != null
      );
    })
    .map(({ assignment, submission }) => ({
      id: `assignment-${assignment.id}`,
      source: "assignment" as const,
      title: assignment.title,
      description: "Your teacher has reviewed this assignment.",
      href: `/assignments/${assignment.id}`,
      badgeLabel: "Assignment feedback",
      reviewedAt: submission?.reviewed_at ?? submission?.submitted_at ?? null,
      feedbackPreview: submission?.feedback ?? null,
    }));
}

function getMockFeedbackItems(
  attempts: StudentDashboardMockAttemptItem[]
): StudentDashboardFeedbackItem[] {
  return attempts
    .filter((item) => item.attempt.status === "marked" || item.attempt.feedback)
    .map((item) => ({
      id: `mock-${item.attempt.id}`,
      source: "mock_exam" as const,
      title: item.exam.title,
      description: `${item.attempt.awarded_marks ?? "-"} / ${
        item.attempt.total_marks_snapshot
      } marks recorded.`,
      href: item.href,
      badgeLabel: "Mock feedback",
      reviewedAt: item.attempt.submitted_at ?? item.attempt.updated_at,
      feedbackPreview: item.attempt.feedback,
    }));
}

export async function getStudentDashboardActivity(
  userId: string | null | undefined
): Promise<StudentDashboardActivity> {
  const [assignments, mockAttempts] = await Promise.all([
    getStudentAssignmentsWithDetailsDb(),
    getStudentMockAttemptItems(userId),
  ]);

  const pendingAssignments = assignments
    .filter((assignment) => getSubmissionStatus(assignment) === "not_started")
    .sort(sortAssignmentsByUrgency);
  const submittedAssignments = assignments.filter(
    (assignment) => getSubmissionStatus(assignment) === "submitted"
  );
  const reviewedAssignments = assignments
    .filter((assignment) => getSubmissionStatus(assignment) === "reviewed")
    .sort(
      (a, b) =>
        getTimeValue(b.submission?.reviewed_at) - getTimeValue(a.submission?.reviewed_at)
    );
  const draftMockAttempts = mockAttempts.filter(
    (item) => item.attempt.status === "draft"
  );
  const submittedMockAttempts = mockAttempts.filter(
    (item) => item.attempt.status === "submitted"
  );
  const markedMockAttempts = mockAttempts.filter(
    (item) => item.attempt.status === "marked"
  );
  const recentFeedback = [
    ...getAssignmentFeedbackItems(assignments),
    ...getMockFeedbackItems(markedMockAttempts),
  ]
    .sort((a, b) => getTimeValue(b.reviewedAt) - getTimeValue(a.reviewedAt))
    .slice(0, 4);

  return {
    assignments,
    pendingAssignments,
    submittedAssignments,
    reviewedAssignments,
    draftMockAttempts,
    submittedMockAttempts,
    markedMockAttempts,
    recentFeedback,
    stats: {
      totalAssignments: assignments.length,
      pendingAssignments: pendingAssignments.length,
      submittedAssignments: submittedAssignments.length,
      reviewedAssignments: reviewedAssignments.length,
      draftMockAttempts: draftMockAttempts.length,
      submittedMockAttempts: submittedMockAttempts.length,
      markedMockAttempts: markedMockAttempts.length,
      recentFeedback: recentFeedback.length,
    },
  };
}

export function getStudentDashboardActionQueue(
  activity: StudentDashboardActivity,
  fallback: StudentDashboardFallbackAction,
  options: { preferLearningPlan?: boolean } = {}
): StudentDashboardAction[] {
  const learningPlanAction = getFallbackAction(fallback);
  const assignmentAction = activity.pendingAssignments[0]
    ? getAssignmentAction(activity.pendingAssignments[0])
    : null;
  const activityActions = [
    assignmentAction,
    activity.draftMockAttempts[0]
      ? getMockAttemptAction(activity.draftMockAttempts[0])
      : null,
    activity.recentFeedback[0] ? getFeedbackAction(activity.recentFeedback[0]) : null,
  ].filter((action): action is StudentDashboardAction => action !== null);

  if (!options.preferLearningPlan) {
    return [...activityActions, learningPlanAction];
  }

  if (isUrgentAction(assignmentAction)) {
    return [
      assignmentAction,
      learningPlanAction,
      ...activityActions.filter((action) => action.id !== assignmentAction.id),
    ];
  }

  return [learningPlanAction, ...activityActions];
}

export function getStudentDashboardStudyPrompts(
  activity: StudentDashboardActivity,
  learningPlan: StudentLearningPlan
): StudentDashboardStudyPrompt[] {
  const nextLessonMeta = learningPlan.nextLesson
    ? `Lesson ${learningPlan.nextLesson.lessonNumber}`
    : learningPlan.totalLessons > 0
      ? `${learningPlan.completedLessons} of ${learningPlan.totalLessons} lessons`
      : "Quick recall";

  return [
    {
      kind: "vocabulary",
      id: "prompt-vocabulary",
      title: learningPlan.nextLesson
        ? "Warm up the next lesson vocabulary"
        : "Build a five-word recall set",
      description: learningPlan.nextLesson
        ? `Preview key words before ${learningPlan.nextLesson.title} so the lesson feels lighter.`
        : "Pick a small word set and test recall before opening a longer study session.",
      href: "/vocabulary",
      label: "Practise vocabulary",
      icon: "vocabulary",
      badgeLabel: "Vocabulary",
      badgeTone: "info",
      metaLabel: nextLessonMeta,
    },
    {
      kind: "grammar",
      id: "prompt-grammar",
      title:
        activity.stats.recentFeedback > 0
          ? "Fix one grammar point from feedback"
          : activity.stats.pendingAssignments > 0
            ? "Check grammar before homework"
            : "Refresh one useful grammar pattern",
      description:
        activity.stats.recentFeedback > 0
          ? "Open the grammar reference, choose one correction, and reuse it in a fresh sentence."
          : "Use the grammar hub as a short reference stop before writing or translation work.",
      href: "/grammar",
      label: "Open grammar",
      icon: "grammar",
      badgeLabel: "Grammar",
      badgeTone: activity.stats.pendingAssignments > 0 ? "warning" : "info",
      metaLabel:
        activity.stats.reviewedAssignments > 0
          ? `${activity.stats.reviewedAssignments} reviewed`
          : "Reference",
    },
    {
      kind: "exam",
      id: "prompt-exam",
      title:
        activity.stats.draftMockAttempts > 0
          ? "Finish the saved mock while it is fresh"
          : "Do one exam-style practice block",
      description:
        activity.stats.markedMockAttempts > 0
          ? "Use marked mock evidence to choose the next paper skill to sharpen."
          : "Start small: one timed section is enough to build exam rhythm.",
      href: activity.draftMockAttempts[0]?.href ?? "/mock-exams",
      label: activity.stats.draftMockAttempts > 0 ? "Resume mock" : "Open mock exams",
      icon: "mockExam",
      badgeLabel: "Exam prep",
      badgeTone: activity.stats.draftMockAttempts > 0 ? "warning" : "info",
      metaLabel:
        activity.stats.markedMockAttempts > 0
          ? `${activity.stats.markedMockAttempts} marked`
          : "GCSE practice",
    },
  ];
}

export function getStudentDashboardWins(
  activity: StudentDashboardActivity,
  learningPlan: StudentLearningPlan
): StudentDashboardWin[] {
  const wins: StudentDashboardWin[] = [];

  if (learningPlan.completedLessons > 0) {
    wins.push({
      id: "lessons-complete",
      title: "Lesson progress secured",
      description: `${learningPlan.completedLessons} lesson${
        learningPlan.completedLessons === 1 ? "" : "s"
      } completed on this path.`,
      icon: "completed",
      badgeLabel: "Course progress",
      badgeTone: "success",
    });
  }

  if (activity.stats.reviewedAssignments > 0) {
    wins.push({
      id: "assignments-reviewed",
      title: "Teacher feedback bank",
      description: `${activity.stats.reviewedAssignments} assignment${
        activity.stats.reviewedAssignments === 1 ? "" : "s"
      } reviewed and ready to learn from.`,
      icon: "feedback",
      badgeLabel: "Reviewed work",
      badgeTone: "success",
    });
  }

  if (activity.stats.markedMockAttempts > 0) {
    wins.push({
      id: "mocks-marked",
      title: "Exam evidence recorded",
      description: `${activity.stats.markedMockAttempts} marked mock attempt${
        activity.stats.markedMockAttempts === 1 ? "" : "s"
      } available for revision decisions.`,
      icon: "mockExam",
      badgeLabel: "Mock progress",
      badgeTone: "success",
    });
  }

  if (
    activity.stats.totalAssignments > 0 &&
    activity.stats.pendingAssignments === 0 &&
    activity.stats.submittedAssignments === 0
  ) {
    wins.push({
      id: "assignments-clear",
      title: "Homework queue clear",
      description: "No teacher-set assignments are currently waiting to be started.",
      icon: "assignments",
      badgeLabel: "Clear queue",
      badgeTone: "success",
    });
  }

  if (wins.length > 0) {
    return wins.slice(0, 3);
  }

  return [
    {
      id: "first-win-ready",
      title: "First win is close",
      description:
        "Start with one lesson, one vocabulary recall, or one short grammar check.",
      icon: "star",
      badgeLabel: "Start today",
      badgeTone: "info",
    },
  ];
}

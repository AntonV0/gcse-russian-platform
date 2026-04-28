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
  fallback: StudentDashboardFallbackAction
) {
  return [
    activity.pendingAssignments[0]
      ? getAssignmentAction(activity.pendingAssignments[0])
      : null,
    activity.draftMockAttempts[0]
      ? getMockAttemptAction(activity.draftMockAttempts[0])
      : null,
    activity.recentFeedback[0] ? getFeedbackAction(activity.recentFeedback[0]) : null,
    getFallbackAction(fallback),
  ].filter((action): action is StudentDashboardAction => action !== null);
}

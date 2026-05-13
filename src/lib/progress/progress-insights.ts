import type { StudentDashboardActivity } from "@/lib/dashboard/student-next-actions";
import type { MasterySignal } from "@/lib/dashboard/mastery-signals";
import type { AppIconKey } from "@/lib/shared/icons";
import type { VariantPathProgressSummary } from "@/lib/courses/path-progress";

type BadgeTone = "default" | "muted" | "info" | "success" | "warning" | "danger";

export type ProgressDomainSummary = {
  id: "vocabulary" | "grammar" | "exam-prep";
  title: string;
  value: number;
  label: string;
  evidence: string;
  href: string;
  actionLabel: string;
  icon: AppIconKey;
  tone: BadgeTone;
};

export type ProgressWeakArea = {
  id: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  icon: AppIconKey;
  tone: BadgeTone;
};

export type ProgressRecentWin = {
  id: string;
  title: string;
  description: string;
  icon: AppIconKey;
  tone: BadgeTone;
};

function getSignal(signals: MasterySignal[], title: string) {
  return signals.find((signal) => signal.title === title);
}

function getSignalTone(value: number): BadgeTone {
  if (value >= 72) return "success";
  if (value >= 36) return "info";
  return "muted";
}

function getDomainFallback(title: string, icon: AppIconKey): MasterySignal {
  return {
    title,
    value: 0,
    label: "Ready to start",
    evidence: "Start lessons and practice to build evidence here.",
    icon,
    tone: "default",
  };
}

function getMockAttemptTotal(activity: StudentDashboardActivity) {
  return (
    activity.stats.draftMockAttempts +
    activity.stats.submittedMockAttempts +
    activity.stats.markedMockAttempts
  );
}

export function getProgressDomainSummaries(
  signals: MasterySignal[],
  activity: StudentDashboardActivity
): ProgressDomainSummary[] {
  const vocabulary =
    getSignal(signals, "Vocabulary") ?? getDomainFallback("Vocabulary", "vocabulary");
  const grammar =
    getSignal(signals, "Grammar") ?? getDomainFallback("Grammar", "grammar");
  const examTechnique =
    getSignal(signals, "Exam technique") ?? getDomainFallback("Exam technique", "exam");
  const mockAttemptTotal = getMockAttemptTotal(activity);

  return [
    {
      id: "vocabulary",
      title: "Vocabulary growth",
      value: vocabulary.value,
      label: vocabulary.label,
      evidence: vocabulary.evidence,
      href: "/vocabulary",
      actionLabel: "Build vocabulary",
      icon: "vocabulary",
      tone: getSignalTone(vocabulary.value),
    },
    {
      id: "grammar",
      title: "Grammar progress",
      value: grammar.value,
      label: grammar.label,
      evidence: grammar.evidence,
      href: "/grammar",
      actionLabel: "Revise grammar",
      icon: "grammar",
      tone: getSignalTone(grammar.value),
    },
    {
      id: "exam-prep",
      title: "Exam prep",
      value: examTechnique.value,
      label:
        mockAttemptTotal > 0
          ? `${mockAttemptTotal} mock attempt${mockAttemptTotal === 1 ? "" : "s"}`
          : "Mocks ready when needed",
      evidence: examTechnique.evidence,
      href: "/mock-exams",
      actionLabel: "Open exam practice",
      icon: "mockExam",
      tone: getSignalTone(examTechnique.value),
    },
  ];
}

export function isNewStudentProgressEmpty(
  pathSummary: VariantPathProgressSummary,
  activity: StudentDashboardActivity
) {
  return (
    pathSummary.completedLessons === 0 &&
    activity.stats.totalAssignments === 0 &&
    getMockAttemptTotal(activity) === 0 &&
    activity.stats.recentFeedback === 0
  );
}

export function getProgressWeakAreas(
  signals: MasterySignal[],
  activity: StudentDashboardActivity
): ProgressWeakArea[] {
  const weakAreas: ProgressWeakArea[] = [];

  if (activity.stats.pendingAssignments > 0) {
    const taskLabel =
      activity.stats.pendingAssignments === 1 ? "task needs" : "tasks need";
    const staleCopy =
      activity.stats.pendingAssignments === 1
        ? "it becomes overdue or stale"
        : "they become overdue or stale";

    weakAreas.push({
      id: "pending-assignments",
      title: "Assignment waiting",
      description: `${activity.stats.pendingAssignments} teacher-set ${taskLabel} attention before ${staleCopy}.`,
      href: "/assignments",
      actionLabel: "Open assignments",
      icon: "assignments",
      tone: "warning",
    });
  }

  if (activity.stats.draftMockAttempts > 0) {
    weakAreas.push({
      id: "draft-mocks",
      title: "Unfinished mock",
      description: "A draft mock is saved. Finishing it gives you clearer exam evidence.",
      href: "/mock-exams",
      actionLabel: "Resume mock",
      icon: "mockExam",
      tone: "warning",
    });
  }

  const signalTargets: Record<string, Pick<ProgressWeakArea, "href" | "actionLabel">> = {
    Vocabulary: { href: "/vocabulary", actionLabel: "Practise vocabulary" },
    Grammar: { href: "/grammar", actionLabel: "Revise grammar" },
    Listening: { href: "/courses", actionLabel: "Open lessons" },
    Speaking: { href: "/assignments", actionLabel: "Practise speaking" },
    "Exam technique": { href: "/mock-exams", actionLabel: "Practise mocks" },
  };

  for (const signal of [...signals].sort((a, b) => a.value - b.value)) {
    if (signal.value >= 58 || weakAreas.length >= 3) continue;

    const target = signalTargets[signal.title] ?? {
      href: "/courses",
      actionLabel: "Open practice",
    };

    weakAreas.push({
      id: `signal-${signal.title.toLowerCase().replace(/\s+/g, "-")}`,
      title: `${signal.title} needs reps`,
      description: `${signal.value}% readiness. ${signal.evidence}`,
      href: target.href,
      actionLabel: target.actionLabel,
      icon: signal.icon,
      tone: signal.value < 30 ? "danger" : "info",
    });
  }

  return weakAreas.slice(0, 3);
}

export function getProgressRecentWins(
  pathSummary: VariantPathProgressSummary,
  activity: StudentDashboardActivity
): ProgressRecentWin[] {
  const wins: ProgressRecentWin[] = [];
  const completedModules = pathSummary.moduleSummaries.filter(
    (summary) => summary.isComplete
  ).length;

  if (activity.stats.recentFeedback > 0) {
    wins.push({
      id: "recent-feedback",
      title: "Feedback received",
      description: `${activity.stats.recentFeedback} recent review${
        activity.stats.recentFeedback === 1 ? "" : "s"
      } ready to turn into marks.`,
      icon: "feedback",
      tone: "success",
    });
  }

  if (activity.stats.markedMockAttempts > 0) {
    wins.push({
      id: "marked-mocks",
      title: "Mock evidence banked",
      description: `${activity.stats.markedMockAttempts} marked mock attempt${
        activity.stats.markedMockAttempts === 1 ? "" : "s"
      } available for review.`,
      icon: "mockExam",
      tone: "success",
    });
  }

  if (completedModules > 0) {
    wins.push({
      id: "completed-modules",
      title: "Module milestone",
      description: `${completedModules} module${
        completedModules === 1 ? "" : "s"
      } completed on this course path.`,
      icon: "modules",
      tone: "success",
    });
  }

  if (pathSummary.completedLessons > 0) {
    wins.push({
      id: "completed-lessons",
      title: "Lesson momentum",
      description: `${pathSummary.completedLessons} lesson${
        pathSummary.completedLessons === 1 ? "" : "s"
      } completed across your current path.`,
      icon: "completed",
      tone: "info",
    });
  }

  if (activity.stats.submittedAssignments > 0) {
    wins.push({
      id: "submitted-assignments",
      title: "Work submitted",
      description: `${activity.stats.submittedAssignments} assignment${
        activity.stats.submittedAssignments === 1 ? "" : "s"
      } waiting for teacher review.`,
      icon: "submitted",
      tone: "info",
    });
  }

  return wins.slice(0, 4);
}

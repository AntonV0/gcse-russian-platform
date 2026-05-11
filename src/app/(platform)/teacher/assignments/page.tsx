import TeacherAccessDenied from "@/components/assignments/teacher-access-denied";
import TeacherAssignmentsList from "@/components/assignments/teacher-assignments-list";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import { getTeacherAssignmentsDb } from "@/lib/assignments/assignment-helpers-db";
import { getDueDateStatus } from "@/lib/assignments/assignment-status";
import { isCurrentUserTeacherForAnyGroup } from "@/lib/auth/teacher-auth";

function getAssignmentStats(
  assignments: Awaited<ReturnType<typeof getTeacherAssignmentsDb>>
) {
  return assignments.reduce(
    (acc, item) => {
      const pendingReview = Math.max(
        0,
        item.submissionCount - item.reviewedSubmissionCount
      );
      const dueStatus = getDueDateStatus(item.assignment.due_at);

      acc.total += 1;
      acc.submissions += item.submissionCount;
      acc.reviewed += item.reviewedSubmissionCount;
      acc.needsReview += pendingReview;

      if (pendingReview > 0) {
        acc.assignmentsNeedingReview += 1;
      }

      if (dueStatus === "soon") {
        acc.dueSoon += 1;
      }

      if (dueStatus === "overdue") {
        acc.overdue += 1;
      }

      return acc;
    },
    {
      total: 0,
      submissions: 0,
      reviewed: 0,
      needsReview: 0,
      assignmentsNeedingReview: 0,
      dueSoon: 0,
      overdue: 0,
    }
  );
}

function getPriorityAssignment(
  assignments: Awaited<ReturnType<typeof getTeacherAssignmentsDb>>
) {
  return [...assignments]
    .map((item) => ({
      item,
      pendingReview: Math.max(0, item.submissionCount - item.reviewedSubmissionCount),
      dueStatus: getDueDateStatus(item.assignment.due_at),
    }))
    .sort((a, b) => {
      if (a.pendingReview !== b.pendingReview) {
        return b.pendingReview - a.pendingReview;
      }

      const rank = { overdue: 0, soon: 1, normal: 2, none: 3 };
      return rank[a.dueStatus] - rank[b.dueStatus];
    })[0];
}

export default async function TeacherAssignmentsPage() {
  const isTeacher = await isCurrentUserTeacherForAnyGroup();

  if (!isTeacher) {
    return <TeacherAccessDenied />;
  }

  const assignments = await getTeacherAssignmentsDb();
  const stats = getAssignmentStats(assignments);
  const priority = getPriorityAssignment(assignments);

  return (
    <main className="space-y-6">
      <PageIntroPanel
        tone="student"
        eyebrow="Teacher workspace"
        title="Teacher assignments"
        description="Triage Volna homework by review priority, due dates, group activity, and submission status."
        badges={
          <>
            <Badge tone="info" icon="teacher">
              Teacher view
            </Badge>
            <Badge tone={stats.needsReview > 0 ? "warning" : "success"} icon="feedback">
              {stats.needsReview} to review
            </Badge>
            <Badge tone={stats.overdue > 0 ? "warning" : "muted"} icon="calendar">
              {stats.overdue} overdue
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/teacher/assignments/new" variant="primary" icon="create">
              New assignment
            </Button>
            <Button href="/dashboard" variant="secondary" icon="dashboard">
              Dashboard
            </Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryStatCard
            title="Assignments"
            value={stats.total}
            description="teacher-set tasks"
            icon="assignments"
            tone="brand"
            compact
          />
          <SummaryStatCard
            title="Needs review"
            value={stats.needsReview}
            description={`${stats.assignmentsNeedingReview} assignment${stats.assignmentsNeedingReview === 1 ? "" : "s"}`}
            icon="feedback"
            tone={stats.needsReview > 0 ? "warning" : "success"}
            compact
          />
          <SummaryStatCard
            title="Submissions"
            value={stats.submissions}
            description={`${stats.reviewed} reviewed`}
            icon="upload"
            compact
          />
          <SummaryStatCard
            title="Due soon"
            value={stats.dueSoon + stats.overdue}
            description={`${stats.overdue} overdue`}
            icon="calendar"
            tone={
              stats.overdue > 0 ? "danger" : stats.dueSoon > 0 ? "warning" : "default"
            }
            compact
          />
        </div>
      </PageIntroPanel>

      {priority && priority.pendingReview > 0 ? (
        <FeedbackBanner
          tone="warning"
          title="Review queue is waiting"
          description={`${priority.pendingReview} submission${priority.pendingReview === 1 ? "" : "s"} need review in "${priority.item.assignment.title}". The list below is sorted by priority by default.`}
        >
          <Button
            href={`/teacher/assignments/${priority.item.assignment.id}`}
            variant="primary"
            size="sm"
            icon="feedback"
          >
            Open priority assignment
          </Button>
        </FeedbackBanner>
      ) : null}

      {assignments.length === 0 ? (
        <EmptyState
          icon="assignments"
          title="No teacher assignments yet"
          description="Create the first task for a group when you are ready to set homework."
          action={
            <Button href="/teacher/assignments/new" variant="primary" icon="create">
              New assignment
            </Button>
          }
        />
      ) : (
        <TeacherAssignmentsList assignments={assignments} />
      )}
    </main>
  );
}

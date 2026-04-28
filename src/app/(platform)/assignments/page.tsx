import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import { getStudentAssignmentsWithDetailsDb } from "@/lib/assignments/assignment-helpers-db";
import StatusBadge from "@/components/ui/status-badge";
import {
  getDueDateClass,
  getDueDateStatus,
  getDueDateUrgency,
} from "@/lib/assignments/assignment-status";

function formatDueDate(value: string | null) {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSubmissionSummary(status?: "not_started" | "submitted" | "reviewed") {
  if (status === "reviewed") {
    return "Reviewed by teacher and locked";
  }

  if (status === "submitted") {
    return "Waiting for review. You can resubmit until it is reviewed.";
  }

  return "Not submitted yet";
}

function getNextActionLabel(status?: "not_started" | "submitted" | "reviewed") {
  if (status === "reviewed") return "View feedback";
  if (status === "submitted") return "Review submission";
  return "Open assignment";
}

export default async function AssignmentsPage() {
  const assignmentCards = await getStudentAssignmentsWithDetailsDb();
  const now = new Date();

  const counts = assignmentCards.reduce(
    (acc, { submission }) => {
      const status = submission?.status ?? "not_started";

      acc.all += 1;
      acc[status] += 1;

      return acc;
    },
    {
      all: 0,
      not_started: 0,
      submitted: 0,
      reviewed: 0,
    }
  );
  const urgentCards = assignmentCards.filter(({ assignment, submission }) => {
    const status = submission?.status ?? "not_started";
    const dueStatus = getDueDateStatus(assignment.due_at, now);

    return status !== "reviewed" && (dueStatus === "overdue" || dueStatus === "soon");
  });
  const mostUrgentCard =
    urgentCards.find(
      ({ assignment }) => getDueDateStatus(assignment.due_at, now) === "overdue"
    ) ?? urgentCards[0];
  const urgentBanner = mostUrgentCard
    ? getDueDateUrgency(mostUrgentCard.assignment.due_at, now)
    : null;

  return (
    <main>
      <div className="mb-6 space-y-4">
        <PageHeader
          title="Assignments"
          description="Your current Volna homework and teacher-set tasks."
        />

        {assignmentCards.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryStatCard
              title="Total"
              value={counts.all}
              icon="assignments"
              tone="brand"
              compact
            />
            <SummaryStatCard
              title="Not started"
              value={counts.not_started}
              icon="pending"
              compact
            />
            <SummaryStatCard
              title="Submitted"
              value={counts.submitted}
              icon="upload"
              tone="warning"
              compact
            />
            <SummaryStatCard
              title="Reviewed"
              value={counts.reviewed}
              icon="completed"
              tone="success"
              compact
            />
          </div>
        ) : null}

        {urgentBanner ? (
          <FeedbackBanner
            tone={urgentBanner.tone}
            title={urgentBanner.title}
            description={`${urgentCards.length} assignment${
              urgentCards.length === 1 ? " needs" : "s need"
            } attention. ${urgentBanner.description}`}
          />
        ) : null}
      </div>

      {assignmentCards.length === 0 ? (
        <EmptyState
          icon="assignments"
          title="No assignments yet"
          description="Teacher-set homework and Volna tasks will appear here when they are assigned."
        />
      ) : (
        <section className="grid gap-4">
          {assignmentCards.map(({ assignment, items, submission }) => {
            const dueStatus = getDueDateStatus(assignment.due_at);
            const dueUrgency = getDueDateUrgency(assignment.due_at);
            const status = submission?.status ?? "not_started";
            const submissionSummary = getSubmissionSummary(status);
            const hasFeedback =
              submission?.status === "reviewed" ||
              submission?.feedback != null ||
              submission?.mark != null;
            const showDueBadge =
              status !== "reviewed" && (dueStatus === "overdue" || dueStatus === "soon");
            const cardToneClass =
              status !== "reviewed" && dueStatus === "overdue"
                ? "border-l-4 border-l-[var(--danger)]"
                : status !== "reviewed" && dueStatus === "soon"
                  ? "border-l-4 border-l-[var(--warning)]"
                  : "";

            return (
              <Link
                key={assignment.id}
                href={`/assignments/${assignment.id}`}
                className="block"
              >
                <div className="transition hover:-translate-y-0.5">
                  <DashboardCard title={assignment.title} className={cardToneClass}>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status={status} />
                        {showDueBadge ? (
                          <Badge
                            tone={dueUrgency.tone === "danger" ? "danger" : "warning"}
                            icon={dueStatus === "overdue" ? "warning" : "calendar"}
                          >
                            {dueUrgency.label}
                          </Badge>
                        ) : null}
                        {hasFeedback ? (
                          <Badge tone="success" icon="feedback">
                            Feedback available
                          </Badge>
                        ) : null}
                      </div>

                      {assignment.instructions ? (
                        <p className="text-sm text-[var(--text-secondary)]">
                          {assignment.instructions}
                        </p>
                      ) : null}

                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                            Due date
                          </p>
                          <p className={`text-sm ${getDueDateClass(dueStatus)}`}>
                            {formatDueDate(assignment.due_at)}
                          </p>
                          {status !== "reviewed" && dueStatus !== "normal" ? (
                            <p className="mt-1 text-xs app-text-muted">
                              {dueUrgency.description}
                            </p>
                          ) : null}
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                            Status
                          </p>
                          <div className="mb-2">
                            <StatusBadge status={status} />
                          </div>
                          <p className="text-sm app-text-muted">{submissionSummary}</p>
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                            Assignment details
                          </p>
                          <div className="space-y-1 text-sm app-text-muted">
                            <p>Items: {items.length}</p>
                            <p>
                              Submission type:{" "}
                              {assignment.allow_file_upload ? "Text + file" : "Text only"}
                            </p>
                            {hasFeedback ? <p>Teacher feedback available</p> : null}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
                        <span className="text-sm font-medium text-[var(--accent-ink)]">
                          {getNextActionLabel(status)}
                        </span>
                        <span className="text-sm text-[var(--text-muted)]">View</span>
                      </div>
                    </div>
                  </DashboardCard>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}

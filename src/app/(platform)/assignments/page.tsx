import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import { getStudentAssignmentsWithDetailsDb } from "@/lib/assignments/assignment-helpers-db";
import StatusBadge from "@/components/ui/status-badge";
import { getDueDateClass, getDueDateStatus } from "@/lib/assignments/assignment-status";

function formatDueDate(value: string | null) {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSubmissionSummary(status?: "not_started" | "submitted" | "reviewed") {
  if (status === "reviewed") {
    return "Reviewed by teacher";
  }

  if (status === "submitted") {
    return "Waiting for review";
  }

  return "Not submitted yet";
}

export default async function AssignmentsPage() {
  const assignmentCards = await getStudentAssignmentsWithDetailsDb();

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
            const status = submission?.status ?? "not_started";
            const submissionSummary = getSubmissionSummary(status);
            const hasFeedback =
              submission?.status === "reviewed" ||
              submission?.feedback != null ||
              submission?.mark != null;

            return (
              <Link
                key={assignment.id}
                href={`/assignments/${assignment.id}`}
                className="block"
              >
                <div className="transition hover:-translate-y-0.5">
                  <DashboardCard title={assignment.title}>
                    <div className="space-y-4">
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
                            {dueStatus === "overdue" ? " (Overdue)" : ""}
                            {dueStatus === "soon" ? " (Due soon)" : ""}
                          </p>
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

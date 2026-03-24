import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { getStudentAssignmentsWithDetailsDb } from "@/lib/assignment-helpers-db";
import StatusBadge from "@/components/ui/status-badge";
import { getDueDateClass, getDueDateStatus } from "@/lib/assignment-status";

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
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4">
              <p className="mb-1 text-sm font-medium text-gray-900">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{counts.all}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="mb-1 text-sm font-medium text-gray-900">Not started</p>
              <p className="text-2xl font-semibold text-gray-900">{counts.not_started}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="mb-1 text-sm font-medium text-gray-900">Submitted</p>
              <p className="text-2xl font-semibold text-gray-900">{counts.submitted}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="mb-1 text-sm font-medium text-gray-900">Reviewed</p>
              <p className="text-2xl font-semibold text-gray-900">{counts.reviewed}</p>
            </div>
          </div>
        ) : null}
      </div>

      {assignmentCards.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">
          No assignments yet.
        </div>
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
                        <p className="text-sm text-gray-700">{assignment.instructions}</p>
                      ) : null}

                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                            Due date
                          </p>
                          <p className={`text-sm ${getDueDateClass(dueStatus)}`}>
                            {formatDueDate(assignment.due_at)}
                            {dueStatus === "overdue" ? " (Overdue)" : ""}
                            {dueStatus === "soon" ? " (Due soon)" : ""}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                            Status
                          </p>
                          <div className="mb-2">
                            <StatusBadge status={status} />
                          </div>
                          <p className="text-sm text-gray-600">{submissionSummary}</p>
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                            Assignment details
                          </p>
                          <div className="space-y-1 text-sm text-gray-600">
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

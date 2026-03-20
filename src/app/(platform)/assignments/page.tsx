import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { getStudentAssignmentsWithDetailsDb } from "@/lib/assignment-helpers-db";

function formatDueDate(value: string | null) {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSubmissionLabel(status: string | null | undefined) {
  switch (status) {
    case "submitted":
      return "Submitted";
    case "reviewed":
      return "Reviewed";
    case "returned":
      return "Returned";
    default:
      return "Not started";
  }
}

export default async function AssignmentsPage() {
  const assignmentCards = await getStudentAssignmentsWithDetailsDb();

  return (
    <main>
      <PageHeader
        title="Assignments"
        description="Your current Volna homework and teacher-set tasks."
      />

      {assignmentCards.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">
          No assignments yet.
        </div>
      ) : (
        <section className="grid gap-4">
          {assignmentCards.map(({ assignment, items, submission }) => (
            <Link
              key={assignment.id}
              href={`/assignments/${assignment.id}`}
              className="block"
            >
              <div className="transition hover:-translate-y-0.5">
                <DashboardCard title={assignment.title}>
                  <div className="space-y-3">
                    {assignment.instructions ? (
                      <p className="text-sm text-gray-700">
                        {assignment.instructions}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>Due: {formatDueDate(assignment.due_at)}</span>
                      <span>Status: {getSubmissionLabel(submission?.status)}</span>
                      <span>Items: {items.length}</span>
                    </div>
                  </div>
                </DashboardCard>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
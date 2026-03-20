import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { getLessonPath } from "@/lib/routes";
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
            <DashboardCard key={assignment.id} title={assignment.title}>
              <div className="space-y-3">
                {assignment.instructions ? (
                  <p className="text-sm text-gray-700">
                    {assignment.instructions}
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>Due: {formatDueDate(assignment.due_at)}</span>
                  <span>Status: {getSubmissionLabel(submission?.status)}</span>
                </div>

                {items.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Assignment items</p>

                    <ul className="space-y-2 text-sm">
                      {items.map((item) => {
                        if (item.item_type === "lesson" && item.lesson) {
                          return (
                            <li key={item.id}>
                              <Link
                                href={getLessonPath(
                                  item.lesson.course_slug,
                                  item.lesson.variant_slug,
                                  item.lesson.module_slug,
                                  item.lesson.slug
                                )}
                                className="text-blue-600 hover:underline"
                              >
                                Lesson: {item.lesson.title}
                              </Link>
                            </li>
                          );
                        }

                        if (item.item_type === "question_set") {
                          return <li key={item.id}>Question set task</li>;
                        }

                        if (item.item_type === "custom_task") {
                          return (
                            <li key={item.id}>
                              {item.custom_prompt ?? "Custom task"}
                            </li>
                          );
                        }

                        return <li key={item.id}>Assignment item</li>;
                      })}
                    </ul>
                  </div>
                ) : null}

                {submission?.submitted_text ? (
                  <div className="rounded border bg-gray-50 p-3 text-sm">
                    <p className="mb-1 font-medium">Your submission</p>
                    <p>{submission.submitted_text}</p>
                  </div>
                ) : null}

                {submission?.feedback ? (
                  <div className="rounded border bg-green-50 p-3 text-sm">
                    <p className="mb-1 font-medium">Teacher feedback</p>
                    <p>{submission.feedback}</p>
                  </div>
                ) : null}
              </div>
            </DashboardCard>
          ))}
        </section>
      )}
    </main>
  );
}
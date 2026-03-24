import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import TeacherAccessDenied from "@/components/assignments/teacher-access-denied";
import { getTeacherAssignmentsDb } from "@/lib/assignment-helpers-db";
import { isCurrentUserTeacherForAnyGroup } from "@/lib/teacher-auth";
import StatusBadge from "@/components/ui/status-badge";

function formatDueDate(value: string | null) {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getTeacherAssignmentStatus(params: {
  submissionCount: number;
  reviewedSubmissionCount: number;
}) {
  const { submissionCount, reviewedSubmissionCount } = params;

  if (submissionCount === 0) {
    return {
      label: "No submissions",
      badgeStatus: null,
      isActive: false,
    };
  }

  if (reviewedSubmissionCount >= submissionCount) {
    return {
      label: "Reviewed",
      badgeStatus: "reviewed" as const,
      isActive: false,
    };
  }

  return {
    label: "Pending review",
    badgeStatus: "submitted" as const,
    isActive: true,
  };
}

export default async function TeacherAssignmentsPage() {
  const isTeacher = await isCurrentUserTeacherForAnyGroup();

  if (!isTeacher) {
    return <TeacherAccessDenied />;
  }

  const assignments = await getTeacherAssignmentsDb();

  return (
    <main>
      <div className="mb-6 flex items-start justify-between gap-4">
        <PageHeader
          title="Teacher Assignments"
          description="Review homework and submissions for your Volna groups."
        />
        <Link
          href="/teacher/assignments/new"
          className="rounded bg-black px-4 py-2 text-white"
        >
          New assignment
        </Link>
      </div>

      {assignments.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">
          No teacher assignments yet.
        </div>
      ) : (
        <section className="grid gap-4">
          {assignments.map(
            ({ assignment, group, submissionCount, reviewedSubmissionCount }) => {
              const teacherStatus = getTeacherAssignmentStatus({
                submissionCount,
                reviewedSubmissionCount,
              });

              return (
                <Link
                  key={assignment.id}
                  href={`/teacher/assignments/${assignment.id}`}
                  className="block"
                >
                  <div
                    className={`transition hover:-translate-y-0.5 ${
                      teacherStatus.isActive ? "border-l-4 border-yellow-400" : ""
                    }`}
                  >
                    <DashboardCard title={assignment.title}>
                      <div className="space-y-2 text-sm text-gray-700">
                        {assignment.instructions ? (
                          <p>{assignment.instructions}</p>
                        ) : null}

                        <div className="flex flex-wrap gap-4 items-center text-sm text-gray-600">
                          <span>Group: {group?.name ?? "Unknown group"}</span>
                          <span>Due: {formatDueDate(assignment.due_at)}</span>
                          <span>Submissions: {submissionCount}</span>
                          {teacherStatus.badgeStatus ? (
                            <StatusBadge status={teacherStatus.badgeStatus} />
                          ) : (
                            <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                              {teacherStatus.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </DashboardCard>
                  </div>
                </Link>
              );
            }
          )}
        </section>
      )}
    </main>
  );
}

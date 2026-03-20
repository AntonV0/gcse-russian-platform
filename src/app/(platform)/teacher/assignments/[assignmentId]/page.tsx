import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import TeacherSubmissionReviewForm from "@/components/assignments/teacher-submission-review-form";
import {
  getAssignmentByIdDb,
  getAssignmentSubmissionsForTeacherDb,
} from "@/lib/assignment-helpers-db";
import DeleteAssignmentButton from "@/components/assignments/delete-assignment-button";

type TeacherAssignmentReviewPageProps = {
  params: Promise<{
    assignmentId: string;
  }>;
};

export default async function TeacherAssignmentReviewPage({
  params,
}: TeacherAssignmentReviewPageProps) {
  const { assignmentId } = await params;

  const [assignment, submissions] = await Promise.all([
    getAssignmentByIdDb(assignmentId),
    getAssignmentSubmissionsForTeacherDb(assignmentId),
  ]);

  if (!assignment) {
    return <main>Assignment not found.</main>;
  }

  return (
    <main>
      <PageHeader
        title={`Review: ${assignment.title}`}
        description={assignment.instructions ?? undefined}
      />
      <DeleteAssignmentButton assignmentId={assignment.id} />

      {submissions.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">
          No submissions yet.
        </div>
      ) : (
        <section className="grid gap-4">
          {submissions.map(({ submission, student }) => (
            <DashboardCard
              key={submission.id}
              title={
                student?.display_name ||
                student?.full_name ||
                student?.email ||
                "Student submission"
              }
            >
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>Status: {submission.status}</p>
                  <p>
                    Submitted:{" "}
                    {submission.submitted_at
                      ? new Intl.DateTimeFormat("en-GB", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(submission.submitted_at))
                      : "Not submitted"}
                  </p>
                </div>

                <div className="rounded border bg-gray-50 p-3 text-sm">
                  <p className="mb-1 font-medium">Submission</p>
                  <p>{submission.submitted_text ?? "No submission text."}</p>
                </div>

                <TeacherSubmissionReviewForm
                  submissionId={submission.id}
                  initialMark={submission.mark}
                  initialFeedback={submission.feedback}
                />
              </div>
            </DashboardCard>
          ))}
        </section>
      )}
    </main>
  );
}
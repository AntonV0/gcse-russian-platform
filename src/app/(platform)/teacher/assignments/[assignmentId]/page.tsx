import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import TeacherSubmissionReviewForm from "@/components/assignments/teacher-submission-review-form";
import DeleteAssignmentButton from "@/components/assignments/delete-assignment-button";
import TeacherAccessDenied from "@/components/assignments/teacher-access-denied";
import StatusBadge from "@/components/ui/status-badge";
import {
  getAssignmentByIdDb,
  getAssignmentItemsWithDetailsDb,
  getAssignmentSubmissionsForTeacherDb,
} from "@/lib/assignment-helpers-db";
import { getLessonPath } from "@/lib/routes";
import { canCurrentUserReviewAssignment } from "@/lib/teacher-auth";
import { getSignedStorageUrl } from "@/lib/storage-helpers";

type Props = {
  params: Promise<{ assignmentId: string }>;
};

function formatDate(value: string | null) {
  if (!value) return "Not submitted";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function TeacherAssignmentReviewPage({ params }: Props) {
  const { assignmentId } = await params;

  const canReview = await canCurrentUserReviewAssignment(assignmentId);
  if (!canReview) return <TeacherAccessDenied />;

  const [assignment, items, submissions] = await Promise.all([
    getAssignmentByIdDb(assignmentId),
    getAssignmentItemsWithDetailsDb(assignmentId),
    getAssignmentSubmissionsForTeacherDb(assignmentId),
  ]);

  if (!assignment) return <main>Assignment not found.</main>;

  const submissionsWithFiles = await Promise.all(
    submissions.map(async ({ submission, student }) => ({
      submission,
      student,
      fileUrl: await getSignedStorageUrl(
        "assignment-submissions",
        submission.submitted_file_path ?? null
      ),
    }))
  );

  const pendingCount = submissionsWithFiles.filter(
    (s) => s.submission.status !== "reviewed"
  ).length;

  return (
    <main>
      {/* HEADER */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-3">
          <Link
            href="/teacher/assignments"
            className="text-sm text-blue-600 hover:underline"
          >
            Back to assignments
          </Link>

          <PageHeader
            title={`Review: ${assignment.title}`}
            description={assignment.instructions ?? undefined}
          />
        </div>

        <div className="flex gap-2">
          <Link
            href={`/teacher/assignments/${assignment.id}/edit`}
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Edit
          </Link>

          <DeleteAssignmentButton assignmentId={assignment.id} />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">Total submissions</p>
          <p className="text-2xl font-semibold">{submissionsWithFiles.length}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">Pending review</p>
          <p className="text-2xl font-semibold text-yellow-600">{pendingCount}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">Reviewed</p>
          <p className="text-2xl font-semibold text-green-600">
            {submissionsWithFiles.length - pendingCount}
          </p>
        </div>
      </div>

      {/* ITEMS */}
      <section className="mb-6 rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-semibold">Assignment items</h2>

        <ol className="space-y-3 text-sm">
          {items.map((item, index) => (
            <li key={item.id} className="rounded border p-3">
              <p className="text-xs text-gray-500">Step {index + 1}</p>

              {item.item_type === "lesson" && item.lesson && (
                <>
                  <p className="font-medium">Lesson</p>
                  <Link
                    href={getLessonPath(
                      item.lesson.course_slug,
                      item.lesson.variant_slug,
                      item.lesson.module_slug,
                      item.lesson.slug
                    )}
                    className="text-blue-600 hover:underline"
                  >
                    {item.lesson.title}
                  </Link>
                </>
              )}

              {item.item_type === "question_set" && item.questionSet && (
                <>
                  <p className="font-medium">Question set</p>
                  <Link
                    href={`/question-sets/${item.questionSet.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {item.questionSet.title}
                  </Link>
                </>
              )}

              {item.item_type === "custom_task" && (
                <>
                  <p className="font-medium">Custom task</p>
                  <p>{item.custom_prompt}</p>
                </>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* SUBMISSIONS */}
      {submissionsWithFiles.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">
          No submissions yet.
        </div>
      ) : (
        <section className="grid gap-4">
          {submissionsWithFiles.map(({ submission, student, fileUrl }) => {
            const isPending = submission.status !== "reviewed";

            return (
              <div
                key={submission.id}
                className={`transition ${
                  isPending ? "border-l-4 border-yellow-400" : ""
                }`}
              >
                <DashboardCard
                  title={
                    student?.display_name ||
                    student?.full_name ||
                    student?.email ||
                    "Student submission"
                  }
                >
                  <div className="space-y-4">
                    {/* STATUS */}
                    <div className="flex items-center justify-between">
                      <StatusBadge status={submission.status} />
                      <p className="text-sm text-gray-600">
                        {formatDate(submission.submitted_at)}
                      </p>
                    </div>

                    {/* SUBMISSION TEXT */}
                    <div className="rounded border bg-gray-50 p-3 text-sm">
                      <p className="mb-1 font-medium">Submission</p>
                      <p>{submission.submitted_text ?? "No text provided."}</p>
                    </div>

                    {/* FILE */}
                    {submission.submitted_file_name && fileUrl && (
                      <div className="rounded border bg-gray-50 p-3 text-sm">
                        <p className="mb-1 font-medium">Uploaded file</p>
                        <p>{submission.submitted_file_name}</p>
                        <Link
                          href={fileUrl}
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >
                          Open file
                        </Link>
                      </div>
                    )}

                    {/* REVIEW */}
                    <div className="border-t pt-3">
                      <TeacherSubmissionReviewForm
                        submissionId={submission.id}
                        initialMark={submission.mark}
                        initialFeedback={submission.feedback}
                      />
                    </div>
                  </div>
                </DashboardCard>
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}

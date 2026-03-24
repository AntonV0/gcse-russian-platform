import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import TeacherSubmissionReviewForm from "@/components/assignments/teacher-submission-review-form";
import DeleteAssignmentButton from "@/components/assignments/delete-assignment-button";
import TeacherAccessDenied from "@/components/assignments/teacher-access-denied";
import {
  getAssignmentByIdDb,
  getAssignmentItemsWithDetailsDb,
  getAssignmentSubmissionsForTeacherDb,
} from "@/lib/assignment-helpers-db";
import { getLessonPath } from "@/lib/routes";
import { canCurrentUserReviewAssignment } from "@/lib/teacher-auth";
import { getSignedStorageUrl } from "@/lib/storage-helpers";

type TeacherAssignmentReviewPageProps = {
  params: Promise<{
    assignmentId: string;
  }>;
};

export default async function TeacherAssignmentReviewPage({
  params,
}: TeacherAssignmentReviewPageProps) {
  const { assignmentId } = await params;

  const canReview = await canCurrentUserReviewAssignment(assignmentId);

  if (!canReview) {
    return <TeacherAccessDenied />;
  }

  const [assignment, items, submissions] = await Promise.all([
    getAssignmentByIdDb(assignmentId),
    getAssignmentItemsWithDetailsDb(assignmentId),
    getAssignmentSubmissionsForTeacherDb(assignmentId),
  ]);

  if (!assignment) {
    return <main>Assignment not found.</main>;
  }

  const submissionsWithFiles = await Promise.all(
    submissions.map(async ({ submission, student }) => {
      const fileUrl = await getSignedStorageUrl(
        "assignment-submissions",
        submission.submitted_file_path ?? null
      );

      return {
        submission,
        student,
        fileUrl,
      };
    })
  );

  return (
    <main>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-3">
          <Link
            href="/teacher/assignments"
            className="inline-block text-sm text-blue-600 hover:underline"
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

      <section className="mb-6 rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-semibold">Assignment items</h2>

        {items.length === 0 ? (
          <p className="text-sm text-gray-600">No items attached to this assignment.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {items.map((item) => {
              if (item.item_type === "lesson" && item.lesson) {
                return (
                  <li key={item.id} className="rounded border p-3">
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
                    <p className="text-gray-600">{item.lesson.module_title}</p>
                  </li>
                );
              }

              if (item.item_type === "custom_task") {
                return (
                  <li key={item.id} className="rounded border p-3">
                    <p className="font-medium">Custom task</p>
                    <p className="text-gray-700">
                      {item.custom_prompt ?? "No task text provided."}
                    </p>
                  </li>
                );
              }

              if (item.item_type === "question_set" && item.questionSet?.slug) {
                return (
                  <li key={item.id} className="rounded border p-3">
                    <p className="font-medium">Question set</p>
                    <Link
                      href={`/question-sets/${item.questionSet.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      {item.questionSet.title}
                    </Link>
                    {item.questionSet.description ? (
                      <p className="text-gray-700">{item.questionSet.description}</p>
                    ) : null}
                  </li>
                );
              }

              return (
                <li key={item.id} className="rounded border p-3">
                  <p className="font-medium">Assignment item</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {submissionsWithFiles.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">
          No submissions yet.
        </div>
      ) : (
        <section className="grid gap-4">
          {submissionsWithFiles.map(({ submission, student, fileUrl }) => (
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

                {submission.submitted_file_name && fileUrl ? (
                  <div className="rounded border bg-gray-50 p-3 text-sm">
                    <p className="mb-1 font-medium">Uploaded file</p>
                    <p>{submission.submitted_file_name}</p>
                    <Link
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Open uploaded file
                    </Link>
                  </div>
                ) : null}

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

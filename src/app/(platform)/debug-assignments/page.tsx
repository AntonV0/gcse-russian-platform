import {
  getAssignmentItemsDb,
  getCurrentUserAssignmentsDb,
  getCurrentUserAssignmentSubmissionDb,
} from "@/lib/assignment-helpers-db";
import AssignmentSubmissionForm from "@/components/assignments/assignment-submission-form";

export default async function DebugAssignmentsPage() {
  const assignments = await getCurrentUserAssignmentsDb();
  const firstAssignment = assignments[0] ?? null;
  const items = firstAssignment
    ? await getAssignmentItemsDb(firstAssignment.id)
    : [];
  const submission = firstAssignment
    ? await getCurrentUserAssignmentSubmissionDb(firstAssignment.id)
    : null;

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Assignments Debug</h1>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Assignments</h2>
        <pre className="overflow-auto rounded border p-4 text-sm">
          {JSON.stringify(assignments, null, 2)}
        </pre>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">First Assignment Items</h2>
        <pre className="overflow-auto rounded border p-4 text-sm">
          {JSON.stringify(items, null, 2)}
        </pre>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Current Submission</h2>
        <pre className="overflow-auto rounded border p-4 text-sm">
          {JSON.stringify(submission, null, 2)}
        </pre>
      </section>

      {firstAssignment ? (
        <section>
          <h2 className="mb-2 text-lg font-semibold">Submit Homework</h2>
          <AssignmentSubmissionForm
            assignmentId={firstAssignment.id}
            initialValue={submission?.submitted_text ?? ""}
          />
        </section>
      ) : null}
    </main>
  );
}
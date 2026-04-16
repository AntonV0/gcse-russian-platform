import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import TeacherAccessDenied from "@/components/assignments/teacher-access-denied";
import TeacherAssignmentsList from "@/components/assignments/teacher-assignments-list";
import { getTeacherAssignmentsDb } from "@/lib/assignments/assignment-helpers-db";
import { isCurrentUserTeacherForAnyGroup } from "@/lib/auth/teacher-auth";

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
        <TeacherAssignmentsList assignments={assignments} />
      )}
    </main>
  );
}

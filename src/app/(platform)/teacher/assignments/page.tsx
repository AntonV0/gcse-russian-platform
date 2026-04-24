import PageHeader from "@/components/layout/page-header";
import TeacherAccessDenied from "@/components/assignments/teacher-access-denied";
import TeacherAssignmentsList from "@/components/assignments/teacher-assignments-list";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
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
        <Button href="/teacher/assignments/new" variant="primary" icon="create">
          New assignment
        </Button>
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          icon="assignments"
          title="No teacher assignments yet"
          description="Create the first task for a group when you are ready to set homework."
          action={
            <Button href="/teacher/assignments/new" variant="primary" icon="create">
              New assignment
            </Button>
          }
        />
      ) : (
        <TeacherAssignmentsList assignments={assignments} />
      )}
    </main>
  );
}

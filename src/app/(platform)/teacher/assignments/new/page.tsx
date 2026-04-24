import PageHeader from "@/components/layout/page-header";
import TeacherCreateAssignmentForm from "@/components/assignments/teacher-create-assignment-form";
import TeacherAccessDenied from "@/components/assignments/teacher-access-denied";
import EmptyState from "@/components/ui/empty-state";
import {
  getLessonOptionsForGroupDb,
  getQuestionSetOptionsDb,
  getTeacherGroupsDb,
} from "@/lib/assignments/assignment-helpers-db";
import { isCurrentUserTeacherForAnyGroup } from "@/lib/auth/teacher-auth";

export default async function NewTeacherAssignmentPage() {
  const isTeacher = await isCurrentUserTeacherForAnyGroup();

  if (!isTeacher) {
    return <TeacherAccessDenied />;
  }

  const [groups, questionSets] = await Promise.all([
    getTeacherGroupsDb(),
    getQuestionSetOptionsDb(),
  ]);

  const lessonEntries = await Promise.all(
    groups.map(async (group) => {
      const lessons = await getLessonOptionsForGroupDb(group.id);
      return [group.id, lessons] as const;
    })
  );

  const lessonsByGroup = Object.fromEntries(lessonEntries);

  return (
    <main>
      <PageHeader
        title="Create Assignment"
        description="Create a homework task for one of your Volna groups."
      />

      {groups.length === 0 ? (
        <EmptyState
          icon="users"
          title="No teacher groups yet"
          description="Ask an administrator to add you to a teaching group before creating assignments."
        />
      ) : (
        <TeacherCreateAssignmentForm
          groups={groups}
          lessonsByGroup={lessonsByGroup}
          questionSets={questionSets}
        />
      )}
    </main>
  );
}

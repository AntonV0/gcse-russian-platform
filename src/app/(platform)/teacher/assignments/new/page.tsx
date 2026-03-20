import PageHeader from "@/components/layout/page-header";
import TeacherCreateAssignmentForm from "@/components/assignments/teacher-create-assignment-form";
import {
  getLessonOptionsForGroupDb,
  getQuestionSetOptionsDb,
  getTeacherGroupsDb,
} from "@/lib/assignment-helpers-db";

export default async function NewTeacherAssignmentPage() {
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
        <div className="rounded-lg border p-6 text-sm text-gray-600">
          You do not have any teacher groups yet.
        </div>
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
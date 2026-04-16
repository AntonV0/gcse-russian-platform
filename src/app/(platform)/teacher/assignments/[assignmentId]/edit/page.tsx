import { redirect } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import TeacherAccessDenied from "@/components/assignments/teacher-access-denied";
import TeacherCreateAssignmentForm from "@/components/assignments/teacher-create-assignment-form";

import {
  getAssignmentByIdDb,
  getAssignmentItemsDb,
  getTeacherGroupsDb,
  getLessonOptionsForGroupDb,
  getQuestionSetOptionsDb,
} from "@/lib/assignments/assignment-helpers-db";

import { canCurrentUserReviewAssignment } from "@/lib/auth/teacher-auth";

type Props = {
  params: Promise<{
    assignmentId: string;
  }>;
};

export default async function EditAssignmentPage({ params }: Props) {
  const { assignmentId } = await params;

  const canEdit = await canCurrentUserReviewAssignment(assignmentId);

  if (!canEdit) {
    return <TeacherAccessDenied />;
  }

  const assignment = await getAssignmentByIdDb(assignmentId);

  if (!assignment) {
    redirect("/teacher/assignments");
  }

  const [items, groups, questionSets] = await Promise.all([
    getAssignmentItemsDb(assignmentId),
    getTeacherGroupsDb(),
    getQuestionSetOptionsDb(),
  ]);

  const lessonOptions = await getLessonOptionsForGroupDb(assignment.group_id);

  // 🔹 Split items into form-friendly shape
  const lessonIds = items
    .filter((i) => i.item_type === "lesson" && i.lesson_id)
    .map((i) => i.lesson_id as string);

  const questionSetIds = items
    .filter((i) => i.item_type === "question_set" && i.question_set_id)
    .map((i) => i.question_set_id as string);

  const customTask =
    items.find((i) => i.item_type === "custom_task")?.custom_prompt ?? null;

  return (
    <main>
      <PageHeader
        title="Edit assignment"
        description="Update assignment details, items, and due date."
      />

      <TeacherCreateAssignmentForm
        mode="edit"
        assignmentId={assignment.id}
        initialData={{
          groupId: assignment.group_id,
          title: assignment.title,
          instructions: assignment.instructions,
          dueAt: assignment.due_at,
          lessonIds,
          questionSetIds,
          customTask,
          allowFileUpload: assignment.allow_file_upload,
        }}
        groups={groups}
        lessonsByGroup={{
          [assignment.group_id]: lessonOptions,
        }}
        questionSets={questionSets}
      />
    </main>
  );
}

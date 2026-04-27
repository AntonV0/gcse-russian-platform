import { createQuestionAction } from "@/app/actions/admin/admin-question-actions";
import AdminQuestionForm from "@/components/admin/admin-question-form";
import PageHeader from "@/components/layout/page-header";

export function QuestionSetAddQuestionPanel({
  questionSetId,
  nextPosition,
}: {
  questionSetId: string;
  nextPosition: number;
}) {
  return (
    <>
      <PageHeader
        title="Add Question"
        description="Create a new question in this question set."
      />

      <AdminQuestionForm
        mode="create"
        action={createQuestionAction}
        questionSetId={questionSetId}
        defaultValues={{
          questionType: "translation",
          answerStrategy: "text_input",
          marks: "1",
          position: String(nextPosition),
          collapseWhitespace: true,
          selectionDisplayMode: "grouped",
          metadata: "{}",
        }}
        submitLabel="Add question"
      />
    </>
  );
}

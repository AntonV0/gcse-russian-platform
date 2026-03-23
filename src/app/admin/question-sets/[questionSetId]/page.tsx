import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { requireAdminAccess } from "@/lib/admin-auth";
import {
  getQuestionSetByIdDb,
  getQuestionsByQuestionSetIdIncludingInactiveDb,
} from "@/lib/question-helpers-db";
import { createQuestionAction } from "@/app/actions/admin-question-actions";
import Link from "next/link";
import AdminQuestionForm from "@/components/admin/admin-question-form";

type AdminQuestionSetDetailPageProps = {
  params: Promise<{
    questionSetId: string;
  }>;
};

function formatQuestionType(value: string) {
  return value.replaceAll("_", " ");
}

export default async function AdminQuestionSetDetailPage({
  params,
}: AdminQuestionSetDetailPageProps) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const { questionSetId } = await params;

  const [questionSet, questions] = await Promise.all([
    getQuestionSetByIdDb(questionSetId),
    getQuestionsByQuestionSetIdIncludingInactiveDb(questionSetId),
  ]);

  if (!questionSet) {
    return <main>Question set not found.</main>;
  }

  return (
    <main>
      <PageHeader
        title={questionSet.title}
        description={questionSet.description ?? "Admin question set view."}
      />

      <section className="mb-8 grid gap-4">
        <DashboardCard title="Question Set Details">
          <div className="space-y-2">
            <p>
              <span className="font-medium">ID:</span> {questionSet.id}
            </p>
            <p>
              <span className="font-medium">Slug:</span> {questionSet.slug ?? "—"}
            </p>
            <p>
              <span className="font-medium">Source type:</span>{" "}
              {questionSet.source_type}
            </p>
            {questionSet.instructions ? (
              <p>
                <span className="font-medium">Instructions:</span>{" "}
                {questionSet.instructions}
              </p>
            ) : null}
          </div>
        </DashboardCard>
      </section>

      <section className="mb-8">
        <PageHeader
          title="Questions"
          description="Questions currently attached to this set."
        />

        {questions.length === 0 ? (
          <div className="rounded-lg border p-6 text-sm text-gray-600">
            No questions yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {questions.map((question) => (
              <Link
                key={question.id}
                href={`/admin/questions/${question.id}`}
                className="block"
              >
                <div className="transition hover:-translate-y-0.5">
                  <DashboardCard title={`Q${question.position}`}>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Type:</span>{" "}
                        {formatQuestionType(question.question_type)}
                      </p>
                      <p>
                        <span className="font-medium">Prompt:</span> {question.prompt}
                      </p>
                      <p>
                        <span className="font-medium">Marks:</span> {question.marks}
                      </p>
                      <p>
                        <span className="font-medium">Active:</span>{" "}
                        {question.is_active ? "Yes" : "No"}
                      </p>
                      {question.audio_path ? (
                        <p>
                          <span className="font-medium">Audio path:</span>{" "}
                          {question.audio_path}
                        </p>
                      ) : null}
                      {question.metadata ? (
                        <pre className="overflow-x-auto rounded border bg-gray-50 p-3 text-xs text-gray-700">
                          {JSON.stringify(question.metadata, null, 2)}
                        </pre>
                      ) : null}
                    </div>
                  </DashboardCard>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-4xl">
        <PageHeader
          title="Add Question"
          description="Create a new question in this question set."
        />

        <AdminQuestionForm
          mode="create"
          action={createQuestionAction}
          questionSetId={questionSet.id}
          defaultValues={{
            questionType: "translation",
            answerStrategy: "text_input",
            marks: "1",
            position: String(questions.length + 1),
            collapseWhitespace: true,
            selectionDisplayMode: "grouped",
            metadata: "{}",
          }}
          submitLabel="Add question"
        />
      </section>
    </main>
  );
}
import Link from "next/link";
import AdminQuestionForm from "@/components/admin/admin-question-form";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import DangerZone from "@/components/ui/danger-zone";
import DashboardCard from "@/components/ui/dashboard-card";
import DetailList from "@/components/ui/detail-list";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import SectionHeader from "@/components/ui/section-header";
import Textarea from "@/components/ui/textarea";
import {
  createQuestionAction,
  deleteQuestionAction,
  deleteQuestionSetAction,
  duplicateQuestionAction,
  duplicateQuestionSetAction,
  moveQuestionAction,
  normalizeQuestionPositionsAction,
  toggleQuestionActiveAction,
  updateQuestionSetAction,
} from "@/app/actions/admin/admin-question-actions";
import { getAssignmentsUsingQuestionSetDb } from "@/lib/assignments/assignment-helpers-db";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  getQuestionSetByIdDb,
  getQuestionsByQuestionSetIdIncludingInactiveDb,
} from "@/lib/questions/question-helpers-db";

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

  const [questionSet, questions, usage] = await Promise.all([
    getQuestionSetByIdDb(questionSetId),
    getQuestionsByQuestionSetIdIncludingInactiveDb(questionSetId),
    getAssignmentsUsingQuestionSetDb(questionSetId),
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
        <PanelCard
          title="Question set details"
          description="Core metadata and quick navigation for this reusable question set."
          tone="admin"
          contentClassName="space-y-4"
        >
          <DetailList
            items={[
              { label: "ID", value: questionSet.id },
              { label: "Slug", value: questionSet.slug ?? "-" },
              { label: "Source type", value: questionSet.source_type },
              { label: "Questions", value: questions.length },
            ]}
          />

          {questionSet.instructions ? (
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/55 px-4 py-3 text-sm leading-6 app-text-muted">
              <span className="font-semibold text-[var(--text-primary)]">
                Instructions:
              </span>{" "}
              {questionSet.instructions}
            </div>
          ) : null}

          <InlineActions>
            <Button href="/admin/question-sets" variant="secondary" icon="back">
              Back to all question sets
            </Button>

            {questionSet.is_template ? (
              <Button
                href={`/admin/question-sets/templates/${questionSet.id}/create`}
                variant="secondary"
                icon="create"
              >
                Create from this template
              </Button>
            ) : null}

            <Button
              href="/admin/question-sets/templates"
              variant="secondary"
              icon="file"
            >
              Open templates
            </Button>

            {questionSet.slug ? (
              <Link
                href={`/question-sets/${questionSet.slug}`}
                className="app-btn-base app-btn-secondary min-h-10 rounded-2xl px-4 py-2.5 text-sm"
                target="_blank"
                rel="noreferrer"
              >
                Open public view
              </Link>
            ) : null}
          </InlineActions>
        </PanelCard>
      </section>

      <section className="mb-8">
        <PanelCard
          title="Usage"
          description="Shows whether this set is already attached to teacher assignments."
        >
          {usage.length === 0 ? (
            <p className="text-sm app-text-muted">
              This question set is not used in any assignments.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm app-text-muted">
                Used in {usage.length} assignment{usage.length > 1 ? "s" : ""}.
              </p>

              <ul className="space-y-2">
                {usage.map((assignment) => (
                  <li
                    key={assignment.id}
                    className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/55 px-3 py-2"
                  >
                    <Link
                      href={`/teacher/assignments/${assignment.id}`}
                      className="font-medium app-brand-text hover:underline"
                    >
                      {assignment.title}
                    </Link>
                    <Badge tone="muted">{assignment.status}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </PanelCard>
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <PanelCard
          title="Edit question set"
          description="Update the title, student instructions, and template behaviour."
          tone="admin"
        >
          <form action={updateQuestionSetAction} className="space-y-4">
            <input type="hidden" name="questionSetId" value={questionSet.id} />

            <FormField label="Title" required>
              <Input
                name="title"
                required
                defaultValue={questionSet.title}
              />
            </FormField>

            <FormField label="Slug" required>
              <Input
                name="slug"
                required
                defaultValue={questionSet.slug ?? ""}
              />
            </FormField>

            <FormField label="Description">
              <Textarea
                name="description"
                defaultValue={questionSet.description ?? ""}
                rows={3}
              />
            </FormField>

            <FormField label="Instructions">
              <Textarea
                name="instructions"
                defaultValue={questionSet.instructions ?? ""}
                rows={3}
              />
            </FormField>

            <PanelCard
              title="Template settings"
              description="Use templates for repeatable question-set patterns."
              tone="muted"
              density="compact"
              contentClassName="space-y-4"
            >
              <CheckboxField
                name="isTemplate"
                label="This question set is a template"
                defaultChecked={Boolean(questionSet.is_template)}
              />

              <FormField label="Template type">
                <Input
                  name="templateType"
                  defaultValue={questionSet.template_type ?? ""}
                  placeholder="translation_selection_based"
                />
              </FormField>
            </PanelCard>

            <InlineActions>
              <Button type="submit" variant="primary" icon="save">
                Save question set
              </Button>
            </InlineActions>
          </form>

          <form action={duplicateQuestionSetAction} className="mt-4">
            <input type="hidden" name="questionSetId" value={questionSet.id} />
            <Button type="submit" variant="secondary" icon="create">
              Duplicate question set
            </Button>
          </form>
        </PanelCard>

        <DangerZone
          title="Delete question set"
          description="Remove this set and all attached questions, options, and accepted answers."
        >
          <form action={deleteQuestionSetAction} className="space-y-4">
            <input type="hidden" name="questionSetId" value={questionSet.id} />

            <p>
              Delete this question set and all of its questions, options, and accepted
              answers.
            </p>

            {usage.length > 0 ? (
              <p className="font-medium text-[var(--danger)]">
                Warning: This question set is used in {usage.length} assignment
                {usage.length > 1 ? "s" : ""}.
              </p>
            ) : null}

            <Button type="submit" variant="danger" icon="delete">
              Delete question set
            </Button>
          </form>
        </DangerZone>
      </section>

      <section className="mb-8">
        <SectionHeader
          className="mb-4"
          title="Questions"
          description="Questions currently attached to this set."
          actions={
            <form action={normalizeQuestionPositionsAction}>
              <input type="hidden" name="questionSetId" value={questionSet.id} />
              <Button type="submit" variant="secondary" size="sm" icon="refresh">
                Normalize positions
              </Button>
            </form>
          }
        />

        {questions.length === 0 ? (
          <EmptyState
            icon="question"
            title="No questions yet"
            description="Add the first question to start building this reusable GCSE Russian set."
          />
        ) : (
          <div className="grid gap-4">
            {questions.map((question) => (
              <DashboardCard key={question.id} title={`Q${question.position}`}>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="info">
                      {formatQuestionType(question.question_type)}
                    </Badge>
                    <Badge tone="muted">{question.marks} mark(s)</Badge>
                    <Badge tone={question.is_active ? "success" : "warning"}>
                      {question.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <p className="text-[var(--text-primary)]">{question.prompt}</p>

                  {question.audio_path ? (
                    <p className="text-sm app-text-muted">
                      <span className="font-medium text-[var(--text-primary)]">
                        Audio path:
                      </span>{" "}
                      {question.audio_path}
                    </p>
                  ) : null}

                  {question.metadata ? (
                    <pre className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)] p-3 text-xs text-[var(--text-secondary)]">
                      {JSON.stringify(question.metadata, null, 2)}
                    </pre>
                  ) : null}

                  <InlineActions className="pt-1">
                    <Button
                      href={`/admin/questions/${question.id}`}
                      variant="secondary"
                      size="sm"
                      icon="edit"
                    >
                      Edit question
                    </Button>

                    <form action={duplicateQuestionAction}>
                      <input type="hidden" name="questionId" value={question.id} />
                      <input type="hidden" name="questionSetId" value={questionSet.id} />
                      <Button type="submit" variant="secondary" size="sm" icon="create">
                        Duplicate
                      </Button>
                    </form>

                    <form action={moveQuestionAction}>
                      <input type="hidden" name="questionId" value={question.id} />
                      <input type="hidden" name="questionSetId" value={questionSet.id} />
                      <input type="hidden" name="direction" value="up" />
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        disabled={question.position === 1}
                      >
                        Move up
                      </Button>
                    </form>

                    <form action={moveQuestionAction}>
                      <input type="hidden" name="questionId" value={question.id} />
                      <input type="hidden" name="questionSetId" value={questionSet.id} />
                      <input type="hidden" name="direction" value="down" />
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        disabled={question.position === questions.length}
                      >
                        Move down
                      </Button>
                    </form>

                    <form action={toggleQuestionActiveAction}>
                      <input type="hidden" name="questionId" value={question.id} />
                      <input type="hidden" name="questionSetId" value={questionSet.id} />
                      <input
                        type="hidden"
                        name="nextState"
                        value={question.is_active ? "inactive" : "active"}
                      />
                      <Button type="submit" variant="secondary" size="sm">
                        {question.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </form>

                    <form action={deleteQuestionAction}>
                      <input type="hidden" name="questionId" value={question.id} />
                      <input type="hidden" name="questionSetId" value={questionSet.id} />
                      <Button type="submit" variant="danger" size="sm" icon="delete">
                        Delete
                      </Button>
                    </form>
                  </InlineActions>
                </div>
              </DashboardCard>
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

import {
  createMockExamQuestionAction,
  deleteMockExamQuestionAction,
  deleteMockExamSectionAction,
  updateMockExamQuestionAction,
  updateMockExamSectionAction,
} from "@/app/actions/admin/admin-mock-exam-actions";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import MockExamQuestionForm from "@/components/admin/mock-exam-question-form";
import MockExamQuestionPreview from "@/components/mock-exams/mock-exam-question-preview";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  getMockExamQuestionTypeLabel,
  getMockExamSectionTypeLabel,
  mockExamQuestionDataTemplates,
  mockExamQuestionTypes,
  mockExamSectionTypes,
  type DbMockExamQuestion,
  type DbMockExamSection,
  type MockExamQuestionType,
} from "@/lib/mock-exams/mock-exam-helpers-db";

type MockExamSectionsPanelProps = {
  mockExamId: string;
  sections: DbMockExamSection[];
  questionsBySectionId: Record<string, DbMockExamQuestion[]>;
  questionTypeLabels: Record<MockExamQuestionType, string>;
};

function SectionSettingsForm({
  mockExamId,
  section,
}: {
  mockExamId: string;
  section: DbMockExamSection;
}) {
  return (
    <form action={updateMockExamSectionAction} className="space-y-4">
      <input type="hidden" name="mockExamId" value={mockExamId} />
      <input type="hidden" name="sectionId" value={section.id} />

      <div className="grid gap-4 lg:grid-cols-3">
        <FormField label="Title" required>
          <Input name="title" required defaultValue={section.title} />
        </FormField>

        <FormField label="Section type" required>
          <Select name="sectionType" required defaultValue={section.section_type}>
            {mockExamSectionTypes.map((sectionType) => (
              <option key={sectionType} value={sectionType}>
                {getMockExamSectionTypeLabel(sectionType)}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Sort order">
          <Input
            name="sortOrder"
            type="number"
            min="0"
            defaultValue={String(section.sort_order)}
          />
        </FormField>
      </div>

      <FormField label="Instructions">
        <Textarea name="instructions" rows={3} defaultValue={section.instructions ?? ""} />
      </FormField>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="primary" size="sm" icon="save">
          Save section
        </Button>
      </div>
    </form>
  );
}

function AddQuestionPanel({
  mockExamId,
  sectionId,
  questionsCount,
  questionTypeLabels,
}: {
  mockExamId: string;
  sectionId: string;
  questionsCount: number;
  questionTypeLabels: Record<MockExamQuestionType, string>;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/55 p-4">
      <div>
        <h3 className="font-semibold leading-6 text-[var(--text-primary)]">
          Add question
        </h3>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          Choose an exam-style type and provide JSON data for the renderer.
        </p>
      </div>

      <MockExamQuestionForm
        action={createMockExamQuestionAction}
        mockExamId={mockExamId}
        sectionId={sectionId}
        mode="create"
        questionTypes={mockExamQuestionTypes}
        questionTypeLabels={questionTypeLabels}
        questionDataTemplates={mockExamQuestionDataTemplates}
        defaultValues={{
          questionType: "multiple_choice",
          marks: "1",
          sortOrder: String(questionsCount + 1),
          data: mockExamQuestionDataTemplates.multiple_choice,
        }}
      />
    </div>
  );
}

function QuestionEditor({
  mockExamId,
  question,
  questionIndex,
  questionTypeLabels,
}: {
  mockExamId: string;
  question: DbMockExamQuestion;
  questionIndex: number;
  questionTypeLabels: Record<MockExamQuestionType, string>;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
      <div>
        <h3 className="font-semibold leading-6 text-[var(--text-primary)]">
          Edit question {questionIndex + 1}
        </h3>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {getMockExamQuestionTypeLabel(question.question_type)}
        </p>
      </div>

      <MockExamQuestionPreview question={question} index={questionIndex} />

      <MockExamQuestionForm
        action={updateMockExamQuestionAction}
        mockExamId={mockExamId}
        questionId={question.id}
        mode="edit"
        questionTypes={mockExamQuestionTypes}
        questionTypeLabels={questionTypeLabels}
        questionDataTemplates={mockExamQuestionDataTemplates}
        defaultValues={{
          questionType: question.question_type,
          prompt: question.prompt,
          marks: String(question.marks),
          sortOrder: String(question.sort_order),
          data: JSON.stringify(question.data, null, 2),
        }}
      />

      <form action={deleteMockExamQuestionAction}>
        <input type="hidden" name="mockExamId" value={mockExamId} />
        <input type="hidden" name="questionId" value={question.id} />
        <AdminConfirmButton
          variant="danger"
          icon="delete"
          confirmMessage={`Delete question ${questionIndex + 1}?`}
        >
          Delete question
        </AdminConfirmButton>
      </form>
    </div>
  );
}

export default function MockExamSectionsPanel({
  mockExamId,
  sections,
  questionsBySectionId,
  questionTypeLabels,
}: MockExamSectionsPanelProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="app-card-title">Sections and questions</h2>
        <p className="app-card-desc">
          Edit ordering with sort order fields. Question data is JSONB so new
          GCSE-style task types can be added without changing the table shape.
        </p>
      </div>

      {sections.length === 0 ? (
        <EmptyState
          icon="list"
          iconTone="brand"
          title="No sections yet"
          description="Add a section before creating mock exam questions."
        />
      ) : (
        <div className="space-y-5">
          {sections.map((section) => {
            const questions = questionsBySectionId[section.id] ?? [];

            return (
              <PanelCard
                key={section.id}
                title={section.title}
                description={section.instructions ?? undefined}
                tone="admin"
                contentClassName="space-y-5"
              >
                <SectionSettingsForm mockExamId={mockExamId} section={section} />

                <form action={deleteMockExamSectionAction}>
                  <input type="hidden" name="mockExamId" value={mockExamId} />
                  <input type="hidden" name="sectionId" value={section.id} />
                  <AdminConfirmButton
                    variant="danger"
                    icon="delete"
                    confirmMessage={`Delete ${section.title}? This also deletes its questions.`}
                  >
                    Delete section
                  </AdminConfirmButton>
                </form>

                <AddQuestionPanel
                  mockExamId={mockExamId}
                  sectionId={section.id}
                  questionsCount={questions.length}
                  questionTypeLabels={questionTypeLabels}
                />

                {questions.length === 0 ? (
                  <EmptyState
                    icon="question"
                    iconTone="brand"
                    title="No questions in this section"
                    description="Add the first original question for this mock exam section."
                  />
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, questionIndex) => (
                      <QuestionEditor
                        key={question.id}
                        mockExamId={mockExamId}
                        question={question}
                        questionIndex={questionIndex}
                        questionTypeLabels={questionTypeLabels}
                      />
                    ))}
                  </div>
                )}
              </PanelCard>
            );
          })}
        </div>
      )}
    </section>
  );
}

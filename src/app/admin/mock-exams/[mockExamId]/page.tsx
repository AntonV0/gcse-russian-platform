import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import MockExamQuestionForm from "@/components/admin/mock-exam-question-form";
import MockExamQuestionPreview from "@/components/mock-exams/mock-exam-question-preview";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  createMockExamQuestionAction,
  createMockExamSectionAction,
  deleteMockExamQuestionAction,
  deleteMockExamSectionAction,
  deleteMockExamSetAction,
  updateMockExamQuestionAction,
  updateMockExamSectionAction,
  updateMockExamSetAction,
} from "@/app/actions/admin/admin-mock-exam-actions";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  getMockExamQuestionTypeLabel,
  getMockExamSectionTypeLabel,
  getMockExamTierLabel,
  loadMockExamByIdDb,
  mockExamPaperNames,
  mockExamQuestionDataTemplates,
  mockExamQuestionTypes,
  mockExamSectionTypes,
  mockExamTiers,
} from "@/lib/mock-exams/mock-exam-helpers-db";

type AdminMockExamDetailPageProps = {
  params: Promise<{
    mockExamId: string;
  }>;
};

export default async function AdminMockExamDetailPage({
  params,
}: AdminMockExamDetailPageProps) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const { mockExamId } = await params;
  const { exam, sections, questionsBySectionId } = await loadMockExamByIdDb(
    mockExamId
  );

  if (!exam) {
    return <main>Mock exam not found.</main>;
  }

  const questionCount = sections.reduce(
    (total, section) => total + (questionsBySectionId[section.id]?.length ?? 0),
    0
  );
  const questionTypeLabels = Object.fromEntries(
    mockExamQuestionTypes.map((questionType) => [
      questionType,
      getMockExamQuestionTypeLabel(questionType),
    ])
  ) as Record<(typeof mockExamQuestionTypes)[number], string>;

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="admin"
        eyebrow="Mock exam editor"
        title={exam.title}
        description={exam.description ?? "Build an original GCSE-style mock exam."}
        badges={
          <>
            <Badge tone="info" icon="file">
              {exam.paper_name}
            </Badge>
            <Badge tone="muted" icon="school">
              {getMockExamTierLabel(exam.tier)}
            </Badge>
            <Badge tone="muted" icon="list">
              {sections.length} section{sections.length === 1 ? "" : "s"}
            </Badge>
            <Badge tone="muted" icon="question">
              {questionCount} question{questionCount === 1 ? "" : "s"}
            </Badge>
            <Badge
              tone={exam.is_published ? "success" : "warning"}
              icon={exam.is_published ? "preview" : "pending"}
            >
              {exam.is_published ? "Published" : "Draft"}
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/admin/mock-exams" variant="secondary" icon="back">
              Back
            </Button>
            <Button href={`/mock-exams/${exam.slug}`} variant="secondary" icon="preview">
              Preview
            </Button>
          </>
        }
      />

      <FeedbackBanner
        tone="warning"
        title="Original content only"
        description="This editor is for platform-created mock exams. Do not paste Pearson copyrighted questions, transcripts, paper text, images, or mark schemes into question prompts or JSON data."
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <PanelCard
          title="Exam settings"
          description="Edit core metadata, paper identity, publication, ordering, and access."
          tone="admin"
        >
          <form action={updateMockExamSetAction} className="space-y-4">
            <input type="hidden" name="mockExamId" value={exam.id} />

            <div className="grid gap-4 lg:grid-cols-2">
              <FormField label="Title" required>
                <Input name="title" required defaultValue={exam.title} />
              </FormField>

              <FormField label="Slug" required>
                <Input name="slug" required defaultValue={exam.slug} />
              </FormField>

              <FormField label="Description">
                <Textarea
                  name="description"
                  rows={3}
                  defaultValue={exam.description ?? ""}
                />
              </FormField>

              <FormField label="Paper number" required>
                <Select name="paperNumber" required defaultValue={String(exam.paper_number)}>
                  <option value="1">Paper 1</option>
                  <option value="2">Paper 2</option>
                  <option value="3">Paper 3</option>
                  <option value="4">Paper 4</option>
                </Select>
              </FormField>

              <FormField label="Paper name" required>
                <Select name="paperName" required defaultValue={exam.paper_name}>
                  {mockExamPaperNames.map((paperName) => (
                    <option key={paperName} value={paperName}>
                      {paperName}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Tier" required>
                <Select name="tier" required defaultValue={exam.tier}>
                  {mockExamTiers.map((tier) => (
                    <option key={tier} value={tier}>
                      {getMockExamTierLabel(tier)}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Time limit minutes">
                <Input
                  name="timeLimitMinutes"
                  type="number"
                  min="1"
                  defaultValue={exam.time_limit_minutes ?? ""}
                />
              </FormField>

              <FormField label="Total marks">
                <Input
                  name="totalMarks"
                  type="number"
                  min="0"
                  step="0.5"
                  defaultValue={String(exam.total_marks)}
                />
              </FormField>

              <FormField label="Sort order">
                <Input
                  name="sortOrder"
                  type="number"
                  min="0"
                  defaultValue={String(exam.sort_order)}
                />
              </FormField>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  name="isPublished"
                  value="true"
                  defaultChecked={exam.is_published}
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  name="isTrialVisible"
                  value="true"
                  defaultChecked={exam.is_trial_visible}
                />
                Trial visible
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  name="requiresPaidAccess"
                  value="true"
                  defaultChecked={exam.requires_paid_access}
                />
                Requires paid access
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  name="availableInVolna"
                  value="true"
                  defaultChecked={exam.available_in_volna}
                />
                Volna visible
              </label>
            </div>

            <Button type="submit" variant="primary" icon="save">
              Save exam
            </Button>
          </form>
        </PanelCard>

        <PanelCard
          title="Delete exam"
          description="Remove this exam set and all sections and questions."
          tone="muted"
        >
          <form action={deleteMockExamSetAction} className="space-y-3">
            <input type="hidden" name="mockExamId" value={exam.id} />
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              Deleting this exam also deletes all nested section and question records.
            </p>
            <AdminConfirmButton
              variant="danger"
              icon="delete"
              confirmMessage={`Delete ${exam.title}? This cannot be undone.`}
            >
              Delete exam
            </AdminConfirmButton>
          </form>
        </PanelCard>
      </section>

      <SectionCard
        title="Add section"
        description="Sections map to exam paper areas such as listening, reading, writing, speaking, or translation."
        tone="admin"
      >
        <form action={createMockExamSectionAction} className="space-y-4">
          <input type="hidden" name="mockExamId" value={exam.id} />

          <div className="grid gap-4 lg:grid-cols-2">
            <FormField label="Title" required>
              <Input name="title" required placeholder="Section A" />
            </FormField>

            <FormField label="Section type" required>
              <Select name="sectionType" required defaultValue="reading">
                {mockExamSectionTypes.map((sectionType) => (
                  <option key={sectionType} value={sectionType}>
                    {getMockExamSectionTypeLabel(sectionType)}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Sort order">
              <Input name="sortOrder" type="number" min="0" defaultValue="0" />
            </FormField>
          </div>

          <FormField label="Instructions">
            <Textarea name="instructions" rows={3} />
          </FormField>

          <Button type="submit" variant="primary" icon="create">
            Add section
          </Button>
        </form>
      </SectionCard>

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
                  <form action={updateMockExamSectionAction} className="space-y-4">
                    <input type="hidden" name="mockExamId" value={exam.id} />
                    <input type="hidden" name="sectionId" value={section.id} />

                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField label="Title" required>
                        <Input name="title" required defaultValue={section.title} />
                      </FormField>

                      <FormField label="Section type" required>
                        <Select
                          name="sectionType"
                          required
                          defaultValue={section.section_type}
                        >
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
                      <Textarea
                        name="instructions"
                        rows={3}
                        defaultValue={section.instructions ?? ""}
                      />
                    </FormField>

                    <div className="flex flex-wrap gap-2">
                      <Button type="submit" variant="primary" size="sm" icon="save">
                        Save section
                      </Button>
                    </div>
                  </form>

                  <form action={deleteMockExamSectionAction}>
                    <input type="hidden" name="mockExamId" value={exam.id} />
                    <input type="hidden" name="sectionId" value={section.id} />
                    <AdminConfirmButton
                      variant="danger"
                      icon="delete"
                      confirmMessage={`Delete ${section.title}? This also deletes its questions.`}
                    >
                      Delete section
                    </AdminConfirmButton>
                  </form>

                  <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/55 p-4">
                    <div>
                      <h3 className="font-semibold leading-6 text-[var(--text-primary)]">
                        Add question
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                        Choose an exam-style type and provide JSON data for the
                        renderer.
                      </p>
                    </div>

                    <MockExamQuestionForm
                      action={createMockExamQuestionAction}
                      mockExamId={exam.id}
                      sectionId={section.id}
                      mode="create"
                      questionTypes={mockExamQuestionTypes}
                      questionTypeLabels={questionTypeLabels}
                      questionDataTemplates={mockExamQuestionDataTemplates}
                      defaultValues={{
                        questionType: "multiple_choice",
                        marks: "1",
                        sortOrder: String(questions.length + 1),
                        data: mockExamQuestionDataTemplates.multiple_choice,
                      }}
                    />
                  </div>

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
                        <div
                          key={question.id}
                          className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4"
                        >
                          <div>
                            <h3 className="font-semibold leading-6 text-[var(--text-primary)]">
                              Edit question {questionIndex + 1}
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                              {getMockExamQuestionTypeLabel(question.question_type)}
                            </p>
                          </div>

                          <MockExamQuestionPreview
                            question={question}
                            index={questionIndex}
                          />

                          <MockExamQuestionForm
                            action={updateMockExamQuestionAction}
                            mockExamId={exam.id}
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
                            <input type="hidden" name="mockExamId" value={exam.id} />
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
                      ))}
                    </div>
                  )}
                </PanelCard>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

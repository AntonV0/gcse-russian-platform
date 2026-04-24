import MockExamQuestionPreview from "@/components/mock-exams/mock-exam-question-preview";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  canDashboardAccessMockExam,
  getMockExamSectionTypeLabel,
  getMockExamTierLabel,
  loadMockExamBySlugDb,
} from "@/lib/mock-exams/mock-exam-helpers-db";

type MockExamDetailPageProps = {
  params: Promise<{
    mockExamSlug: string;
  }>;
};

export default async function MockExamDetailPage({ params }: MockExamDetailPageProps) {
  const { mockExamSlug } = await params;
  const dashboard = await getDashboardInfo();
  const { exam, sections, questionsBySectionId } = await loadMockExamBySlugDb(
    mockExamSlug,
    { publishedOnly: dashboard.role !== "admin" && dashboard.role !== "teacher" }
  );

  if (!exam || !canDashboardAccessMockExam(exam, dashboard)) {
    return <main>Mock exam not found.</main>;
  }

  const questionCount = sections.reduce(
    (total, section) => total + (questionsBySectionId[section.id]?.length ?? 0),
    0
  );

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="student"
        eyebrow="Mock exam preview"
        title={exam.title}
        description={exam.description ?? "Original GCSE-style mock exam preview."}
        badges={
          <>
            <Badge tone="info" icon="file">
              {exam.paper_name}
            </Badge>
            <Badge tone="muted" icon="school">
              {getMockExamTierLabel(exam.tier)}
            </Badge>
            <Badge tone="muted" icon="pending">
              {exam.time_limit_minutes
                ? `${exam.time_limit_minutes} minutes`
                : "Untimed preview"}
            </Badge>
            <Badge tone="muted">{exam.total_marks} marks</Badge>
            <Badge tone="warning" icon="preview">
              Read-only
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/mock-exams" variant="secondary" icon="back">
              Mock exams
            </Button>
            <Button href="/past-papers" variant="secondary" icon="file">
              Past papers
            </Button>
          </>
        }
      />

      <FeedbackBanner
        tone="warning"
        title="Attempt flow coming later"
        description="This page previews the structure and questions only. Timed attempts, submissions, scoring, and teacher review are future work."
      />

      {sections.length === 0 ? (
        <SectionCard
          title="Exam structure"
          description={`${sections.length} sections and ${questionCount} questions.`}
          tone="student"
        >
          <EmptyState
            icon="list"
            iconTone="brand"
            title="No sections published yet"
            description="This mock exam has been created but does not have previewable sections."
          />
        </SectionCard>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => {
            const questions = questionsBySectionId[section.id] ?? [];

            return (
              <SectionCard
                key={section.id}
                title={section.title}
                description={section.instructions ?? undefined}
                tone="student"
                density="compact"
                actions={
                  <Badge tone="muted" icon="list">
                    {getMockExamSectionTypeLabel(section.section_type)}
                  </Badge>
                }
              >
                {questions.length === 0 ? (
                  <EmptyState
                    icon="question"
                    iconTone="brand"
                    title="No questions in this section"
                    description="Questions will appear here once they have been added."
                  />
                ) : (
                  <div className="space-y-3">
                    {questions.map((question, questionIndex) => (
                      <MockExamQuestionPreview
                        key={question.id}
                        question={question}
                        index={questionIndex}
                      />
                    ))}
                  </div>
                )}
              </SectionCard>
            );
          })}
        </div>
      )}
    </main>
  );
}

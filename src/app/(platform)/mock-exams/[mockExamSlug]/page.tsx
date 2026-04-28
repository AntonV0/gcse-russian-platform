import MockExamQuestionPreview from "@/components/mock-exams/mock-exam-question-preview";
import AttemptStatusBadge from "@/components/ui/attempt-status-badge";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import { startMockExamAttemptAction } from "@/app/actions/mock-exams/mock-exam-attempt-actions";
import { getCurrentUser } from "@/lib/auth/auth";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import { canDashboardAccessMockExam } from "@/lib/mock-exams/access";
import {
  getMockExamSectionTypeLabel,
  getMockExamTierLabel,
} from "@/lib/mock-exams/labels";
import { loadMockExamBySlugDb } from "@/lib/mock-exams/loaders";
import { getStudentSafeMockExamQuestion } from "@/lib/mock-exams/normalizers";
import { getCurrentUserMockExamAttemptsDb } from "@/lib/mock-exams/queries";

type MockExamDetailPageProps = {
  params: Promise<{
    mockExamSlug: string;
  }>;
};

export default async function MockExamDetailPage({ params }: MockExamDetailPageProps) {
  const { mockExamSlug } = await params;
  const [dashboard, user] = await Promise.all([getDashboardInfo(), getCurrentUser()]);
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
  const attempts = user ? await getCurrentUserMockExamAttemptsDb(exam.id, user.id) : [];

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="student"
        eyebrow="Mock exam"
        title={exam.title}
        description={exam.description ?? "Original GCSE-style mock exam."}
        badges={
          <>
            <Badge tone="info" icon="mockExam">
              {exam.paper_name}
            </Badge>
            <Badge tone="muted" icon="school">
              {getMockExamTierLabel(exam.tier)}
            </Badge>
            <Badge tone="muted" icon="pending">
              {exam.time_limit_minutes ? `${exam.time_limit_minutes} minutes` : "Untimed"}
            </Badge>
            <Badge tone="muted">{exam.total_marks} marks</Badge>
            <Badge tone="success" icon="exam">
              Attemptable
            </Badge>
          </>
        }
        actions={
          <>
            <form action={startMockExamAttemptAction}>
              <input type="hidden" name="mockExamSlug" value={exam.slug} />
              <Button type="submit" variant="primary" icon="create">
                Start attempt
              </Button>
            </form>
            <Button href="/mock-exams" variant="secondary" icon="back">
              Mock exams
            </Button>
            <Button href="/past-papers" variant="secondary" icon="pastPapers">
              Past papers
            </Button>
          </>
        }
      />

      <FeedbackBanner
        tone="info"
        title="Exam conditions"
        description="When you start an attempt, answer independently and submit before the time limit if one is set. Objective questions may be auto-marked; longer writing, speaking, and translation tasks need teacher review."
      />

      {attempts.length > 0 ? (
        <SectionCard
          title="Your attempts"
          description="Continue a draft or review a submitted result."
          tone="student"
          density="compact"
        >
          <div className="grid gap-3">
            {attempts.slice(0, 5).map((attempt) => (
              <CardListItem
                key={attempt.id}
                href={`/mock-exams/${exam.slug}/attempts/${attempt.id}`}
                title={`Attempt from ${new Date(attempt.started_at).toLocaleString("en-GB")}`}
                subtitle={
                  attempt.submitted_at
                    ? `Submitted ${new Date(attempt.submitted_at).toLocaleString("en-GB")}`
                    : "Draft attempt"
                }
                badges={
                  <>
                    <AttemptStatusBadge status={attempt.status} />
                    <Badge tone="muted">
                      {attempt.awarded_marks ?? "-"} / {attempt.total_marks_snapshot}
                    </Badge>
                  </>
                }
                actions={
                  <Button
                    href={`/mock-exams/${exam.slug}/attempts/${attempt.id}`}
                    variant="quiet"
                    size="sm"
                    icon="next"
                    iconOnly
                    ariaLabel="Open attempt"
                  />
                }
              />
            ))}
          </div>
        </SectionCard>
      ) : null}

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
                    {questions.map((question, questionIndex) => {
                      const studentSafeQuestion =
                        getStudentSafeMockExamQuestion(question);

                      return (
                        <MockExamQuestionPreview
                          key={question.id}
                          question={studentSafeQuestion}
                          index={questionIndex}
                        />
                      );
                    })}
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

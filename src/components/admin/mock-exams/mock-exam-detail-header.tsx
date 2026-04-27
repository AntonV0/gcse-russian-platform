import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import {
  getMockExamTierLabel,
  type DbMockExamSet,
} from "@/lib/mock-exams/mock-exam-helpers-db";

export default function MockExamDetailHeader({
  exam,
  sectionCount,
  questionCount,
}: {
  exam: DbMockExamSet;
  sectionCount: number;
  questionCount: number;
}) {
  return (
    <>
      <PageIntroPanel
        tone="admin"
        eyebrow="Mock exam editor"
        title={exam.title}
        description={exam.description ?? "Build an original GCSE-style mock exam."}
        badges={
          <>
            <Badge tone="info" icon="mockExam">
              {exam.paper_name}
            </Badge>
            <Badge tone="muted" icon="school">
              {getMockExamTierLabel(exam.tier)}
            </Badge>
            <Badge tone="muted" icon="list">
              {sectionCount} section{sectionCount === 1 ? "" : "s"}
            </Badge>
            <Badge tone="muted" icon="question">
              {questionCount} question{questionCount === 1 ? "" : "s"}
            </Badge>
            <PublishStatusBadge isPublished={exam.is_published} />
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
    </>
  );
}

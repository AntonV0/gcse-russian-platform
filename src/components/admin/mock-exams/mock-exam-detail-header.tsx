import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
  OperationsHeader,
  OperationsSection,
} from "@/components/ui/operations-workspace";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import { getMockExamTierLabel } from "@/lib/mock-exams/labels";
import type { DbMockExamSet } from "@/lib/mock-exams/types";

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
      <OperationsHeader
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

      <OperationsSection muted>
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--warning)_24%,var(--border-subtle))] bg-[var(--warning-soft)] px-4 py-3 text-sm leading-6 text-[var(--warning)]">
          <span className="font-semibold">Original content only.</span>{" "}
          This editor is for platform-created mock exams. Do not paste Pearson
          copyrighted questions, transcripts, paper text, images, or mark schemes into
          question prompts or JSON data.
        </div>
      </OperationsSection>
    </>
  );
}

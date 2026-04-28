import Badge from "@/components/ui/badge";
import { getMockExamQuestionTypeLabel } from "@/lib/mock-exams/labels";
import type { DbMockExamQuestion } from "@/lib/mock-exams/types";
import { MockExamQuestionMediaPreview } from "./question-preview/media-preview";
import { MockExamQuestionSpecificPreview } from "./question-preview/question-specific-preview";

type MockExamQuestionPreviewProps = {
  question: DbMockExamQuestion;
  index: number;
};

export default function MockExamQuestionPreview({
  question,
  index,
}: MockExamQuestionPreviewProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/55 p-4">
      <div>
        <h3 className="font-semibold leading-6 text-[var(--text-primary)]">
          Question {index + 1}
        </h3>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {question.prompt}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge tone="info" icon="question">
          {getMockExamQuestionTypeLabel(question.question_type)}
        </Badge>
        <Badge tone="muted">{question.marks} mark(s)</Badge>
      </div>

      <MockExamQuestionMediaPreview question={question} />
      <MockExamQuestionSpecificPreview question={question} />
    </div>
  );
}

import type { DbMockExamQuestion } from "@/lib/mock-exams/mock-exam-helpers-db";
import {
  MockExamFieldsPreview,
  MockExamMatchingPreview,
  MockExamOptionsPreview,
  MockExamStatementsPreview,
} from "./choice-structure-previews";
import {
  MockExamBulletsPreview,
  MockExamPhotoCardPreview,
  MockExamRolePlayPreview,
} from "./speaking-writing-previews";
import {
  MockExamPromptsPreview,
  MockExamReadingListeningTaskPreview,
  MockExamTextSourcePreview,
} from "./text-previews";

export function MockExamQuestionSpecificPreview({
  question,
}: {
  question: DbMockExamQuestion;
}) {
  switch (question.question_type) {
    case "multiple_choice":
    case "multiple_response":
      return <MockExamOptionsPreview question={question} />;

    case "matching":
      return <MockExamMatchingPreview question={question} />;

    case "gap_fill":
    case "translation_into_english":
    case "translation_into_russian":
      return <MockExamTextSourcePreview question={question} />;

    case "reading_comprehension":
    case "listening_comprehension":
      return <MockExamReadingListeningTaskPreview question={question} />;

    case "sequencing":
      return (
        <MockExamPromptsPreview
          question={{ ...question, data: { prompts: question.data.items } }}
        />
      );

    case "opinion_recognition":
    case "true_false_not_mentioned":
      return <MockExamStatementsPreview question={question} />;

    case "note_completion":
      return <MockExamFieldsPreview question={question} />;

    case "writing_task":
    case "simple_sentences":
    case "short_paragraph":
      return <MockExamBulletsPreview question={question} />;

    case "extended_writing":
    case "conversation":
      return <MockExamPromptsPreview question={question} />;

    case "role_play":
      return <MockExamRolePlayPreview question={question} />;

    case "photo_card":
      return <MockExamPhotoCardPreview question={question} />;

    case "sentence_builder":
      return (
        <MockExamPromptsPreview
          question={{ ...question, data: { prompts: question.data.wordBank } }}
        />
      );

    case "short_answer":
    case "other":
    default:
      return null;
  }
}

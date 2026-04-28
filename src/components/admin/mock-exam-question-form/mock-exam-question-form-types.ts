import type { MockExamQuestionDataState } from "@/lib/mock-exams/question-data/codecs";
import type { MockExamQuestionType } from "@/lib/mock-exams/types";

export type MockExamQuestionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  mockExamId: string;
  sectionId?: string;
  questionId?: string;
  mode: "create" | "edit";
  questionTypes: MockExamQuestionType[];
  questionTypeLabels: Record<MockExamQuestionType, string>;
  questionDataTemplates: Record<MockExamQuestionType, string>;
  defaultValues?: {
    questionType?: MockExamQuestionType;
    prompt?: string;
    marks?: string;
    sortOrder?: string;
    data?: string;
  };
};

export type MockExamQuestionDataUpdater = <Key extends keyof MockExamQuestionDataState>(
  key: Key,
  value: MockExamQuestionDataState[Key]
) => void;

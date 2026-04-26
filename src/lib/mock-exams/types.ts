export type MockExamTier = "foundation" | "higher" | "both";

export type MockExamPaperName =
  | "Paper 1 Listening"
  | "Paper 2 Speaking"
  | "Paper 3 Reading"
  | "Paper 4 Writing";

export type MockExamSectionType =
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "translation"
  | "mixed"
  | "other";

export type MockExamQuestionType =
  | "multiple_choice"
  | "multiple_response"
  | "short_answer"
  | "gap_fill"
  | "matching"
  | "sequencing"
  | "opinion_recognition"
  | "true_false_not_mentioned"
  | "translation_into_english"
  | "translation_into_russian"
  | "writing_task"
  | "simple_sentences"
  | "short_paragraph"
  | "extended_writing"
  | "role_play"
  | "photo_card"
  | "conversation"
  | "sentence_builder"
  | "note_completion"
  | "listening_comprehension"
  | "reading_comprehension"
  | "other";

export type DbMockExamSet = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  paper_number: number;
  paper_name: MockExamPaperName;
  tier: MockExamTier;
  time_limit_minutes: number | null;
  total_marks: number;
  is_published: boolean;
  sort_order: number;
  is_trial_visible: boolean;
  requires_paid_access: boolean;
  available_in_volna: boolean;
  created_at: string;
  updated_at: string;
};

export type DbMockExamSection = {
  id: string;
  mock_exam_id: string;
  title: string;
  instructions: string | null;
  section_type: MockExamSectionType;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type DbMockExamQuestion = {
  id: string;
  section_id: string;
  question_type: MockExamQuestionType;
  prompt: string;
  data: Record<string, unknown>;
  marks: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type MockExamAttemptStatus = "draft" | "submitted" | "marked" | "abandoned";

export type DbMockExamAttempt = {
  id: string;
  mock_exam_id: string;
  user_id: string;
  status: MockExamAttemptStatus;
  started_at: string;
  submitted_at: string | null;
  time_limit_minutes_snapshot: number | null;
  total_marks_snapshot: number;
  awarded_marks: number | null;
  feedback: string | null;
  created_at: string;
  updated_at: string;
};

export type DbMockExamResponse = {
  id: string;
  attempt_id: string;
  question_id: string;
  response_text: string | null;
  response_payload: Record<string, unknown>;
  awarded_marks: number | null;
  feedback: string | null;
  is_flagged: boolean;
  created_at: string;
  updated_at: string;
};

export type DbMockExamScore = {
  id: string;
  attempt_id: string;
  total_marks: number;
  awarded_marks: number;
  score_payload: Record<string, unknown>;
  feedback: string | null;
  marked_by: string | null;
  marked_at: string | null;
  created_at: string;
  updated_at: string;
};

export type MockExamProfileSummary = {
  id: string;
  full_name: string | null;
  display_name: string | null;
  email: string | null;
};

export type LoadedMockExamDb = {
  exam: DbMockExamSet | null;
  sections: DbMockExamSection[];
  questionsBySectionId: Record<string, DbMockExamQuestion[]>;
};

export type LoadedMockExamAttemptDb = LoadedMockExamDb & {
  attempt: DbMockExamAttempt | null;
  responsesByQuestionId: Record<string, DbMockExamResponse>;
};

export type MockExamAttemptReviewListItem = {
  attempt: DbMockExamAttempt;
  exam: DbMockExamSet | null;
  student: MockExamProfileSummary | null;
  responseCount: number;
  markedResponseCount: number;
};

export type LoadedMockExamAttemptReviewDb = LoadedMockExamAttemptDb & {
  student: MockExamProfileSummary | null;
  score: DbMockExamScore | null;
};

export type MockExamFilters = {
  paperNumber?: number | "all" | null;
  tier?: MockExamTier | "all" | null;
  published?: "all" | "published" | "draft" | null;
};

import { createClient } from "@/lib/supabase/server";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";

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

export type LoadedMockExamDb = {
  exam: DbMockExamSet | null;
  sections: DbMockExamSection[];
  questionsBySectionId: Record<string, DbMockExamQuestion[]>;
};

export type MockExamFilters = {
  paperNumber?: number | "all" | null;
  tier?: MockExamTier | "all" | null;
  published?: "all" | "published" | "draft" | null;
};

export const mockExamPaperNames: MockExamPaperName[] = [
  "Paper 1 Listening",
  "Paper 2 Speaking",
  "Paper 3 Reading",
  "Paper 4 Writing",
];

export const mockExamTiers: MockExamTier[] = ["foundation", "higher", "both"];

export const mockExamSectionTypes: MockExamSectionType[] = [
  "listening",
  "speaking",
  "reading",
  "writing",
  "translation",
  "mixed",
  "other",
];

export const mockExamQuestionTypes: MockExamQuestionType[] = [
  "multiple_choice",
  "multiple_response",
  "short_answer",
  "gap_fill",
  "matching",
  "sequencing",
  "opinion_recognition",
  "true_false_not_mentioned",
  "translation_into_english",
  "translation_into_russian",
  "writing_task",
  "simple_sentences",
  "short_paragraph",
  "extended_writing",
  "role_play",
  "photo_card",
  "conversation",
  "sentence_builder",
  "note_completion",
  "listening_comprehension",
  "reading_comprehension",
  "other",
];

export const mockExamQuestionDataTemplates: Record<MockExamQuestionType, string> = {
  multiple_choice: JSON.stringify(
    { options: ["Option A", "Option B"], correctAnswers: [0] },
    null,
    2
  ),
  multiple_response: JSON.stringify(
    { options: ["Option A", "Option B", "Option C"], correctAnswers: [0, 2] },
    null,
    2
  ),
  short_answer: JSON.stringify({ acceptedAnswers: ["answer"] }, null, 2),
  gap_fill: JSON.stringify(
    { text: "Complete the sentence: I live in ____.", gaps: [{ acceptedAnswers: ["London"] }] },
    null,
    2
  ),
  matching: JSON.stringify(
    {
      prompts: ["Person 1", "Person 2"],
      options: ["Activity A", "Activity B"],
      correctMatches: [0, 1],
    },
    null,
    2
  ),
  sequencing: JSON.stringify(
    { items: ["First event", "Second event"], correctOrder: [0, 1] },
    null,
    2
  ),
  opinion_recognition: JSON.stringify(
    { statements: ["The speaker likes school."], answers: ["positive"] },
    null,
    2
  ),
  true_false_not_mentioned: JSON.stringify(
    { statements: ["The text mentions a holiday."], answers: ["true"] },
    null,
    2
  ),
  translation_into_english: JSON.stringify({ sourceText: "Russian text here" }, null, 2),
  translation_into_russian: JSON.stringify(
    { sourceText: "English text here", sentences: ["I live in London."] },
    null,
    2
  ),
  writing_task: JSON.stringify(
    { bullets: ["Bullet 1", "Bullet 2"], recommendedWordCount: 90 },
    null,
    2
  ),
  simple_sentences: JSON.stringify(
    { bullets: ["Say where you live", "Say what you like"], expectedSentences: 2 },
    null,
    2
  ),
  short_paragraph: JSON.stringify(
    { bullets: ["Your school", "Your opinion"], minWordCount: 40 },
    null,
    2
  ),
  extended_writing: JSON.stringify(
    { prompts: ["Write about your free time."], minWordCount: 90 },
    null,
    2
  ),
  role_play: JSON.stringify(
    {
      scenario: "You are speaking to a friend.",
      prompts: [{ text: "Ask one question.", type: "question" }],
    },
    null,
    2
  ),
  photo_card: JSON.stringify(
    { imageUrl: "", prompts: ["Describe the photo.", "Give your opinion."] },
    null,
    2
  ),
  conversation: JSON.stringify(
    { theme: "School", questions: ["What is your favourite subject?"] },
    null,
    2
  ),
  sentence_builder: JSON.stringify(
    { wordBank: ["I", "live", "in", "London"], acceptedAnswers: ["I live in London"] },
    null,
    2
  ),
  note_completion: JSON.stringify(
    { fields: [{ prompt: "Time", acceptedAnswers: ["three o'clock"] }] },
    null,
    2
  ),
  listening_comprehension: JSON.stringify(
    { audioUrl: "", transcript: "", questions: [] },
    null,
    2
  ),
  reading_comprehension: JSON.stringify({ text: "Reading text here", questions: [] }, null, 2),
  other: JSON.stringify({}, null, 2),
};

export function getMockExamTierLabel(tier: MockExamTier) {
  switch (tier) {
    case "foundation":
      return "Foundation";
    case "higher":
      return "Higher";
    case "both":
      return "Both tiers";
    default:
      return tier;
  }
}

export function getMockExamSectionTypeLabel(sectionType: MockExamSectionType) {
  return sectionType.replaceAll("_", " ");
}

export function getMockExamQuestionTypeLabel(questionType: MockExamQuestionType) {
  switch (questionType) {
    case "true_false_not_mentioned":
      return "True / false / not mentioned";
    default:
      return questionType.replaceAll("_", " ");
  }
}

function normalizeRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function normalizeMockExamSet(row: unknown): DbMockExamSet {
  const record = row as Partial<DbMockExamSet>;

  return {
    id: String(record.id),
    title: String(record.title),
    slug: String(record.slug),
    description: record.description ?? null,
    paper_number: Number(record.paper_number ?? 0),
    paper_name: (record.paper_name ?? "Paper 1 Listening") as MockExamPaperName,
    tier: (record.tier ?? "both") as MockExamTier,
    time_limit_minutes:
      record.time_limit_minutes === null || record.time_limit_minutes === undefined
        ? null
        : Number(record.time_limit_minutes),
    total_marks: Number(record.total_marks ?? 0),
    is_published: Boolean(record.is_published),
    sort_order: Number(record.sort_order ?? 0),
    is_trial_visible: Boolean(record.is_trial_visible),
    requires_paid_access: Boolean(record.requires_paid_access),
    available_in_volna: Boolean(record.available_in_volna),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

function normalizeMockExamSection(row: unknown): DbMockExamSection {
  const record = row as Partial<DbMockExamSection>;

  return {
    id: String(record.id),
    mock_exam_id: String(record.mock_exam_id),
    title: String(record.title),
    instructions: record.instructions ?? null,
    section_type: (record.section_type ?? "other") as MockExamSectionType,
    sort_order: Number(record.sort_order ?? 0),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

function normalizeMockExamQuestion(row: unknown): DbMockExamQuestion {
  const record = row as Partial<DbMockExamQuestion>;

  return {
    id: String(record.id),
    section_id: String(record.section_id),
    question_type: (record.question_type ?? "other") as MockExamQuestionType,
    prompt: String(record.prompt),
    data: normalizeRecord(record.data),
    marks: Number(record.marks ?? 0),
    sort_order: Number(record.sort_order ?? 0),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

function applyMockExamFilters(exams: DbMockExamSet[], filters?: MockExamFilters) {
  const paperNumber =
    filters?.paperNumber && filters.paperNumber !== "all"
      ? Number(filters.paperNumber)
      : null;
  const tier = filters?.tier && filters.tier !== "all" ? filters.tier : null;
  const published = filters?.published ?? "all";

  return exams.filter((exam) => {
    if (paperNumber && exam.paper_number !== paperNumber) return false;
    if (tier && exam.tier !== tier && exam.tier !== "both") return false;
    if (published === "published" && !exam.is_published) return false;
    if (published === "draft" && exam.is_published) return false;

    return true;
  });
}

export function canDashboardAccessMockExam(
  exam: DbMockExamSet,
  dashboard: DashboardInfo | null
) {
  if (!dashboard) return false;

  if (dashboard.role === "admin" || dashboard.role === "teacher") {
    return true;
  }

  if (dashboard.role !== "student") {
    return false;
  }

  if (dashboard.variant === "foundation" && exam.tier === "higher") {
    return false;
  }

  if (dashboard.variant === "higher" && exam.tier === "foundation") {
    return false;
  }

  if (dashboard.accessMode === "trial") {
    return exam.is_trial_visible;
  }

  if (dashboard.accessMode === "full") {
    return true;
  }

  if (dashboard.accessMode === "volna") {
    return exam.available_in_volna;
  }

  return !exam.requires_paid_access;
}

export function filterMockExamsForDashboardAccess(
  exams: DbMockExamSet[],
  dashboard: DashboardInfo | null
) {
  return exams.filter((exam) => canDashboardAccessMockExam(exam, dashboard));
}

export async function getMockExamSetsDb(filters?: MockExamFilters) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_sets")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching mock exam sets:", { filters, error });
    return [];
  }

  return applyMockExamFilters((data ?? []).map(normalizeMockExamSet), filters);
}

export async function getPublishedMockExamSetsDb(filters?: MockExamFilters) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_sets")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching published mock exam sets:", { filters, error });
    return [];
  }

  return applyMockExamFilters((data ?? []).map(normalizeMockExamSet), {
    ...filters,
    published: "published",
  });
}

export async function getMockExamSetByIdDb(mockExamId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_sets")
    .select("*")
    .eq("id", mockExamId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching mock exam set by id:", { mockExamId, error });
    return null;
  }

  return data ? normalizeMockExamSet(data) : null;
}

export async function getMockExamSetBySlugDb(mockExamSlug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_sets")
    .select("*")
    .eq("slug", mockExamSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching mock exam set by slug:", { mockExamSlug, error });
    return null;
  }

  return data ? normalizeMockExamSet(data) : null;
}

export async function getMockExamSectionsDb(mockExamId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_sections")
    .select("*")
    .eq("mock_exam_id", mockExamId)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching mock exam sections:", { mockExamId, error });
    return [];
  }

  return (data ?? []).map(normalizeMockExamSection);
}

export async function getMockExamQuestionsBySectionIdsDb(sectionIds: string[]) {
  if (sectionIds.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_questions")
    .select("*")
    .in("section_id", sectionIds)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching mock exam questions:", { sectionIds, error });
    return [];
  }

  return (data ?? []).map(normalizeMockExamQuestion);
}

export async function loadMockExamByIdDb(
  mockExamId: string
): Promise<LoadedMockExamDb> {
  const exam = await getMockExamSetByIdDb(mockExamId);

  if (!exam) {
    return {
      exam: null,
      sections: [],
      questionsBySectionId: {},
    };
  }

  const sections = await getMockExamSectionsDb(exam.id);
  const questions = await getMockExamQuestionsBySectionIdsDb(
    sections.map((section) => section.id)
  );

  return {
    exam,
    sections,
    questionsBySectionId: groupQuestionsBySectionId(questions),
  };
}

export async function loadMockExamBySlugDb(
  mockExamSlug: string,
  options?: { publishedOnly?: boolean }
): Promise<LoadedMockExamDb> {
  const exam = await getMockExamSetBySlugDb(mockExamSlug);

  if (!exam || (options?.publishedOnly && !exam.is_published)) {
    return {
      exam: null,
      sections: [],
      questionsBySectionId: {},
    };
  }

  const sections = await getMockExamSectionsDb(exam.id);
  const questions = await getMockExamQuestionsBySectionIdsDb(
    sections.map((section) => section.id)
  );

  return {
    exam,
    sections,
    questionsBySectionId: groupQuestionsBySectionId(questions),
  };
}

function groupQuestionsBySectionId(questions: DbMockExamQuestion[]) {
  return questions.reduce<Record<string, DbMockExamQuestion[]>>((acc, question) => {
    const existing = acc[question.section_id] ?? [];
    existing.push(question);
    acc[question.section_id] = existing;
    return acc;
  }, {});
}

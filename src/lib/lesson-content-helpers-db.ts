import { createClient } from "@/lib/supabase/server";
import type { LessonBlock, LessonSection, LessonSectionKind } from "@/types/lesson";

export type DbLessonSection = {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  section_kind: string;
  position: number;
  is_published: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type DbLessonBlock = {
  id: string;
  lesson_section_id: string;
  block_type: string;
  position: number;
  data: Record<string, unknown>;
  is_published: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

const allowedSectionKinds: LessonSectionKind[] = [
  "intro",
  "content",
  "grammar",
  "practice",
  "reading_practice",
  "writing_practice",
  "speaking_practice",
  "listening_practice",
  "summary",
];

function resolveSectionKind(value: string): LessonSectionKind {
  return allowedSectionKinds.includes(value as LessonSectionKind)
    ? (value as LessonSectionKind)
    : "content";
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid lesson block field: ${field}`);
  }

  return value;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function mapDbBlockToLessonBlock(row: DbLessonBlock): LessonBlock {
  const data = row.data ?? {};

  switch (row.block_type) {
    case "header":
      return {
        type: "header",
        content: requireString(data.content, "content"),
      };

    case "subheader":
      return {
        type: "subheader",
        content: requireString(data.content, "content"),
      };

    case "divider":
      return {
        type: "divider",
      };

    case "text":
      return {
        type: "text",
        content: requireString(data.content, "content"),
      };

    case "note":
      return {
        type: "note",
        title: requireString(data.title, "title"),
        content: requireString(data.content, "content"),
      };

    case "callout":
      return {
        type: "callout",
        title: optionalString(data.title),
        content: requireString(data.content, "content"),
      };

    case "exam-tip":
      return {
        type: "exam-tip",
        title: optionalString(data.title),
        content: requireString(data.content, "content"),
      };

    case "vocabulary":
      return {
        type: "vocabulary",
        title: requireString(data.title, "title"),
        items: Array.isArray(data.items)
          ? data.items.map((item, index) => {
              if (!item || typeof item !== "object") {
                throw new Error(`Invalid vocabulary item at index ${index}`);
              }

              const record = item as Record<string, unknown>;

              return {
                russian: requireString(record.russian, `items[${index}].russian`),
                english: requireString(record.english, `items[${index}].english`),
              };
            })
          : [],
      };

    case "vocabulary-set":
      return {
        type: "vocabulary-set",
        title: optionalString(data.title),
        vocabularySetSlug: requireString(data.vocabularySetSlug, "vocabularySetSlug"),
      };

    case "question-set":
      return {
        type: "question-set",
        title: optionalString(data.title),
        questionSetSlug: requireString(data.questionSetSlug, "questionSetSlug"),
      };

    case "multiple-choice":
      return {
        type: "multiple-choice",
        question: requireString(data.question, "question"),
        options: Array.isArray(data.options)
          ? data.options.map((option, index) => {
              if (!option || typeof option !== "object") {
                throw new Error(`Invalid multiple-choice option at index ${index}`);
              }

              const record = option as Record<string, unknown>;

              return {
                id: requireString(record.id, `options[${index}].id`),
                text: requireString(record.text, `options[${index}].text`),
              };
            })
          : [],
        correctOptionId: requireString(data.correctOptionId, "correctOptionId"),
        explanation: optionalString(data.explanation),
      };

    case "short-answer":
      return {
        type: "short-answer",
        question: requireString(data.question, "question"),
        acceptedAnswers: Array.isArray(data.acceptedAnswers)
          ? data.acceptedAnswers.filter(
              (value): value is string =>
                typeof value === "string" && value.trim().length > 0
            )
          : [],
        explanation: optionalString(data.explanation),
        placeholder: optionalString(data.placeholder),
      };

    default:
      throw new Error(`Unsupported lesson block type: ${row.block_type}`);
  }
}

export async function getLessonSectionsByLessonIdDb(
  lessonId: string
): Promise<DbLessonSection[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_sections")
    .select("*")
    .eq("lesson_id", lessonId)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lesson sections:", { lessonId, error });
    return [];
  }

  return (data ?? []) as DbLessonSection[];
}

export async function getLessonBlocksBySectionIdsDb(
  sectionIds: string[]
): Promise<DbLessonBlock[]> {
  if (sectionIds.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_blocks")
    .select("*")
    .in("lesson_section_id", sectionIds)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lesson blocks:", { sectionIds, error });
    return [];
  }

  return (data ?? []) as DbLessonBlock[];
}

export async function loadLessonContentByLessonIdDb(
  lessonId: string
): Promise<{ lessonId: string; sections: LessonSection[] }> {
  const sections = await getLessonSectionsByLessonIdDb(lessonId);
  const sectionIds = sections.map((section) => section.id);
  const blocks = await getLessonBlocksBySectionIdsDb(sectionIds);

  const blocksBySectionId = new Map<string, DbLessonBlock[]>();

  for (const block of blocks) {
    const current = blocksBySectionId.get(block.lesson_section_id) ?? [];
    current.push(block);
    blocksBySectionId.set(block.lesson_section_id, current);
  }

  return {
    lessonId,
    sections: sections.map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description ?? undefined,
      sectionKind: resolveSectionKind(section.section_kind),
      position: section.position,
      blocks: (blocksBySectionId.get(section.id) ?? []).map(mapDbBlockToLessonBlock),
    })),
  };
}

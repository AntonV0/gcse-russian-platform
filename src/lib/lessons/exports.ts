import type { DbCourse, DbCourseVariant, DbLesson, DbModule } from "@/lib/courses/types";
import {
  renderGrammarPointMarkdown,
  type GrammarExportPoint,
} from "@/lib/grammar/exports";
import type { DbGrammarSet } from "@/lib/grammar/types";
import { getLessonBlockLabel } from "@/lib/lessons/lesson-blocks";
import {
  getNumberArray,
  getRecordArray,
  getStringArray,
} from "@/lib/questions/question-answer-utils";
import type {
  DbQuestion,
  DbQuestionAcceptedAnswer,
  DbQuestionOption,
  DbQuestionSet,
} from "@/lib/questions/question-db-types";
import {
  renderUnlistedVocabularyItemsSectionMarkdown,
  renderVocabularyItemsTableMarkdown,
  renderVocabularyListSectionMarkdown,
} from "@/lib/vocabulary/exports";
import type {
  DbVocabularyItem,
  DbVocabularyList,
  DbVocabularySet,
} from "@/lib/vocabulary/shared/types";

export type LessonExportBlock = {
  id?: string;
  block_type: string;
  position: number;
  is_published: boolean;
  data: Record<string, unknown> | null;
};

export type LessonExportSection = {
  id?: string;
  title: string;
  description?: string | null;
  section_kind: string;
  position: number;
  is_published: boolean;
  variant_visibility: "shared" | "foundation_only" | "higher_only" | "volna_only";
  canonical_section_key: string | null;
  blocks: LessonExportBlock[];
};

export type LessonExportVocabularyResource = {
  vocabularySet: DbVocabularySet | null;
  vocabularyList: DbVocabularyList | null;
  lists: DbVocabularyList[];
  items: DbVocabularyItem[];
};

export type LessonExportGrammarSetResource = {
  grammarSet: DbGrammarSet | null;
  points: GrammarExportPoint[];
};

export type LessonExportQuestionSetResource = {
  questionSet: DbQuestionSet | null;
  questions: DbQuestion[];
  options: DbQuestionOption[];
  acceptedAnswers: DbQuestionAcceptedAnswer[];
};

export type LessonExportLinkedResources = {
  vocabularySets?: Record<string, LessonExportVocabularyResource>;
  grammarSets?: Record<string, LessonExportGrammarSetResource>;
  questionSets?: Record<string, LessonExportQuestionSetResource>;
};

export type LessonExportInput = {
  course: Pick<DbCourse, "title" | "slug">;
  variant: Pick<DbCourseVariant, "title" | "slug">;
  module: Pick<DbModule, "title" | "slug">;
  lesson: Pick<
    DbLesson,
    | "title"
    | "slug"
    | "summary"
    | "lesson_type"
    | "estimated_minutes"
    | "is_published"
    | "is_trial_visible"
    | "requires_paid_access"
    | "available_in_volna"
    | "content_source"
    | "content_key"
  >;
  sections: LessonExportSection[];
  linkedResources?: LessonExportLinkedResources;
};

export type LessonMarkdownExport = {
  markdown: string;
  filename: string;
};

function asText(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asBooleanText(value: boolean): string {
  return value ? "Yes" : "No";
}

function asStatusText(value: boolean): string {
  return value ? "Published" : "Draft";
}

function asActiveStatusText(value: boolean): string {
  return value ? "Active" : "Inactive";
}

function formatOptionalText(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "Not set";
  return String(value);
}

function formatVariantVisibility(value: LessonExportSection["variant_visibility"]) {
  switch (value) {
    case "shared":
      return "Shared";
    case "foundation_only":
      return "Foundation only";
    case "higher_only":
      return "Higher only";
    case "volna_only":
      return "Volna only";
    default:
      return value;
  }
}

function slugForFilename(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "lesson"
  );
}

function escapeTableCell(value: string): string {
  return value.replaceAll("|", "\\|").replace(/\s+/g, " ").trim();
}

function markdownHeading(level: number, text: string) {
  const safeLevel = Math.min(Math.max(level, 1), 6);
  return `${"#".repeat(safeLevel)} ${text}`;
}

export function getLessonVocabularyResourceKey(params: {
  vocabularySetSlug: string;
  vocabularyListSlug?: string | null;
}) {
  return JSON.stringify([
    params.vocabularySetSlug.trim(),
    params.vocabularyListSlug?.trim() ?? "",
  ]);
}

export function getLessonLinkedResourceSlug(data: Record<string, unknown>, key: string) {
  return asText(data[key]);
}

function sectionHeading(section: LessonExportSection, index: number): string {
  const status = asStatusText(section.is_published);
  return `## ${index + 1}. ${section.title} (${status})`;
}

function renderTextBlock(data: Record<string, unknown>, heading?: string): string {
  const content = asText(data.content) ?? "_No content set._";
  return heading ? `**${heading}:**\n\n${content}` : content;
}

function renderTitledContentBlock(
  label: string,
  data: Record<string, unknown>,
  fallbackTitle: string
): string {
  const title = asText(data.title) ?? fallbackTitle;
  const content = asText(data.content) ?? "_No content set._";
  return `**${label}: ${title}**\n\n${content}`;
}

function renderVocabularyBlock(data: Record<string, unknown>): string {
  const title = asText(data.title) ?? "Vocabulary";
  const items = Array.isArray(data.items) ? data.items : [];

  if (items.length === 0) {
    return `**Vocabulary: ${title}**\n\n_No vocabulary items set._`;
  }

  const rows = items.map((item) => {
    if (!item || typeof item !== "object") {
      return "| Not set | Not set |";
    }

    const record = item as Record<string, unknown>;
    return `| ${escapeTableCell(asText(record.russian) ?? "Not set")} | ${escapeTableCell(
      asText(record.english) ?? "Not set"
    )} |`;
  });

  return [
    `**Vocabulary: ${title}**`,
    "",
    "| Russian | English |",
    "| --- | --- |",
    ...rows,
  ].join("\n");
}

function renderReference(label: string, values: [string, string | null][]): string {
  const details = values
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: \`${value}\``)
    .join("; ");

  return `**Reference: ${label}**${details ? `\n\n${details}` : ""}`;
}

function renderMissingLinkedResource(reference: string, label: string) {
  return `${reference}\n\n_Missing linked ${label}; it may have been deleted or the saved slug may be stale._`;
}

function sortVocabularyLists(lists: DbVocabularyList[]) {
  return [...lists].sort(
    (a, b) =>
      a.sort_order - b.sort_order ||
      a.title.localeCompare(b.title) ||
      a.slug.localeCompare(b.slug)
  );
}

function renderLinkedVocabularySetBlock(
  data: Record<string, unknown>,
  resources?: LessonExportLinkedResources["vocabularySets"]
): string {
  const vocabularySetSlug = asText(data.vocabularySetSlug);
  const vocabularyListSlug = asText(data.vocabularyListSlug);
  const reference = renderReference("Vocabulary set", [
    ["title", asText(data.title)],
    ["vocabularySetSlug", vocabularySetSlug],
    ["vocabularyListSlug", vocabularyListSlug],
  ]);

  if (!resources || !vocabularySetSlug) return reference;

  const resource =
    resources[
      getLessonVocabularyResourceKey({
        vocabularySetSlug,
        vocabularyListSlug,
      })
    ];

  if (!resource?.vocabularySet) {
    return renderMissingLinkedResource(reference, "vocabulary set");
  }

  const { vocabularySet, vocabularyList, items } = resource;
  const lines = [
    `**Linked vocabulary set: ${asText(data.title) ?? vocabularySet.title}**`,
    "",
    `- Set: ${vocabularySet.title} (\`${formatOptionalText(vocabularySet.slug)}\`)`,
    `- Published: ${asBooleanText(vocabularySet.is_published)}`,
    `- Selected list: ${
      vocabularyList ? `${vocabularyList.title} (\`${vocabularyList.slug}\`)` : "Not set"
    }`,
    `- Items included: ${items.length}`,
  ];

  if (vocabularyListSlug && !vocabularyList) {
    lines.push(
      "",
      `_Linked vocabulary list \`${vocabularyListSlug}\` was not found in this set._`
    );
    return lines.join("\n");
  }

  const lists = vocabularyList ? [vocabularyList] : sortVocabularyLists(resource.lists);
  const listIds = new Set(lists.map((list) => list.id));
  const unlistedItems = vocabularyList
    ? []
    : items.filter(
        (item) => !item.vocabulary_list_id || !listIds.has(item.vocabulary_list_id)
      );

  lines.push("");

  if (lists.length > 0) {
    lines.push(
      lists
        .map((list, index) => renderVocabularyListSectionMarkdown(list, items, index, 4))
        .join("\n\n")
    );

    if (unlistedItems.length > 0) {
      lines.push("", renderUnlistedVocabularyItemsSectionMarkdown(unlistedItems, 4));
    }
  } else {
    lines.push(
      markdownHeading(4, "Vocabulary Items"),
      "",
      renderVocabularyItemsTableMarkdown(items)
    );
  }

  return lines.join("\n");
}

function sortGrammarPoints(points: GrammarExportPoint[]) {
  return [...points].sort(
    (a, b) =>
      a.sort_order - b.sort_order ||
      a.title.localeCompare(b.title) ||
      a.slug.localeCompare(b.slug)
  );
}

function renderLinkedGrammarSetBlock(
  data: Record<string, unknown>,
  resources?: LessonExportLinkedResources["grammarSets"]
): string {
  const grammarSetSlug = asText(data.grammarSetSlug);
  const reference = renderReference("Grammar set", [
    ["title", asText(data.title)],
    ["grammarSetSlug", grammarSetSlug],
  ]);

  if (!resources || !grammarSetSlug) return reference;

  const resource = resources[grammarSetSlug];

  if (!resource?.grammarSet) {
    return renderMissingLinkedResource(reference, "grammar set");
  }

  const points = sortGrammarPoints(resource.points);
  return [
    `**Linked grammar set: ${asText(data.title) ?? resource.grammarSet.title}**`,
    "",
    `- Set: ${resource.grammarSet.title} (\`${resource.grammarSet.slug}\`)`,
    `- Published: ${asBooleanText(resource.grammarSet.is_published)}`,
    `- Points included: ${points.length}`,
    "",
    points.length > 0
      ? points
          .map((point, index) => renderGrammarPointMarkdown(point, index, 4))
          .join("\n\n")
      : "_No grammar points available._",
  ].join("\n");
}

function groupByQuestionId<T extends { question_id: string }>(items: T[]) {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    groups.set(item.question_id, [...(groups.get(item.question_id) ?? []), item]);
  }

  return groups;
}

function renderQuestionOptions(options: DbQuestionOption[]) {
  if (options.length === 0) return null;

  const rows = [...options]
    .sort((a, b) => a.position - b.position)
    .map(
      (option, index) =>
        `| ${index + 1} | ${escapeTableCell(option.option_text ?? "Not set")} | ${
          option.is_correct === null ? "Not set" : asBooleanText(option.is_correct)
        } |`
    );

  return ["| # | Option | Correct |", "| --- | --- | --- |", ...rows].join("\n");
}

function renderAcceptedAnswers(answers: DbQuestionAcceptedAnswer[]) {
  if (answers.length === 0) return null;

  const rows = [...answers]
    .sort(
      (a, b) =>
        Number(b.is_primary) - Number(a.is_primary) ||
        a.answer_text.localeCompare(b.answer_text)
    )
    .map((answer, index) =>
      [
        index + 1,
        escapeTableCell(answer.answer_text),
        asBooleanText(answer.is_primary),
        asBooleanText(answer.case_sensitive),
        escapeTableCell(formatOptionalText(answer.notes)),
      ].join(" | ")
    );

  return [
    "| # | Accepted answer | Primary | Case sensitive | Notes |",
    "| --- | --- | --- | --- | --- |",
    ...rows.map((row) => `| ${row} |`),
  ].join("\n");
}

function renderStructuredQuestionMetadata(question: DbQuestion) {
  const metadata = question.metadata ?? {};

  if (question.question_type === "matching") {
    const prompts = getStringArray(metadata.prompts);
    const options = getStringArray(metadata.options);
    const correctMatches = getNumberArray(metadata.correctMatches);
    const lines = [
      markdownHeading(5, "Matching Data"),
      "",
      prompts.length > 0 ? `Prompts: ${prompts.join("; ")}` : "Prompts: Not set",
      options.length > 0 ? `Options: ${options.join("; ")}` : "Options: Not set",
    ];

    if (correctMatches.length > 0) {
      lines.push(
        `Correct matches: ${correctMatches
          .map((optionIndex, promptIndex) => {
            const prompt = prompts[promptIndex] ?? `Prompt ${promptIndex + 1}`;
            const option = options[optionIndex] ?? `Option ${optionIndex + 1}`;
            return `${prompt} -> ${option}`;
          })
          .join("; ")}`
      );
    }

    return lines.join("\n");
  }

  if (question.question_type === "ordering") {
    const items = getStringArray(metadata.items);
    const correctOrder = getNumberArray(metadata.correctOrder)
      .map((index) => items[index] ?? `Item ${index + 1}`)
      .filter(Boolean);

    return [
      markdownHeading(5, "Ordering Data"),
      "",
      items.length > 0 ? `Items: ${items.join("; ")}` : "Items: Not set",
      correctOrder.length > 0
        ? `Correct order: ${correctOrder.join(" -> ")}`
        : "Correct order: Not set",
    ].join("\n");
  }

  if (question.question_type === "word_bank_gap_fill") {
    const gaps = getRecordArray(metadata.gaps);
    const wordBank = getStringArray(metadata.wordBank);
    const gapLines = gaps.map((gap, index) => {
      const label = asText(gap.label) ?? `Gap ${index + 1}`;
      const acceptedAnswers = getStringArray(gap.acceptedAnswers);
      return `- ${label}: ${
        acceptedAnswers.length > 0 ? acceptedAnswers.join(", ") : "Not set"
      }`;
    });

    return [
      markdownHeading(5, "Gap Fill Data"),
      "",
      asText(metadata.text) ? `Text: ${asText(metadata.text)}` : "Text: Not set",
      wordBank.length > 0 ? `Word bank: ${wordBank.join(", ")}` : "Word bank: Not set",
      "",
      gapLines.length > 0 ? gapLines.join("\n") : "_No gaps set._",
    ].join("\n");
  }

  if (question.question_type === "categorisation") {
    const categories = getRecordArray(metadata.categories);
    const items = getRecordArray(metadata.items);
    const categoryById = new Map(
      categories.map((category, index) => [
        asText(category.id) ?? `category-${index + 1}`,
        asText(category.label) ?? `Category ${index + 1}`,
      ])
    );

    return [
      markdownHeading(5, "Categorisation Data"),
      "",
      categories.length > 0
        ? `Categories: ${Array.from(categoryById.values()).join("; ")}`
        : "Categories: Not set",
      "",
      items.length > 0
        ? items
            .map((item, index) => {
              const text = asText(item.text) ?? `Item ${index + 1}`;
              const categoryId = asText(item.categoryId);
              const category = categoryId ? categoryById.get(categoryId) : null;
              return `- ${text}: ${category ?? categoryId ?? "Not set"}`;
            })
            .join("\n")
        : "_No items set._",
    ].join("\n");
  }

  return null;
}

function renderQuestionForExport(
  question: DbQuestion,
  index: number,
  options: DbQuestionOption[],
  acceptedAnswers: DbQuestionAcceptedAnswer[]
) {
  const optionMarkdown = renderQuestionOptions(options);
  const acceptedAnswerMarkdown = renderAcceptedAnswers(acceptedAnswers);
  const structuredMetadata = renderStructuredQuestionMetadata(question);
  const answerSections = [
    optionMarkdown,
    acceptedAnswerMarkdown,
    structuredMetadata,
  ].filter((section): section is string => Boolean(section));

  return [
    markdownHeading(
      4,
      `Question ${index + 1}: ${question.question_type} (${asActiveStatusText(
        question.is_active
      )})`
    ),
    "",
    `- Position: ${question.position}`,
    `- Marks: ${question.marks}`,
    `- Difficulty: ${formatOptionalText(question.difficulty)}`,
    question.audio_path ? `- Audio reference: \`${question.audio_path}\`` : null,
    question.image_path ? `- Image reference: \`${question.image_path}\`` : null,
    "",
    question.prompt || "_No prompt set._",
    question.explanation ? `\nExplanation: ${question.explanation}` : null,
    answerSections.length > 0
      ? "\n" + answerSections.join("\n\n")
      : "\n_No answer data available._",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

function renderLinkedQuestionSetBlock(
  data: Record<string, unknown>,
  resources?: LessonExportLinkedResources["questionSets"]
): string {
  const questionSetSlug = asText(data.questionSetSlug);
  const reference = renderReference("Question set", [
    ["title", asText(data.title)],
    ["questionSetSlug", questionSetSlug],
  ]);

  if (!resources || !questionSetSlug) return reference;

  const resource = resources[questionSetSlug];

  if (!resource?.questionSet) {
    return renderMissingLinkedResource(reference, "question set");
  }

  const optionsByQuestionId = groupByQuestionId(resource.options);
  const acceptedAnswersByQuestionId = groupByQuestionId(resource.acceptedAnswers);
  const questions = [...resource.questions].sort(
    (a, b) =>
      a.position - b.position ||
      a.prompt.localeCompare(b.prompt) ||
      a.id.localeCompare(b.id)
  );

  return [
    `**Linked question set: ${asText(data.title) ?? resource.questionSet.title}**`,
    "",
    `- Set: ${resource.questionSet.title} (\`${formatOptionalText(resource.questionSet.slug)}\`)`,
    `- Source type: ${formatOptionalText(resource.questionSet.source_type)}`,
    `- Questions included: ${questions.length}`,
    resource.questionSet.description
      ? `- Description: ${resource.questionSet.description}`
      : null,
    resource.questionSet.instructions
      ? `- Instructions: ${resource.questionSet.instructions}`
      : null,
    "",
    questions.length > 0
      ? questions
          .map((question, index) =>
            renderQuestionForExport(
              question,
              index,
              optionsByQuestionId.get(question.id) ?? [],
              acceptedAnswersByQuestionId.get(question.id) ?? []
            )
          )
          .join("\n\n")
      : "_No questions available._",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

function renderMultipleChoiceBlock(data: Record<string, unknown>): string {
  const question = asText(data.question) ?? "Question not set";
  const options = Array.isArray(data.options) ? data.options : [];
  const correctOptionId = asText(data.correctOptionId);
  const explanation = asText(data.explanation);

  const lines = [`**Multiple choice:** ${question}`, ""];

  if (options.length > 0) {
    for (const option of options) {
      if (!option || typeof option !== "object") continue;
      const record = option as Record<string, unknown>;
      const optionId = asText(record.id) ?? "";
      const marker = correctOptionId && optionId === correctOptionId ? " (correct)" : "";
      lines.push(`- ${asText(record.text) ?? "Option not set"}${marker}`);
    }
  } else {
    lines.push("_No options set._");
  }

  if (explanation) {
    lines.push("", `Explanation: ${explanation}`);
  }

  return lines.join("\n");
}

function renderShortAnswerBlock(data: Record<string, unknown>): string {
  const question = asText(data.question) ?? "Question not set";
  const acceptedAnswers = Array.isArray(data.acceptedAnswers)
    ? data.acceptedAnswers.filter((value): value is string => typeof value === "string")
    : [];
  const explanation = asText(data.explanation);

  const lines = [`**Short answer:** ${question}`, ""];
  lines.push(
    acceptedAnswers.length > 0
      ? `Accepted answers: ${acceptedAnswers.map((answer) => `\`${answer}\``).join(", ")}`
      : "Accepted answers: Not set"
  );

  if (explanation) {
    lines.push("", `Explanation: ${explanation}`);
  }

  return lines.join("\n");
}

function renderBlockContent(
  block: LessonExportBlock,
  linkedResources?: LessonExportLinkedResources
): string {
  const data = block.data ?? {};

  switch (block.block_type) {
    case "header":
      return `### ${asText(data.content) ?? "Header not set"}`;
    case "subheader":
      return `#### ${asText(data.content) ?? "Subheader not set"}`;
    case "text":
      return renderTextBlock(data);
    case "note":
      return renderTitledContentBlock("Note", data, "Study note");
    case "callout":
      return renderTitledContentBlock("Callout", data, "Remember");
    case "exam-tip":
      return renderTitledContentBlock("Exam tip", data, "Exam tip");
    case "vocabulary":
      return renderVocabularyBlock(data);
    case "question-set":
      return renderLinkedQuestionSetBlock(data, linkedResources?.questionSets);
    case "vocabulary-set":
      return renderLinkedVocabularySetBlock(data, linkedResources?.vocabularySets);
    case "grammar-set":
      return renderLinkedGrammarSetBlock(data, linkedResources?.grammarSets);
    case "image":
      return renderReference("Image", [
        ["src", asText(data.src)],
        ["alt", asText(data.alt)],
        ["caption", asText(data.caption)],
      ]);
    case "audio":
      return renderReference("Audio", [
        ["title", asText(data.title)],
        ["src", asText(data.src)],
        ["caption", asText(data.caption)],
      ]);
    case "multiple-choice":
      return renderMultipleChoiceBlock(data);
    case "short-answer":
      return renderShortAnswerBlock(data);
    case "divider":
      return "**Divider**";
    default:
      return renderReference(`Unsupported block type: ${block.block_type}`, []);
  }
}

function renderBlock(
  block: LessonExportBlock,
  index: number,
  linkedResources?: LessonExportLinkedResources
): string {
  const label = getLessonBlockLabel(block.block_type);
  const status = asStatusText(block.is_published);

  return [
    `### Block ${index + 1}: ${label} (${status})`,
    "",
    `- Position: ${block.position}`,
    `- Type: \`${block.block_type}\``,
    "",
    renderBlockContent(block, linkedResources),
  ].join("\n");
}

function renderSection(
  section: LessonExportSection,
  index: number,
  linkedResources?: LessonExportLinkedResources
): string {
  const blocks = [...section.blocks].sort((a, b) => a.position - b.position);
  const lines = [
    sectionHeading(section, index),
    "",
    `- Position: ${section.position}`,
    `- Kind: \`${section.section_kind}\``,
    `- Variant visibility: ${formatVariantVisibility(section.variant_visibility)}`,
    `- Canonical key: ${formatOptionalText(section.canonical_section_key)}`,
  ];

  if (section.description) {
    lines.push(`- Description: ${section.description}`);
  }

  lines.push("");

  if (blocks.length === 0) {
    lines.push("_No blocks in this section._");
  } else {
    lines.push(
      blocks
        .map((block, blockIndex) => renderBlock(block, blockIndex, linkedResources))
        .join("\n\n")
    );
  }

  return lines.join("\n");
}

export function renderLessonMarkdownExport(
  input: LessonExportInput
): LessonMarkdownExport {
  const sections = [...input.sections].sort((a, b) => a.position - b.position);
  const filename = `${slugForFilename(input.course.slug)}-${slugForFilename(
    input.variant.slug
  )}-${slugForFilename(input.module.slug)}-${slugForFilename(input.lesson.slug)}-review.md`;

  const header = [
    `# ${input.lesson.title}`,
    "",
    "## Lesson Metadata",
    "",
    `- Course: ${input.course.title} (\`${input.course.slug}\`)`,
    `- Variant: ${input.variant.title} (\`${input.variant.slug}\`)`,
    `- Module: ${input.module.title} (\`${input.module.slug}\`)`,
    `- Lesson: ${input.lesson.title} (\`${input.lesson.slug}\`)`,
    `- Lesson type: ${formatOptionalText(input.lesson.lesson_type)}`,
    `- Estimated minutes: ${formatOptionalText(input.lesson.estimated_minutes)}`,
    `- Published: ${asBooleanText(input.lesson.is_published)}`,
    `- Trial visible: ${asBooleanText(input.lesson.is_trial_visible)}`,
    `- Requires paid access: ${asBooleanText(input.lesson.requires_paid_access)}`,
    `- Available in Volna: ${asBooleanText(input.lesson.available_in_volna)}`,
    `- Content source: ${formatOptionalText(input.lesson.content_source)}`,
    `- Content key: ${formatOptionalText(input.lesson.content_key)}`,
  ];

  if (input.lesson.summary) {
    header.push(`- Summary: ${input.lesson.summary}`);
  }

  const body =
    sections.length > 0
      ? sections
          .map((section, index) => renderSection(section, index, input.linkedResources))
          .join("\n\n")
      : "_No lesson sections available._";

  return {
    filename,
    markdown: [...header, "", body, ""].join("\n"),
  };
}

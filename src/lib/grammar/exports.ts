import {
  getGrammarCategoryLabel,
  getGrammarKnowledgeRequirementLabel,
  getGrammarThemeLabel,
  getGrammarTierLabel,
  getGrammarTopicLabel,
} from "@/lib/grammar/labels";
import type {
  DbGrammarExample,
  DbGrammarPoint,
  DbGrammarSet,
  DbGrammarTable,
} from "@/lib/grammar/types";

export type GrammarExportPoint = DbGrammarPoint & {
  examples: DbGrammarExample[];
  tables: DbGrammarTable[];
};

export type GrammarExportInput = {
  grammarSet: DbGrammarSet;
  points: GrammarExportPoint[];
};

export type GrammarMarkdownExport = {
  markdown: string;
  filename: string;
};

function asBooleanText(value: boolean): string {
  return value ? "Yes" : "No";
}

function asStatusText(value: boolean): string {
  return value ? "Published" : "Draft";
}

function formatOptionalText(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "Not set";
  return String(value);
}

function slugForFilename(value: string, fallback: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || fallback
  );
}

function escapeTableCell(value: string): string {
  return value
    .replaceAll("|", "\\|")
    .replace(/\r?\n/g, "<br>")
    .replace(/\s+/g, " ")
    .trim();
}

function sortPoints(points: GrammarExportPoint[]) {
  return [...points].sort(
    (a, b) =>
      a.sort_order - b.sort_order ||
      a.title.localeCompare(b.title) ||
      a.slug.localeCompare(b.slug)
  );
}

function sortExamples(examples: DbGrammarExample[]) {
  return [...examples].sort(
    (a, b) =>
      a.sort_order - b.sort_order ||
      a.russian_text.localeCompare(b.russian_text) ||
      a.id.localeCompare(b.id)
  );
}

function sortTables(tables: DbGrammarTable[]) {
  return [...tables].sort(
    (a, b) =>
      a.sort_order - b.sort_order ||
      a.title.localeCompare(b.title) ||
      a.id.localeCompare(b.id)
  );
}

function markdownHeading(level: number, text: string) {
  const safeLevel = Math.min(Math.max(level, 1), 6);
  return `${"#".repeat(safeLevel)} ${text}`;
}

export function renderGrammarExamplesMarkdown(examples: DbGrammarExample[]) {
  const sortedExamples = sortExamples(examples);

  if (sortedExamples.length === 0) return "_No examples available._";

  const rows = sortedExamples.map((example, index) =>
    [
      index + 1,
      escapeTableCell(example.russian_text),
      escapeTableCell(example.english_translation),
      escapeTableCell(formatOptionalText(example.optional_highlight)),
      escapeTableCell(formatOptionalText(example.note)),
    ].join(" | ")
  );

  return [
    "| # | Russian | English | Highlight | Notes |",
    "| --- | --- | --- | --- | --- |",
    ...rows.map((row) => `| ${row} |`),
  ].join("\n");
}

function getTableColumns(table: DbGrammarTable) {
  if (table.columns.length > 0) return table.columns;

  const width = Math.max(0, ...table.rows.map((row) => row.length));
  return Array.from({ length: width }, (_, index) => `Column ${index + 1}`);
}

export function renderGrammarTableMarkdown(table: DbGrammarTable) {
  const columns = getTableColumns(table);

  if (columns.length === 0) {
    return "_No table columns or rows available._";
  }

  const header = `| ${columns.map((column) => escapeTableCell(column)).join(" | ")} |`;
  const divider = `| ${columns.map(() => "---").join(" | ")} |`;
  const rows = table.rows.map((row) => {
    const cells = columns.map((_, index) => escapeTableCell(row[index] ?? "Not set"));
    return `| ${cells.join(" | ")} |`;
  });

  return [header, divider, ...rows].join("\n");
}

export function renderGrammarTablesMarkdown(tables: DbGrammarTable[], headingLevel = 4) {
  const sortedTables = sortTables(tables);

  if (sortedTables.length === 0) return "_No tables available._";

  return sortedTables
    .map((table, index) =>
      [
        markdownHeading(headingLevel, `Table ${index + 1}: ${table.title}`),
        "",
        table.optional_note ? `_${table.optional_note}_\n` : null,
        renderGrammarTableMarkdown(table),
      ]
        .filter((line): line is string => line !== null)
        .join("\n")
    )
    .join("\n\n");
}

export function renderGrammarPointMarkdown(
  point: GrammarExportPoint,
  index: number,
  headingLevel = 2
) {
  return [
    markdownHeading(
      headingLevel,
      `${index + 1}. ${point.title} (${asStatusText(point.is_published)})`
    ),
    "",
    `- Slug: \`${point.slug}\``,
    `- Tier: ${getGrammarTierLabel(point.tier)}`,
    `- Knowledge requirement: ${getGrammarKnowledgeRequirementLabel(point.knowledge_requirement)}`,
    `- Category: ${getGrammarCategoryLabel(point.category_key)}`,
    `- Grammar tag: ${formatOptionalText(point.grammar_tag_key)}`,
    `- Spec reference: ${formatOptionalText(point.spec_reference)}`,
    `- Receptive scope: ${formatOptionalText(point.receptive_scope)}`,
    `- Source key: ${formatOptionalText(point.source_key)}`,
    `- Source version: ${formatOptionalText(point.source_version)}`,
    `- Import key: ${formatOptionalText(point.import_key)}`,
    point.short_description ? `- Description: ${point.short_description}` : null,
    "",
    markdownHeading(headingLevel + 1, "Explanation"),
    "",
    point.full_explanation?.trim() || "_No explanation available._",
    "",
    markdownHeading(headingLevel + 1, "Examples"),
    "",
    renderGrammarExamplesMarkdown(point.examples),
    "",
    markdownHeading(headingLevel + 1, "Tables"),
    "",
    renderGrammarTablesMarkdown(point.tables, headingLevel + 2),
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export function renderGrammarMarkdownExport(
  input: GrammarExportInput
): GrammarMarkdownExport {
  const { grammarSet } = input;
  const points = sortPoints(input.points);
  const filename = `${slugForFilename(grammarSet.slug, "grammar-set")}-review.md`;
  const header = [
    `# ${grammarSet.title}`,
    "",
    "## Grammar Set Metadata",
    "",
    `- Set: ${grammarSet.title} (\`${grammarSet.slug}\`)`,
    `- Description: ${formatOptionalText(grammarSet.description)}`,
    `- Tier: ${getGrammarTierLabel(grammarSet.tier)}`,
    `- Theme: ${getGrammarThemeLabel(grammarSet.theme_key)}`,
    `- Topic: ${getGrammarTopicLabel(grammarSet.topic_key)}`,
    `- Published: ${asBooleanText(grammarSet.is_published)}`,
    `- Trial visible: ${asBooleanText(grammarSet.is_trial_visible)}`,
    `- Requires paid access: ${asBooleanText(grammarSet.requires_paid_access)}`,
    `- Available in Volna: ${asBooleanText(grammarSet.available_in_volna)}`,
    `- Source key: ${formatOptionalText(grammarSet.source_key)}`,
    `- Source version: ${formatOptionalText(grammarSet.source_version)}`,
    `- Import key: ${formatOptionalText(grammarSet.import_key)}`,
    `- Points: ${points.length}`,
  ];

  const body =
    points.length > 0
      ? points
          .map((point, index) => renderGrammarPointMarkdown(point, index))
          .join("\n\n")
      : "_No grammar points available._";

  return {
    filename,
    markdown: [...header, "", body, ""].join("\n"),
  };
}

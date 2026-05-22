import {
  getVocabularyListModeLabel,
  getVocabularyProductiveReceptiveLabel,
  getVocabularySetTypeLabel,
  getVocabularyThemeLabel,
  getVocabularyTierLabel,
  getVocabularyTopicLabel,
} from "@/lib/vocabulary/shared/labels";
import type {
  DbVocabularyItem,
  DbVocabularyList,
  DbVocabularySet,
} from "@/lib/vocabulary/shared/types";

export type VocabularyExportInput = {
  vocabularySet: DbVocabularySet;
  lists: DbVocabularyList[];
  items: DbVocabularyItem[];
};

export type VocabularyMarkdownExport = {
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

function slugForFilename(value: string | null | undefined, fallback: string): string {
  return (
    (value ?? fallback)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "vocabulary-set"
  );
}

function escapeTableCell(value: string): string {
  return value
    .replaceAll("|", "\\|")
    .replace(/\r?\n/g, "<br>")
    .replace(/\s+/g, " ")
    .trim();
}

function getStableItemSortValue(item: DbVocabularyItem) {
  return [
    String(item.position).padStart(8, "0"),
    item.russian.toLocaleLowerCase("ru"),
    item.english.toLocaleLowerCase("en"),
    item.id,
  ].join("|");
}

function sortItems(items: DbVocabularyItem[]) {
  return [...items].sort((a, b) =>
    getStableItemSortValue(a).localeCompare(getStableItemSortValue(b))
  );
}

function sortLists(lists: DbVocabularyList[]) {
  return [...lists].sort(
    (a, b) =>
      a.sort_order - b.sort_order ||
      a.title.localeCompare(b.title) ||
      a.slug.localeCompare(b.slug)
  );
}

function markdownHeading(level: number, text: string) {
  const safeLevel = Math.min(Math.max(level, 1), 6);
  return `${"#".repeat(safeLevel)} ${text}`;
}

function formatItemExamplesAndNotes(item: DbVocabularyItem) {
  const parts = [
    item.example_ru ? `RU: ${item.example_ru}` : null,
    item.example_en ? `EN: ${item.example_en}` : null,
    item.notes ? `Notes: ${item.notes}` : null,
  ].filter((value): value is string => Boolean(value));

  return parts.length > 0 ? parts.join("<br>") : "Not set";
}

function formatItemMetadata(item: DbVocabularyItem) {
  const parts = [
    `Type: ${item.item_type}`,
    `Part of speech: ${item.part_of_speech}`,
    item.gender !== "not_applicable" ? `Gender: ${item.gender}` : null,
    item.plural ? `Plural: ${item.plural}` : null,
    item.aspect !== "not_applicable" ? `Aspect: ${item.aspect}` : null,
    item.case_governed ? `Case governed: ${item.case_governed}` : null,
    item.is_reflexive ? "Reflexive: Yes" : null,
    `Use: ${getVocabularyProductiveReceptiveLabel(item.productive_receptive)}`,
    `Tier: ${getVocabularyTierLabel(item.tier)}`,
    `Source type: ${item.source_type}`,
    `Priority: ${item.priority}`,
    item.canonical_key ? `Canonical key: ${item.canonical_key}` : null,
    item.source_key ? `Source: ${item.source_key}` : null,
    item.source_version ? `Source version: ${item.source_version}` : null,
    item.source_section_ref ? `Source ref: ${item.source_section_ref}` : null,
    item.import_key ? `Import: ${item.import_key}` : null,
  ].filter((value): value is string => Boolean(value));

  return parts.join("<br>");
}

export function renderVocabularyItemsTableMarkdown(items: DbVocabularyItem[]) {
  if (items.length === 0) return "_No vocabulary items available._";

  const rows = sortItems(items).map((item, index) =>
    [
      index + 1,
      escapeTableCell(item.russian),
      escapeTableCell(item.english),
      escapeTableCell(formatOptionalText(item.transliteration)),
      escapeTableCell(formatItemExamplesAndNotes(item)),
      escapeTableCell(formatItemMetadata(item)),
    ].join(" | ")
  );

  return [
    "| # | Russian | English | Transliteration | Examples and notes | Metadata |",
    "| --- | --- | --- | --- | --- | --- |",
    ...rows.map((row) => `| ${row} |`),
  ].join("\n");
}

export function renderVocabularyListSectionMarkdown(
  list: DbVocabularyList,
  items: DbVocabularyItem[],
  index: number,
  headingLevel = 2
) {
  const listItems = items.filter((item) => item.vocabulary_list_id === list.id);

  return [
    markdownHeading(
      headingLevel,
      `${index + 1}. ${list.title} (${asStatusText(list.is_published)})`
    ),
    "",
    `- Slug: \`${list.slug}\``,
    `- Tier: ${getVocabularyTierLabel(list.tier)}`,
    `- Mode: ${getVocabularyListModeLabel(list.list_mode)}`,
    `- Theme: ${getVocabularyThemeLabel(list.theme_key)}`,
    `- Topic: ${getVocabularyTopicLabel(list.topic_key)}`,
    `- Category: ${formatOptionalText(list.category_key)}`,
    `- Subcategory: ${formatOptionalText(list.subcategory_key)}`,
    `- Source key: ${formatOptionalText(list.source_key)}`,
    `- Source version: ${formatOptionalText(list.source_version)}`,
    `- Source ref: ${formatOptionalText(list.source_section_ref)}`,
    `- Import key: ${formatOptionalText(list.import_key)}`,
    list.description ? `- Description: ${list.description}` : null,
    "",
    renderVocabularyItemsTableMarkdown(listItems),
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export function renderUnlistedVocabularyItemsSectionMarkdown(
  items: DbVocabularyItem[],
  headingLevel = 2
) {
  return [
    markdownHeading(headingLevel, "Unlisted Vocabulary Items"),
    "",
    renderVocabularyItemsTableMarkdown(items),
  ].join("\n");
}

export function renderVocabularyMarkdownExport(
  input: VocabularyExportInput
): VocabularyMarkdownExport {
  const { vocabularySet, items } = input;
  const lists = sortLists(input.lists);
  const listIds = new Set(lists.map((list) => list.id));
  const unlistedItems = items.filter(
    (item) => !item.vocabulary_list_id || !listIds.has(item.vocabulary_list_id)
  );
  const fallbackSlug = slugForFilename(vocabularySet.title, "vocabulary-set");
  const filename = `${slugForFilename(vocabularySet.slug, fallbackSlug)}-review.md`;
  const header = [
    `# ${vocabularySet.title}`,
    "",
    "## Vocabulary Set Metadata",
    "",
    `- Set: ${vocabularySet.title} (\`${formatOptionalText(vocabularySet.slug)}\`)`,
    `- Description: ${formatOptionalText(vocabularySet.description)}`,
    `- Tier: ${getVocabularyTierLabel(vocabularySet.tier)}`,
    `- Theme: ${getVocabularyThemeLabel(vocabularySet.theme_key)}`,
    `- Topic: ${getVocabularyTopicLabel(vocabularySet.topic_key)}`,
    `- List mode: ${getVocabularyListModeLabel(vocabularySet.list_mode)}`,
    `- Set type: ${getVocabularySetTypeLabel(vocabularySet.set_type)}`,
    `- Published: ${asBooleanText(vocabularySet.is_published)}`,
    `- Trial visible: ${asBooleanText(vocabularySet.is_trial_visible)}`,
    `- Requires paid access: ${asBooleanText(vocabularySet.requires_paid_access)}`,
    `- Available in Volna: ${asBooleanText(vocabularySet.available_in_volna)}`,
    `- Source key: ${formatOptionalText(vocabularySet.source_key)}`,
    `- Source version: ${formatOptionalText(vocabularySet.source_version)}`,
    `- Import key: ${formatOptionalText(vocabularySet.import_key)}`,
    `- Lists: ${lists.length}`,
    `- Items: ${items.length}`,
  ];

  const body =
    lists.length > 0
      ? [
          ...lists.map((list, index) =>
            renderVocabularyListSectionMarkdown(list, items, index)
          ),
          unlistedItems.length > 0
            ? renderUnlistedVocabularyItemsSectionMarkdown(unlistedItems)
            : null,
        ]
          .filter((section): section is string => Boolean(section))
          .join("\n\n")
      : ["## Vocabulary Items", "", renderVocabularyItemsTableMarkdown(items)].join("\n");

  return {
    filename,
    markdown: [...header, "", body, ""].join("\n"),
  };
}

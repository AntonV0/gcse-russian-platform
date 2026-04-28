import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import Select from "@/components/ui/select";
import {
  BulkVocabularyItemForm,
  NewVocabularyItemForm,
} from "@/components/admin/vocabulary/items/item-forms";
import { getDefaultVocabularyItemTier } from "@/components/admin/vocabulary/items/item-display";
import { VocabularyAdminStatTile } from "@/components/admin/vocabulary/items/primitives";
import VocabularyItemCard from "@/components/admin/vocabulary/items/vocabulary-item-card";
import {
  getVocabularyListModeLabel,
  getVocabularyTierLabel,
} from "@/lib/vocabulary/labels";
import { getVocabularyListAppliesToStudyVariant } from "@/lib/vocabulary/study-variants";
import type {
  DbVocabularyItem,
  DbVocabularyItemCoverage,
  DbVocabularyList,
  DbVocabularyPartOfSpeech,
  DbVocabularyProductiveReceptive,
  DbVocabularyItemSourceType,
  DbVocabularySet,
  DbVocabularySetUsageStats,
  DbVocabularyTier,
} from "@/lib/vocabulary/types";

type VocabularyItemAdminFilters = {
  itemSearch?: string;
  partOfSpeech?: string;
  sourceType?: string;
  tier?: string;
  skillUse?: string;
  categoryKey?: string;
  coverage?: string;
};

function getAdminListSectionTitle(list: DbVocabularyList) {
  if (list.tier === "foundation") {
    return "Foundation tier";
  }

  if (list.tier === "higher") {
    return "Higher tier extension";
  }

  return list.title;
}

function groupAdminItemsByList(lists: DbVocabularyList[], items: DbVocabularyItem[]) {
  const itemListIds = new Set(
    items.map((item) => item.vocabulary_list_id).filter(Boolean)
  );
  const visibleLists = lists.filter((list) => itemListIds.has(list.id));

  if (visibleLists.length === 0) {
    return [
      {
        key: "all-items",
        title: "All items",
        description: `${items.length} item${items.length === 1 ? "" : "s"}`,
        items,
      },
    ];
  }

  return visibleLists.map((list) => {
    const listItems = items.filter((item) => item.vocabulary_list_id === list.id);
    const higherCumulativeNote =
      list.tier === "higher" &&
      lists.some((candidate) =>
        getVocabularyListAppliesToStudyVariant(candidate.tier, "higher")
      )
        ? "Higher and Volna students also need the Foundation section above."
        : null;

    return {
      key: list.id,
      title: getAdminListSectionTitle(list),
      description: [
        `${listItems.length} item${listItems.length === 1 ? "" : "s"}`,
        higherCumulativeNote,
      ]
        .filter(Boolean)
        .join(" "),
      items: listItems,
    };
  });
}

function getUniqueSortedValues(values: (string | null | undefined)[]) {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value)))
  ).sort((a, b) => a.localeCompare(b));
}

function normalizePartOfSpeechFilter(value?: string): DbVocabularyPartOfSpeech | "all" {
  const allowed = new Set([
    "noun",
    "verb",
    "adjective",
    "adverb",
    "pronoun",
    "preposition",
    "conjunction",
    "number",
    "phrase",
    "interjection",
    "other",
    "unknown",
  ]);

  return value && allowed.has(value) ? (value as DbVocabularyPartOfSpeech) : "all";
}

function normalizeSourceTypeFilter(value?: string): DbVocabularyItemSourceType | "all" {
  return value === "spec_required" || value === "extended" || value === "custom"
    ? value
    : "all";
}

function normalizeTierFilter(value?: string): DbVocabularyTier | "all" {
  return value === "foundation" ||
    value === "higher" ||
    value === "both" ||
    value === "unknown"
    ? value
    : "all";
}

function normalizeSkillUseFilter(
  value?: string
): DbVocabularyProductiveReceptive | "all" {
  return value === "productive" ||
    value === "receptive" ||
    value === "both" ||
    value === "unknown"
    ? value
    : "all";
}

function normalizeCoverageFilter(value?: string) {
  if (
    value === "foundation" ||
    value === "higher" ||
    value === "volna" ||
    value === "custom" ||
    value === "unused"
  ) {
    return value;
  }

  return "all";
}

function filterVocabularyItems({
  items,
  itemCoverageById,
  filters,
}: {
  items: DbVocabularyItem[];
  itemCoverageById: Map<string, DbVocabularyItemCoverage>;
  filters: VocabularyItemAdminFilters;
}) {
  const search = filters.itemSearch?.trim().toLowerCase();
  const partOfSpeech = normalizePartOfSpeechFilter(filters.partOfSpeech);
  const sourceType = normalizeSourceTypeFilter(filters.sourceType);
  const tier = normalizeTierFilter(filters.tier);
  const skillUse = normalizeSkillUseFilter(filters.skillUse);
  const categoryKey = filters.categoryKey?.trim();
  const coverage = normalizeCoverageFilter(filters.coverage);

  return items.filter((item) => {
    if (search) {
      const haystack = [
        item.russian,
        item.english,
        item.transliteration,
        item.example_ru,
        item.example_en,
        item.notes,
        item.canonical_key,
        item.import_key,
        item.theme_key,
        item.topic_key,
        item.category_key,
        item.subcategory_key,
        item.source_section_ref,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(search)) return false;
    }

    if (partOfSpeech !== "all" && item.part_of_speech !== partOfSpeech) {
      return false;
    }

    if (sourceType !== "all" && item.source_type !== sourceType) {
      return false;
    }

    if (tier !== "all" && item.tier !== tier) {
      return false;
    }

    if (skillUse !== "all" && item.productive_receptive !== skillUse) {
      return false;
    }

    if (
      categoryKey &&
      item.category_key !== categoryKey &&
      item.subcategory_key !== categoryKey
    ) {
      return false;
    }

    const itemCoverage = itemCoverageById.get(item.id);

    if (coverage === "foundation" && !itemCoverage?.used_in_foundation) {
      return false;
    }

    if (coverage === "higher" && !itemCoverage?.used_in_higher) {
      return false;
    }

    if (coverage === "volna" && !itemCoverage?.used_in_volna) {
      return false;
    }

    if (coverage === "custom" && !itemCoverage?.used_in_custom_list) {
      return false;
    }

    if (
      coverage === "unused" &&
      (itemCoverage?.used_in_foundation ||
        itemCoverage?.used_in_higher ||
        itemCoverage?.used_in_volna ||
        itemCoverage?.used_in_custom_list)
    ) {
      return false;
    }

    return true;
  });
}

export default function VocabularySetItemsAdmin({
  vocabularySet,
  vocabularyList,
  lists,
  items,
  usageStats,
  itemCoverageById,
  itemFilters,
}: {
  vocabularySet: DbVocabularySet;
  vocabularyList: DbVocabularyList | null;
  lists: DbVocabularyList[];
  items: DbVocabularyItem[];
  usageStats: DbVocabularySetUsageStats;
  itemCoverageById: Map<string, DbVocabularyItemCoverage>;
  itemFilters: VocabularyItemAdminFilters;
}) {
  const defaultTier = getDefaultVocabularyItemTier(vocabularySet.tier);
  const filteredItems = filterVocabularyItems({
    items,
    itemCoverageById,
    filters: itemFilters,
  });
  const itemSections = groupAdminItemsByList(lists, filteredItems);
  const categoryOptions = getUniqueSortedValues(
    items.flatMap((item) => [item.category_key, item.subcategory_key])
  );
  const hasActiveItemFilters =
    Boolean(itemFilters.itemSearch?.trim()) ||
    normalizePartOfSpeechFilter(itemFilters.partOfSpeech) !== "all" ||
    normalizeSourceTypeFilter(itemFilters.sourceType) !== "all" ||
    normalizeTierFilter(itemFilters.tier) !== "all" ||
    normalizeSkillUseFilter(itemFilters.skillUse) !== "all" ||
    Boolean(itemFilters.categoryKey?.trim()) ||
    normalizeCoverageFilter(itemFilters.coverage) !== "all";

  return (
    <main className="space-y-8">
      <PageHeader
        title="Vocabulary items"
        description="Manage the words and phrases inside this reusable vocabulary set."
      />

      <section className="app-surface app-section-padding">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="vocabulary">
                {getVocabularyTierLabel(vocabularySet.tier)}
              </Badge>

              <Badge tone="muted" icon="list">
                {getVocabularyListModeLabel(vocabularySet.list_mode)}
              </Badge>

              <PublishStatusBadge isPublished={vocabularySet.is_published} />
            </div>

            <div>
              <h2 className="app-heading-section">{vocabularySet.title}</h2>
              <p className="mt-2 max-w-3xl app-text-body-muted">
                {vocabularySet.description || "No description yet."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/admin/vocabulary" variant="secondary" icon="back">
              Back to vocabulary
            </Button>

            <Button
              href={`/admin/vocabulary/${vocabularySet.id}/edit`}
              variant="soft"
              icon="edit"
            >
              Edit set
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <VocabularyAdminStatTile label="Items" value={items.length} />
        <VocabularyAdminStatTile label="Lists" value={lists.length} />
        <VocabularyAdminStatTile
          label="Foundation usages"
          value={usageStats.foundationOccurrences}
        />
        <VocabularyAdminStatTile
          label="Higher usages"
          value={usageStats.higherOccurrences}
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <NewVocabularyItemForm
          vocabularySetId={vocabularySet.id}
          vocabularyListId={vocabularyList?.id ?? null}
          defaultTier={defaultTier}
        />

        <BulkVocabularyItemForm
          vocabularySetId={vocabularySet.id}
          vocabularyListId={vocabularyList?.id ?? null}
          defaultTier={defaultTier}
        />
      </div>

      <section className="app-surface app-section-padding">
        <div className="mb-5 flex flex-col gap-4">
          <div>
            <h2 className="app-heading-subsection">Current items</h2>
            <p className="mt-2 app-text-body-muted">
              Items are collapsed by default so long sets stay scannable. Filter by item
              metadata to inspect the spec vocabulary without changing the uploaded sets.
            </p>
          </div>

          <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.2fr)_repeat(6,minmax(140px,1fr))_max-content] xl:items-center">
            <Input
              name="itemSearch"
              defaultValue={itemFilters.itemSearch ?? ""}
              placeholder="Search word, meaning, example, key..."
            />

            <Select
              name="partOfSpeech"
              defaultValue={normalizePartOfSpeechFilter(itemFilters.partOfSpeech)}
            >
              <option value="all">All parts</option>
              <option value="noun">Nouns</option>
              <option value="verb">Verbs</option>
              <option value="adjective">Adjectives</option>
              <option value="adverb">Adverbs</option>
              <option value="pronoun">Pronouns</option>
              <option value="preposition">Prepositions</option>
              <option value="conjunction">Conjunctions</option>
              <option value="number">Numbers</option>
              <option value="phrase">Phrases</option>
              <option value="interjection">Interjections</option>
              <option value="other">Other</option>
              <option value="unknown">Unknown</option>
            </Select>

            <Select
              name="sourceType"
              defaultValue={normalizeSourceTypeFilter(itemFilters.sourceType)}
            >
              <option value="all">All sources</option>
              <option value="spec_required">Spec required</option>
              <option value="extended">Extended</option>
              <option value="custom">Custom</option>
            </Select>

            <Select name="tier" defaultValue={normalizeTierFilter(itemFilters.tier)}>
              <option value="all">All tiers</option>
              <option value="foundation">Foundation</option>
              <option value="higher">Higher</option>
              <option value="both">Both tiers</option>
              <option value="unknown">Unknown</option>
            </Select>

            <Select
              name="skillUse"
              defaultValue={normalizeSkillUseFilter(itemFilters.skillUse)}
            >
              <option value="all">All skills</option>
              <option value="productive">Productive</option>
              <option value="receptive">Receptive</option>
              <option value="both">Both</option>
              <option value="unknown">Unknown</option>
            </Select>

            <Select name="categoryKey" defaultValue={itemFilters.categoryKey ?? ""}>
              <option value="">All categories</option>
              {categoryOptions.map((categoryKey) => (
                <option key={categoryKey} value={categoryKey}>
                  {categoryKey.replaceAll("_", " ")}
                </option>
              ))}
            </Select>

            <Select
              name="coverage"
              defaultValue={normalizeCoverageFilter(itemFilters.coverage)}
            >
              <option value="all">All coverage</option>
              <option value="foundation">Used in Foundation</option>
              <option value="higher">Used in Higher</option>
              <option value="volna">Used in Volna</option>
              <option value="custom">Used in custom list</option>
              <option value="unused">Unused</option>
            </Select>

            <div className="flex flex-wrap gap-2 md:col-span-2 xl:col-span-1 xl:justify-end">
              <Button type="submit" variant="secondary" size="sm" icon="filter">
                Apply
              </Button>
              <Button
                href={`/admin/vocabulary/${vocabularySet.id}/items`}
                variant="quiet"
                size="sm"
                icon="refresh"
              >
                Reset
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2">
            <Badge tone={hasActiveItemFilters ? "info" : "muted"} icon="filter">
              {filteredItems.length} of {items.length} shown
            </Badge>
            {hasActiveItemFilters ? (
              <Badge tone="muted" icon="vocabulary">
                Metadata filters active
              </Badge>
            ) : null}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-5 py-8 app-text-body-muted">
            No items in this set yet. Use quick add or bulk add above to create the first
            entries.
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-5 py-8 app-text-body-muted">
            No items match the current metadata filters. Clear the filters to inspect the
            full set again.
          </div>
        ) : (
          <div className="space-y-8">
            {itemSections.map((section) => (
              <section key={section.key} className="space-y-4">
                <div>
                  <h3 className="app-heading-card">{section.title}</h3>
                  <p className="mt-1 app-text-caption">{section.description}</p>
                </div>

                <div className="space-y-4">
                  {section.items.map((item) => (
                    <VocabularyItemCard
                      key={item.id}
                      item={item}
                      vocabularySetId={vocabularySet.id}
                      vocabularyListId={
                        item.vocabulary_list_id ?? vocabularyList?.id ?? null
                      }
                      defaultTier={defaultTier}
                      coverage={itemCoverageById.get(item.id) ?? null}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

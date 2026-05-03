import Badge from "@/components/ui/badge";
import VocabularyItemCard from "@/components/admin/vocabulary/items/vocabulary-item-card";
import { VocabularyItemFilterForm } from "./item-filter-form";
import type {
  DbVocabularyItem,
  DbVocabularyItemCoverage,
  DbVocabularyList,
  DbVocabularyTier,
} from "@/lib/vocabulary/shared/types";
import type { ReactNode } from "react";
import type { VocabularyItemAdminFilters, VocabularyItemAdminSection } from "./types";

function VocabularyItemsEmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-5 py-8 app-text-body-muted">
      {children}
    </div>
  );
}

function VocabularyItemSectionList({
  sections,
  vocabularySetId,
  fallbackVocabularyListId,
  defaultTier,
  itemCoverageById,
}: {
  sections: VocabularyItemAdminSection[];
  vocabularySetId: string;
  fallbackVocabularyListId: string | null;
  defaultTier: DbVocabularyTier;
  itemCoverageById: Map<string, DbVocabularyItemCoverage>;
}) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
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
                vocabularySetId={vocabularySetId}
                vocabularyListId={item.vocabulary_list_id ?? fallbackVocabularyListId}
                defaultTier={defaultTier}
                coverage={itemCoverageById.get(item.id) ?? null}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function CurrentVocabularyItemsSection({
  vocabularySetId,
  vocabularyList,
  items,
  filteredItems,
  itemSections,
  itemCoverageById,
  itemFilters,
  categoryOptions,
  hasActiveItemFilters,
  defaultTier,
  showVolnaCoverageFilter,
  showExtendedSourceFilter,
}: {
  vocabularySetId: string;
  vocabularyList: DbVocabularyList | null;
  items: DbVocabularyItem[];
  filteredItems: DbVocabularyItem[];
  itemSections: VocabularyItemAdminSection[];
  itemCoverageById: Map<string, DbVocabularyItemCoverage>;
  itemFilters: VocabularyItemAdminFilters;
  categoryOptions: string[];
  hasActiveItemFilters: boolean;
  defaultTier: DbVocabularyTier;
  showVolnaCoverageFilter: boolean;
  showExtendedSourceFilter: boolean;
}) {
  return (
    <section className="app-surface app-section-padding">
      <div className="mb-5 flex flex-col gap-4">
        <div>
          <h2 className="app-heading-subsection">Current items</h2>
          <p className="mt-2 app-text-body-muted">
            Items are collapsed by default so long sets stay scannable. Filter by item
            metadata to inspect the spec vocabulary without changing the uploaded sets.
          </p>
        </div>

        <VocabularyItemFilterForm
          vocabularySetId={vocabularySetId}
          itemFilters={itemFilters}
          categoryOptions={categoryOptions}
          showVolnaCoverageFilter={showVolnaCoverageFilter}
          showExtendedSourceFilter={showExtendedSourceFilter}
        />

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
        <VocabularyItemsEmptyState>
          No items in this set yet. Use quick add or bulk add below to create the first
          entries.
        </VocabularyItemsEmptyState>
      ) : filteredItems.length === 0 ? (
        <VocabularyItemsEmptyState>
          No items match the current metadata filters. Clear the filters to inspect the
          full set again.
        </VocabularyItemsEmptyState>
      ) : (
        <VocabularyItemSectionList
          sections={itemSections}
          vocabularySetId={vocabularySetId}
          fallbackVocabularyListId={vocabularyList?.id ?? null}
          defaultTier={defaultTier}
          itemCoverageById={itemCoverageById}
        />
      )}
    </section>
  );
}

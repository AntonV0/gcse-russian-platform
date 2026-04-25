import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import { BulkVocabularyItemForm, NewVocabularyItemForm } from "@/components/admin/vocabulary/items/item-forms";
import {
  getDefaultVocabularyItemTier,
} from "@/components/admin/vocabulary/items/item-display";
import {
  VocabularyAdminStatTile,
} from "@/components/admin/vocabulary/items/primitives";
import VocabularyItemCard from "@/components/admin/vocabulary/items/vocabulary-item-card";
import {
  getVocabularyListModeLabel,
  getVocabularyTierLabel,
  type DbVocabularyItem,
  type DbVocabularyItemCoverage,
  type DbVocabularyList,
  type DbVocabularySet,
  type DbVocabularySetUsageStats,
} from "@/lib/vocabulary/vocabulary-helpers-db";

export default function VocabularySetItemsAdmin({
  vocabularySet,
  vocabularyList,
  lists,
  items,
  usageStats,
  itemCoverageById,
}: {
  vocabularySet: DbVocabularySet;
  vocabularyList: DbVocabularyList | null;
  lists: DbVocabularyList[];
  items: DbVocabularyItem[];
  usageStats: DbVocabularySetUsageStats;
  itemCoverageById: Map<string, DbVocabularyItemCoverage>;
}) {
  const defaultTier = getDefaultVocabularyItemTier(vocabularySet.tier);

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
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                {vocabularySet.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
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
        <div className="mb-5 flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Current items
          </h2>
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            Items are collapsed by default so long sets stay scannable. Open one item when
            you need detailed editing.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-5 py-8 text-sm text-[var(--text-secondary)]">
            No items in this set yet. Use quick add or bulk add above to create the first
            entries.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <VocabularyItemCard
                key={item.id}
                item={item}
                vocabularySetId={vocabularySet.id}
                vocabularyListId={item.vocabulary_list_id ?? vocabularyList?.id ?? null}
                defaultTier={defaultTier}
                coverage={itemCoverageById.get(item.id) ?? null}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

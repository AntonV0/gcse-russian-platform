import { notFound } from "next/navigation";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DetailList from "@/components/ui/detail-list";
import EmptyState from "@/components/ui/empty-state";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getRequiredVocabularyCoverageVariants,
  getVocabularyCoverageVariantCount,
  getVocabularyCoverageVariantLabel,
  getVocabularyCoverageVariantUsed,
  getVocabularyDisplayVariantLabel,
  getVocabularyItemCoverageByItemIdsDb,
  getVocabularyListModeLabel,
  getVocabularyProductiveReceptiveLabel,
  getVocabularySetTypeLabel,
  getVocabularyThemeLabel,
  getVocabularyTierLabel,
  getVocabularyTopicLabel,
  groupVocabularyItemsBySource,
  loadVocabularySetByRefDb,
  type DbVocabularyItemCoverage,
  type DbVocabularyItem,
} from "@/lib/vocabulary/vocabulary-helpers-db";

type VocabularySetPageProps = {
  params: Promise<{ vocabularySetRef: string }>;
};

function getItemBadgeTone(item: DbVocabularyItem) {
  if (item.source_type === "spec_required") return "info";
  if (item.priority === "extension") return "warning";
  return "muted";
}

function CoverageBadge({
  label,
  isUsed,
  count,
}: {
  label: string;
  isUsed: boolean;
  count?: number;
}) {
  return (
    <Badge tone={isUsed ? "success" : "danger"} icon={isUsed ? "success" : "cancel"}>
      {count && count > 0 ? `${label} ${count}` : label}
    </Badge>
  );
}

function VocabularyItemCoverageBadges({
  item,
  coverage,
}: {
  item: DbVocabularyItem;
  coverage: DbVocabularyItemCoverage | null;
}) {
  const lessonCoverageVariants = getRequiredVocabularyCoverageVariants(item.tier);

  return (
    <div className="flex flex-wrap gap-2 md:justify-end">
      {lessonCoverageVariants.map((variant) => (
        <CoverageBadge
          key={variant}
          label={getVocabularyCoverageVariantLabel(variant)}
          isUsed={getVocabularyCoverageVariantUsed(coverage, variant)}
          count={getVocabularyCoverageVariantCount(coverage, variant)}
        />
      ))}

      <CoverageBadge
        label="Custom list"
        isUsed={Boolean(coverage?.used_in_custom_list)}
        count={coverage?.custom_list_occurrences ?? 0}
      />
    </div>
  );
}

function VocabularyItemRow({
  item,
  coverage,
}: {
  item: DbVocabularyItem;
  coverage: DbVocabularyItemCoverage | null;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="text-lg font-semibold leading-7 text-[var(--text-primary)]">
            {item.russian}
          </div>
          <div className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            {item.english}
          </div>
          {item.transliteration ? (
            <div className="mt-1 text-sm leading-6 app-text-soft">
              {item.transliteration}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col gap-2 md:items-end">
          <div className="flex flex-wrap gap-2 md:justify-end">
            <Badge tone={getItemBadgeTone(item)}>
              {item.source_type.replaceAll("_", " ")}
            </Badge>
            <Badge tone="muted">{item.part_of_speech.replaceAll("_", " ")}</Badge>
            <Badge tone="muted">{getVocabularyTierLabel(item.tier)}</Badge>
          </div>

          <VocabularyItemCoverageBadges item={item} coverage={coverage} />
        </div>
      </div>

      {item.example_ru || item.example_en || item.notes ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {item.example_ru || item.example_en ? (
            <div className="rounded-xl bg-[var(--background-muted)] px-3 py-3">
              {item.example_ru ? (
                <div className="font-medium text-[var(--text-primary)]">
                  {item.example_ru}
                </div>
              ) : null}
              {item.example_en ? (
                <div className="mt-1 text-sm text-[var(--text-secondary)]">
                  {item.example_en}
                </div>
              ) : null}
            </div>
          ) : null}

          {item.notes ? (
            <div className="rounded-xl bg-[var(--background-muted)] px-3 py-3 text-sm leading-6 text-[var(--text-secondary)]">
              {item.notes}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function VocabularyItemSection({
  title,
  items,
  itemCoverageById,
}: {
  title: string;
  items: DbVocabularyItem[];
  itemCoverageById: Map<string, DbVocabularyItemCoverage>;
}) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {items.length} item{items.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <VocabularyItemRow
            key={`${item.vocabulary_list_id ?? item.vocabulary_set_id}-${item.id}`}
            item={item}
            coverage={itemCoverageById.get(item.id) ?? null}
          />
        ))}
      </div>
    </div>
  );
}

export default async function VocabularySetPage({ params }: VocabularySetPageProps) {
  const { vocabularySetRef } = await params;
  const dashboard = await getDashboardInfo();
  const { vocabularySet, lists, items } = await loadVocabularySetByRefDb(vocabularySetRef);
  const canSeeDrafts = dashboard.role === "admin" || dashboard.role === "teacher";

  if (!vocabularySet || (!vocabularySet.is_published && !canSeeDrafts)) {
    notFound();
  }

  const groupedItems = groupVocabularyItemsBySource(items);
  const itemCoverageById = await getVocabularyItemCoverageByItemIdsDb(
    items.map((item) => item.id)
  );

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="student"
        eyebrow="Vocabulary set"
        title={vocabularySet.title}
        description={vocabularySet.description ?? "Review this vocabulary set."}
        badges={
          <>
            <Badge tone="info" icon="school">
              {getVocabularyTierLabel(vocabularySet.tier)}
            </Badge>
            <Badge tone="muted" icon="language">
              {getVocabularyListModeLabel(vocabularySet.list_mode)}
            </Badge>
            {!vocabularySet.is_published ? (
              <Badge tone="warning" icon="edit">
                Draft
              </Badge>
            ) : null}
          </>
        }
        actions={
          <>
            <Button href="/vocabulary" variant="secondary" icon="back">
              All vocabulary
            </Button>
            {canSeeDrafts ? (
              <Button
                href={`/admin/vocabulary/${vocabularySet.id}/items`}
                variant="secondary"
                icon="edit"
              >
                Edit items
              </Button>
            ) : null}
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <SectionCard
          title="Vocabulary items"
          description="Study the Russian, English, examples, and notes in this set."
          tone="student"
        >
          {items.length === 0 ? (
            <EmptyState
              icon="language"
              iconTone="brand"
              title="No vocabulary items yet"
              description="This set exists, but no items have been added yet."
            />
          ) : (
            <div className="space-y-6">
              <VocabularyItemSection
                title="Specification vocabulary"
                items={groupedItems.specRequired}
                itemCoverageById={itemCoverageById}
              />
              <VocabularyItemSection
                title="Extended vocabulary"
                items={groupedItems.extended}
                itemCoverageById={itemCoverageById}
              />
              <VocabularyItemSection
                title="Custom vocabulary"
                items={groupedItems.custom}
                itemCoverageById={itemCoverageById}
              />
            </div>
          )}
        </SectionCard>

        <div className="space-y-4">
          <PanelCard title="Set details" tone="student">
            <DetailList
              items={[
                {
                  label: "Tier",
                  value: getVocabularyTierLabel(vocabularySet.tier),
                },
                {
                  label: "Mode",
                  value: getVocabularyListModeLabel(vocabularySet.list_mode),
                },
                {
                  label: "Type",
                  value: getVocabularySetTypeLabel(vocabularySet.set_type),
                },
                {
                  label: "Display",
                  value: getVocabularyDisplayVariantLabel(
                    vocabularySet.default_display_variant
                  ),
                },
                {
                  label: "Theme",
                  value: getVocabularyThemeLabel(vocabularySet.theme_key),
                },
                {
                  label: "Topic",
                  value: getVocabularyTopicLabel(vocabularySet.topic_key),
                },
                {
                  label: "Lists",
                  value: lists.length,
                },
                {
                  label: "Items",
                  value: items.length,
                },
              ]}
            />
          </PanelCard>

          <PanelCard
            title="Learning notes"
            description="Item metadata can help you decide what to prioritise."
            tone="student"
          >
            <div className="space-y-3 text-sm leading-6 text-[var(--text-secondary)]">
              <p>
                Productive vocabulary is especially useful for speaking and writing.
                Receptive vocabulary mainly supports listening and reading.
              </p>
              <p>
                This set marks item status as{" "}
                {items.length > 0
                  ? getVocabularyProductiveReceptiveLabel(items[0].productive_receptive)
                  : "unknown"}{" "}
                where that metadata is available.
              </p>
            </div>
          </PanelCard>
        </div>
      </div>
    </main>
  );
}

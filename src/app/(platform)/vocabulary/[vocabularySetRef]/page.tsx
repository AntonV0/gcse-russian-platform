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

function getItemSourceLabel(item: DbVocabularyItem) {
  switch (item.source_type) {
    case "spec_required":
      return "Exam specification";
    case "extended":
      return "Extended";
    case "custom":
      return "Custom";
  }
}

function getItemStudyUseLabel(item: DbVocabularyItem) {
  switch (item.productive_receptive) {
    case "productive":
      return "Speaking and writing";
    case "receptive":
      return "Listening and reading";
    case "both":
      return "All skills";
    default:
      return null;
  }
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
  showStaffMetadata,
}: {
  item: DbVocabularyItem;
  coverage: DbVocabularyItemCoverage | null;
  showStaffMetadata: boolean;
}) {
  const studyUseLabel = getItemStudyUseLabel(item);

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
            <Badge tone={getItemBadgeTone(item)}>{getItemSourceLabel(item)}</Badge>
            <Badge tone="muted">{item.part_of_speech.replaceAll("_", " ")}</Badge>
            <Badge tone="muted">{getVocabularyTierLabel(item.tier)}</Badge>
            {studyUseLabel ? <Badge tone="muted">{studyUseLabel}</Badge> : null}
          </div>

          {showStaffMetadata ? (
            <VocabularyItemCoverageBadges item={item} coverage={coverage} />
          ) : null}
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
  showStaffMetadata,
}: {
  title: string;
  items: DbVocabularyItem[];
  itemCoverageById: Map<string, DbVocabularyItemCoverage>;
  showStaffMetadata: boolean;
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
            showStaffMetadata={showStaffMetadata}
          />
        ))}
      </div>
    </div>
  );
}

export default async function VocabularySetPage({ params }: VocabularySetPageProps) {
  const { vocabularySetRef } = await params;
  const dashboard = await getDashboardInfo();
  const { vocabularySet, lists, items } =
    await loadVocabularySetByRefDb(vocabularySetRef);
  const canSeeDrafts = dashboard.role === "admin" || dashboard.role === "teacher";

  if (!vocabularySet || (!vocabularySet.is_published && !canSeeDrafts)) {
    notFound();
  }

  const groupedItems = groupVocabularyItemsBySource(items);
  const itemCoverageById: Map<string, DbVocabularyItemCoverage> = canSeeDrafts
    ? await getVocabularyItemCoverageByItemIdsDb(items.map((item) => item.id))
    : new Map();

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
          description="Study the Russian, English, examples, and notes without leaving this page."
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
                showStaffMetadata={canSeeDrafts}
              />
              <VocabularyItemSection
                title="Extended vocabulary"
                items={groupedItems.extended}
                itemCoverageById={itemCoverageById}
                showStaffMetadata={canSeeDrafts}
              />
              <VocabularyItemSection
                title="Custom vocabulary"
                items={groupedItems.custom}
                itemCoverageById={itemCoverageById}
                showStaffMetadata={canSeeDrafts}
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
                  label: "Source",
                  value: getVocabularyListModeLabel(vocabularySet.list_mode),
                },
                {
                  label: "Type",
                  value: getVocabularySetTypeLabel(vocabularySet.set_type),
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
                  label: "Items",
                  value: items.length,
                },
                ...(canSeeDrafts
                  ? [
                      {
                        label: "Lists",
                        value: lists.length,
                      },
                      {
                        label: "Display",
                        value: getVocabularyDisplayVariantLabel(
                          vocabularySet.default_display_variant
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </PanelCard>

          <PanelCard
            title="How to use this set"
            description="A quick revision rhythm for this vocabulary."
            tone="student"
          >
            <div className="space-y-3 text-sm leading-6 text-[var(--text-secondary)]">
              <p>
                Start by covering the English and saying the Russian out loud, then
                reverse it and check the examples for natural exam-style usage.
              </p>
              <p>
                Badges show whether a word is best for production, recognition, or
                all skills, so you can prioritise speaking, writing, listening, and
                reading practice deliberately.
              </p>
            </div>
          </PanelCard>
        </div>
      </div>
    </main>
  );
}

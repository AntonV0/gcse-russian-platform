import { notFound } from "next/navigation";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { getButtonClassName } from "@/components/ui/button-styles";
import DetailList from "@/components/ui/detail-list";
import EmptyState from "@/components/ui/empty-state";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getRequiredVocabularyCoverageVariants,
  getVocabularyListAppliesToStudyVariant,
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
  type DbVocabularyList,
  type DbVocabularyStudyVariant,
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

function SectionToggleButton() {
  return (
    <span
      className={getButtonClassName({
        variant: "secondary",
        size: "sm",
        className: "pointer-events-none",
      })}
      aria-hidden="true"
    >
      <span className="shrink-0">
        <AppIcon icon="next" size={16} />
      </span>
      <span className="truncate">Open</span>
    </span>
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
    <div className="app-card app-card-hover p-4">
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
            <div className="app-soft-panel px-3 py-3">
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
            <div className="app-soft-panel px-3 py-3 text-sm leading-6 text-[var(--text-secondary)]">
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
  description,
  items,
  itemCoverageById,
  showStaffMetadata,
}: {
  title: string;
  description?: string;
  items: DbVocabularyItem[];
  itemCoverageById: Map<string, DbVocabularyItemCoverage>;
  showStaffMetadata: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <details className="group app-card p-4">
      <summary className="app-focus-ring flex cursor-pointer list-none items-start justify-between gap-4 rounded-lg">
        <span className="min-w-0">
          <span className="block text-base font-semibold text-[var(--text-primary)]">
            {title}
          </span>
          <span className="mt-1 block text-sm text-[var(--text-secondary)]">
            {description ?? `${items.length} item${items.length === 1 ? "" : "s"}`}
          </span>
        </span>

        <SectionToggleButton />
      </summary>

      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <VocabularyItemRow
            key={`${item.vocabulary_list_id ?? item.vocabulary_set_id}-${item.id}`}
            item={item}
            coverage={itemCoverageById.get(item.id) ?? null}
            showStaffMetadata={showStaffMetadata}
          />
        ))}
      </div>
    </details>
  );
}

function getVocabularyStudyVariant(
  dashboardVariant: DbVocabularyStudyVariant | null,
  canSeeDrafts: boolean
): DbVocabularyStudyVariant | "all" {
  if (canSeeDrafts) {
    return "all";
  }

  return dashboardVariant ?? "foundation";
}

function getVisibleVocabularyLists(
  lists: DbVocabularyList[],
  studyVariant: DbVocabularyStudyVariant | "all"
) {
  if (studyVariant === "all") {
    return lists;
  }

  return lists.filter((list) =>
    getVocabularyListAppliesToStudyVariant(list.tier, studyVariant)
  );
}

function getVocabularyListSectionTitle(
  list: DbVocabularyList,
  studyVariant: DbVocabularyStudyVariant | "all"
) {
  if (studyVariant === "higher" || studyVariant === "volna") {
    if (list.tier === "foundation") {
      return "Foundation tier";
    }

    if (list.tier === "higher") {
      return "Higher tier extension";
    }
  }

  return list.title;
}

function getVocabularyListSectionDescription(
  list: DbVocabularyList,
  itemCount: number,
  studyVariant: DbVocabularyStudyVariant | "all"
) {
  if ((studyVariant === "higher" || studyVariant === "volna") && list.tier === "foundation") {
    return `${itemCount} Foundation item${itemCount === 1 ? "" : "s"} included for Higher and Volna study`;
  }

  if (list.tier === "higher") {
    return `${itemCount} Higher-extension item${itemCount === 1 ? "" : "s"}`;
  }

  return `${itemCount} item${itemCount === 1 ? "" : "s"}`;
}

function groupVocabularyItemsByList(
  lists: DbVocabularyList[],
  items: DbVocabularyItem[],
  studyVariant: DbVocabularyStudyVariant | "all"
) {
  const itemListIds = new Set(items.map((item) => item.vocabulary_list_id).filter(Boolean));
  const visibleLists = getVisibleVocabularyLists(lists, studyVariant).filter((list) =>
    itemListIds.has(list.id)
  );

  if (visibleLists.length === 0) {
    if (lists.length > 0) {
      const tierSections = [
        {
          key: "foundation",
          title: "Foundation tier",
          description: `${items.filter((item) => item.tier === "foundation").length} Foundation item${items.filter((item) => item.tier === "foundation").length === 1 ? "" : "s"}`,
          items: items.filter((item) => item.tier === "foundation"),
        },
        {
          key: "higher",
          title: "Higher tier extension",
          description: `${items.filter((item) => item.tier === "higher").length} Higher-extension item${items.filter((item) => item.tier === "higher").length === 1 ? "" : "s"}`,
          items: items.filter((item) => item.tier === "higher"),
        },
        {
          key: "both",
          title: "Both tiers",
          description: `${items.filter((item) => item.tier === "both" || item.tier === "unknown").length} item${items.filter((item) => item.tier === "both" || item.tier === "unknown").length === 1 ? "" : "s"}`,
          items: items.filter((item) => item.tier === "both" || item.tier === "unknown"),
        },
      ];

      return tierSections.filter((section) => section.items.length > 0);
    }

    const groupedItems = groupVocabularyItemsBySource(items);
    return [
      {
        key: "spec-required",
        title: "Specification vocabulary",
        description: `${groupedItems.specRequired.length} item${groupedItems.specRequired.length === 1 ? "" : "s"}`,
        items: groupedItems.specRequired,
      },
      {
        key: "extended",
        title: "Extended vocabulary",
        description: `${groupedItems.extended.length} item${groupedItems.extended.length === 1 ? "" : "s"}`,
        items: groupedItems.extended,
      },
      {
        key: "custom",
        title: "Custom vocabulary",
        description: `${groupedItems.custom.length} item${groupedItems.custom.length === 1 ? "" : "s"}`,
        items: groupedItems.custom,
      },
    ].filter((section) => section.items.length > 0);
  }

  return visibleLists.map((list) => {
    const listItems = items.filter((item) => item.vocabulary_list_id === list.id);

    return {
      key: list.id,
      title: getVocabularyListSectionTitle(list, studyVariant),
      description: getVocabularyListSectionDescription(
        list,
        listItems.length,
        studyVariant
      ),
      items: listItems,
    };
  });
}

export default async function VocabularySetPage({ params }: VocabularySetPageProps) {
  const { vocabularySetRef } = await params;
  const dashboard = await getDashboardInfo();
  const canSeeDrafts = dashboard.role === "admin" || dashboard.role === "teacher";
  const studyVariant = getVocabularyStudyVariant(dashboard.variant, canSeeDrafts);
  const { vocabularySet, lists, items } = await loadVocabularySetByRefDb(
    vocabularySetRef,
    { scopeVariant: studyVariant }
  );

  if (!vocabularySet || (!vocabularySet.is_published && !canSeeDrafts)) {
    notFound();
  }

  const itemSections = groupVocabularyItemsByList(lists, items, studyVariant);
  const itemCoverageById: Map<string, DbVocabularyItemCoverage> = canSeeDrafts
    ? await getVocabularyItemCoverageByItemIdsDb(
        Array.from(new Set(items.map((item) => item.id)))
      )
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
            <Badge tone="muted" icon="vocabularySet">
              {getVocabularyListModeLabel(vocabularySet.list_mode)}
            </Badge>
            {!vocabularySet.is_published ? (
              <PublishStatusBadge isPublished={vocabularySet.is_published} />
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
              icon="vocabulary"
              iconTone="brand"
              title="No vocabulary items yet"
              description="This set exists, but no items have been added yet."
            />
          ) : (
            <div className="space-y-6">
              {itemSections.map((section) => (
                <VocabularyItemSection
                  key={section.key}
                  title={section.title}
                  description={section.description}
                  items={section.items}
                  itemCoverageById={itemCoverageById}
                  showStaffMetadata={canSeeDrafts}
                />
              ))}
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

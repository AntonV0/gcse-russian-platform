import { notFound } from "next/navigation";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DetailList from "@/components/ui/detail-list";
import EmptyState from "@/components/ui/empty-state";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import VocabularyItemSectionList from "@/components/vocabulary/vocabulary-item-section-list";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getVocabularyStudyVariant,
  groupVocabularyItemsByList,
} from "@/lib/vocabulary/item-sections";
import {
  getVocabularyDisplayVariantLabel,
  getVocabularyListModeLabel,
  getVocabularySetTypeLabel,
  getVocabularyThemeLabel,
  getVocabularyTierLabel,
  getVocabularyTopicLabel,
} from "@/lib/vocabulary/labels";
import { getVocabularyItemCoverageByItemIdsDb } from "@/lib/vocabulary/item-queries";
import { loadVocabularySetByRefDb } from "@/lib/vocabulary/loaders";
import type { DbVocabularyItemCoverage } from "@/lib/vocabulary/types";

type VocabularySetPageProps = {
  params: Promise<{ vocabularySetRef: string }>;
};

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
            <VocabularyItemSectionList
              sections={itemSections}
              itemCoverageById={itemCoverageById}
              showStaffMetadata={canSeeDrafts}
            />
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
                Badges show whether a word is best for production, recognition, or all
                skills, so you can prioritise speaking, writing, listening, and reading
                practice deliberately.
              </p>
            </div>
          </PanelCard>
        </div>
      </div>
    </main>
  );
}

import { notFound, redirect } from "next/navigation";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DetailList from "@/components/ui/detail-list";
import EmptyState from "@/components/ui/empty-state";
import LockedContentCard from "@/components/ui/locked-content-card";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import VocabularyStudyWorkspace from "@/components/vocabulary/vocabulary-study-workspace";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import { noIndexRobots } from "@/lib/seo/site";
import { canDashboardAccessVocabularySet } from "@/lib/vocabulary/access";
import {
  getVocabularyStudyVariant,
  groupVocabularyItemsByList,
} from "@/lib/vocabulary/items/item-sections";
import {
  getVocabularyDisplayVariantLabel,
  getVocabularyListModeLabel,
  getVocabularySetTypeLabel,
  getVocabularyThemeLabel,
  getVocabularyTierLabel,
  getVocabularyTopicLabel,
} from "@/lib/vocabulary/shared/labels";
import { getVocabularyItemCoverageByItemIdsDb } from "@/lib/vocabulary/items/item-queries";
import { loadVocabularySetByRefDb } from "@/lib/vocabulary/sets/loaders";
import type { DbVocabularyItemCoverage } from "@/lib/vocabulary/shared/types";

type VocabularySetPageProps = {
  params: Promise<{ vocabularySetRef: string }>;
};

export const metadata = {
  robots: noIndexRobots,
};

export default async function VocabularySetPage({ params }: VocabularySetPageProps) {
  const { vocabularySetRef } = await params;
  const dashboard = await getDashboardInfo();
  const canSeeDrafts = dashboard.role === "admin" || dashboard.role === "teacher";

  if (dashboard.role === "guest") {
    redirect("/vocabulary");
  }

  const studyVariant = getVocabularyStudyVariant(dashboard.variant, canSeeDrafts);
  const { vocabularySet, lists, items } = await loadVocabularySetByRefDb(
    vocabularySetRef,
    { scopeVariant: studyVariant }
  );

  if (
    !vocabularySet ||
    (!vocabularySet.is_published && !canSeeDrafts) ||
    (vocabularySet.set_type === "specification" && !canSeeDrafts)
  ) {
    notFound();
  }

  if (!canDashboardAccessVocabularySet(vocabularySet, dashboard)) {
    return (
      <main className="space-y-4">
        <PageIntroPanel
          tone="student"
          eyebrow="Vocabulary set"
          title={vocabularySet.title}
          description={
            vocabularySet.description ??
            "This vocabulary set is part of the full GCSE Russian course."
          }
          badges={
            <>
              <Badge tone="info" icon="school">
                {getVocabularyTierLabel(vocabularySet.tier)}
              </Badge>
              <Badge tone="muted" icon="vocabularySet">
                {getVocabularyListModeLabel(vocabularySet.list_mode)}
              </Badge>
            </>
          }
          actions={
            <Button href="/vocabulary" variant="secondary" icon="back">
              All vocabulary
            </Button>
          }
        />

        <LockedContentCard
          title="Unlock this vocabulary set"
          description="This set is visible in the vocabulary hub, but your current access does not include the detailed study view."
          accessLabel="Full course"
          statusLabel="Locked"
          primaryActionHref="/account/billing"
          primaryActionLabel="Review access"
          secondaryActionHref="/vocabulary"
          secondaryActionLabel="Browse vocabulary"
        />
      </main>
    );
  }

  const itemSections = groupVocabularyItemsByList(lists, items, studyVariant);
  const itemCoverageById: Map<string, DbVocabularyItemCoverage> = canSeeDrafts
    ? await getVocabularyItemCoverageByItemIdsDb(
        Array.from(new Set(items.map((item) => item.id)))
      )
    : new Map();
  const itemCoverage = Array.from(itemCoverageById.values());

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
          description="Search, filter, and mark each item as new, needs practice, or mastered."
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
            <VocabularyStudyWorkspace
              vocabularySetId={vocabularySet.id}
              vocabularySetTitle={vocabularySet.title}
              sections={itemSections}
              itemCoverage={itemCoverage}
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
            description="A quick repeat-study rhythm for this vocabulary."
            tone="student"
          >
            <div className="space-y-3 text-sm leading-6 text-[var(--text-secondary)]">
              <p>
                Start with new words, mark uncertain items as needs practice, then return
                to that queue before moving anything into mastered.
              </p>
              <p>
                Use the skill and source filters to switch between output practice,
                recognition practice, exam-list words, and extension vocabulary.
              </p>
            </div>
          </PanelCard>
        </div>
      </div>
    </main>
  );
}

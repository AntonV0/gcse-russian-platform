import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import VocabularyFilterForm from "@/components/vocabulary/vocabulary-filter-form";
import VocabularySetSectionList from "@/components/vocabulary/vocabulary-set-section-list";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getPublishedVocabularySetsDb,
  getVocabularySetThemeKeysDb,
  getVocabularySetsDb,
  getVocabularyThemeLabel,
  type VocabularySetFilters,
} from "@/lib/vocabulary/vocabulary-helpers-db";

type VocabularyPageProps = {
  searchParams?: Promise<{
    search?: string;
    tier?: string;
    listMode?: string;
    themeKey?: string;
  }>;
};

function normalizeTierFilter(value?: string): VocabularySetFilters["tier"] {
  if (
    value === "foundation" ||
    value === "higher" ||
    value === "both" ||
    value === "unknown"
  ) {
    return value;
  }

  return "all";
}

function normalizeListModeFilter(value?: string): VocabularySetFilters["listMode"] {
  if (
    value === "spec_only" ||
    value === "extended_only" ||
    value === "spec_and_extended" ||
    value === "custom"
  ) {
    return value;
  }

  return "all";
}

function getTopicOptions(themeKeys: string[]) {
  return themeKeys.map((themeKey) => ({
    value: themeKey,
    label: getVocabularyThemeLabel(themeKey),
  }));
}

export default async function VocabularyPage({ searchParams }: VocabularyPageProps) {
  const params = (await searchParams) ?? {};
  const dashboard = await getDashboardInfo();
  const filters: VocabularySetFilters = {
    search: params.search ?? null,
    tier: normalizeTierFilter(params.tier),
    listMode: normalizeListModeFilter(params.listMode),
    themeKey: params.themeKey ?? null,
  };
  const canSeeDrafts = dashboard.role === "admin" || dashboard.role === "teacher";
  const canSeeCoverage = dashboard.role === "admin";
  const [vocabularySets, themeKeys] = await Promise.all([
    canSeeDrafts
      ? getVocabularySetsDb({ filters })
      : getPublishedVocabularySetsDb(filters),
    getVocabularySetThemeKeysDb({ publishedOnly: !canSeeDrafts }),
  ]);
  const draftCount = vocabularySets.filter((set) => !set.is_published).length;
  const topicOptions = getTopicOptions(themeKeys);

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="student"
        eyebrow="Vocabulary"
        title="Vocabulary"
        description="Browse GCSE Russian vocabulary by topic, tier, and source so you can find the right words to revise quickly."
        badges={
          <>
            <Badge tone="info" icon="vocabulary">
              Vocabulary hub
            </Badge>
            <Badge tone="muted" icon="school">
              GCSE Russian
            </Badge>
            {canSeeDrafts && draftCount > 0 ? (
              <Badge tone="warning" icon="draft">
                {draftCount} draft visible to staff
              </Badge>
            ) : null}
          </>
        }
        actions={
          <>
            <Button href="/dashboard" variant="secondary" icon="dashboard">
              Dashboard
            </Button>
            <Button href="/grammar" variant="secondary" icon="grammar">
              Grammar
            </Button>
          </>
        }
        visual={
          <VisualPlaceholder
            category="vocabulary"
            size="wide"
            ariaLabel="Abstract vocabulary card illustration"
          />
        }
      />

      <SectionCard
        title="Find vocabulary"
        description="Search by keyword, then narrow by tier, list type, or topic."
        tone="student"
      >
        <VocabularyFilterForm
          search={params.search}
          filters={filters}
          topicOptions={topicOptions}
        />
      </SectionCard>

      <SectionCard
        title="Vocabulary sets"
        description={`${vocabularySets.length} set${vocabularySets.length === 1 ? "" : "s"} available${canSeeDrafts ? " to your staff view" : ""}.`}
        tone="student"
      >
        {vocabularySets.length === 0 ? (
          <EmptyState
            icon="vocabulary"
            iconTone="brand"
            title="No vocabulary sets found"
            description="Try clearing filters, or publish vocabulary sets in admin so students can see them."
          />
        ) : (
          <VocabularySetSectionList
            vocabularySets={vocabularySets}
            canSeeCoverage={canSeeCoverage}
          />
        )}
      </SectionCard>
    </main>
  );
}

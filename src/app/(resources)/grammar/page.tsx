import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Input from "@/components/ui/input";
import LearningSheet, {
  LearningSheetHeader,
  LearningSheetSection,
} from "@/components/ui/learning-sheet";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import GrammarSetSectionList from "@/components/grammar/grammar-set-section-list";
import {
  filterGrammarSetsForDashboardAccess,
  getGrammarTopicLabel,
  getGrammarSetsDb,
  getPublishedGrammarSetsDb,
  type DbGrammarSetListItem,
  type GrammarSetFilters,
} from "@/lib/grammar/grammar-helpers-db";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Grammar",
  description:
    "Preview structured GCSE Russian grammar study for Pearson Edexcel 1RU0, with course-linked explanations, examples, and practice after signup.",
  path: "/grammar",
  ogTitle: "GCSE Russian Grammar",
  ogDescription:
    "See how GCSE Russian grammar explanations unlock through the course journey.",
  ogImagePath: getOgImagePath("grammar"),
});

type GrammarPageProps = {
  searchParams?: Promise<{
    search?: string;
    tier?: string;
    topicKey?: string;
  }>;
};

function normalizeTierFilter(value?: string): GrammarSetFilters["tier"] {
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

function getTopicOptions(grammarSets: DbGrammarSetListItem[]) {
  return [...new Set(grammarSets.map((set) => set.topic_key).filter(Boolean))]
    .sort((a, b) => getGrammarTopicLabel(a).localeCompare(getGrammarTopicLabel(b)))
    .map((topicKey) => ({
      value: topicKey as string,
      label: getGrammarTopicLabel(topicKey as string),
    }));
}

export default async function GrammarPage({ searchParams }: GrammarPageProps) {
  const params = (await searchParams) ?? {};
  const dashboard = await getDashboardInfo();

  if (dashboard.role === "guest") {
    return <GuestGrammarPreview />;
  }

  const filters: GrammarSetFilters = {
    search: params.search ?? null,
    tier: normalizeTierFilter(params.tier),
    topicKey: params.topicKey ?? null,
  };
  const canSeeDrafts = dashboard.role === "admin" || dashboard.role === "teacher";
  const canSeeCoverage = dashboard.role === "admin";
  const [grammarSets, allVisibleGrammarSets] = await Promise.all([
    canSeeDrafts ? getGrammarSetsDb(filters) : getPublishedGrammarSetsDb(filters),
    canSeeDrafts ? getGrammarSetsDb() : getPublishedGrammarSetsDb(),
  ]);
  const visibleGrammarSets = filterGrammarSetsForDashboardAccess(grammarSets, dashboard);
  const topicOptions = getTopicOptions(
    filterGrammarSetsForDashboardAccess(allVisibleGrammarSets, dashboard)
  );

  return (
    <main>
      <LearningSheet>
      <LearningSheetHeader
        eyebrow="Grammar"
        title="Grammar"
        description="Find GCSE Russian grammar by topic and tier, then open clear explanations, examples, and reference tables."
        badges={
          <>
            <Badge tone="info" icon="grammar">
              Grammar hub
            </Badge>
            <Badge tone="muted" icon="school">
              GCSE Russian
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/dashboard" variant="secondary" icon="dashboard">
              Dashboard
            </Button>
            <Button href="/vocabulary" variant="secondary" icon="vocabulary">
              Vocabulary
            </Button>
          </>
        }
      />

      <LearningSheetSection>
        <div className="mb-4">
          <h2 className="app-heading-section">Find grammar</h2>
          <p className="mt-2 max-w-2xl app-text-body-muted">
            Search by keyword, then narrow by tier or topic.
          </p>
        </div>
        <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_minmax(150px,190px)_minmax(220px,1fr)] xl:items-center">
          <div className="min-w-0">
            <Input
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="Search grammar..."
            />
          </div>

          <div className="min-w-0">
            <Select name="tier" defaultValue={filters.tier ?? "all"}>
              <option value="all">All tiers</option>
              <option value="foundation">Foundation</option>
              <option value="higher">Higher</option>
            </Select>
          </div>

          <div className="min-w-0 md:col-span-2 xl:col-span-1">
            <Select name="topicKey" defaultValue={filters.topicKey ?? ""}>
              <option value="">All topics</option>
              {topicOptions.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="app-mobile-action-stack flex flex-col gap-2 sm:flex-row sm:flex-wrap md:col-span-2 xl:col-span-3 xl:justify-end">
            <Button type="submit" variant="secondary" icon="search">
              Search
            </Button>
            <Button href="/grammar" variant="quiet" icon="refresh">
              Reset
            </Button>
          </div>
        </form>
      </LearningSheetSection>

      <LearningSheetSection>
        <div className="mb-4">
          <h2 className="app-heading-section">Grammar sets</h2>
          <p className="mt-2 max-w-2xl app-text-body-muted">
            {visibleGrammarSets.length} set
            {visibleGrammarSets.length === 1 ? "" : "s"} available for your access
            level.
          </p>
        </div>
        {visibleGrammarSets.length === 0 ? (
          <EmptyState
            icon="search"
            iconTone="brand"
            title="No grammar sets found"
            description="Try clearing filters, or check back once more grammar content has been published."
            visual={
              <VisualPlaceholder
                category="grammar"
                ariaLabel="Grammar empty state placeholder"
              />
            }
          />
        ) : (
          <GrammarSetSectionList
            grammarSets={visibleGrammarSets}
            canSeeCoverage={canSeeCoverage}
          />
        )}
      </LearningSheetSection>
      </LearningSheet>
    </main>
  );
}

function GuestGrammarPreview() {
  const previewFeatures = [
    {
      title: "Explanations in context",
      description:
        "Grammar is introduced through the course route, then reinforced with examples, tables, and short practice prompts.",
    },
    {
      title: "Tier-aware structure",
      description:
        "The platform separates what students need to recognise from what they need to produce for Foundation or Higher.",
    },
    {
      title: "Unlocked as students progress",
      description:
        "Signed-in students gradually open the grammar they need, instead of receiving an overwhelming list all at once.",
    },
  ];

  return (
    <main>
      <LearningSheet>
      <LearningSheetHeader
        eyebrow="Grammar"
        title="GCSE Russian grammar with guided access"
        description="The platform includes structured grammar explanations and practice, but the full grammar index and point names are kept inside the signed-in course experience."
        badges={
          <>
            <Badge tone="info" icon="grammar">
              Grammar preview
            </Badge>
            <Badge tone="muted" icon="school">
              Pearson Edexcel 1RU0
            </Badge>
            <Badge tone="success" icon="success">
              Trial available
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/signup?from=app" variant="primary" icon="create">
              Start trial
            </Button>
            <Button href="/gcse-russian-grammar" variant="secondary" icon="text">
              Grammar guide
            </Button>
          </>
        }
      />

      <LearningSheetSection>
        <div className="grid gap-4 md:grid-cols-3">
        {previewFeatures.map((feature) => (
          <SectionCard key={feature.title} title={feature.title} tone="student">
            <p className="app-text-body-muted">{feature.description}</p>
          </SectionCard>
        ))}
        </div>
      </LearningSheetSection>

      <LearningSheetSection muted>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="app-heading-section">What opens after signup</h2>
            <p className="mt-2 max-w-2xl app-text-body-muted">
              Trial and paid accounts can use the grammar study flow inside the course,
              including explanations, examples, tables, and links back to lessons.
            </p>
          </div>
          <Button href="/courses" variant="secondary" icon="courses">
            Preview course
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            "Choose Foundation or Higher.",
            "Work through lessons that introduce new grammar.",
            "Open matching explanations and practice when they become relevant.",
          ].map((step, index) => (
            <div
              key={step}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full [background:var(--accent-gradient-selected)] text-sm font-semibold text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
                {index + 1}
              </div>
              <p className="app-text-body-muted">{step}</p>
            </div>
          ))}
        </div>
      </LearningSheetSection>
      </LearningSheet>
    </main>
  );
}

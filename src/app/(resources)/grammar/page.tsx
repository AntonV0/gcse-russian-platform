import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
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
    "Browse GCSE Russian grammar sets by topic and tier, with explanations, examples, and reference tables for Pearson Edexcel 1RU0.",
  path: "/grammar",
  ogTitle: "GCSE Russian Grammar",
  ogDescription:
    "Find grammar explanations, sentence patterns, examples, and reference material for GCSE Russian.",
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
    <main className="space-y-4">
      <PageIntroPanel
        tone="student"
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
        visual={
          <VisualPlaceholder
            category="grammar"
            size="wide"
            ariaLabel="Abstract grammar diagram illustration"
          />
        }
      />

      <SectionCard
        title="Find grammar"
        description="Search by keyword, then narrow by tier or topic."
        tone="student"
      >
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
            <Button type="submit" variant="primary" icon="search">
              Search
            </Button>
            <Button href="/grammar" variant="secondary" icon="refresh">
              Reset
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Grammar sets"
        description={`${visibleGrammarSets.length} set${visibleGrammarSets.length === 1 ? "" : "s"} available for your access level.`}
        tone="student"
      >
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
      </SectionCard>
    </main>
  );
}

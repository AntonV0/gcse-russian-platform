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
    <main className="flex flex-col gap-4">
      <PageIntroPanel
        className="order-1"
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
        className="order-2"
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
            <Button type="submit" variant="secondary" icon="search">
              Search
            </Button>
            <Button href="/grammar" variant="quiet" icon="refresh">
              Reset
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        className="order-3"
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
    <main className="flex flex-col gap-4">
      <PageIntroPanel
        className="order-1"
        tone="student"
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
            <Button href="/signup" variant="primary" icon="create">
              Start trial
            </Button>
            <Button href="/gcse-russian-grammar" variant="secondary" icon="text">
              Grammar guide
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

      <section className="order-2 grid gap-4 md:grid-cols-3">
        {previewFeatures.map((feature) => (
          <SectionCard key={feature.title} title={feature.title} tone="student">
            <p className="app-text-body-muted">{feature.description}</p>
          </SectionCard>
        ))}
      </section>

      <SectionCard
        className="order-3"
        title="What opens after signup"
        description="Trial and paid accounts can use the grammar study flow inside the course, including explanations, examples, tables, and links back to lessons."
        tone="student"
        actions={
          <Button href="/courses" variant="secondary" icon="courses">
            Preview course
          </Button>
        }
      >
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
      </SectionCard>
    </main>
  );
}

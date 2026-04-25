import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import {
  filterGrammarSetsForDashboardAccess,
  getGrammarThemeLabel,
  getGrammarTierLabel,
  getPublishedGrammarSetsDb,
  type GrammarSetFilters,
} from "@/lib/grammar/grammar-helpers-db";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";

type GrammarPageProps = {
  searchParams?: Promise<{
    search?: string;
    tier?: string;
    themeKey?: string;
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

export default async function GrammarPage({ searchParams }: GrammarPageProps) {
  const params = (await searchParams) ?? {};
  const dashboard = await getDashboardInfo();
  const filters: GrammarSetFilters = {
    search: params.search ?? null,
    tier: normalizeTierFilter(params.tier),
    themeKey: params.themeKey ?? null,
  };
  const grammarSets = filterGrammarSetsForDashboardAccess(
    await getPublishedGrammarSetsDb(filters),
    dashboard
  );

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="student"
        eyebrow="Grammar"
        title="Grammar"
        description="Review GCSE Russian grammar through structured sets, explanations, examples, and reference tables."
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

      <SectionCard
        title="Find grammar"
        description="Search by keyword or filter by tier and theme."
        tone="student"
      >
        <form className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="w-full lg:max-w-xs">
            <Input name="search" defaultValue={params.search ?? ""} placeholder="Search grammar..." />
          </div>

          <div className="w-full lg:max-w-[190px]">
            <Select name="tier" defaultValue={filters.tier ?? "all"}>
              <option value="all">All tiers</option>
              <option value="foundation">Foundation</option>
              <option value="higher">Higher</option>
              <option value="both">Both tiers</option>
            </Select>
          </div>

          <div className="w-full lg:max-w-[220px]">
            <Input
              name="themeKey"
              defaultValue={params.themeKey ?? ""}
              placeholder="Theme key"
            />
          </div>

          <div className="flex flex-wrap gap-2">
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
        description={`${grammarSets.length} set${grammarSets.length === 1 ? "" : "s"} available for your access level.`}
        tone="student"
      >
        {grammarSets.length === 0 ? (
          <EmptyState
            icon="search"
            iconTone="brand"
            title="No grammar sets found"
            description="Try clearing filters, or check back once more grammar content has been published."
          />
        ) : (
          <div className="grid gap-3">
            {grammarSets.map((grammarSet) => (
              <CardListItem
                key={grammarSet.id}
                href={`/grammar/${grammarSet.slug}`}
                title={grammarSet.title}
                subtitle={grammarSet.description ?? "Grammar reference set."}
                badges={
                  <>
                    <Badge tone="info" icon="school">
                      {getGrammarTierLabel(grammarSet.tier)}
                    </Badge>
                    <Badge tone="muted" className="capitalize">
                      {getGrammarThemeLabel(grammarSet.theme_key)}
                    </Badge>
                    <Badge tone="muted" icon="list">
                      {grammarSet.point_count} point
                      {grammarSet.point_count === 1 ? "" : "s"}
                    </Badge>
                  </>
                }
                actions={
                  <Button
                    href={`/grammar/${grammarSet.slug}`}
                    variant="quiet"
                    size="sm"
                    icon="next"
                    iconOnly
                    ariaLabel={`Open ${grammarSet.title}`}
                  />
                }
              />
            ))}
          </div>
        )}
      </SectionCard>
    </main>
  );
}

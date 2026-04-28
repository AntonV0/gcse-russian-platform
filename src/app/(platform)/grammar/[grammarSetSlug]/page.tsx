import { notFound } from "next/navigation";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import {
  canDashboardAccessGrammarSet,
  getGrammarCategoryLabel,
  getGrammarKnowledgeRequirementLabel,
  getGrammarThemeLabel,
  getGrammarTierLabel,
  loadGrammarSetBySlugDb,
} from "@/lib/grammar/grammar-helpers-db";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";

type GrammarSetPageProps = {
  params: Promise<{ grammarSetSlug: string }>;
};

export default async function GrammarSetPage({ params }: GrammarSetPageProps) {
  const { grammarSetSlug } = await params;
  const dashboard = await getDashboardInfo();
  const { grammarSet, points } = await loadGrammarSetBySlugDb(grammarSetSlug, {
    publishedOnly: true,
  });

  if (!grammarSet || !canDashboardAccessGrammarSet(grammarSet, dashboard)) {
    notFound();
  }

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="student"
        eyebrow="Grammar set"
        title={grammarSet.title}
        description={grammarSet.description ?? "Review the grammar points in this set."}
        badges={
          <>
            <Badge tone="info" icon="school">
              {getGrammarTierLabel(grammarSet.tier)}
            </Badge>
            <Badge tone="muted" className="capitalize">
              {getGrammarThemeLabel(grammarSet.theme_key)}
            </Badge>
            <Badge tone="muted" icon="list">
              {points.length} point{points.length === 1 ? "" : "s"}
            </Badge>
          </>
        }
        actions={
          <Button href="/grammar" variant="secondary" icon="back">
            All grammar
          </Button>
        }
      />

      <SectionCard
        title="Grammar points"
        description="Open a point to read the full explanation, tables, and examples."
        tone="student"
      >
        {points.length === 0 ? (
          <EmptyState
            icon="lessonContent"
            iconTone="brand"
            title="No published points yet"
            description="This grammar set has been published, but its points are still being prepared."
          />
        ) : (
          <div className="grid gap-3">
            {points.map((point) => (
              <CardListItem
                key={point.id}
                href={`/grammar/${grammarSet.slug}/${point.slug}`}
                title={point.title}
                subtitle={point.short_description ?? "Read the grammar explanation."}
                badges={
                  <>
                    <Badge tone="info" icon="school">
                      {getGrammarTierLabel(point.tier)}
                    </Badge>
                    <Badge tone="muted" className="capitalize">
                      {getGrammarCategoryLabel(point.category_key)}
                    </Badge>
                    <Badge
                      tone={
                        point.knowledge_requirement === "receptive"
                          ? "warning"
                          : "muted"
                      }
                    >
                      {getGrammarKnowledgeRequirementLabel(
                        point.knowledge_requirement
                      )}
                    </Badge>
                    {point.spec_reference ? (
                      <Badge tone="muted" icon="file">
                        {point.spec_reference}
                      </Badge>
                    ) : null}
                  </>
                }
                actions={
                  <Button
                    href={`/grammar/${grammarSet.slug}/${point.slug}`}
                    variant="quiet"
                    size="sm"
                    icon="next"
                    iconOnly
                    ariaLabel={`Open ${point.title}`}
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

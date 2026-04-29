import { notFound } from "next/navigation";
import Button from "@/components/ui/button";
import DetailList from "@/components/ui/detail-list";
import EmptyState from "@/components/ui/empty-state";
import LockedContentCard from "@/components/ui/locked-content-card";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import { GrammarSetRequirementBadges } from "@/components/grammar/grammar-requirement-badges";
import GrammarPointSectionList from "@/components/grammar/grammar-point-section-list";
import { RelatedGrammarSetsPanel } from "@/components/grammar/grammar-related-navigation";
import {
  canDashboardAccessGrammarSet,
  getGrammarPointCoverageByPointIdsDb,
  getGrammarTopicLabel,
  getPublishedGrammarSetsDb,
  filterGrammarSetsForDashboardAccess,
  type DbGrammarStudyVariant,
  loadGrammarSetBySlugDb,
} from "@/lib/grammar/grammar-helpers-db";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";

type GrammarSetPageProps = {
  params: Promise<{ grammarSetSlug: string }>;
};

const GRAMMAR_SET_STUDY_STEPS = [
  "Read each explanation and notice the requirement badge before memorising forms.",
  "Use examples to check how the rule looks in a sentence, not just in a table.",
  "Finish by writing one sentence of your own for each productive or mixed point.",
] as const;

export default async function GrammarSetPage({ params }: GrammarSetPageProps) {
  const { grammarSetSlug } = await params;
  const dashboard = await getDashboardInfo();
  const canSeeDrafts = dashboard.role === "admin" || dashboard.role === "teacher";
  const scopeVariant: DbGrammarStudyVariant | "all" =
    canSeeDrafts ||
    (dashboard.variant !== "foundation" &&
      dashboard.variant !== "higher" &&
      dashboard.variant !== "volna")
      ? "all"
      : dashboard.variant;
  const { grammarSet, points } = await loadGrammarSetBySlugDb(grammarSetSlug, {
    publishedOnly: !canSeeDrafts,
    scopeVariant,
  });

  if (!grammarSet) {
    notFound();
  }

  if (!canDashboardAccessGrammarSet(grammarSet, dashboard)) {
    return (
      <main className="space-y-4">
        <PageIntroPanel
          tone="student"
          eyebrow="Grammar set"
          title={grammarSet.title}
          description={
            grammarSet.description ??
            "This grammar set is part of the full GCSE Russian course."
          }
          badges={<GrammarSetRequirementBadges grammarSet={grammarSet} />}
          actions={
            <Button href="/grammar" variant="secondary" icon="back">
              All grammar
            </Button>
          }
        />

        <LockedContentCard
          title="Unlock this grammar set"
          description="This set is published, but your current access does not include it yet. Review your access options to continue with the full grammar route."
          accessLabel="Full course"
          statusLabel="Locked"
          primaryActionHref="/account/billing"
          primaryActionLabel="Review access"
          secondaryActionHref="/grammar"
          secondaryActionLabel="Browse grammar"
        />
      </main>
    );
  }

  const relatedGrammarSets = grammarSet.topic_key
    ? filterGrammarSetsForDashboardAccess(
        await getPublishedGrammarSetsDb({ topicKey: grammarSet.topic_key }),
        dashboard
      )
        .filter((relatedSet) => relatedSet.id !== grammarSet.id)
        .slice(0, 4)
    : [];
  const pointCoverageById = canSeeDrafts
    ? await getGrammarPointCoverageByPointIdsDb(points.map((point) => point.id))
    : new Map();

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="student"
        eyebrow="Grammar set"
        title={grammarSet.title}
        description={grammarSet.description ?? "Review the grammar points in this set."}
        badges={
          <GrammarSetRequirementBadges
            grammarSet={grammarSet}
            pointCount={points.length}
          />
        }
        actions={
          <Button href="/grammar" variant="secondary" icon="back">
            All grammar
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <SectionCard
          title="Grammar points"
          description="Open a point to read the explanation, check examples, and practise the pattern."
          tone="student"
        >
          {points.length === 0 ? (
            <EmptyState
              icon="lessonContent"
              iconTone="brand"
              title="No published points yet"
              description="This grammar set has been published, but its points are still being prepared."
              action={
                <Button href="/grammar" variant="primary" icon="grammar">
                  Back to grammar
                </Button>
              }
            />
          ) : (
            <GrammarPointSectionList
              grammarSet={grammarSet}
              points={points}
              pointCoverageById={pointCoverageById}
              showStaffMetadata={canSeeDrafts}
            />
          )}
        </SectionCard>

        <div className="space-y-4">
          <PanelCard
            title="Study route"
            description="A simple rhythm for this set."
            tone="student"
          >
            <div className="space-y-3 text-sm leading-6 text-[var(--text-secondary)]">
              {GRAMMAR_SET_STUDY_STEPS.map((step, index) => (
                <div key={step} className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-elevated)] text-xs font-semibold text-[var(--accent-fill)]">
                    {index + 1}
                  </span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="Set details" tone="student">
            <DetailList
              items={[
                {
                  label: "Topic",
                  value: getGrammarTopicLabel(grammarSet.topic_key),
                },
                {
                  label: "Points",
                  value: points.length,
                },
                {
                  label: "Trial visible",
                  value: grammarSet.is_trial_visible ? "Yes" : "No",
                },
                {
                  label: "Access",
                  value: grammarSet.requires_paid_access ? "Full course" : "Included",
                },
                {
                  label: "Volna",
                  value: grammarSet.available_in_volna ? "Included" : "Not included",
                },
              ]}
            />
          </PanelCard>

          <RelatedGrammarSetsPanel grammarSets={relatedGrammarSets} />
        </div>
      </div>
    </main>
  );
}

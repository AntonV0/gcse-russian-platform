import SummaryStatCard from "@/components/ui/summary-stat-card";
import type { AdminGrammarListStats } from "@/components/admin/grammar/list/types";
import { getGrammarUsageFilterLabel } from "@/components/admin/grammar/list/grammar-list-labels";
import type { GrammarSetFilters } from "@/lib/grammar/grammar-helpers-db";

export default function GrammarSummaryStats({
  stats,
  usageVariant,
}: {
  stats: AdminGrammarListStats;
  usageVariant: GrammarSetFilters["usageVariant"];
}) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <SummaryStatCard
        title="Grammar sets"
        value={stats.totalSets}
        description="Reusable sets matching the current filters."
        icon="grammar"
      />
      <SummaryStatCard
        title="Published"
        value={stats.publishedSets}
        description="Visible on the student grammar page."
        icon="published"
      />
      <SummaryStatCard
        title="Draft"
        value={stats.draftSets}
        description="Hidden from students until published."
        icon="draft"
      />
      <SummaryStatCard
        title="Points"
        value={stats.totalPoints}
        description="Atomic grammar points in filtered sets."
        icon="list"
      />
      <SummaryStatCard
        title="Lesson usage"
        value={stats.totalUsages}
        description={`${getGrammarUsageFilterLabel(usageVariant)} across filtered sets.`}
        icon="lessons"
      />
    </section>
  );
}

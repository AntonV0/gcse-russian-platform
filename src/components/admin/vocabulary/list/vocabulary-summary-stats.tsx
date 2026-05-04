import SummaryStatCard from "@/components/ui/summary-stat-card";
import type { AdminVocabularyListStats } from "@/components/admin/vocabulary/list/types";

type VocabularySummaryStatsProps = AdminVocabularyListStats;

export default function VocabularySummaryStats({
  totalSets,
  publishedSets,
  draftSets,
  totalItems,
  totalUsages,
}: VocabularySummaryStatsProps) {
  return (
    <section className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
      <SummaryStatCard
        title="Vocabulary sets"
        value={totalSets}
        icon="vocabulary"
        compact
      />
      <SummaryStatCard
        title="Published"
        value={publishedSets}
        icon="published"
        tone="success"
        compact
      />
      <SummaryStatCard
        title="Draft"
        value={draftSets}
        icon="draft"
        tone="warning"
        compact
      />
      <SummaryStatCard
        title="Items"
        value={totalItems}
        icon="list"
        tone="info"
        compact
      />
      <SummaryStatCard
        title="Lesson usage"
        value={totalUsages}
        icon="lessons"
        compact
      />
    </section>
  );
}

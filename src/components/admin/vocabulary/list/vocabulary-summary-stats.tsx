import SummaryStatCard from "@/components/ui/summary-stat-card";
import type { AdminVocabularyListStats } from "@/components/admin/vocabulary/list/types";
import type { VocabularySetFilters } from "@/lib/vocabulary/shared/types";

function getUsageFilterLabel(value?: VocabularySetFilters["usageVariant"]) {
  switch (value) {
    case "foundation":
      return "Foundation usage";
    case "higher":
      return "Higher usage";
    case "volna":
      return "Volna usage";
    case "unused":
      return "Unused sets";
    default:
      return "All usage";
  }
}

type VocabularySummaryStatsProps = AdminVocabularyListStats & {
  usageVariant: VocabularySetFilters["usageVariant"];
};

export default function VocabularySummaryStats({
  totalSets,
  publishedSets,
  draftSets,
  totalItems,
  totalUsages,
  usageVariant,
}: VocabularySummaryStatsProps) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <SummaryStatCard
        title="Vocabulary sets"
        value={totalSets}
        description="Reusable sets matching the current filters."
        icon="vocabulary"
      />
      <SummaryStatCard
        title="Published"
        value={publishedSets}
        description="Visible on the student vocabulary page."
        icon="published"
      />
      <SummaryStatCard
        title="Draft"
        value={draftSets}
        description="Hidden from students until published."
        icon="draft"
      />
      <SummaryStatCard
        title="Items"
        value={totalItems}
        description="Total vocabulary items inside filtered sets."
        icon="list"
      />
      <SummaryStatCard
        title="Lesson usage"
        value={totalUsages}
        description={`${getUsageFilterLabel(usageVariant)} across filtered sets.`}
        icon="lessons"
      />
    </section>
  );
}

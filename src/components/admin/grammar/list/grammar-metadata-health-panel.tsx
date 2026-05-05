import SummaryStatCard from "@/components/ui/summary-stat-card";
import type { AdminGrammarMetadataHealth } from "@/components/admin/grammar/list/types";

export default function GrammarMetadataHealthPanel({
  metadataHealth,
}: {
  metadataHealth: AdminGrammarMetadataHealth;
}) {
  return (
    <section className="grid gap-3 md:grid-cols-2">
      <SummaryStatCard
        title="Missing source"
        value={metadataHealth.missingSourceSets}
        description="Sets without import/source metadata."
        icon="file"
        tone={metadataHealth.missingSourceSets === 0 ? "success" : "warning"}
        compact
      />
      <SummaryStatCard
        title="Missing topic"
        value={metadataHealth.missingTopicSets}
        description="Sets that cannot be grouped cleanly yet."
        icon="folder"
        tone={metadataHealth.missingTopicSets === 0 ? "success" : "warning"}
        compact
      />
    </section>
  );
}

import { GrammarPointAdminStatTile } from "@/components/admin/grammar/points/primitives";
import type { GrammarPointAdminStats } from "@/components/admin/grammar/points/types";

export function GrammarSetPointsStatsSection({
  stats,
}: {
  stats: GrammarPointAdminStats;
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      <GrammarPointAdminStatTile label="Points" value={stats.totalPoints} />
      <GrammarPointAdminStatTile
        label="Published"
        value={stats.publishedPoints}
        tone="success"
      />
      <GrammarPointAdminStatTile
        label="Draft"
        value={stats.draftPoints}
        tone={stats.draftPoints > 0 ? "warning" : "neutral"}
      />
      <GrammarPointAdminStatTile
        label="Foundation usages"
        value={stats.foundationUsages}
      />
      <GrammarPointAdminStatTile label="Higher usages" value={stats.higherUsages} />
      <GrammarPointAdminStatTile
        label="Content gaps"
        value={stats.missingExplanationPoints + stats.missingExamplePoints}
        tone={
          stats.missingExplanationPoints + stats.missingExamplePoints > 0
            ? "warning"
            : "success"
        }
      />
    </section>
  );
}

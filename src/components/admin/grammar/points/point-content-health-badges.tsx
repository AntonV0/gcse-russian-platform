import Badge from "@/components/ui/badge";
import type { DbGrammarPointContentHealth } from "@/lib/grammar/grammar-helpers-db";

export default function PointContentHealthBadges({
  health,
}: {
  health: DbGrammarPointContentHealth | null;
}) {
  if (!health) return null;

  return (
    <>
      {health.missing_explanation ? (
        <Badge tone="warning" icon="warning">
          No explanation
        </Badge>
      ) : null}
      {health.missing_examples ? (
        <Badge tone="warning" icon="warning">
          No examples
        </Badge>
      ) : null}
      {health.missing_tables ? (
        <Badge tone="muted" icon="table">
          No tables
        </Badge>
      ) : null}
    </>
  );
}

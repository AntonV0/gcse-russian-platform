import Badge from "@/components/ui/badge";
import type { DbGrammarSetContentHealth } from "@/lib/grammar/grammar-helpers-db";

type GrammarContentHealthBadgesProps = {
  health: DbGrammarSetContentHealth | null;
  isPublished: boolean;
};

export default function GrammarContentHealthBadges({
  health,
  isPublished,
}: GrammarContentHealthBadgesProps) {
  if (!health || !isPublished) return null;

  const hasNoPublishedPoints = health.published_points === 0;
  const badges = [
    hasNoPublishedPoints
      ? {
          key: "no-points",
          label: "No published points",
          tone: "warning" as const,
        }
      : null,
    health.missing_explanation_points > 0
      ? {
          key: "explanation",
          label: `${health.missing_explanation_points} no explanation`,
          tone: "warning" as const,
        }
      : null,
    health.missing_example_points > 0
      ? {
          key: "examples",
          label: `${health.missing_example_points} no examples`,
          tone: "warning" as const,
        }
      : null,
    health.missing_table_points > 0
      ? {
          key: "tables",
          label: `${health.missing_table_points} no tables`,
          tone: "muted" as const,
        }
      : null,
  ].filter((badge): badge is NonNullable<typeof badge> => Boolean(badge));

  if (badges.length === 0) {
    return (
      <Badge tone="success" icon="success">
        Content ready
      </Badge>
    );
  }

  return (
    <>
      {badges.map((badge) => (
        <Badge key={badge.key} tone={badge.tone} icon="warning">
          {badge.label}
        </Badge>
      ))}
    </>
  );
}

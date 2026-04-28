import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import { getButtonClassName } from "@/components/ui/button-styles";
import CardListItem from "@/components/ui/card-list-item";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import GrammarCoverageBadges from "@/components/grammar/grammar-coverage-badges";
import { GrammarSetRequirementBadges } from "@/components/grammar/grammar-requirement-badges";
import {
  type DbGrammarSetListItem,
} from "@/lib/grammar/grammar-helpers-db";

const GRAMMAR_SECTION_DEFINITIONS = [
  {
    keys: [
      "nouns",
      "adjectives",
      "adverbs",
      "quantifiers_intensifiers",
      "pronouns_personal",
      "pronouns_other",
      "possessives",
    ],
    order: 1,
    title: "Forms and word classes",
  },
  {
    keys: ["verbs", "impersonal_constructions"],
    order: 2,
    title: "Verbs and constructions",
  },
  {
    keys: ["numbers_and_quantity", "prepositions", "conjunctions"],
    order: 3,
    title: "Sentence building",
  },
  {
    keys: ["times_and_dates", "negation"],
    order: 4,
    title: "Time, dates and negation",
  },
] as const;

function getGrammarSetHref(grammarSet: DbGrammarSetListItem) {
  return `/grammar/${grammarSet.slug}`;
}

function normalizeGrammarKey(value: string | null) {
  return value?.replaceAll("-", "_") ?? null;
}

function getGrammarSectionTitle(grammarSet: DbGrammarSetListItem) {
  const topicKey = normalizeGrammarKey(grammarSet.topic_key);
  const matchingSection = GRAMMAR_SECTION_DEFINITIONS.find((section) =>
    topicKey ? (section.keys as readonly string[]).includes(topicKey) : false
  );

  return matchingSection?.title ?? "Custom grammar";
}

function getGrammarSectionOrder(title: string) {
  if (title === "Custom grammar") return 1000;
  return (
    GRAMMAR_SECTION_DEFINITIONS.find((section) => section.title === title)?.order ?? 900
  );
}

function groupGrammarSetsBySection(grammarSets: DbGrammarSetListItem[]) {
  const groups = new Map<string, DbGrammarSetListItem[]>();

  for (const grammarSet of grammarSets) {
    const sectionTitle = getGrammarSectionTitle(grammarSet);
    groups.set(sectionTitle, [...(groups.get(sectionTitle) ?? []), grammarSet]);
  }

  return Array.from(groups.entries())
    .map(([title, sets]) => ({ title, sets }))
    .sort(
      (a, b) =>
        getGrammarSectionOrder(a.title) - getGrammarSectionOrder(b.title) ||
        a.title.localeCompare(b.title)
    );
}

function SectionToggleButton() {
  return (
    <span
      className={getButtonClassName({
        variant: "secondary",
        size: "sm",
        className: "pointer-events-none shrink-0 px-3 sm:px-3.5",
      })}
      aria-hidden="true"
    >
      <span className="shrink-0">
        <AppIcon icon="next" size={16} />
      </span>
      <span className="hidden sm:inline">Open</span>
    </span>
  );
}

function GrammarSetBadges({
  grammarSet,
  canSeeCoverage,
}: {
  grammarSet: DbGrammarSetListItem;
  canSeeCoverage: boolean;
}) {
  return (
    <>
      <span className="flex flex-wrap gap-2">
        <GrammarSetRequirementBadges
          grammarSet={grammarSet}
          pointCount={grammarSet.point_count}
        />
        {!grammarSet.is_published ? (
          <PublishStatusBadge isPublished={grammarSet.is_published} />
        ) : null}
      </span>

      {canSeeCoverage ? (
        <span
          className="flex basis-full flex-wrap gap-2 pt-1"
          aria-label="Grammar coverage by course variant"
        >
          <GrammarCoverageBadges
            coverageSummary={grammarSet.coverage_summary}
            fallbackTotalPoints={grammarSet.point_count}
          />
        </span>
      ) : null}
    </>
  );
}

export default function GrammarSetSectionList({
  grammarSets,
  canSeeCoverage,
}: {
  grammarSets: DbGrammarSetListItem[];
  canSeeCoverage: boolean;
}) {
  const grammarSetGroups = groupGrammarSetsBySection(grammarSets);

  return (
    <div className="space-y-6">
      {grammarSetGroups.map((group) => (
        <details key={group.title} className="group app-card p-4">
          <summary className="app-focus-ring flex cursor-pointer list-none items-start justify-between gap-4 rounded-lg">
            <span className="min-w-0">
              <span className="block text-base font-semibold text-[var(--text-primary)]">
                {group.title}
              </span>
              <span className="mt-1 block text-sm text-[var(--text-secondary)]">
                {group.sets.length} set{group.sets.length === 1 ? "" : "s"}
              </span>
            </span>

            <SectionToggleButton />
          </summary>

          <div className="mt-4 grid gap-3">
            {group.sets.map((grammarSet) => (
              <CardListItem
                key={grammarSet.id}
                href={getGrammarSetHref(grammarSet)}
                title={grammarSet.title}
                subtitle={grammarSet.description ?? "Grammar set ready for study."}
                badges={
                  <GrammarSetBadges
                    grammarSet={grammarSet}
                    canSeeCoverage={canSeeCoverage}
                  />
                }
                actions={
                  <Button
                    href={getGrammarSetHref(grammarSet)}
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
        </details>
      ))}
    </div>
  );
}

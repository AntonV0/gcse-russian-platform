import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { getButtonClassName } from "@/components/ui/button-styles";
import CardListItem from "@/components/ui/card-list-item";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import VocabularyCoverageBadges from "@/components/vocabulary/vocabulary-coverage-badges";
import {
  getVocabularyListModeLabel,
  getVocabularySetsDb,
  getVocabularyThemeLabel,
  getVocabularyTierLabel,
} from "@/lib/vocabulary/vocabulary-helpers-db";

type VocabularySet = Awaited<ReturnType<typeof getVocabularySetsDb>>[number];

type VocabularyThemeSectionDefinition = {
  keys: readonly string[];
  order: number;
  title: string;
};

const VOCABULARY_THEME_SECTION_DEFINITIONS: VocabularyThemeSectionDefinition[] = [
  {
    keys: ["high_frequency_language"],
    order: 1,
    title: "Section 1: High-frequency language",
  },
  {
    keys: ["identity_and_culture"],
    order: 2,
    title: "Section 2: Identity and culture",
  },
  {
    keys: ["local_area_holiday_travel", "local_area_holiday_and_travel"],
    order: 3,
    title: "Section 3: Local area, holiday and travel",
  },
  {
    keys: ["school"],
    order: 4,
    title: "Section 4: School",
  },
  {
    keys: ["future_aspirations_study_work", "future_aspirations_study_and_work"],
    order: 5,
    title: "Section 5: Future aspirations, study and work",
  },
  {
    keys: ["international_global_dimension"],
    order: 6,
    title: "Section 6: International and global dimension",
  },
] as const;

function getVocabularySetHref(vocabularySet: { id: string; slug: string | null }) {
  return `/vocabulary/${vocabularySet.slug ?? vocabularySet.id}`;
}

function normalizeVocabularyKey(value: string | null) {
  return value?.replaceAll("-", "_") ?? null;
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getVocabularyThemeSectionByKey(themeKey: string | null) {
  const normalizedThemeKey = normalizeVocabularyKey(themeKey);

  return VOCABULARY_THEME_SECTION_DEFINITIONS.find((section) =>
    normalizedThemeKey ? section.keys.includes(normalizedThemeKey) : false
  );
}

function getVocabularySectionTitle(vocabularySet: {
  import_key: string | null;
  theme_key: string | null;
}) {
  const section = getVocabularyThemeSectionByKey(vocabularySet.theme_key);

  if (section) {
    return section.title;
  }

  const importKey = vocabularySet.import_key ?? "";

  if (importKey.startsWith("section-1:")) {
    return "Section 1: High-frequency language";
  }

  if (importKey.startsWith("section-2:")) {
    return `Section 2: ${toTitleCase(getVocabularyThemeLabel(vocabularySet.theme_key))}`;
  }

  return "Custom Vocabulary";
}

function getVocabularySectionOrder(sectionTitle: string) {
  if (sectionTitle === "Custom Vocabulary") {
    return 1000;
  }

  const matchingSection = VOCABULARY_THEME_SECTION_DEFINITIONS.find(
    (section) => section.title === sectionTitle
  );

  if (matchingSection) {
    return matchingSection.order;
  }

  return 900;
}

function groupVocabularySetsBySection(vocabularySets: VocabularySet[]) {
  const groups = new Map<string, VocabularySet[]>();

  for (const vocabularySet of vocabularySets) {
    const sectionTitle = getVocabularySectionTitle(vocabularySet);
    groups.set(sectionTitle, [...(groups.get(sectionTitle) ?? []), vocabularySet]);
  }

  return Array.from(groups.entries())
    .map(([title, sets]) => ({ title, sets }))
    .sort(
      (a, b) =>
        getVocabularySectionOrder(a.title) - getVocabularySectionOrder(b.title) ||
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

function VocabularySetBadges({
  vocabularySet,
  canSeeCoverage,
}: {
  vocabularySet: VocabularySet;
  canSeeCoverage: boolean;
}) {
  return (
    <>
      <span className="flex flex-wrap gap-2">
        <Badge tone="info" icon="school">
          {getVocabularyTierLabel(vocabularySet.tier)}
        </Badge>
        <Badge tone="muted" icon="vocabularySet">
          {getVocabularyListModeLabel(vocabularySet.list_mode)}
        </Badge>
        <Badge tone="muted" className="capitalize">
          {getVocabularyThemeLabel(vocabularySet.theme_key)}
        </Badge>
        <Badge tone="muted" icon="list">
          {vocabularySet.item_count} item
          {vocabularySet.item_count === 1 ? "" : "s"}
        </Badge>
        {!vocabularySet.is_published ? (
          <PublishStatusBadge isPublished={vocabularySet.is_published} />
        ) : null}
      </span>

      {canSeeCoverage ? (
        <span
          className="flex basis-full flex-wrap gap-2 pt-1"
          aria-label="Coverage by vocabulary source"
        >
          <VocabularyCoverageBadges
            coverageSummary={vocabularySet.coverage_summary}
            fallbackTotalItems={vocabularySet.item_count}
          />
        </span>
      ) : null}
    </>
  );
}

export default function VocabularySetSectionList({
  vocabularySets,
  canSeeCoverage,
}: {
  vocabularySets: VocabularySet[];
  canSeeCoverage: boolean;
}) {
  const vocabularySetGroups = groupVocabularySetsBySection(vocabularySets);

  return (
    <div className="space-y-6">
      {vocabularySetGroups.map((group) => (
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
            {group.sets.map((vocabularySet) => (
              <CardListItem
                key={vocabularySet.id}
                href={getVocabularySetHref(vocabularySet)}
                title={vocabularySet.title}
                subtitle={vocabularySet.description ?? "Vocabulary set ready for study."}
                badges={
                  <VocabularySetBadges
                    vocabularySet={vocabularySet}
                    canSeeCoverage={canSeeCoverage}
                  />
                }
                actions={
                  <Button
                    href={getVocabularySetHref(vocabularySet)}
                    variant="quiet"
                    size="sm"
                    icon="next"
                    iconOnly
                    ariaLabel={`Open ${vocabularySet.title}`}
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

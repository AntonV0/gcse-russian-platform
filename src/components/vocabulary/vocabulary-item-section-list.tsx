import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import { getButtonClassName } from "@/components/ui/button-styles";
import type { VocabularyItemSectionGroup } from "@/lib/vocabulary/item-sections";
import { getVocabularyTierLabel } from "@/lib/vocabulary/labels";
import {
  getRequiredVocabularyCoverageVariants,
  getVocabularyCoverageVariantCount,
  getVocabularyCoverageVariantLabel,
  getVocabularyCoverageVariantUsed,
} from "@/lib/vocabulary/study-variants";
import type { DbVocabularyItem, DbVocabularyItemCoverage } from "@/lib/vocabulary/types";

function getItemBadgeTone(item: DbVocabularyItem) {
  if (item.source_type === "spec_required") return "info";
  if (item.priority === "extension") return "warning";
  return "muted";
}

function getItemSourceLabel(item: DbVocabularyItem) {
  switch (item.source_type) {
    case "spec_required":
      return "Exam specification";
    case "extended":
      return "Extended";
    case "custom":
      return "Custom";
  }
}

function getItemStudyUseLabel(item: DbVocabularyItem) {
  switch (item.productive_receptive) {
    case "productive":
      return "Speaking and writing";
    case "receptive":
      return "Listening and reading";
    case "both":
      return "All skills";
    default:
      return null;
  }
}

function CoverageBadge({
  label,
  isUsed,
  count,
}: {
  label: string;
  isUsed: boolean;
  count?: number;
}) {
  return (
    <Badge tone={isUsed ? "success" : "danger"} icon={isUsed ? "success" : "cancel"}>
      {count && count > 0 ? `${label} ${count}` : label}
    </Badge>
  );
}

function VocabularyItemCoverageBadges({
  item,
  coverage,
}: {
  item: DbVocabularyItem;
  coverage: DbVocabularyItemCoverage | null;
}) {
  const lessonCoverageVariants = getRequiredVocabularyCoverageVariants(item.tier);

  return (
    <div className="flex flex-wrap gap-2 md:justify-end">
      {lessonCoverageVariants.map((variant) => (
        <CoverageBadge
          key={variant}
          label={getVocabularyCoverageVariantLabel(variant)}
          isUsed={getVocabularyCoverageVariantUsed(coverage, variant)}
          count={getVocabularyCoverageVariantCount(coverage, variant)}
        />
      ))}

      <CoverageBadge
        label="Custom list"
        isUsed={Boolean(coverage?.used_in_custom_list)}
        count={coverage?.custom_list_occurrences ?? 0}
      />
    </div>
  );
}

function SectionToggleButton() {
  return (
    <span
      className={getButtonClassName({
        variant: "secondary",
        size: "sm",
        className: "pointer-events-none",
      })}
      aria-hidden="true"
    >
      <span className="shrink-0">
        <AppIcon icon="next" size={16} />
      </span>
      <span className="truncate">Open</span>
    </span>
  );
}

function VocabularyItemRow({
  item,
  coverage,
  showStaffMetadata,
}: {
  item: DbVocabularyItem;
  coverage: DbVocabularyItemCoverage | null;
  showStaffMetadata: boolean;
}) {
  const studyUseLabel = getItemStudyUseLabel(item);

  return (
    <div className="app-card app-card-hover p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="text-lg font-semibold leading-7 text-[var(--text-primary)]">
            {item.russian}
          </div>
          <div className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            {item.english}
          </div>
          {item.transliteration ? (
            <div className="mt-1 text-sm leading-6 app-text-soft">
              {item.transliteration}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col gap-2 md:items-end">
          <div className="flex flex-wrap gap-2 md:justify-end">
            <Badge tone={getItemBadgeTone(item)}>{getItemSourceLabel(item)}</Badge>
            <Badge tone="muted">{item.part_of_speech.replaceAll("_", " ")}</Badge>
            <Badge tone="muted">{getVocabularyTierLabel(item.tier)}</Badge>
            {studyUseLabel ? <Badge tone="muted">{studyUseLabel}</Badge> : null}
          </div>

          {showStaffMetadata ? (
            <VocabularyItemCoverageBadges item={item} coverage={coverage} />
          ) : null}
        </div>
      </div>

      {item.example_ru || item.example_en || item.notes ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {item.example_ru || item.example_en ? (
            <div className="app-soft-panel px-3 py-3">
              {item.example_ru ? (
                <div className="font-medium text-[var(--text-primary)]">
                  {item.example_ru}
                </div>
              ) : null}
              {item.example_en ? (
                <div className="mt-1 text-sm text-[var(--text-secondary)]">
                  {item.example_en}
                </div>
              ) : null}
            </div>
          ) : null}

          {item.notes ? (
            <div className="app-soft-panel px-3 py-3 text-sm leading-6 text-[var(--text-secondary)]">
              {item.notes}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function VocabularyItemSection({
  title,
  description,
  items,
  itemCoverageById,
  showStaffMetadata,
}: {
  title: string;
  description?: string;
  items: DbVocabularyItem[];
  itemCoverageById: Map<string, DbVocabularyItemCoverage>;
  showStaffMetadata: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <details className="group app-card p-4">
      <summary className="app-focus-ring flex cursor-pointer list-none items-start justify-between gap-4 rounded-lg">
        <span className="min-w-0">
          <span className="block text-base font-semibold text-[var(--text-primary)]">
            {title}
          </span>
          <span className="mt-1 block text-sm text-[var(--text-secondary)]">
            {description ?? `${items.length} item${items.length === 1 ? "" : "s"}`}
          </span>
        </span>

        <SectionToggleButton />
      </summary>

      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <VocabularyItemRow
            key={`${item.vocabulary_list_id ?? item.vocabulary_set_id}-${item.id}`}
            item={item}
            coverage={itemCoverageById.get(item.id) ?? null}
            showStaffMetadata={showStaffMetadata}
          />
        ))}
      </div>
    </details>
  );
}

export default function VocabularyItemSectionList({
  sections,
  itemCoverageById,
  showStaffMetadata,
}: {
  sections: VocabularyItemSectionGroup[];
  itemCoverageById: Map<string, DbVocabularyItemCoverage>;
  showStaffMetadata: boolean;
}) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <VocabularyItemSection
          key={section.key}
          title={section.title}
          description={section.description}
          items={section.items}
          itemCoverageById={itemCoverageById}
          showStaffMetadata={showStaffMetadata}
        />
      ))}
    </div>
  );
}

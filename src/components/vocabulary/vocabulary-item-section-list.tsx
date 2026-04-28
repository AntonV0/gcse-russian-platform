import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import { getButtonClassName } from "@/components/ui/button-styles";
import type { VocabularyItemSectionGroup } from "@/lib/vocabulary/items/item-sections";
import { getVocabularyTierLabel } from "@/lib/vocabulary/shared/labels";
import {
  getRequiredVocabularyCoverageVariants,
  getVocabularyCoverageVariantCount,
  getVocabularyCoverageVariantLabel,
  getVocabularyCoverageVariantUsed,
} from "@/lib/vocabulary/shared/study-variants";
import type { DbVocabularyItem, DbVocabularyItemCoverage } from "@/lib/vocabulary/shared/types";

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
  position,
}: {
  item: DbVocabularyItem;
  coverage: DbVocabularyItemCoverage | null;
  showStaffMetadata: boolean;
  position: number;
}) {
  const studyUseLabel = getItemStudyUseLabel(item);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted-bg)] shadow-[var(--shadow-xs)] transition hover:border-[color-mix(in_srgb,var(--accent)_24%,var(--border-strong))] hover:bg-[var(--background-elevated)]">
      <div className="absolute inset-y-0 left-0 w-1 bg-[var(--accent-fill)] opacity-70" />

      <div className="grid gap-4 px-4 py-4 sm:pl-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <div className="flex min-w-0 gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-elevated)] text-xs font-semibold text-[var(--text-muted)]">
            {position}
          </span>

          <div className="min-w-0">
            <div
              lang="ru"
              className="text-lg font-semibold leading-7 text-[var(--text-primary)]"
            >
              {item.russian}
            </div>
            {item.transliteration ? (
              <div className="mt-1 text-sm leading-6 app-text-soft">
                {item.transliteration}
              </div>
            ) : null}
          </div>
        </div>

        <div className="min-w-0 border-t border-[var(--border-subtle)] pt-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
          <div className="text-sm leading-6 text-[var(--text-secondary)]">
            {item.english}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone={getItemBadgeTone(item)}>{getItemSourceLabel(item)}</Badge>
            <Badge tone="muted">{item.part_of_speech.replaceAll("_", " ")}</Badge>
            <Badge tone="muted">{getVocabularyTierLabel(item.tier)}</Badge>
            {studyUseLabel ? <Badge tone="muted">{studyUseLabel}</Badge> : null}
          </div>

          {showStaffMetadata ? (
            <div className="mt-3">
              <VocabularyItemCoverageBadges item={item} coverage={coverage} />
            </div>
          ) : null}
        </div>
      </div>

      {item.example_ru || item.example_en || item.notes ? (
        <div className="grid gap-3 border-t border-[var(--border-subtle)] bg-[var(--background-elevated)]/45 px-4 py-4 sm:pl-5 md:grid-cols-2">
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
        {items.map((item, index) => (
          <VocabularyItemRow
            key={`${item.vocabulary_list_id ?? item.vocabulary_set_id}-${item.id}`}
            item={item}
            coverage={itemCoverageById.get(item.id) ?? null}
            showStaffMetadata={showStaffMetadata}
            position={index + 1}
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

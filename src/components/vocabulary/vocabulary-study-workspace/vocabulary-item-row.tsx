import Badge from "@/components/ui/badge";
import { RussianText } from "@/components/typography/russian-text";
import { getVocabularyTierLabel } from "@/lib/vocabulary/shared/labels";
import {
  getRequiredVocabularyCoverageVariants,
  getVocabularyCoverageVariantCount,
  getVocabularyCoverageVariantLabel,
  getVocabularyCoverageVariantUsed,
} from "@/lib/vocabulary/shared/study-variants";
import type {
  DbVocabularyItem,
  DbVocabularyItemCoverage,
} from "@/lib/vocabulary/shared/types";
import type { VocabularyStudyState } from "@/lib/vocabulary/study-state";

import {
  getStudyStateBadgeTone,
  getStudyStateIcon,
  getStudyStateLabel,
  getStudyStateRowClassName,
  getStudyStateStripeClassName,
  StudyStateButton,
} from "./study-state-ui";

export function VocabularyItemRow({
  item,
  coverage,
  showStaffMetadata,
  position,
  studyState,
  onSetStudyState,
}: {
  item: DbVocabularyItem;
  coverage: DbVocabularyItemCoverage | null;
  showStaffMetadata: boolean;
  position: number;
  studyState: VocabularyStudyState;
  onSetStudyState: (state: VocabularyStudyState) => void;
}) {
  const studyUseLabel = getItemStudyUseLabel(item);

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl border shadow-[var(--shadow-xs)] transition",
        "hover:bg-[var(--background-elevated)]",
        getStudyStateRowClassName(studyState),
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-y-0 left-0 w-1 opacity-80",
          getStudyStateStripeClassName(studyState),
        ].join(" ")}
      />

      <div className="grid gap-4 px-4 py-4 sm:pl-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:items-start">
        <div className="flex min-w-0 gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-elevated)] text-xs font-semibold text-[var(--text-muted)]">
            {position}
          </span>

          <div className="min-w-0">
            <RussianText variant="term" className="block text-lg font-semibold leading-7">
              {item.russian}
            </RussianText>
            {item.transliteration ? (
              <div className="mt-1 text-sm leading-6 app-text-soft">
                {item.transliteration}
              </div>
            ) : null}
          </div>
        </div>

        <div className="min-w-0 border-t border-[var(--border-subtle)] pt-3 xl:border-l xl:border-t-0 xl:pl-4 xl:pt-0">
          <div className="text-sm leading-6 text-[var(--text-secondary)]">
            {item.english}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge
              tone={getStudyStateBadgeTone(studyState)}
              icon={getStudyStateIcon(studyState)}
            >
              {getStudyStateLabel(studyState)}
            </Badge>
            <Badge tone={getItemBadgeTone(item)} icon="vocabulary">
              {getItemSourceLabel(item)}
            </Badge>
            <Badge tone="muted">{item.part_of_speech.replaceAll("_", " ")}</Badge>
            <Badge tone="muted" icon="school">
              {getVocabularyTierLabel(item.tier)}
            </Badge>
            {studyUseLabel ? <Badge tone="muted">{studyUseLabel}</Badge> : null}
          </div>

          <div
            className="app-mobile-action-stack mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap"
            role="group"
            aria-label={`Study state for ${item.russian}`}
          >
            <StudyStateButton
              state="needs_practice"
              currentState={studyState}
              onClick={() => onSetStudyState("needs_practice")}
            />
            <StudyStateButton
              state="mastered"
              currentState={studyState}
              onClick={() => onSetStudyState("mastered")}
            />
            <StudyStateButton
              state="new"
              currentState={studyState}
              onClick={() => onSetStudyState("new")}
            />
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
                <RussianText variant="prose" className="block font-medium">
                  {item.example_ru}
                </RussianText>
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

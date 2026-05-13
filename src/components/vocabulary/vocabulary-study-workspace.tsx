"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import ActionPill from "@/components/ui/action-pill";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { RussianText } from "@/components/typography/russian-text";
import type { VocabularyItemSectionGroup } from "@/lib/vocabulary/items/item-sections";
import { getVocabularyTierLabel } from "@/lib/vocabulary/shared/labels";
import {
  getRequiredVocabularyCoverageVariants,
  getVocabularyCoverageVariantCount,
  getVocabularyCoverageVariantLabel,
  getVocabularyCoverageVariantUsed,
} from "@/lib/vocabulary/shared/study-variants";
import {
  getVocabularyStudyItemMatchesFilters,
  getVocabularyStudyState,
  getVocabularyStudyStateCounts,
  normalizeVocabularyStudyState,
  type VocabularyStudySkillFilter,
  type VocabularyStudySourceFilter,
  type VocabularyStudyState,
  type VocabularyStudyStateFilter,
  type VocabularyStudyStateMap,
} from "@/lib/vocabulary/study-state";
import type {
  DbVocabularyItem,
  DbVocabularyItemCoverage,
} from "@/lib/vocabulary/shared/types";

type VocabularyStudyWorkspaceProps = {
  vocabularySetId: string;
  vocabularySetTitle: string;
  sections: VocabularyItemSectionGroup[];
  itemCoverage: DbVocabularyItemCoverage[];
  showStaffMetadata: boolean;
};

const EMPTY_STUDY_STATES: VocabularyStudyStateMap = {};
const STUDY_STATE_STORAGE_EVENT = "vocabulary-study-state-change";
let cachedStudyStateStorageKey = "";
let cachedStudyStateItemIdsKey = "";
let cachedStudyStateRawValue = "";
let cachedStudyStateSnapshot: VocabularyStudyStateMap = EMPTY_STUDY_STATES;

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

function getStudyStateLabel(state: VocabularyStudyState) {
  switch (state) {
    case "mastered":
      return "Mastered";
    case "needs_practice":
      return "Needs practice";
    case "new":
      return "New";
  }
}

function getStudyStateBadgeTone(state: VocabularyStudyState) {
  switch (state) {
    case "mastered":
      return "success";
    case "needs_practice":
      return "warning";
    case "new":
      return "muted";
  }
}

function getStudyStateIcon(state: VocabularyStudyState) {
  switch (state) {
    case "mastered":
      return "success";
    case "needs_practice":
      return "brain";
    case "new":
      return "sparkles";
  }
}

function getStudyStateRowClassName(state: VocabularyStudyState) {
  switch (state) {
    case "mastered":
      return [
        "border-[var(--success-border)]",
        "bg-[color-mix(in_srgb,var(--success-surface)_48%,var(--surface-muted-bg))]",
        "hover:border-[var(--success-border-strong)]",
      ].join(" ");
    case "needs_practice":
      return [
        "border-[var(--warning-border)]",
        "bg-[color-mix(in_srgb,var(--warning-surface)_52%,var(--surface-muted-bg))]",
        "hover:border-[var(--warning-border-strong)]",
      ].join(" ");
    case "new":
    default:
      return [
        "border-[var(--border-subtle)]",
        "bg-[var(--surface-muted-bg)]",
        "hover:border-[color-mix(in_srgb,var(--accent-border-ink)_34%,var(--border-strong))]",
      ].join(" ");
  }
}

function getStudyStateStripeClassName(state: VocabularyStudyState) {
  switch (state) {
    case "mastered":
      return "bg-[var(--success)]";
    case "needs_practice":
      return "bg-[var(--warning-display)]";
    case "new":
    default:
      return "bg-[var(--accent-fill)]";
  }
}

function getStorageKey(vocabularySetId: string) {
  return `gcse-russian:vocabulary-study:${vocabularySetId}`;
}

function loadStoredStudyStates(storageKey: string, itemIds: Set<string>) {
  try {
    const rawValue = window.localStorage.getItem(storageKey);
    const parsedValue = rawValue ? JSON.parse(rawValue) : null;

    if (!parsedValue || typeof parsedValue !== "object") {
      return {};
    }

    return Object.entries(parsedValue).reduce<VocabularyStudyStateMap>(
      (states, [itemId, value]) => {
        const normalizedState = normalizeVocabularyStudyState(value);

        if (itemIds.has(itemId) && normalizedState) {
          states[itemId] = normalizedState;
        }

        return states;
      },
      {}
    );
  } catch {
    return {};
  }
}

function getCachedStoredStudyStates(storageKey: string, itemIds: Set<string>) {
  if (typeof window === "undefined") {
    return EMPTY_STUDY_STATES;
  }

  const itemIdsKey = Array.from(itemIds).join("\u001f");
  const rawValue = window.localStorage.getItem(storageKey) ?? "";

  if (
    cachedStudyStateStorageKey === storageKey &&
    cachedStudyStateItemIdsKey === itemIdsKey &&
    cachedStudyStateRawValue === rawValue
  ) {
    return cachedStudyStateSnapshot;
  }

  cachedStudyStateStorageKey = storageKey;
  cachedStudyStateItemIdsKey = itemIdsKey;
  cachedStudyStateRawValue = rawValue;
  cachedStudyStateSnapshot = loadStoredStudyStates(storageKey, itemIds);

  return cachedStudyStateSnapshot;
}

function subscribeToStudyStateStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STUDY_STATE_STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STUDY_STATE_STORAGE_EVENT, onStoreChange);
  };
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
    <ActionPill
      icon="down"
      className="pointer-events-none shrink-0 gap-1 px-3 sm:px-3.5"
      aria-hidden="true"
    >
      <span className="group-open:hidden">Open</span>
      <span className="hidden group-open:inline">Close</span>
    </ActionPill>
  );
}

function StudyStateButton({
  state,
  currentState,
  onClick,
}: {
  state: VocabularyStudyState;
  currentState: VocabularyStudyState;
  onClick: () => void;
}) {
  const isActive = state === currentState;

  return (
    <Button
      type="button"
      variant={
        state === "mastered"
          ? "success"
          : state === "needs_practice"
            ? "warning"
            : isActive
              ? "soft"
              : "secondary"
      }
      size="sm"
      icon={getStudyStateIcon(state)}
      aria-pressed={isActive}
      onClick={onClick}
    >
      {getStudyStateLabel(state)}
    </Button>
  );
}

function VocabularyItemRow({
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
            className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap"
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

function StudySummaryButton({
  label,
  count,
  stateFilter,
  activeFilter,
  onClick,
}: {
  label: string;
  count: number;
  stateFilter: VocabularyStudyStateFilter;
  activeFilter: VocabularyStudyStateFilter;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activeFilter === stateFilter}
      className={[
        "app-focus-ring rounded-2xl border px-4 py-3 text-left transition",
        activeFilter === stateFilter
          ? "border-[var(--accent-selected-border)] [background:var(--accent-gradient-selected)] shadow-[0_10px_24px_color-mix(in_srgb,var(--accent)_10%,transparent)]"
          : "border-[var(--border-subtle)] bg-[var(--background-elevated)] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)]",
      ].join(" ")}
    >
      <span className="block text-2xl font-bold leading-none text-[var(--text-primary)]">
        {count}
      </span>
      <span className="mt-1 block text-sm font-semibold text-[var(--text-secondary)]">
        {label}
      </span>
    </button>
  );
}

export default function VocabularyStudyWorkspace({
  vocabularySetId,
  vocabularySetTitle,
  sections,
  itemCoverage,
  showStaffMetadata,
}: VocabularyStudyWorkspaceProps) {
  const allItems = useMemo(
    () => sections.flatMap((section) => section.items),
    [sections]
  );
  const itemIds = useMemo(() => allItems.map((item) => item.id), [allItems]);
  const itemIdSet = useMemo(() => new Set(itemIds), [itemIds]);
  const coverageByItemId = useMemo(
    () =>
      new Map(
        itemCoverage.map((coverage) => [coverage.vocabulary_item_id, coverage] as const)
      ),
    [itemCoverage]
  );
  const storageKey = getStorageKey(vocabularySetId);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<VocabularyStudyStateFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<VocabularyStudySourceFilter>("all");
  const [skillFilter, setSkillFilter] = useState<VocabularyStudySkillFilter>("all");
  const getStudyStateSnapshot = useCallback(
    () => getCachedStoredStudyStates(storageKey, itemIdSet),
    [itemIdSet, storageKey]
  );
  const stateByItemId = useSyncExternalStore(
    subscribeToStudyStateStorage,
    getStudyStateSnapshot,
    () => EMPTY_STUDY_STATES
  );

  const counts = getVocabularyStudyStateCounts(itemIds, stateByItemId);
  const masteredPercent =
    itemIds.length > 0 ? Math.round((counts.mastered / itemIds.length) * 100) : 0;
  const activeFilterCount = [search, stateFilter, sourceFilter, skillFilter].filter(
    (value) => value && value !== "all"
  ).length;
  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        getVocabularyStudyItemMatchesFilters({
          item,
          search,
          stateFilter,
          sourceFilter,
          skillFilter,
          stateByItemId,
        })
      ),
    }))
    .filter((section) => section.items.length > 0);
  const filteredItemCount = filteredSections.reduce(
    (count, section) => count + section.items.length,
    0
  );

  function setItemStudyState(itemId: string, state: VocabularyStudyState) {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...stateByItemId,
        [itemId]: state,
      })
    );
    window.dispatchEvent(new Event(STUDY_STATE_STORAGE_EVENT));
  }

  function resetFilters() {
    setSearch("");
    setStateFilter("all");
    setSourceFilter("all");
    setSkillFilter("all");
  }

  return (
    <div className="space-y-5">
      <section
        className="rounded-2xl border border-[color-mix(in_srgb,var(--accent-border-ink)_18%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent)_4%,var(--background-elevated))] p-4 shadow-[var(--shadow-xs)]"
        aria-label={`${vocabularySetTitle} study progress`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-ink)]">
              <AppIcon icon="brain" size={18} />
              Study tracker
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              Mark words as you revise. Your states are saved in this browser so repeat
              sessions can start from the words that still need work.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
            <Button
              type="button"
              variant="warning"
              icon="brain"
              onClick={() => setStateFilter("needs_practice")}
            >
              Review needs practice
            </Button>
            <Button
              type="button"
              variant="success"
              icon="success"
              onClick={() => setStateFilter("mastered")}
            >
              Check mastered
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <StudySummaryButton
            label="New"
            count={counts.new}
            stateFilter="new"
            activeFilter={stateFilter}
            onClick={() => setStateFilter(stateFilter === "new" ? "all" : "new")}
          />
          <StudySummaryButton
            label="Needs practice"
            count={counts.needs_practice}
            stateFilter="needs_practice"
            activeFilter={stateFilter}
            onClick={() =>
              setStateFilter(stateFilter === "needs_practice" ? "all" : "needs_practice")
            }
          />
          <StudySummaryButton
            label="Mastered"
            count={counts.mastered}
            stateFilter="mastered"
            activeFilter={stateFilter}
            onClick={() =>
              setStateFilter(stateFilter === "mastered" ? "all" : "mastered")
            }
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-[var(--text-primary)]">
              {masteredPercent}% mastered
            </span>
            <span className="text-[var(--text-secondary)]">
              {counts.mastered} of {itemIds.length}
            </span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--background-muted)]"
            role="progressbar"
            aria-label="Vocabulary mastered progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={masteredPercent}
          >
            <div
              className="h-full rounded-full [background:var(--success-progress-gradient)]"
              style={{ width: `${masteredPercent}%` }}
            />
          </div>
        </div>
      </section>

      <section
        className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-xs)]"
        aria-label="Vocabulary item filters"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.2fr)_repeat(3,minmax(150px,1fr))_auto] xl:items-end">
          <div className="min-w-0">
            <label
              htmlFor="vocabulary-item-search"
              className="mb-1.5 block text-sm font-semibold text-[var(--text-primary)]"
            >
              Search this set
            </label>
            <Input
              id="vocabulary-item-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Russian, English, examples..."
              type="search"
            />
          </div>

          <div className="min-w-0">
            <label
              htmlFor="vocabulary-state-filter"
              className="mb-1.5 block text-sm font-semibold text-[var(--text-primary)]"
            >
              Study state
            </label>
            <Select
              id="vocabulary-state-filter"
              value={stateFilter}
              onChange={(event) =>
                setStateFilter(event.target.value as VocabularyStudyStateFilter)
              }
            >
              <option value="all">All states</option>
              <option value="new">New</option>
              <option value="needs_practice">Needs practice</option>
              <option value="mastered">Mastered</option>
            </Select>
          </div>

          <div className="min-w-0">
            <label
              htmlFor="vocabulary-source-filter"
              className="mb-1.5 block text-sm font-semibold text-[var(--text-primary)]"
            >
              Source
            </label>
            <Select
              id="vocabulary-source-filter"
              value={sourceFilter}
              onChange={(event) =>
                setSourceFilter(event.target.value as VocabularyStudySourceFilter)
              }
            >
              <option value="all">All sources</option>
              <option value="spec_required">Exam specification</option>
              <option value="extended">Extended</option>
              <option value="custom">Custom</option>
            </Select>
          </div>

          <div className="min-w-0">
            <label
              htmlFor="vocabulary-skill-filter"
              className="mb-1.5 block text-sm font-semibold text-[var(--text-primary)]"
            >
              Skill use
            </label>
            <Select
              id="vocabulary-skill-filter"
              value={skillFilter}
              onChange={(event) =>
                setSkillFilter(event.target.value as VocabularyStudySkillFilter)
              }
            >
              <option value="all">All skills</option>
              <option value="productive">Speaking and writing</option>
              <option value="receptive">Listening and reading</option>
              <option value="both">All skills words</option>
              <option value="unknown">Unknown</option>
            </Select>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
            <Button
              type="button"
              variant="secondary"
              icon="refresh"
              onClick={resetFilters}
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Badge tone={activeFilterCount > 0 ? "info" : "muted"} icon="filter">
            {activeFilterCount} active filter{activeFilterCount === 1 ? "" : "s"}
          </Badge>
          <span>
            Showing {filteredItemCount} of {itemIds.length} item
            {itemIds.length === 1 ? "" : "s"}.
          </span>
        </div>
      </section>

      {filteredSections.length === 0 ? (
        <EmptyState
          icon="search"
          iconTone="brand"
          title="No vocabulary items match"
          description="Clear a filter or try a different search term to bring items back into the study list."
          action={
            <Button
              type="button"
              variant="secondary"
              icon="refresh"
              onClick={resetFilters}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {filteredSections.map((section, sectionIndex) => (
            <details
              key={section.key}
              className="group app-card p-4"
              open={sectionIndex === 0 || activeFilterCount > 0}
            >
              <summary className="app-focus-ring flex cursor-pointer list-none items-start justify-between gap-4 rounded-lg">
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-[var(--text-primary)]">
                    {section.title}
                  </span>
                  <span className="mt-1 block text-sm text-[var(--text-secondary)]">
                    {section.description ??
                      `${section.items.length} item${section.items.length === 1 ? "" : "s"}`}
                  </span>
                </span>

                <SectionToggleButton />
              </summary>

              <div className="mt-4 grid gap-3">
                {section.items.map((item, index) => (
                  <VocabularyItemRow
                    key={`${item.vocabulary_list_id ?? item.vocabulary_set_id}-${item.id}`}
                    item={item}
                    coverage={coverageByItemId.get(item.id) ?? null}
                    showStaffMetadata={showStaffMetadata}
                    position={index + 1}
                    studyState={getVocabularyStudyState(item.id, stateByItemId)}
                    onSetStudyState={(state) => setItemStudyState(item.id, state)}
                  />
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

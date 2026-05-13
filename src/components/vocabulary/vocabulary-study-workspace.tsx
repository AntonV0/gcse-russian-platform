"use client";

import { useMemo, useState } from "react";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import type { VocabularyItemSectionGroup } from "@/lib/vocabulary/items/item-sections";
import {
  getVocabularyStudyItemMatchesFilters,
  getVocabularyStudyState,
  getVocabularyStudyStateCounts,
  type VocabularyStudySkillFilter,
  type VocabularyStudySourceFilter,
  type VocabularyStudyState,
  type VocabularyStudyStateFilter,
} from "@/lib/vocabulary/study-state";
import type { DbVocabularyItemCoverage } from "@/lib/vocabulary/shared/types";

import {
  getVocabularyStudyStorageKey,
  saveVocabularyStudyState,
  useVocabularyStudyStateMap,
} from "./vocabulary-study-workspace/study-state-storage";
import {
  SectionToggleButton,
  StudySummaryButton,
} from "./vocabulary-study-workspace/study-state-ui";
import { VocabularyItemRow } from "./vocabulary-study-workspace/vocabulary-item-row";

type VocabularyStudyWorkspaceProps = {
  vocabularySetId: string;
  vocabularySetTitle: string;
  sections: VocabularyItemSectionGroup[];
  itemCoverage: DbVocabularyItemCoverage[];
  showStaffMetadata: boolean;
};

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
  const storageKey = getVocabularyStudyStorageKey(vocabularySetId);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<VocabularyStudyStateFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<VocabularyStudySourceFilter>("all");
  const [skillFilter, setSkillFilter] = useState<VocabularyStudySkillFilter>("all");
  const stateByItemId = useVocabularyStudyStateMap({ storageKey, itemIdSet });

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
    saveVocabularyStudyState({
      storageKey,
      stateByItemId,
      itemId,
      state,
    });
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

          <div className="app-mobile-action-stack flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
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

          <div className="app-mobile-action-stack flex flex-col gap-2 sm:flex-row xl:flex-col">
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

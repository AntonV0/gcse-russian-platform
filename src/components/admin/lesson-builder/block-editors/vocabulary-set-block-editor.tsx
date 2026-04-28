"use client";

import { useMemo, useState } from "react";
import { updateVocabularySetBlockAction } from "@/app/actions/admin/admin-lesson-builder-actions";
import type { LessonBuilderVocabularySetOption } from "@/components/admin/lesson-builder/lesson-builder-types";
import { useVocabularySetOptionFilters } from "@/components/admin/lesson-builder/vocabulary-set-option-filters";
import { getVocabularySetTypeLabel } from "@/lib/vocabulary/shared/labels";
import {
  BuilderHiddenFields,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_FIELD_CLASS,
  BUILDER_MUTED_INFO_BOX_CLASS,
  BUILDER_SECONDARY_BUTTON_CLASS,
  BUILDER_SELECT_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import type { BlockEditorProps } from "./shared";

type VocabularySetBlockEditorProps = BlockEditorProps & {
  defaultTitle: string;
  defaultSlug: string;
  defaultListSlug: string;
  vocabularySetOptions: LessonBuilderVocabularySetOption[];
};

export function VocabularySetBlockEditor(props: VocabularySetBlockEditorProps) {
  const hasMatchingOption = props.vocabularySetOptions.some(
    (option) => option.slug === props.defaultSlug
  );

  const initialValue =
    hasMatchingOption || !props.defaultSlug
      ? props.defaultSlug
      : `__missing__:${props.defaultSlug}`;

  const [selectedValue, setSelectedValue] = useState<string>(initialValue);
  const [selectedListValue, setSelectedListValue] = useState<string>(
    props.defaultListSlug
  );

  const selectedVocabularySet = useMemo(() => {
    if (selectedValue.startsWith("__missing__:")) {
      return null;
    }

    return (
      props.vocabularySetOptions.find((option) => option.slug === selectedValue) ?? null
    );
  }, [props.vocabularySetOptions, selectedValue]);
  const selectedVocabularyList = selectedVocabularySet?.lists.find(
    (list) => list.slug === selectedListValue
  );
  const {
    filteredVocabularySetOptions,
    setModeFilter,
    setSearch,
    setSetModeFilter,
    setSetSearch,
    setSetStatusFilter,
    setSetTierFilter,
    setSetTypeFilter,
    setStatusFilter,
    setTierFilter,
    setTypeFilter,
  } = useVocabularySetOptionFilters({
    options: props.vocabularySetOptions,
    selectedOption: selectedVocabularySet,
  });
  const hasMissingList =
    Boolean(props.defaultListSlug) &&
    selectedValue === props.defaultSlug &&
    selectedListValue === props.defaultListSlug &&
    !selectedVocabularyList;

  if (props.vocabularySetOptions.length === 0 && !props.defaultSlug) {
    return (
      <div className="space-y-2 rounded-2xl border border-dashed border-[var(--border)] px-4 py-4 text-sm app-text-muted">
        <div>No vocabulary sets with slugs are available yet.</div>
        <div>Create a vocabulary set first, then return to attach it here.</div>
      </div>
    );
  }

  return (
    <form action={updateVocabularySetBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />

      <input
        name="title"
        defaultValue={props.defaultTitle}
        placeholder="Optional heading"
        className={BUILDER_FIELD_CLASS}
      />

      <div className="grid gap-2 md:grid-cols-2">
        <input
          type="search"
          value={setSearch}
          onChange={(event) => setSetSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.preventDefault();
          }}
          placeholder="Filter vocabulary sets..."
          className={`${BUILDER_FIELD_CLASS} md:col-span-2`}
          aria-label="Filter vocabulary sets"
        />
        <select
          value={setTierFilter}
          onChange={(event) => setSetTierFilter(event.target.value)}
          className={BUILDER_SELECT_CLASS}
          aria-label="Filter vocabulary sets by tier"
        >
          <option value="all">All tiers</option>
          <option value="foundation">Foundation</option>
          <option value="higher">Higher</option>
          <option value="both">Both tiers</option>
        </select>
        <select
          value={setModeFilter}
          onChange={(event) => setSetModeFilter(event.target.value)}
          className={BUILDER_SELECT_CLASS}
          aria-label="Filter vocabulary sets by list mode"
        >
          <option value="all">All modes</option>
          <option value="spec_only">Exam list</option>
          <option value="extended_only">Extra practice</option>
          <option value="spec_and_extended">Exam + extra</option>
          <option value="custom">Custom sets</option>
        </select>
        <select
          value={setStatusFilter}
          onChange={(event) => setSetStatusFilter(event.target.value)}
          className={BUILDER_SELECT_CLASS}
          aria-label="Filter vocabulary sets by status"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select
          value={setTypeFilter}
          onChange={(event) => setSetTypeFilter(event.target.value)}
          className={BUILDER_SELECT_CLASS}
          aria-label="Filter vocabulary sets by type"
        >
          <option value="lesson_custom">Lesson custom</option>
          <option value="theme">Theme</option>
          <option value="core">Core</option>
          <option value="phrase_bank">Phrase bank</option>
          <option value="exam_prep">Exam prep</option>
          <option value="all">All attachable types</option>
        </select>
      </div>

      <select
        name="vocabularySetSlug"
        required
        value={selectedValue}
        onChange={(event) => {
          setSelectedValue(event.target.value);
          setSelectedListValue("");
        }}
        className={BUILDER_SELECT_CLASS}
      >
        {!hasMatchingOption && props.defaultSlug ? (
          <option value={`__missing__:${props.defaultSlug}`}>
            Missing set - {props.defaultSlug}
          </option>
        ) : null}
        <option value="" disabled>
          Choose a vocabulary set
        </option>

        {filteredVocabularySetOptions.map((option) => (
          <option key={option.id} value={option.slug}>
            {option.title} - {option.slug} - {option.tier} - {option.listMode}
            {" - "}
            {getVocabularySetTypeLabel(option.setType)}
            {option.isPublished ? "" : " - draft"}
          </option>
        ))}
      </select>

      <div className="text-xs app-text-soft">
        Showing {filteredVocabularySetOptions.length} of{" "}
        {props.vocabularySetOptions.length} vocabulary set
        {props.vocabularySetOptions.length === 1 ? "" : "s"}.
      </div>

      {!hasMatchingOption && props.defaultSlug ? (
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--warning)_24%,transparent)] bg-[var(--warning-soft)] px-3 py-3 text-sm text-[var(--warning)]">
          The currently linked vocabulary set slug no longer matches an available library
          option. Choose a new set before saving.
        </div>
      ) : null}

      {selectedVocabularySet ? (
        <select
          name="vocabularyListSlug"
          value={selectedListValue}
          onChange={(event) => setSelectedListValue(event.target.value)}
          className={BUILDER_SELECT_CLASS}
        >
          <option value="">All applicable lists for this course variant</option>
          {hasMissingList ? (
            <option value={props.defaultListSlug}>
              Missing list - {props.defaultListSlug}
            </option>
          ) : null}
          {selectedVocabularySet.lists.map((list) => (
            <option key={list.id} value={list.slug}>
              {list.title} - {list.slug}
              {list.isPublished ? "" : " - draft"}
            </option>
          ))}
        </select>
      ) : null}

      {hasMissingList ? (
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--warning)_24%,transparent)] bg-[var(--warning-soft)] px-3 py-3 text-sm text-[var(--warning)]">
          The currently linked vocabulary list slug no longer matches this set. Choose
          another list or use the course-variant scope before saving.
        </div>
      ) : null}

      {selectedVocabularySet ? (
        <div className={BUILDER_MUTED_INFO_BOX_CLASS}>
          <div className="font-medium text-[var(--text-primary)]">
            {selectedVocabularySet.title}
          </div>
          <div className="mt-1 text-xs app-text-soft">
            Slug: {selectedVocabularySet.slug}
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-2 py-1 text-[var(--text-secondary)]">
              {selectedVocabularySet.isPublished ? "Published" : "Draft"}
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-2 py-1 text-[var(--text-secondary)]">
              Tier: {selectedVocabularySet.tier}
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-2 py-1 text-[var(--text-secondary)]">
              Mode: {selectedVocabularySet.listMode}
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-2 py-1 text-[var(--text-secondary)]">
              Type: {getVocabularySetTypeLabel(selectedVocabularySet.setType)}
            </span>
            {selectedVocabularyList ? (
              <span className="rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-2 py-1 text-[var(--text-secondary)]">
                List: {selectedVocabularyList.title}
              </span>
            ) : null}
          </div>
          {selectedVocabularySet.setType !== "lesson_custom" ? (
            <div className="mt-3 rounded-2xl border border-[color-mix(in_srgb,var(--warning)_24%,transparent)] bg-[var(--warning-soft)] px-3 py-3 text-xs leading-5 text-[var(--warning)]">
              Lesson custom sets are recommended here so students see the smaller,
              lesson-specific vocabulary list rather than a broad library set.
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Save vocabulary-set block"
          pendingLabel="Saving vocabulary-set block..."
          className={BUILDER_SECONDARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Updating linked vocabulary set..." />
      </div>
    </form>
  );
}

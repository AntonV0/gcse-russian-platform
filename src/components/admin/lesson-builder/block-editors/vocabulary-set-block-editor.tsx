"use client";

import { useMemo, useState } from "react";
import { updateVocabularySetBlockAction } from "@/app/actions/admin/admin-lesson-builder-actions";
import type { LessonBuilderVocabularySetOption } from "@/components/admin/lesson-builder/lesson-builder-types";
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

  const selectedVocabularySet = useMemo(() => {
    if (selectedValue.startsWith("__missing__:")) {
      return null;
    }

    return (
      props.vocabularySetOptions.find((option) => option.slug === selectedValue) ?? null
    );
  }, [props.vocabularySetOptions, selectedValue]);

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

      <select
        name="vocabularySetSlug"
        required
        value={selectedValue}
        onChange={(event) => setSelectedValue(event.target.value)}
        className={BUILDER_SELECT_CLASS}
      >
        {!hasMatchingOption && props.defaultSlug ? (
          <option value={`__missing__:${props.defaultSlug}`}>
            Missing set - {props.defaultSlug}
          </option>
        ) : null}

        {props.vocabularySetOptions.map((option) => (
          <option key={option.id} value={option.slug}>
            {option.title} - {option.slug}
            {option.isPublished ? "" : " - draft"}
          </option>
        ))}
      </select>

      {!hasMatchingOption && props.defaultSlug ? (
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--warning)_24%,transparent)] bg-[var(--warning-soft)] px-3 py-3 text-sm text-[var(--warning)]">
          The currently linked vocabulary set slug no longer matches an available library
          option. Choose a new set before saving.
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
          </div>
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

"use client";

import { useMemo, useState } from "react";
import {
  createVocabularyBlockAction,
  createVocabularySetBlockAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import type { LessonBuilderVocabularySetOption } from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  BuilderHiddenFields,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_FIELD_CLASS,
  BUILDER_MUTED_INFO_BOX_CLASS,
  BUILDER_PRIMARY_BUTTON_CLASS,
  BUILDER_SELECT_CLASS,
  BUILDER_TEXTAREA_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import { getDefaultBlockData } from "@/lib/lessons/lesson-blocks";
import type { AddBlockFormProps } from "./shared";

export function AddVocabularyBlockForm(props: AddBlockFormProps) {
  const defaults = getDefaultBlockData("vocabulary") as {
    title?: string;
    items?: { russian: string; english: string }[];
  };

  return (
    <form action={createVocabularyBlockAction} className="space-y-3">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />
      <input
        name="title"
        required
        placeholder="Key vocabulary"
        defaultValue={defaults.title ?? ""}
        className={BUILDER_FIELD_CLASS}
      />
      <textarea
        name="items"
        required
        rows={6}
        defaultValue={(defaults.items ?? [])
          .map((item) => `${item.russian} | ${item.english}`)
          .join("\n")}
        placeholder={`дом | house\nшкола | school`}
        className={`${BUILDER_TEXTAREA_CLASS} font-mono`}
      />
      <p className="text-xs app-text-soft">
        Use one item per line in the format: russian | english
      </p>
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Add vocabulary block"
          pendingLabel="Adding vocabulary block..."
          className={BUILDER_PRIMARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Saving vocabulary block..." />
      </div>
    </form>
  );
}

type AddVocabularySetBlockFormProps = AddBlockFormProps & {
  vocabularySetOptions: LessonBuilderVocabularySetOption[];
};

export function AddVocabularySetBlockForm(props: AddVocabularySetBlockFormProps) {
  const defaultData = getDefaultBlockData("vocabulary-set") as {
    title?: string;
    vocabularySetSlug?: string;
    vocabularyListSlug?: string;
  };

  const [selectedSlug, setSelectedSlug] = useState<string>(
    props.vocabularySetOptions[0]?.slug ?? String(defaultData.vocabularySetSlug ?? "")
  );
  const [selectedListSlug, setSelectedListSlug] = useState<string>(
    String(defaultData.vocabularyListSlug ?? "")
  );

  const selectedVocabularySet = useMemo(
    () =>
      props.vocabularySetOptions.find((option) => option.slug === selectedSlug) ?? null,
    [props.vocabularySetOptions, selectedSlug]
  );

  if (props.vocabularySetOptions.length === 0) {
    return (
      <div className="space-y-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-elevated)] px-4 py-5">
        <div className="text-sm font-semibold text-[var(--text-primary)]">
          No attachable vocabulary sets yet
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Create at least one vocabulary set with a slug before attaching it to a lesson
          block.
        </p>
      </div>
    );
  }

  return (
    <form action={createVocabularySetBlockAction} className="space-y-3">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />

      <input
        name="title"
        placeholder="Optional heading"
        defaultValue={String(defaultData.title ?? "")}
        className={BUILDER_FIELD_CLASS}
      />

      <div className="space-y-2">
        <select
          name="vocabularySetSlug"
          required
          value={selectedSlug}
          onChange={(event) => {
            setSelectedSlug(event.target.value);
            setSelectedListSlug("");
          }}
          className={BUILDER_SELECT_CLASS}
        >
          {props.vocabularySetOptions.map((option) => (
            <option key={option.id} value={option.slug}>
              {option.title} - {option.slug}
              {option.isPublished ? "" : " - draft"}
            </option>
          ))}
        </select>

        {selectedVocabularySet ? (
          <select
            name="vocabularyListSlug"
            value={selectedListSlug}
            onChange={(event) => setSelectedListSlug(event.target.value)}
            className={BUILDER_SELECT_CLASS}
          >
            <option value="">All applicable lists for this course variant</option>
            {selectedVocabularySet.lists.map((list) => (
              <option key={list.id} value={list.slug}>
                {list.title} - {list.slug}
                {list.isPublished ? "" : " - draft"}
              </option>
            ))}
          </select>
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
              {selectedListSlug ? (
                <span className="rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-2 py-1 text-[var(--text-secondary)]">
                  List:{" "}
                  {selectedVocabularySet.lists.find(
                    (list) => list.slug === selectedListSlug
                  )?.title ?? selectedListSlug}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Add vocabulary-set block"
          pendingLabel="Adding vocabulary-set block..."
          className={BUILDER_PRIMARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Saving linked vocabulary set block..." />
      </div>
    </form>
  );
}

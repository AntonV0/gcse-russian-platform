"use client";

import { useMemo, useState } from "react";
import {
  createAudioBlockAction,
  createCalloutBlockAction,
  createDividerBlockAction,
  createExamTipBlockAction,
  createHeaderBlockAction,
  createImageBlockAction,
  createNoteBlockAction,
  createQuestionSetBlockAction,
  createSubheaderBlockAction,
  createTextBlockAction,
  createVocabularyBlockAction,
  createVocabularySetBlockAction,
  insertBlockPresetAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import type {
  LessonBuilderVocabularySetOption,
  LessonSection,
  NewBlockType,
  RouteFields,
} from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  BuilderHiddenFields,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_DASHED_EMPTY_STATE_CLASS,
  BUILDER_FIELD_CLASS,
  BUILDER_MUTED_INFO_BOX_CLASS,
  BUILDER_PRIMARY_BUTTON_CLASS,
  BUILDER_SECONDARY_BUTTON_CLASS,
  BUILDER_SELECT_CLASS,
  BUILDER_TEXTAREA_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import { getDefaultBlockData, getLessonBlockLabel } from "@/lib/lessons/lesson-blocks";

function AddSimpleTextBlockForm(props: {
  placeholder: string;
  defaultValue?: string;
  sectionId: string;
  routeFields: RouteFields;
  action: (formData: FormData) => void | Promise<void>;
  buttonLabel: string;
}) {
  return (
    <form action={props.action} className="space-y-3">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />
      <textarea
        name="content"
        required
        rows={4}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        className={BUILDER_TEXTAREA_CLASS}
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel={props.buttonLabel}
          pendingLabel="Adding block..."
          className={BUILDER_PRIMARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Saving new block..." />
      </div>
    </form>
  );
}

function AddTitledContentBlockForm(props: {
  sectionId: string;
  routeFields: RouteFields;
  action: (formData: FormData) => void | Promise<void>;
  buttonLabel: string;
  titlePlaceholder: string;
  contentPlaceholder: string;
  defaultTitle?: string;
  defaultContent?: string;
}) {
  return (
    <form action={props.action} className="space-y-3">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />
      <input
        name="title"
        placeholder={props.titlePlaceholder}
        defaultValue={props.defaultTitle}
        className={BUILDER_FIELD_CLASS}
      />
      <textarea
        name="content"
        required
        rows={5}
        placeholder={props.contentPlaceholder}
        defaultValue={props.defaultContent}
        className={BUILDER_TEXTAREA_CLASS}
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel={props.buttonLabel}
          pendingLabel="Adding block..."
          className={BUILDER_PRIMARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Saving new block..." />
      </div>
    </form>
  );
}

function AddSlugBlockForm(props: {
  sectionId: string;
  routeFields: RouteFields;
  action: (formData: FormData) => void | Promise<void>;
  buttonLabel: string;
  slugFieldName: "questionSetSlug" | "vocabularySetSlug";
  slugPlaceholder: string;
}) {
  return (
    <form action={props.action} className="space-y-3">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />
      <input
        name="title"
        placeholder="Optional heading"
        className={BUILDER_FIELD_CLASS}
      />
      <input
        name={props.slugFieldName}
        required
        placeholder={props.slugPlaceholder}
        className={BUILDER_FIELD_CLASS}
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel={props.buttonLabel}
          pendingLabel="Adding block..."
          className={BUILDER_PRIMARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Saving linked practice block..." />
      </div>
    </form>
  );
}

function AddImageBlockForm(props: { sectionId: string; routeFields: RouteFields }) {
  return (
    <form action={createImageBlockAction} className="space-y-3">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />
      <input
        name="src"
        required
        placeholder="https://..."
        className={BUILDER_FIELD_CLASS}
      />
      <input name="alt" placeholder="Alt text" className={BUILDER_FIELD_CLASS} />
      <input
        name="caption"
        placeholder="Optional caption"
        className={BUILDER_FIELD_CLASS}
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Add image block"
          pendingLabel="Adding image block..."
          className={BUILDER_PRIMARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Saving image block..." />
      </div>
    </form>
  );
}

function AddAudioBlockForm(props: { sectionId: string; routeFields: RouteFields }) {
  return (
    <form action={createAudioBlockAction} className="space-y-3">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />
      <input name="title" placeholder="Optional title" className={BUILDER_FIELD_CLASS} />
      <input
        name="src"
        required
        placeholder="https://..."
        className={BUILDER_FIELD_CLASS}
      />
      <input
        name="caption"
        placeholder="Optional caption"
        className={BUILDER_FIELD_CLASS}
      />
      <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <input type="checkbox" name="autoPlay" value="true" />
        Auto play
      </label>
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Add audio block"
          pendingLabel="Adding audio block..."
          className={BUILDER_PRIMARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Saving audio block..." />
      </div>
    </form>
  );
}

function AddVocabularyBlockForm(props: { sectionId: string; routeFields: RouteFields }) {
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

function AddVocabularySetBlockForm(props: {
  sectionId: string;
  routeFields: RouteFields;
  vocabularySetOptions: LessonBuilderVocabularySetOption[];
}) {
  const defaultData = getDefaultBlockData("vocabulary-set") as {
    title?: string;
    vocabularySetSlug?: string;
  };

  const [selectedSlug, setSelectedSlug] = useState<string>(
    props.vocabularySetOptions[0]?.slug ?? String(defaultData.vocabularySetSlug ?? "")
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
          onChange={(event) => setSelectedSlug(event.target.value)}
          className={BUILDER_SELECT_CLASS}
        >
          {props.vocabularySetOptions.map((option) => (
            <option key={option.id} value={option.slug}>
              {option.title} · {option.slug}
              {option.isPublished ? "" : " · draft"}
            </option>
          ))}
        </select>

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

function BlockTypeButton(props: {
  label: string;
  value: NewBlockType;
  selectedValue: NewBlockType | null;
  onSelect: (value: NewBlockType) => void;
}) {
  const isSelected = props.selectedValue === props.value;

  return (
    <button
      type="button"
      onClick={() => props.onSelect(props.value)}
      className={`rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
        isSelected
          ? "border-[var(--brand-blue)] bg-[var(--brand-blue)] text-white shadow-[0_10px_22px_rgba(37,99,235,0.18)]"
          : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)]"
      }`}
    >
      {props.label}
    </button>
  );
}

function getDefaultComposerSelection(section: LessonSection): NewBlockType | null {
  return section.blocks.length === 0 ? "text" : null;
}

export default function AddBlockComposer(props: {
  section: LessonSection;
  routeFields: RouteFields;
  blockPresetOptions: {
    id: string;
    label: string;
    description: string;
    blocksCount: number;
  }[];
  vocabularySetOptions: LessonBuilderVocabularySetOption[];
}) {
  const [composerState, setComposerState] = useState<{
    sectionId: string;
    selectedNewBlockType: NewBlockType | null;
  }>(() => ({
    sectionId: props.section.id,
    selectedNewBlockType: getDefaultComposerSelection(props.section),
  }));

  const selectedNewBlockType =
    composerState.sectionId === props.section.id
      ? composerState.selectedNewBlockType
      : getDefaultComposerSelection(props.section);

  function updateSelectedNewBlockType(value: NewBlockType | null) {
    setComposerState({
      sectionId: props.section.id,
      selectedNewBlockType: value,
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
        <div className="mb-4">
          <div className="font-semibold text-[var(--text-primary)]">Quick presets</div>
          <div className="text-sm app-text-muted">
            Insert a ready-made starter structure for this section.
          </div>
        </div>

        <div className="grid gap-3">
          {props.blockPresetOptions.length === 0 ? (
            <div className={BUILDER_DASHED_EMPTY_STATE_CLASS}>
              No DB block presets found yet.
            </div>
          ) : (
            props.blockPresetOptions.map((preset) => (
              <form
                key={preset.id}
                action={insertBlockPresetAction}
                className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/45 p-4"
              >
                <BuilderHiddenFields {...props.routeFields} />
                <input type="hidden" name="sectionId" value={props.section.id} />
                <input type="hidden" name="presetId" value={preset.id} />

                <div className="mb-3">
                  <div className="font-semibold text-[var(--text-primary)]">
                    {preset.label}
                  </div>
                  <div className="text-sm app-text-muted">{preset.description}</div>
                  <div className="mt-2 text-xs app-text-soft">
                    {preset.blocksCount} block{preset.blocksCount === 1 ? "" : "s"}
                  </div>
                </div>

                <div className="space-y-2">
                  <PendingSubmitButton
                    idleLabel="Insert preset"
                    pendingLabel="Inserting preset..."
                    className={BUILDER_SECONDARY_BUTTON_CLASS}
                  />
                  <PendingStatusText pendingText="Adding starter blocks to this section..." />
                </div>
              </form>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
        <div className="mb-4">
          <div className="font-semibold text-[var(--text-primary)]">
            Choose a block type
          </div>
          <div className="text-sm app-text-muted">
            Pick a block below, then fill in the form underneath.
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide app-text-soft">
              Structure
            </div>
            <div className="flex flex-wrap gap-2">
              <BlockTypeButton
                label="Header"
                value="header"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Subheader"
                value="subheader"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Divider"
                value="divider"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide app-text-soft">
              Teaching
            </div>
            <div className="flex flex-wrap gap-2">
              <BlockTypeButton
                label="Text"
                value="text"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Note"
                value="note"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Callout"
                value="callout"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Exam tip"
                value="exam-tip"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Vocabulary"
                value="vocabulary"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide app-text-soft">
              Media
            </div>
            <div className="flex flex-wrap gap-2">
              <BlockTypeButton
                label="Image"
                value="image"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Audio"
                value="audio"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide app-text-soft">
              Practice
            </div>
            <div className="flex flex-wrap gap-2">
              <BlockTypeButton
                label="Question set"
                value="question-set"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
              <BlockTypeButton
                label="Vocabulary set"
                value="vocabulary-set"
                selectedValue={selectedNewBlockType}
                onSelect={updateSelectedNewBlockType}
              />
            </div>
          </div>
        </div>
      </div>

      {!selectedNewBlockType ? (
        <div className={BUILDER_DASHED_EMPTY_STATE_CLASS}>
          Choose a block type above to add it to this section.
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/50 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-[var(--text-primary)]">
                New {getLessonBlockLabel(selectedNewBlockType)}
              </div>
              <div className="text-sm app-text-muted">
                Fill in the details for this new block.
              </div>
            </div>

            <button
              type="button"
              onClick={() => updateSelectedNewBlockType(null)}
              className={BUILDER_SECONDARY_BUTTON_CLASS}
            >
              Clear
            </button>
          </div>

          {selectedNewBlockType === "header" && (
            <AddSimpleTextBlockForm
              placeholder="Big heading for this section"
              defaultValue={String(getDefaultBlockData("header").content ?? "")}
              sectionId={props.section.id}
              routeFields={props.routeFields}
              action={createHeaderBlockAction}
              buttonLabel="Add header block"
            />
          )}

          {selectedNewBlockType === "subheader" && (
            <AddSimpleTextBlockForm
              placeholder="Smaller heading for this section"
              defaultValue={String(getDefaultBlockData("subheader").content ?? "")}
              sectionId={props.section.id}
              routeFields={props.routeFields}
              action={createSubheaderBlockAction}
              buttonLabel="Add subheader block"
            />
          )}

          {selectedNewBlockType === "divider" && (
            <form action={createDividerBlockAction} className="space-y-2">
              <BuilderHiddenFields {...props.routeFields} />
              <input type="hidden" name="sectionId" value={props.section.id} />
              <PendingSubmitButton
                idleLabel="Add divider block"
                pendingLabel="Adding divider block..."
                className={BUILDER_PRIMARY_BUTTON_CLASS}
              />
            </form>
          )}

          {selectedNewBlockType === "text" && (
            <AddSimpleTextBlockForm
              placeholder="Write the text content here..."
              defaultValue={String(getDefaultBlockData("text").content ?? "")}
              sectionId={props.section.id}
              routeFields={props.routeFields}
              action={createTextBlockAction}
              buttonLabel="Add text block"
            />
          )}

          {selectedNewBlockType === "note" && (
            <AddTitledContentBlockForm
              sectionId={props.section.id}
              routeFields={props.routeFields}
              action={createNoteBlockAction}
              buttonLabel="Add note block"
              titlePlaceholder="Study tip"
              contentPlaceholder="Write the note content here..."
              defaultTitle={String(getDefaultBlockData("note").title ?? "")}
              defaultContent={String(getDefaultBlockData("note").content ?? "")}
            />
          )}

          {selectedNewBlockType === "callout" && (
            <AddTitledContentBlockForm
              sectionId={props.section.id}
              routeFields={props.routeFields}
              action={createCalloutBlockAction}
              buttonLabel="Add callout block"
              titlePlaceholder="Optional title"
              contentPlaceholder="Important information or reminder..."
              defaultTitle={String(getDefaultBlockData("callout").title ?? "")}
              defaultContent={String(getDefaultBlockData("callout").content ?? "")}
            />
          )}

          {selectedNewBlockType === "exam-tip" && (
            <AddTitledContentBlockForm
              sectionId={props.section.id}
              routeFields={props.routeFields}
              action={createExamTipBlockAction}
              buttonLabel="Add exam tip block"
              titlePlaceholder="Optional title"
              contentPlaceholder="Advice for exam success..."
              defaultTitle={String(getDefaultBlockData("exam-tip").title ?? "")}
              defaultContent={String(getDefaultBlockData("exam-tip").content ?? "")}
            />
          )}

          {selectedNewBlockType === "vocabulary" && (
            <AddVocabularyBlockForm
              sectionId={props.section.id}
              routeFields={props.routeFields}
            />
          )}

          {selectedNewBlockType === "image" && (
            <AddImageBlockForm
              sectionId={props.section.id}
              routeFields={props.routeFields}
            />
          )}

          {selectedNewBlockType === "audio" && (
            <AddAudioBlockForm
              sectionId={props.section.id}
              routeFields={props.routeFields}
            />
          )}

          {selectedNewBlockType === "question-set" && (
            <AddSlugBlockForm
              sectionId={props.section.id}
              routeFields={props.routeFields}
              action={createQuestionSetBlockAction}
              buttonLabel="Add question-set block"
              slugFieldName="questionSetSlug"
              slugPlaceholder="question-set-slug"
            />
          )}

          {selectedNewBlockType === "vocabulary-set" && (
            <AddVocabularySetBlockForm
              sectionId={props.section.id}
              routeFields={props.routeFields}
              vocabularySetOptions={props.vocabularySetOptions}
            />
          )}
        </div>
      )}
    </div>
  );
}

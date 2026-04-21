"use client";

import { useMemo, useState } from "react";
import {
  updateAudioBlockAction,
  updateCalloutBlockAction,
  updateExamTipBlockAction,
  updateHeaderBlockAction,
  updateImageBlockAction,
  updateNoteBlockAction,
  updateQuestionSetBlockAction,
  updateSubheaderBlockAction,
  updateTextBlockAction,
  updateVocabularyBlockAction,
  updateVocabularySetBlockAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import type {
  LessonBuilderVocabularySetOption,
  RouteFields,
} from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  BuilderHiddenFields,
  PendingStatusText,
  PendingSubmitButton,
} from "@/components/admin/lesson-builder/lesson-builder-ui";

function stringifyVocabularyItems(items: unknown) {
  if (!Array.isArray(items)) return "";

  return items
    .map((item) => {
      if (!item || typeof item !== "object") return "";
      const record = item as Record<string, unknown>;
      const russian = typeof record.russian === "string" ? record.russian : "";
      const english = typeof record.english === "string" ? record.english : "";
      return russian && english ? `${russian} | ${english}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function TextLikeEditor(props: {
  blockId: string;
  routeFields: RouteFields;
  defaultValue: string;
  action: (formData: FormData) => void | Promise<void>;
  label: string;
}) {
  return (
    <form action={props.action} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />
      <textarea
        name="content"
        required
        rows={3}
        defaultValue={props.defaultValue}
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel={`Save ${props.label}`}
          pendingLabel="Saving..."
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
        />
        <PendingStatusText pendingText="Updating block..." />
      </div>
    </form>
  );
}

function TitledContentEditor(props: {
  blockId: string;
  routeFields: RouteFields;
  defaultTitle: string;
  defaultContent: string;
  action: (formData: FormData) => void | Promise<void>;
  label: string;
  titleRequired?: boolean;
}) {
  return (
    <form action={props.action} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />
      <input
        name="title"
        required={props.titleRequired ?? false}
        defaultValue={props.defaultTitle}
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <textarea
        name="content"
        required
        rows={4}
        defaultValue={props.defaultContent}
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel={`Save ${props.label}`}
          pendingLabel="Saving..."
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
        />
        <PendingStatusText pendingText="Updating block..." />
      </div>
    </form>
  );
}

function SlugBlockEditor(props: {
  blockId: string;
  routeFields: RouteFields;
  defaultTitle: string;
  defaultSlug: string;
  slugFieldName: "questionSetSlug" | "vocabularySetSlug";
  action: (formData: FormData) => void | Promise<void>;
  label: string;
}) {
  return (
    <form action={props.action} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />
      <input
        name="title"
        defaultValue={props.defaultTitle}
        placeholder="Optional heading"
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <input
        name={props.slugFieldName}
        required
        defaultValue={props.defaultSlug}
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel={`Save ${props.label}`}
          pendingLabel="Saving..."
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
        />
        <PendingStatusText pendingText="Updating linked block..." />
      </div>
    </form>
  );
}

function ImageBlockEditor(props: {
  blockId: string;
  routeFields: RouteFields;
  defaultSrc: string;
  defaultAlt: string;
  defaultCaption: string;
}) {
  return (
    <form action={updateImageBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />
      <input
        name="src"
        required
        defaultValue={props.defaultSrc}
        placeholder="https://..."
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <input
        name="alt"
        defaultValue={props.defaultAlt}
        placeholder="Alt text"
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <input
        name="caption"
        defaultValue={props.defaultCaption}
        placeholder="Optional caption"
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Save image block"
          pendingLabel="Saving image block..."
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
        />
        <PendingStatusText pendingText="Updating image block..." />
      </div>
    </form>
  );
}

function AudioBlockEditor(props: {
  blockId: string;
  routeFields: RouteFields;
  defaultTitle: string;
  defaultSrc: string;
  defaultCaption: string;
  defaultAutoPlay: boolean;
}) {
  return (
    <form action={updateAudioBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />
      <input
        name="title"
        defaultValue={props.defaultTitle}
        placeholder="Optional title"
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <input
        name="src"
        required
        defaultValue={props.defaultSrc}
        placeholder="https://..."
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <input
        name="caption"
        defaultValue={props.defaultCaption}
        placeholder="Optional caption"
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="autoPlay"
          value="true"
          defaultChecked={props.defaultAutoPlay}
        />
        Auto play
      </label>
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Save audio block"
          pendingLabel="Saving audio block..."
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
        />
        <PendingStatusText pendingText="Updating audio block..." />
      </div>
    </form>
  );
}

function VocabularyBlockEditor(props: {
  blockId: string;
  routeFields: RouteFields;
  defaultTitle: string;
  defaultItems: unknown;
}) {
  return (
    <form action={updateVocabularyBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />
      <input
        name="title"
        required
        defaultValue={props.defaultTitle}
        placeholder="Key vocabulary"
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <textarea
        name="items"
        required
        rows={6}
        defaultValue={stringifyVocabularyItems(props.defaultItems)}
        placeholder={`дом | house\nшкола | school`}
        className="w-full rounded-xl border px-3 py-2 font-mono text-sm"
      />
      <p className="text-xs text-gray-500">
        Use one item per line in the format: russian | english
      </p>
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Save vocabulary block"
          pendingLabel="Saving vocabulary block..."
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
        />
        <PendingStatusText pendingText="Updating vocabulary block..." />
      </div>
    </form>
  );
}

function VocabularySetBlockEditor(props: {
  blockId: string;
  routeFields: RouteFields;
  defaultTitle: string;
  defaultSlug: string;
  vocabularySetOptions: LessonBuilderVocabularySetOption[];
}) {
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
      <div className="space-y-2 rounded-xl border border-dashed px-4 py-4 text-sm text-gray-500">
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
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />

      <select
        name="vocabularySetSlug"
        required
        value={selectedValue}
        onChange={(event) => setSelectedValue(event.target.value)}
        className="w-full rounded-xl border px-3 py-2 text-sm"
      >
        {!hasMatchingOption && props.defaultSlug ? (
          <option value={`__missing__:${props.defaultSlug}`}>
            Missing set · {props.defaultSlug}
          </option>
        ) : null}

        {props.vocabularySetOptions.map((option) => (
          <option key={option.id} value={option.slug}>
            {option.title} · {option.slug}
            {option.isPublished ? "" : " · draft"}
          </option>
        ))}
      </select>

      {!hasMatchingOption && props.defaultSlug ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
          The currently linked vocabulary set slug no longer matches an available library
          option. Choose a new set before saving.
        </div>
      ) : null}

      {selectedVocabularySet ? (
        <div className="rounded-xl border bg-gray-50 px-3 py-3 text-sm">
          <div className="font-medium text-gray-900">{selectedVocabularySet.title}</div>
          <div className="mt-1 text-xs text-gray-500">
            Slug: {selectedVocabularySet.slug}
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="rounded-full border bg-white px-2 py-1">
              {selectedVocabularySet.isPublished ? "Published" : "Draft"}
            </span>
            <span className="rounded-full border bg-white px-2 py-1">
              Tier: {selectedVocabularySet.tier}
            </span>
            <span className="rounded-full border bg-white px-2 py-1">
              Mode: {selectedVocabularySet.listMode}
            </span>
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Save vocabulary-set block"
          pendingLabel="Saving vocabulary-set block..."
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
        />
        <PendingStatusText pendingText="Updating linked vocabulary set..." />
      </div>
    </form>
  );
}

export function BlockEditPanel(props: {
  block: {
    id: string;
    block_type: string;
    data: Record<string, unknown>;
  };
  routeFields: RouteFields;
  vocabularySetOptions: LessonBuilderVocabularySetOption[];
}) {
  switch (props.block.block_type) {
    case "header":
      return (
        <TextLikeEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultValue={
            typeof props.block.data.content === "string" ? props.block.data.content : ""
          }
          action={updateHeaderBlockAction}
          label="header block"
        />
      );

    case "subheader":
      return (
        <TextLikeEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultValue={
            typeof props.block.data.content === "string" ? props.block.data.content : ""
          }
          action={updateSubheaderBlockAction}
          label="subheader block"
        />
      );

    case "text":
      return (
        <TextLikeEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultValue={
            typeof props.block.data.content === "string" ? props.block.data.content : ""
          }
          action={updateTextBlockAction}
          label="text block"
        />
      );

    case "note":
      return (
        <TitledContentEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={
            typeof props.block.data.title === "string" ? props.block.data.title : ""
          }
          defaultContent={
            typeof props.block.data.content === "string" ? props.block.data.content : ""
          }
          action={updateNoteBlockAction}
          label="note block"
          titleRequired
        />
      );

    case "callout":
      return (
        <TitledContentEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={
            typeof props.block.data.title === "string" ? props.block.data.title : ""
          }
          defaultContent={
            typeof props.block.data.content === "string" ? props.block.data.content : ""
          }
          action={updateCalloutBlockAction}
          label="callout block"
        />
      );

    case "exam-tip":
      return (
        <TitledContentEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={
            typeof props.block.data.title === "string" ? props.block.data.title : ""
          }
          defaultContent={
            typeof props.block.data.content === "string" ? props.block.data.content : ""
          }
          action={updateExamTipBlockAction}
          label="exam tip block"
        />
      );

    case "image":
      return (
        <ImageBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultSrc={
            typeof props.block.data.src === "string" ? props.block.data.src : ""
          }
          defaultAlt={
            typeof props.block.data.alt === "string" ? props.block.data.alt : ""
          }
          defaultCaption={
            typeof props.block.data.caption === "string" ? props.block.data.caption : ""
          }
        />
      );

    case "audio":
      return (
        <AudioBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={
            typeof props.block.data.title === "string" ? props.block.data.title : ""
          }
          defaultSrc={
            typeof props.block.data.src === "string" ? props.block.data.src : ""
          }
          defaultCaption={
            typeof props.block.data.caption === "string" ? props.block.data.caption : ""
          }
          defaultAutoPlay={
            typeof props.block.data.autoPlay === "boolean"
              ? props.block.data.autoPlay
              : false
          }
        />
      );

    case "vocabulary":
      return (
        <VocabularyBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={
            typeof props.block.data.title === "string" ? props.block.data.title : ""
          }
          defaultItems={props.block.data.items}
        />
      );

    case "question-set":
      return (
        <SlugBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={
            typeof props.block.data.title === "string" ? props.block.data.title : ""
          }
          defaultSlug={
            typeof props.block.data.questionSetSlug === "string"
              ? props.block.data.questionSetSlug
              : ""
          }
          slugFieldName="questionSetSlug"
          action={updateQuestionSetBlockAction}
          label="question-set block"
        />
      );

    case "vocabulary-set":
      return (
        <VocabularySetBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={
            typeof props.block.data.title === "string" ? props.block.data.title : ""
          }
          defaultSlug={
            typeof props.block.data.vocabularySetSlug === "string"
              ? props.block.data.vocabularySetSlug
              : ""
          }
          vocabularySetOptions={props.vocabularySetOptions}
        />
      );

    case "divider":
      return (
        <div className="text-sm text-gray-500">Divider blocks do not need editing.</div>
      );

    default:
      return (
        <div className="text-sm text-gray-500">
          Editing is not supported yet for this block type.
        </div>
      );
  }
}

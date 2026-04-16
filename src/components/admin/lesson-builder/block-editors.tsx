"use client";

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
import type { RouteFields } from "@/components/admin/lesson-builder/lesson-builder-types";
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

export function BlockEditPanel(props: {
  block: {
    id: string;
    block_type: string;
    data: Record<string, unknown>;
  };
  routeFields: RouteFields;
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
        <SlugBlockEditor
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
          slugFieldName="vocabularySetSlug"
          action={updateVocabularySetBlockAction}
          label="vocabulary-set block"
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

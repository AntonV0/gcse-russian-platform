"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { lessonBlockPresets } from "@/lib/lesson-block-presets";
import { getDefaultBlockData } from "@/lib/lesson-blocks";
import {
  insertBlockPresetAction,
  insertLessonTemplateAction,
  insertSectionTemplateAction,
} from "@/app/actions/admin-lesson-builder-actions";
import { lessonSectionTemplates } from "@/lib/lesson-section-templates";
import { lessonTemplates } from "@/lib/lesson-templates";
import {
  createAudioBlockAction,
  createCalloutBlockAction,
  createDividerBlockAction,
  createExamTipBlockAction,
  createHeaderBlockAction,
  createImageBlockAction,
  createNoteBlockAction,
  createQuestionSetBlockAction,
  createSectionAction,
  createSubheaderBlockAction,
  createTextBlockAction,
  createVocabularyBlockAction,
  createVocabularySetBlockAction,
  deleteBlockAction,
  deleteSectionAction,
  duplicateBlockAction,
  duplicateSectionAction,
  moveBlockAction,
  moveBlockToSectionAction,
  moveSectionAction,
  reorderBlocksAction,
  reorderSectionsAction,
  toggleBlockPublishedAction,
  toggleSectionPublishedAction,
  updateAudioBlockAction,
  updateCalloutBlockAction,
  updateExamTipBlockAction,
  updateHeaderBlockAction,
  updateImageBlockAction,
  updateNoteBlockAction,
  updateQuestionSetBlockAction,
  updateSectionAction,
  updateSubheaderBlockAction,
  updateTextBlockAction,
  updateVocabularyBlockAction,
  updateVocabularySetBlockAction,
} from "@/app/actions/admin-lesson-builder-actions";
import {
  getLessonBlockAccentClass,
  getLessonBlockGroupLabel,
  getLessonBlockLabel,
  getLessonBlockPreview,
} from "@/lib/lesson-blocks";

type AdminLessonBuilderProps = {
  lessonId: string;
  courseId: string;
  variantId: string;
  moduleId: string;
  lessonSlug: string;
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  sections: {
    id: string;
    title: string;
    description?: string | null;
    section_kind: string;
    position: number;
    is_published: boolean;
    blocks: {
      id: string;
      block_type: string;
      position: number;
      is_published: boolean;
      data: Record<string, unknown>;
    }[];
  }[];
};

type RouteFields = {
  courseId: string;
  variantId: string;
  moduleId: string;
  lessonId: string;
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
};

type LessonSection = AdminLessonBuilderProps["sections"][number];
type LessonBlock = LessonSection["blocks"][number];

type NewBlockType =
  | "header"
  | "subheader"
  | "divider"
  | "text"
  | "note"
  | "callout"
  | "exam-tip"
  | "vocabulary"
  | "image"
  | "audio"
  | "question-set"
  | "vocabulary-set";

type DragSectionState = {
  sectionId: string;
} | null;

type DragBlockState = {
  blockId: string;
} | null;

type DraggedBlockContext = {
  blockId: string;
  sourceSectionId: string;
} | null;

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

function getSectionCounts(sections: LessonSection[]) {
  let publishedSections = 0;
  let totalBlocks = 0;
  let publishedBlocks = 0;

  for (const section of sections) {
    if (section.is_published) publishedSections += 1;
    totalBlocks += section.blocks.length;

    for (const block of section.blocks) {
      if (block.is_published) publishedBlocks += 1;
    }
  }

  return { publishedSections, totalBlocks, publishedBlocks };
}

function BuilderHiddenFields(props: RouteFields) {
  return (
    <>
      <input type="hidden" name="courseId" value={props.courseId} />
      <input type="hidden" name="variantId" value={props.variantId} />
      <input type="hidden" name="moduleId" value={props.moduleId} />
      <input type="hidden" name="lessonId" value={props.lessonId} />
      <input type="hidden" name="courseSlug" value={props.courseSlug} />
      <input type="hidden" name="variantSlug" value={props.variantSlug} />
      <input type="hidden" name="moduleSlug" value={props.moduleSlug} />
      <input type="hidden" name="lessonSlug" value={props.lessonSlug} />
    </>
  );
}

function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "muted" | "warning";
}) {
  const classes =
    tone === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : tone === "muted"
          ? "border-gray-200 bg-gray-50 text-gray-600"
          : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${classes}`}>
      {children}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-4 py-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {description ? <p className="mt-1 text-sm text-gray-600">{description}</p> : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function ConfirmSubmitButton({
  children,
  confirmMessage,
  className,
}: {
  children: React.ReactNode;
  confirmMessage: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        const confirmed = window.confirm(confirmMessage);
        if (!confirmed) event.preventDefault();
      }}
      className={className}
    >
      {children}
    </button>
  );
}

function DragHandle({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "active";
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border px-2 py-1 text-[11px] ${
        tone === "active"
          ? "border-blue-300 bg-blue-50 text-blue-700"
          : "border-gray-200 bg-gray-50 text-gray-500"
      }`}
      aria-hidden="true"
    >
      <span className="tracking-tight">⋮⋮</span>
      <span>{label}</span>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  isActive = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm transition ${
        isActive ? "border-black bg-black text-white" : "bg-white hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function PendingSubmitButton({
  idleLabel,
  pendingLabel,
  className,
}: {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}

function PendingStatusText({
  idleText,
  pendingText,
}: {
  idleText?: string;
  pendingText: string;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="text-xs text-gray-500">
      {pending ? pendingText : (idleText ?? "")}
    </div>
  );
}

function CompactDisclosure({
  title,
  description,
  children,
  defaultOpen = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="rounded-2xl border bg-white shadow-sm [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="cursor-pointer select-none px-4 py-4 hover:bg-gray-50">
        <div className="font-semibold text-gray-900">{title}</div>
        {description ? (
          <div className="mt-1 text-sm text-gray-600">{description}</div>
        ) : null}
      </summary>
      <div className="border-t p-4">{children}</div>
    </details>
  );
}

function MiniStatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
      <span className="font-medium">{value}</span>
      <span>{label}</span>
    </span>
  );
}

function usePersistentBoolean(key: string, defaultValue: boolean) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    if (stored === "true") setValue(true);
    else if (stored === "false") setValue(false);
  }, [key]);

  useEffect(() => {
    window.localStorage.setItem(key, String(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function getLessonBuilderStorageKey(lessonId: string, suffix: string) {
  return `lesson-builder:${lessonId}:${suffix}`;
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
        <PendingStatusText pendingText="Updating block..." />
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

function BlockEditPanel(props: {
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

function AddSimpleTextBlockForm(props: {
  placeholder: string;
  defaultValue?: string;
  sectionId: string;
  routeFields: RouteFields;
  action: (formData: FormData) => void | Promise<void>;
  buttonLabel: string;
}) {
  return (
    <form action={props.action} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />
      <textarea
        name="content"
        required
        rows={3}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel={props.buttonLabel}
          pendingLabel="Adding block..."
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
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
    <form action={props.action} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />
      <input
        name="title"
        placeholder={props.titlePlaceholder}
        defaultValue={props.defaultTitle}
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <textarea
        name="content"
        required
        rows={4}
        placeholder={props.contentPlaceholder}
        defaultValue={props.defaultContent}
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel={props.buttonLabel}
          pendingLabel="Adding block..."
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
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
    <form action={props.action} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />
      <input
        name="title"
        placeholder="Optional heading"
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <input
        name={props.slugFieldName}
        required
        placeholder={props.slugPlaceholder}
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel={props.buttonLabel}
          pendingLabel="Adding block..."
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
        />
        <PendingStatusText pendingText="Saving linked practice block..." />
      </div>
    </form>
  );
}

function AddImageBlockForm(props: { sectionId: string; routeFields: RouteFields }) {
  return (
    <form action={createImageBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />
      <input
        name="src"
        required
        placeholder="https://..."
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <input
        name="alt"
        placeholder="Alt text"
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <input
        name="caption"
        placeholder="Optional caption"
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Add image block"
          pendingLabel="Adding image block..."
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
        />
        <PendingStatusText pendingText="Saving image block..." />
      </div>
    </form>
  );
}

function AddAudioBlockForm(props: { sectionId: string; routeFields: RouteFields }) {
  return (
    <form action={createAudioBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />
      <input
        name="title"
        placeholder="Optional title"
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <input
        name="src"
        required
        placeholder="https://..."
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <input
        name="caption"
        placeholder="Optional caption"
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="autoPlay" value="true" />
        Auto play
      </label>
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Add audio block"
          pendingLabel="Adding audio block..."
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
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
    <form action={createVocabularyBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />
      <input
        name="title"
        required
        placeholder="Key vocabulary"
        defaultValue={defaults.title ?? ""}
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
      <textarea
        name="items"
        required
        rows={6}
        defaultValue={(defaults.items ?? [])
          .map((item) => `${item.russian} | ${item.english}`)
          .join("\n")}
        placeholder={`дом | house\nшкола | school`}
        className="w-full rounded-xl border px-3 py-2 font-mono text-sm"
      />
      <p className="text-xs text-gray-500">
        Use one item per line in the format: russian | english
      </p>
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Add vocabulary block"
          pendingLabel="Adding vocabulary block..."
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
        />
        <PendingStatusText pendingText="Saving vocabulary block..." />
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
      className={`rounded-xl border px-3 py-2 text-sm transition ${
        isSelected ? "border-black bg-black text-white" : "bg-white hover:bg-gray-50"
      }`}
    >
      {props.label}
    </button>
  );
}

function AddBlockComposer(props: { section: LessonSection; routeFields: RouteFields }) {
  const [selectedNewBlockType, setSelectedNewBlockType] = useState<NewBlockType | null>(
    props.section.blocks.length === 0 ? "text" : null
  );

  useEffect(() => {
    setSelectedNewBlockType(props.section.blocks.length === 0 ? "text" : null);
  }, [props.section.id, props.section.blocks.length]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="rounded-2xl border bg-white p-4">
          <div className="mb-3">
            <div className="font-medium text-gray-900">Quick presets</div>
            <div className="text-sm text-gray-500">
              Insert a ready-made starter structure for this section.
            </div>
          </div>

          <div className="grid gap-3">
            {lessonBlockPresets.map((preset) => (
              <form
                key={preset.id}
                action={insertBlockPresetAction}
                className="rounded-xl border p-3"
              >
                <BuilderHiddenFields {...props.routeFields} />
                <input type="hidden" name="sectionId" value={props.section.id} />
                <input type="hidden" name="presetId" value={preset.id} />

                <div className="mb-2">
                  <div className="font-medium text-gray-900">{preset.label}</div>
                  <div className="text-sm text-gray-500">{preset.description}</div>
                </div>

                <div className="space-y-2">
                  <PendingSubmitButton
                    idleLabel="Insert preset"
                    pendingLabel="Inserting preset..."
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                  />
                  <PendingStatusText pendingText="Adding starter blocks to this section..." />
                </div>
              </form>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-medium text-gray-900">Structure</div>
          <div className="flex flex-wrap gap-2">
            <BlockTypeButton
              label="Header"
              value="header"
              selectedValue={selectedNewBlockType}
              onSelect={setSelectedNewBlockType}
            />
            <BlockTypeButton
              label="Subheader"
              value="subheader"
              selectedValue={selectedNewBlockType}
              onSelect={setSelectedNewBlockType}
            />
            <BlockTypeButton
              label="Divider"
              value="divider"
              selectedValue={selectedNewBlockType}
              onSelect={setSelectedNewBlockType}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-gray-900">Teaching</div>
          <div className="flex flex-wrap gap-2">
            <BlockTypeButton
              label="Text"
              value="text"
              selectedValue={selectedNewBlockType}
              onSelect={setSelectedNewBlockType}
            />
            <BlockTypeButton
              label="Note"
              value="note"
              selectedValue={selectedNewBlockType}
              onSelect={setSelectedNewBlockType}
            />
            <BlockTypeButton
              label="Callout"
              value="callout"
              selectedValue={selectedNewBlockType}
              onSelect={setSelectedNewBlockType}
            />
            <BlockTypeButton
              label="Exam tip"
              value="exam-tip"
              selectedValue={selectedNewBlockType}
              onSelect={setSelectedNewBlockType}
            />
            <BlockTypeButton
              label="Vocabulary"
              value="vocabulary"
              selectedValue={selectedNewBlockType}
              onSelect={setSelectedNewBlockType}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-gray-900">Media</div>
          <div className="flex flex-wrap gap-2">
            <BlockTypeButton
              label="Image"
              value="image"
              selectedValue={selectedNewBlockType}
              onSelect={setSelectedNewBlockType}
            />
            <BlockTypeButton
              label="Audio"
              value="audio"
              selectedValue={selectedNewBlockType}
              onSelect={setSelectedNewBlockType}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-gray-900">Practice</div>
          <div className="flex flex-wrap gap-2">
            <BlockTypeButton
              label="Question set"
              value="question-set"
              selectedValue={selectedNewBlockType}
              onSelect={setSelectedNewBlockType}
            />
            <BlockTypeButton
              label="Vocabulary set"
              value="vocabulary-set"
              selectedValue={selectedNewBlockType}
              onSelect={setSelectedNewBlockType}
            />
          </div>
        </div>
      </div>

      {!selectedNewBlockType ? (
        <div className="rounded-xl border border-dashed px-4 py-8 text-sm text-gray-500">
          Choose a block type above to add it to this section.
        </div>
      ) : (
        <div className="rounded-2xl border bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="font-medium text-gray-900">
                New {getLessonBlockLabel(selectedNewBlockType)}
              </div>
              <div className="text-sm text-gray-500">
                Fill in the details for this new block.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedNewBlockType(null)}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-white"
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
              <button
                type="submit"
                className="rounded-lg border px-3 py-2 text-sm hover:bg-white"
              >
                Add divider block
              </button>
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
            <AddSlugBlockForm
              sectionId={props.section.id}
              routeFields={props.routeFields}
              action={createVocabularySetBlockAction}
              buttonLabel="Add vocabulary-set block"
              slugFieldName="vocabularySetSlug"
              slugPlaceholder="vocabulary-set-slug"
            />
          )}
        </div>
      )}
    </div>
  );
}

function LessonSectionSidebar(props: {
  sections: LessonSection[];
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  routeFields: RouteFields;
  sectionSearch: string;
  onSectionSearchChange: (value: string) => void;
  draggedBlockContext: {
    blockId: string;
    sourceSectionId: string;
  } | null;
  onBlockDropComplete: () => void;
}) {
  const normalizedQuery = props.sectionSearch.trim().toLowerCase();
  const [dragSection, setDragSection] = useState<DragSectionState>(null);
  const [dropTargetSectionId, setDropTargetSectionId] = useState<string | null>(null);
  const [blockDropTargetSectionId, setBlockDropTargetSectionId] = useState<string | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const filteredSections = props.sections.filter((section) => {
    if (!normalizedQuery) return true;

    return (
      section.title.toLowerCase().includes(normalizedQuery) ||
      section.section_kind.toLowerCase().includes(normalizedQuery) ||
      String(section.position).includes(normalizedQuery)
    );
  });

  useEffect(() => {
    if (!props.selectedSectionId) return;

    const element = document.getElementById(`sidebar-section-${props.selectedSectionId}`);
    element?.scrollIntoView({ block: "nearest" });
  }, [props.selectedSectionId]);

  function submitSectionOrder(sourceSectionId: string, targetSectionId: string) {
    if (sourceSectionId === targetSectionId) return;

    const reordered = [...props.sections];
    const sourceIndex = reordered.findIndex((section) => section.id === sourceSectionId);
    const targetIndex = reordered.findIndex((section) => section.id === targetSectionId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const formData = new FormData();
    formData.set("courseId", props.routeFields.courseId);
    formData.set("variantId", props.routeFields.variantId);
    formData.set("moduleId", props.routeFields.moduleId);
    formData.set("lessonId", props.routeFields.lessonId);
    formData.set("courseSlug", props.routeFields.courseSlug);
    formData.set("variantSlug", props.routeFields.variantSlug);
    formData.set("moduleSlug", props.routeFields.moduleSlug);
    formData.set("lessonSlug", props.routeFields.lessonSlug);
    formData.set("orderedSectionIds", reordered.map((section) => section.id).join(","));

    startTransition(async () => {
      await reorderSectionsAction(formData);
    });
  }

  function submitBlockMove(targetSectionId: string) {
    if (!props.draggedBlockContext) return;
    if (props.draggedBlockContext.sourceSectionId === targetSectionId) return;

    const formData = new FormData();
    formData.set("courseId", props.routeFields.courseId);
    formData.set("variantId", props.routeFields.variantId);
    formData.set("moduleId", props.routeFields.moduleId);
    formData.set("lessonId", props.routeFields.lessonId);
    formData.set("courseSlug", props.routeFields.courseSlug);
    formData.set("variantSlug", props.routeFields.variantSlug);
    formData.set("moduleSlug", props.routeFields.moduleSlug);
    formData.set("lessonSlug", props.routeFields.lessonSlug);
    formData.set("blockId", props.draggedBlockContext.blockId);
    formData.set("sourceSectionId", props.draggedBlockContext.sourceSectionId);
    formData.set("targetSectionId", targetSectionId);

    startTransition(async () => {
      await moveBlockToSectionAction(formData);
      props.onBlockDropComplete();
    });
  }

  return (
    <div className="space-y-4">
      <Panel title="Sections" description="Select a section to focus the editor.">
        <div className="space-y-3">
          <div className="space-y-2">
            <input
              value={props.sectionSearch}
              onChange={(event) => props.onSectionSearchChange(event.target.value)}
              placeholder="Search sections..."
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />

            <div className="text-xs text-gray-500">
              Showing {filteredSections.length} of {props.sections.length} section
              {props.sections.length === 1 ? "" : "s"}
              {isPending ? " · Saving..." : ""}
            </div>
          </div>

          {props.sections.length === 0 ? (
            <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-gray-500">
              No sections yet.
            </div>
          ) : filteredSections.length === 0 ? (
            <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-gray-500">
              No sections match your search.
            </div>
          ) : (
            filteredSections.map((section) => {
              const actualIndex = props.sections.findIndex(
                (item) => item.id === section.id
              );
              const isSelected = section.id === props.selectedSectionId;
              const isSectionDropTarget = dropTargetSectionId === section.id;
              const isBlockDropTarget = blockDropTargetSectionId === section.id;
              const canAcceptDraggedBlock =
                !!props.draggedBlockContext &&
                props.draggedBlockContext.sourceSectionId !== section.id;

              return (
                <div
                  key={section.id}
                  id={`sidebar-section-${section.id}`}
                  draggable={!isPending && !props.draggedBlockContext}
                  onDragStart={() => {
                    if (!props.draggedBlockContext) {
                      setDragSection({ sectionId: section.id });
                    }
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();

                    if (props.draggedBlockContext) {
                      if (canAcceptDraggedBlock) {
                        setBlockDropTargetSectionId(section.id);
                      }
                    } else {
                      setDropTargetSectionId(section.id);
                    }
                  }}
                  onDragLeave={() => {
                    if (dropTargetSectionId === section.id) {
                      setDropTargetSectionId(null);
                    }
                    if (blockDropTargetSectionId === section.id) {
                      setBlockDropTargetSectionId(null);
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault();

                    if (props.draggedBlockContext) {
                      if (canAcceptDraggedBlock) {
                        submitBlockMove(section.id);
                      }
                    } else if (dragSection?.sectionId) {
                      submitSectionOrder(dragSection.sectionId, section.id);
                    }

                    setDragSection(null);
                    setDropTargetSectionId(null);
                    setBlockDropTargetSectionId(null);
                  }}
                  onDragEnd={() => {
                    setDragSection(null);
                    setDropTargetSectionId(null);
                    setBlockDropTargetSectionId(null);
                  }}
                  className={`rounded-xl border transition-shadow transition-colors ${
                    isSelected ? "border-black bg-black text-white" : "bg-white"
                  } ${isSectionDropTarget ? "ring-2 ring-blue-300 shadow-md" : ""} ${
                    isBlockDropTarget ? "ring-2 ring-green-300 shadow-md" : ""
                  } ${isPending ? "opacity-70" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => props.onSelectSection(section.id)}
                    className="w-full px-4 py-3 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="mb-2">
                          <DragHandle
                            label={
                              props.draggedBlockContext
                                ? "Drop block here"
                                : "Drag section"
                            }
                            tone={
                              isBlockDropTarget || isSectionDropTarget
                                ? "active"
                                : "default"
                            }
                          />
                        </div>

                        <div className="font-medium">
                          {section.position}. {section.title}
                        </div>
                        <div
                          className={`mt-1 text-xs ${
                            isSelected ? "text-gray-200" : "text-gray-500"
                          }`}
                        >
                          {section.section_kind}
                        </div>
                        <div
                          className={`mt-2 flex flex-wrap gap-2 text-[11px] ${
                            isSelected ? "text-gray-200" : "text-gray-500"
                          }`}
                        >
                          <span className="rounded-full border border-current/20 px-2 py-0.5">
                            {section.blocks.length} block(s)
                          </span>
                          <span className="rounded-full border border-current/20 px-2 py-0.5">
                            {section.blocks.filter((block) => block.is_published).length}{" "}
                            published
                          </span>
                        </div>

                        {isBlockDropTarget ? (
                          <div
                            className={`mt-2 text-xs font-medium ${
                              isSelected ? "text-green-200" : "text-green-700"
                            }`}
                          >
                            Drop block here to move it into this section
                          </div>
                        ) : null}
                      </div>

                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] ${
                          isSelected
                            ? "border-white/20 bg-white/10 text-white"
                            : section.is_published
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {section.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </button>

                  <div
                    className={`border-t px-3 py-2 ${
                      isSelected ? "border-white/10" : "border-gray-200"
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <form action={moveSectionAction}>
                        <BuilderHiddenFields {...props.routeFields} />
                        <input type="hidden" name="sectionId" value={section.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button
                          type="submit"
                          disabled={
                            actualIndex === 0 || isPending || !!props.draggedBlockContext
                          }
                          className={`w-full rounded-lg border px-2 py-2 text-xs disabled:opacity-50 ${
                            isSelected
                              ? "border-white/20 bg-white/5 text-white hover:bg-white/10"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          Move up
                        </button>
                      </form>

                      <form action={moveSectionAction}>
                        <BuilderHiddenFields {...props.routeFields} />
                        <input type="hidden" name="sectionId" value={section.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button
                          type="submit"
                          disabled={
                            actualIndex === props.sections.length - 1 ||
                            isPending ||
                            !!props.draggedBlockContext
                          }
                          className={`w-full rounded-lg border px-2 py-2 text-xs disabled:opacity-50 ${
                            isSelected
                              ? "border-white/20 bg-white/5 text-white hover:bg-white/10"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          Move down
                        </button>
                      </form>

                      <form action={duplicateSectionAction}>
                        <BuilderHiddenFields {...props.routeFields} />
                        <input type="hidden" name="sectionId" value={section.id} />
                        <button
                          type="submit"
                          disabled={isPending || !!props.draggedBlockContext}
                          className={`w-full rounded-lg border px-2 py-2 text-xs ${
                            isSelected
                              ? "border-white/20 bg-white/5 text-white hover:bg-white/10"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          Duplicate
                        </button>
                      </form>

                      <form action={toggleSectionPublishedAction}>
                        <BuilderHiddenFields {...props.routeFields} />
                        <input type="hidden" name="sectionId" value={section.id} />
                        <input
                          type="hidden"
                          name="nextState"
                          value={section.is_published ? "draft" : "published"}
                        />
                        <button
                          type="submit"
                          disabled={isPending || !!props.draggedBlockContext}
                          className={`w-full rounded-lg border px-2 py-2 text-xs ${
                            isSelected
                              ? "border-white/20 bg-white/5 text-white hover:bg-white/10"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {section.is_published ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Panel>

      <Panel
        title="Section templates"
        description="Insert a ready-made section with starter blocks."
      >
        <div className="grid gap-3">
          {lessonSectionTemplates.map((template) => (
            <form
              key={template.id}
              action={insertSectionTemplateAction}
              className="rounded-xl border p-3"
            >
              <BuilderHiddenFields {...props.routeFields} />
              <input type="hidden" name="templateId" value={template.id} />

              <div className="mb-2">
                <div className="font-medium text-gray-900">{template.label}</div>
                <div className="text-sm text-gray-500">{template.description}</div>
              </div>

              <div className="space-y-2">
                <PendingSubmitButton
                  idleLabel="Insert section template"
                  pendingLabel="Inserting section template..."
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                />
                <PendingStatusText pendingText="Creating the section and starter blocks..." />
              </div>
            </form>
          ))}
        </div>
      </Panel>

      <Panel title="Add section" description="Create a section first, then add blocks.">
        <form action={createSectionAction} className="space-y-3">
          <BuilderHiddenFields {...props.routeFields} />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Section title
            </label>
            <input
              name="title"
              required
              placeholder="Introduction"
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Description
            </label>
            <input
              name="description"
              placeholder="Optional short description"
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Section kind
            </label>
            <select
              name="sectionKind"
              defaultValue="content"
              className="w-full rounded-xl border px-3 py-2 text-sm"
            >
              <option value="intro">intro</option>
              <option value="content">content</option>
              <option value="grammar">grammar</option>
              <option value="practice">practice</option>
              <option value="reading_practice">reading_practice</option>
              <option value="writing_practice">writing_practice</option>
              <option value="speaking_practice">speaking_practice</option>
              <option value="listening_practice">listening_practice</option>
              <option value="summary">summary</option>
            </select>
          </div>

          <div className="space-y-2">
            <PendingSubmitButton
              idleLabel="Add section"
              pendingLabel="Adding section..."
              className="w-full rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            />
            <PendingStatusText pendingText="Creating section..." />
          </div>
        </form>
      </Panel>
    </div>
  );
}

function LessonInspectorPanel(props: {
  section: LessonSection | null;
  block: LessonBlock | null;
  sections: LessonSection[];
  routeFields: RouteFields;
  sectionIndex: number;
  totalSections: number;
  blockIndex: number;
}) {
  if (!props.section) {
    return (
      <Panel title="Inspector" description="Select a section to begin editing.">
        <div className="rounded-xl border border-dashed bg-gray-50 px-4 py-8 text-sm text-gray-500">
          No section selected yet.
        </div>
      </Panel>
    );
  }

  if (props.block) {
    return (
      <Panel title="Block inspector" description="Edit the selected block.">
        <div className="space-y-4">
          <div className="rounded-xl border bg-gray-50 p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${getLessonBlockAccentClass(
                  props.block.block_type
                )}`}
              >
                {getLessonBlockGroupLabel(props.block.block_type)}
              </span>

              <span className="font-medium text-gray-900">
                {getLessonBlockLabel(props.block.block_type)}
              </span>

              <Badge tone={props.block.is_published ? "success" : "warning"}>
                {props.block.is_published ? "Published" : "Draft"}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Position:</span> {props.block.position}
              </div>
              <div className="rounded-lg bg-white px-3 py-2 text-gray-600 break-words">
                {getLessonBlockPreview(props.block)}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-gray-50 p-3">
            <BlockEditPanel block={props.block} routeFields={props.routeFields} />
          </div>

          <div className="rounded-xl border bg-white p-3">
            <div className="mb-2 text-sm font-medium text-gray-900">
              Move to another section
            </div>

            <form action={moveBlockToSectionAction} className="space-y-2">
              <BuilderHiddenFields {...props.routeFields} />
              <input type="hidden" name="blockId" value={props.block.id} />
              <input type="hidden" name="sourceSectionId" value={props.section.id} />

              <select
                name="targetSectionId"
                defaultValue=""
                className="w-full rounded-xl border px-3 py-2 text-sm"
              >
                <option value="" disabled>
                  Select target section
                </option>
                {props.sections
                  .filter((section) => section.id !== props.section?.id)
                  .map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.position}. {section.title}
                    </option>
                  ))}
              </select>

              <div className="space-y-2">
                <PendingSubmitButton
                  idleLabel="Move block to section"
                  pendingLabel="Moving block..."
                  className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                />
                <PendingStatusText pendingText="Moving block and reordering sections..." />
              </div>
            </form>
          </div>

          <div className="grid gap-2">
            <form action={moveBlockAction}>
              <BuilderHiddenFields {...props.routeFields} />
              <input type="hidden" name="sectionId" value={props.section.id} />
              <input type="hidden" name="blockId" value={props.block.id} />
              <input type="hidden" name="direction" value="up" />
              <button
                type="submit"
                disabled={props.blockIndex === 0}
                className="w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
              >
                Move block up
              </button>
            </form>

            <form action={moveBlockAction}>
              <BuilderHiddenFields {...props.routeFields} />
              <input type="hidden" name="sectionId" value={props.section.id} />
              <input type="hidden" name="blockId" value={props.block.id} />
              <input type="hidden" name="direction" value="down" />
              <button
                type="submit"
                disabled={props.blockIndex === props.section.blocks.length - 1}
                className="w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
              >
                Move block down
              </button>
            </form>

            <form action={duplicateBlockAction}>
              <BuilderHiddenFields {...props.routeFields} />
              <input type="hidden" name="sectionId" value={props.section.id} />
              <input type="hidden" name="blockId" value={props.block.id} />
              <button
                type="submit"
                className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Duplicate block
              </button>
            </form>

            <form action={toggleBlockPublishedAction}>
              <BuilderHiddenFields {...props.routeFields} />
              <input type="hidden" name="blockId" value={props.block.id} />
              <input
                type="hidden"
                name="nextState"
                value={props.block.is_published ? "draft" : "published"}
              />
              <button
                type="submit"
                className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              >
                {props.block.is_published ? "Unpublish block" : "Publish block"}
              </button>
            </form>

            <form action={deleteBlockAction}>
              <BuilderHiddenFields {...props.routeFields} />
              <input type="hidden" name="blockId" value={props.block.id} />
              <ConfirmSubmitButton
                confirmMessage={`Delete this ${getLessonBlockLabel(
                  props.block.block_type
                ).toLowerCase()} block?`}
                className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                Delete block
              </ConfirmSubmitButton>
            </form>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      title="Section inspector"
      description="Quick actions for the selected section."
    >
      <div className="space-y-4">
        <div className="rounded-xl border bg-gray-50 p-4">
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Section:</span> {props.section.title}
            </div>
            <div>
              <span className="font-medium">Kind:</span> {props.section.section_kind}
            </div>
            <div>
              <span className="font-medium">Position:</span> {props.section.position}
            </div>
            <div>
              <span className="font-medium">Status:</span>{" "}
              {props.section.is_published ? "Published" : "Draft"}
            </div>
            <div>
              <span className="font-medium">Blocks:</span> {props.section.blocks.length}
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-dashed bg-white px-4 py-4 text-sm text-gray-500">
          <div>Select a block in the center column to edit its content here.</div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-lg border px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
          >
            Back to top
          </button>
        </div>

        <div className="grid gap-2">
          <form action={moveSectionAction}>
            <BuilderHiddenFields {...props.routeFields} />
            <input type="hidden" name="sectionId" value={props.section.id} />
            <input type="hidden" name="direction" value="up" />
            <button
              type="submit"
              disabled={props.sectionIndex === 0}
              className="w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
            >
              Move section up
            </button>
          </form>

          <form action={moveSectionAction}>
            <BuilderHiddenFields {...props.routeFields} />
            <input type="hidden" name="sectionId" value={props.section.id} />
            <input type="hidden" name="direction" value="down" />
            <button
              type="submit"
              disabled={props.sectionIndex === props.totalSections - 1}
              className="w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
            >
              Move section down
            </button>
          </form>

          <form action={duplicateSectionAction}>
            <BuilderHiddenFields {...props.routeFields} />
            <input type="hidden" name="sectionId" value={props.section.id} />
            <button
              type="submit"
              className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Duplicate section
            </button>
          </form>

          <form action={toggleSectionPublishedAction}>
            <BuilderHiddenFields {...props.routeFields} />
            <input type="hidden" name="sectionId" value={props.section.id} />
            <input
              type="hidden"
              name="nextState"
              value={props.section.is_published ? "draft" : "published"}
            />
            <button
              type="submit"
              className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              {props.section.is_published ? "Unpublish section" : "Publish section"}
            </button>
          </form>

          <form action={deleteSectionAction}>
            <BuilderHiddenFields {...props.routeFields} />
            <input type="hidden" name="sectionId" value={props.section.id} />
            <ConfirmSubmitButton
              confirmMessage={`Delete section "${props.section.title}"? This will remove the section and all blocks inside it.`}
              className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              Delete section
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>
    </Panel>
  );
}

function DraggableBlockList(props: {
  section: LessonSection;
  filteredBlocks: LessonBlock[];
  routeFields: RouteFields;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  onBlockDragStart: (payload: { blockId: string; sourceSectionId: string }) => void;
  onBlockDragEnd: () => void;
}) {
  const [dragBlock, setDragBlock] = useState<DragBlockState>(null);
  const [dropTargetBlockId, setDropTargetBlockId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submitBlockOrder(sourceBlockId: string, targetBlockId: string) {
    if (sourceBlockId === targetBlockId) return;

    const reordered = [...props.section.blocks];
    const sourceIndex = reordered.findIndex((block) => block.id === sourceBlockId);
    const targetIndex = reordered.findIndex((block) => block.id === targetBlockId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const formData = new FormData();
    formData.set("courseId", props.routeFields.courseId);
    formData.set("variantId", props.routeFields.variantId);
    formData.set("moduleId", props.routeFields.moduleId);
    formData.set("lessonId", props.routeFields.lessonId);
    formData.set("courseSlug", props.routeFields.courseSlug);
    formData.set("variantSlug", props.routeFields.variantSlug);
    formData.set("moduleSlug", props.routeFields.moduleSlug);
    formData.set("lessonSlug", props.routeFields.lessonSlug);
    formData.set("sectionId", props.section.id);
    formData.set("orderedBlockIds", reordered.map((block) => block.id).join(","));

    startTransition(async () => {
      await reorderBlocksAction(formData);
    });
  }

  return (
    <div className="space-y-3">
      {isPending ? (
        <div className="rounded-xl border bg-blue-50 px-3 py-2 text-sm text-blue-700">
          Saving block order...
        </div>
      ) : null}

      {props.filteredBlocks.map((block) => {
        const blockIndex = props.section.blocks.findIndex((item) => item.id === block.id);
        const isSelected = block.id === props.selectedBlockId;
        const isDropTarget = dropTargetBlockId === block.id;

        return (
          <div
            key={block.id}
            draggable={!isPending}
            onDragStart={() => {
              setDragBlock({ blockId: block.id });
              props.onBlockDragStart({
                blockId: block.id,
                sourceSectionId: props.section.id,
              });
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDropTargetBlockId(block.id);
            }}
            onDragLeave={() => {
              if (dropTargetBlockId === block.id) {
                setDropTargetBlockId(null);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();

              if (dragBlock?.blockId) {
                submitBlockOrder(dragBlock.blockId, block.id);
              }

              setDragBlock(null);
              setDropTargetBlockId(null);
              props.onBlockDragEnd();
            }}
            onDragEnd={() => {
              setDragBlock(null);
              setDropTargetBlockId(null);
              props.onBlockDragEnd();
            }}
            className={`rounded-xl border transition-shadow transition-colors ${
              isSelected ? "border-black bg-gray-50" : "bg-white"
            } ${isDropTarget ? "ring-2 ring-blue-300 shadow-md" : ""} ${
              isPending ? "opacity-70" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => props.onSelectBlock(isSelected ? null : block.id)}
              className="w-full px-4 py-4 text-left"
            >
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 space-y-2">
                  <DragHandle
                    label="Drag block"
                    tone={isDropTarget ? "active" : "default"}
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${getLessonBlockAccentClass(
                        block.block_type
                      )}`}
                    >
                      {getLessonBlockGroupLabel(block.block_type)}
                    </span>

                    <span className="font-medium text-gray-900">
                      {getLessonBlockLabel(block.block_type)}
                    </span>

                    <Badge tone={block.is_published ? "success" : "warning"}>
                      {block.is_published ? "Published" : "Draft"}
                    </Badge>

                    <Badge tone="muted">Position {block.position}</Badge>

                    {isSelected ? <Badge tone="default">Selected</Badge> : null}
                  </div>

                  <div className="text-sm text-gray-600 line-clamp-2 break-words">
                    {getLessonBlockPreview(block)}
                  </div>
                </div>
              </div>
            </button>

            {isSelected ? (
              <div className="border-t px-3 py-3">
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <form action={moveBlockAction}>
                    <BuilderHiddenFields {...props.routeFields} />
                    <input type="hidden" name="sectionId" value={props.section.id} />
                    <input type="hidden" name="blockId" value={block.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={blockIndex === 0 || isPending}
                      className="w-full rounded-lg border px-2 py-2 text-xs disabled:opacity-50 hover:bg-white"
                    >
                      Move up
                    </button>
                  </form>

                  <form action={moveBlockAction}>
                    <BuilderHiddenFields {...props.routeFields} />
                    <input type="hidden" name="sectionId" value={props.section.id} />
                    <input type="hidden" name="blockId" value={block.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={
                        blockIndex === props.section.blocks.length - 1 || isPending
                      }
                      className="w-full rounded-lg border px-2 py-2 text-xs disabled:opacity-50 hover:bg-white"
                    >
                      Move down
                    </button>
                  </form>

                  <form action={duplicateBlockAction}>
                    <BuilderHiddenFields {...props.routeFields} />
                    <input type="hidden" name="sectionId" value={props.section.id} />
                    <input type="hidden" name="blockId" value={block.id} />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full rounded-lg border px-2 py-2 text-xs hover:bg-white"
                    >
                      Duplicate
                    </button>
                  </form>

                  <form action={toggleBlockPublishedAction}>
                    <BuilderHiddenFields {...props.routeFields} />
                    <input type="hidden" name="blockId" value={block.id} />
                    <input
                      type="hidden"
                      name="nextState"
                      value={block.is_published ? "draft" : "published"}
                    />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full rounded-lg border px-2 py-2 text-xs hover:bg-white"
                    >
                      {block.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function LessonSectionEditor(props: {
  section: LessonSection | null;
  routeFields: RouteFields;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  blockSearch: string;
  onBlockSearchChange: (value: string) => void;
  onJumpToAddBlock: () => void;
  onBlockDragStart: (payload: { blockId: string; sourceSectionId: string }) => void;
  onBlockDragEnd: () => void;
}) {
  if (!props.section) {
    return (
      <Panel
        title="Lesson editor"
        description="Select a section from the left to start editing."
      >
        <div className="space-y-3 rounded-xl border border-dashed px-4 py-10 text-sm text-gray-500">
          <div>No section selected.</div>
          <div>Use the sections panel to choose a section or create a new one.</div>
        </div>
      </Panel>
    );
  }

  const section = props.section;
  const normalizedQuery = props.blockSearch.trim().toLowerCase();

  const filteredBlocks = section.blocks.filter((block) => {
    if (!normalizedQuery) return true;

    const typeLabel = getLessonBlockLabel(block.block_type).toLowerCase();
    const preview = getLessonBlockPreview(block).toLowerCase();
    const groupLabel = getLessonBlockGroupLabel(block.block_type).toLowerCase();

    return (
      typeLabel.includes(normalizedQuery) ||
      preview.includes(normalizedQuery) ||
      groupLabel.includes(normalizedQuery)
    );
  });

  const blockTypeCounts = section.blocks.reduce<Record<string, number>>((acc, block) => {
    acc[block.block_type] = (acc[block.block_type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Panel title={section.title} description="Focused section editing workspace.">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone={section.is_published ? "success" : "warning"}>
              {section.is_published ? "Published" : "Draft"}
            </Badge>
            <Badge tone="muted">{section.section_kind}</Badge>
            <Badge tone="default">{section.blocks.length} block(s)</Badge>
          </div>

          {section.description ? (
            <p className="text-sm text-gray-600">{section.description}</p>
          ) : (
            <p className="text-sm text-gray-400">No section description yet.</p>
          )}

          {section.blocks.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {Object.entries(blockTypeCounts)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([blockType, count]) => (
                  <MiniStatPill
                    key={blockType}
                    label={getLessonBlockLabel(blockType)}
                    value={count}
                  />
                ))}
            </div>
          ) : null}
        </div>
      </Panel>

      <CompactDisclosure
        title="Edit section metadata"
        description="Update section title, description, and section kind."
        defaultOpen={section.blocks.length === 0}
      >
        <form action={updateSectionAction} className="space-y-3">
          <BuilderHiddenFields {...props.routeFields} />
          <input type="hidden" name="sectionId" value={section.id} />

          <input
            name="title"
            required
            defaultValue={section.title}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />

          <input
            name="description"
            defaultValue={section.description ?? ""}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />

          <select
            name="sectionKind"
            defaultValue={section.section_kind}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          >
            <option value="intro">intro</option>
            <option value="content">content</option>
            <option value="grammar">grammar</option>
            <option value="practice">practice</option>
            <option value="reading_practice">reading_practice</option>
            <option value="writing_practice">writing_practice</option>
            <option value="speaking_practice">speaking_practice</option>
            <option value="listening_practice">listening_practice</option>
            <option value="summary">summary</option>
          </select>

          <div className="space-y-2">
            <PendingSubmitButton
              idleLabel="Save section"
              pendingLabel="Saving section..."
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
            />
            <PendingStatusText pendingText="Updating section metadata..." />
          </div>
        </form>
      </CompactDisclosure>

      <Panel title="Blocks" description="Select a block to edit it in the inspector.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-500">
              Showing {filteredBlocks.length} of {section.blocks.length} block
              {section.blocks.length === 1 ? "" : "s"}
            </div>

            <div className="flex gap-2">
              <input
                value={props.blockSearch}
                onChange={(event) => props.onBlockSearchChange(event.target.value)}
                placeholder="Search blocks..."
                className="w-full rounded-xl border px-3 py-2 text-sm sm:w-64"
              />
              <button
                type="button"
                onClick={props.onJumpToAddBlock}
                className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Add block
              </button>
            </div>
          </div>

          <div className="rounded-xl border bg-gray-50 px-3 py-3 text-sm text-gray-600">
            Drag a block to reorder it within this section, or drag it onto a section in
            the left sidebar to move it there.
          </div>

          {section.blocks.length === 0 ? (
            <div className="rounded-xl border border-dashed px-4 py-8 text-sm text-gray-500">
              No blocks in this section yet.
            </div>
          ) : filteredBlocks.length === 0 ? (
            <div className="rounded-xl border border-dashed px-4 py-8 text-sm text-gray-500">
              No blocks match your search.
            </div>
          ) : (
            <DraggableBlockList
              section={section}
              filteredBlocks={filteredBlocks}
              routeFields={props.routeFields}
              selectedBlockId={props.selectedBlockId}
              onSelectBlock={props.onSelectBlock}
              onBlockDragStart={props.onBlockDragStart}
              onBlockDragEnd={props.onBlockDragEnd}
            />
          )}
        </div>
      </Panel>

      <div id="add-block-composer">
        <Panel
          title="Add block"
          description="Choose a block type, then fill in the form."
        >
          <AddBlockComposer section={section} routeFields={props.routeFields} />
        </Panel>
      </div>
    </div>
  );
}

export default function AdminLessonBuilderWorkspace({
  lessonId,
  courseId,
  variantId,
  moduleId,
  lessonSlug,
  courseSlug,
  variantSlug,
  moduleSlug,
  sections,
}: AdminLessonBuilderProps) {
  const routeFields: RouteFields = {
    courseId,
    variantId,
    moduleId,
    lessonId,
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug,
  };

  const { publishedSections, totalBlocks, publishedBlocks } = useMemo(
    () => getSectionCounts(sections),
    [sections]
  );

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [sectionSearch, setSectionSearch] = useState("");
  const [blockSearch, setBlockSearch] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = usePersistentBoolean(
    getLessonBuilderStorageKey(lessonId, "sidebar-open"),
    true
  );
  const [isInspectorOpen, setIsInspectorOpen] = usePersistentBoolean(
    getLessonBuilderStorageKey(lessonId, "inspector-open"),
    true
  );
  const [draggedBlockContext, setDraggedBlockContext] =
    useState<DraggedBlockContext>(null);

  useEffect(() => {
    const storedSectionId = window.localStorage.getItem(
      getLessonBuilderStorageKey(lessonId, "selected-section-id")
    );

    if (storedSectionId && sections.some((section) => section.id === storedSectionId)) {
      setSelectedSectionId(storedSectionId);
      return;
    }

    setSelectedSectionId(sections[0]?.id ?? null);
  }, [lessonId, sections]);

  useEffect(() => {
    if (!selectedSectionId) return;

    window.localStorage.setItem(
      getLessonBuilderStorageKey(lessonId, "selected-section-id"),
      selectedSectionId
    );
  }, [lessonId, selectedSectionId]);

  useEffect(() => {
    if (sections.length === 0) {
      setSelectedSectionId(null);
      setSelectedBlockId(null);
      setSectionSearch("");
      setBlockSearch("");
      return;
    }

    const stillExists = sections.some((section) => section.id === selectedSectionId);

    if (!stillExists) {
      setSelectedSectionId(sections[0].id);
      setSelectedBlockId(null);
      setBlockSearch("");
    }
  }, [sections, selectedSectionId]);

  const selectedSection =
    sections.find((section) => section.id === selectedSectionId) ?? null;

  const selectedBlock =
    selectedSection?.blocks.find((block) => block.id === selectedBlockId) ?? null;

  const sectionIndex = selectedSection
    ? sections.findIndex((section) => section.id === selectedSection.id)
    : -1;

  const blockIndex = selectedBlock
    ? (selectedSection?.blocks.findIndex((block) => block.id === selectedBlock.id) ?? -1)
    : -1;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        <StatCard label="Sections" value={sections.length} />
        <StatCard label="Blocks" value={totalBlocks} />
        <StatCard label="Published sections" value={publishedSections} />
        <StatCard label="Published blocks" value={publishedBlocks} />
      </section>
      <Panel
        title="Lesson templates"
        description="Create several structured sections at once for faster lesson setup."
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {lessonTemplates.map((template) => (
            <form
              key={template.id}
              action={insertLessonTemplateAction}
              className="rounded-xl border p-4"
            >
              <BuilderHiddenFields {...routeFields} />
              <input type="hidden" name="templateId" value={template.id} />

              <div className="mb-2">
                <div className="font-medium text-gray-900">{template.label}</div>
                <div className="text-sm text-gray-500">{template.description}</div>
              </div>

              <div className="mb-3 text-xs text-gray-500">
                {template.sections.length} section
                {template.sections.length === 1 ? "" : "s"}
              </div>

              <div className="space-y-2">
                <PendingSubmitButton
                  idleLabel="Insert lesson template"
                  pendingLabel="Inserting lesson template..."
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                />
                <PendingStatusText pendingText="Creating sections and starter blocks..." />
              </div>
            </form>
          ))}
        </div>
      </Panel>
      <section className="sticky top-4 z-10 rounded-2xl border bg-white/95 p-3 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {selectedSection ? `Editing: ${selectedSection.title}` : "Lesson builder"}
            </div>
            <div className="text-xs text-gray-500">
              {selectedSection
                ? `${selectedSection.blocks.length} block(s)${
                    selectedBlock
                      ? ` · Selected block: ${getLessonBlockLabel(selectedBlock.block_type)}`
                      : ""
                  }`
                : "Select a section to begin."}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <ToolbarButton
              onClick={() => setIsSidebarOpen((value) => !value)}
              isActive={isSidebarOpen}
            >
              {isSidebarOpen ? "Hide sections" : "Show sections"}
            </ToolbarButton>

            <ToolbarButton
              onClick={() => setIsInspectorOpen((value) => !value)}
              isActive={isInspectorOpen}
            >
              {isInspectorOpen ? "Hide inspector" : "Show inspector"}
            </ToolbarButton>

            <ToolbarButton
              onClick={() => {
                setSelectedBlockId(null);
                setBlockSearch("");
              }}
            >
              Clear block selection
            </ToolbarButton>

            <ToolbarButton
              onClick={() => {
                document
                  .getElementById("add-block-composer")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Jump to add block
            </ToolbarButton>
          </div>
        </div>
      </section>

      <section
        className={`grid gap-6 ${
          isSidebarOpen && isInspectorOpen
            ? "xl:grid-cols-[260px_minmax(0,1fr)] 2xl:grid-cols-[260px_minmax(0,1fr)_320px]"
            : isSidebarOpen
              ? "xl:grid-cols-[260px_minmax(0,1fr)]"
              : isInspectorOpen
                ? "2xl:grid-cols-[minmax(0,1fr)_320px]"
                : "grid-cols-1"
        }`}
      >
        {isSidebarOpen ? (
          <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
            <LessonSectionSidebar
              sections={sections}
              selectedSectionId={selectedSectionId}
              onSelectSection={(sectionId) => {
                setSelectedSectionId(sectionId);
                setSelectedBlockId(null);
                setBlockSearch("");
              }}
              routeFields={routeFields}
              sectionSearch={sectionSearch}
              onSectionSearchChange={setSectionSearch}
              draggedBlockContext={draggedBlockContext}
              onBlockDropComplete={() => {
                setDraggedBlockContext(null);
                setSelectedBlockId(null);
              }}
            />
          </aside>
        ) : null}

        <div className="min-w-0">
          <LessonSectionEditor
            section={selectedSection}
            routeFields={routeFields}
            selectedBlockId={selectedBlockId}
            onSelectBlock={(blockId) => {
              setSelectedBlockId(blockId);
              if (blockId) {
                setIsInspectorOpen(true);
              }
            }}
            blockSearch={blockSearch}
            onBlockSearchChange={setBlockSearch}
            onJumpToAddBlock={() => {
              document
                .getElementById("add-block-composer")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            onBlockDragStart={(payload) => {
              setDraggedBlockContext(payload);
            }}
            onBlockDragEnd={() => {
              setDraggedBlockContext(null);
            }}
          />
        </div>

        {isInspectorOpen ? (
          <aside className="space-y-6 2xl:sticky 2xl:top-24 2xl:self-start">
            <LessonInspectorPanel
              section={selectedSection}
              block={selectedBlock}
              sections={sections}
              routeFields={routeFields}
              sectionIndex={sectionIndex}
              totalSections={sections.length}
              blockIndex={blockIndex}
            />

            <Panel title="Authoring notes">
              <div className="grid gap-3 text-sm text-gray-600">
                <div className="rounded-xl border bg-gray-50 p-3">
                  Create the section outline before writing detailed content.
                </div>
                <div className="rounded-xl border bg-gray-50 p-3">
                  Duplicate sections or blocks when lessons follow a repeated structure.
                </div>
                <div className="rounded-xl border bg-gray-50 p-3">
                  Keep copied content as draft until checked on the public lesson page.
                </div>
                <div className="rounded-xl border bg-gray-50 p-3">
                  Select a block to edit it in the inspector.
                </div>
              </div>
            </Panel>
          </aside>
        ) : null}
      </section>
    </div>
  );
}

"use client";

import {
  createCalloutBlockAction,
  createDividerBlockAction,
  createExamTipBlockAction,
  createHeaderBlockAction,
  createNoteBlockAction,
  createQuestionSetBlockAction,
  createSubheaderBlockAction,
  createTextBlockAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import type {
  LessonBuilderVocabularySetOption,
  NewBlockType,
  RouteFields,
} from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  BuilderHiddenFields,
  PendingSubmitButton,
  BUILDER_PRIMARY_BUTTON_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import Button from "@/components/ui/button";
import { getDefaultBlockData, getLessonBlockLabel } from "@/lib/lessons/lesson-blocks";
import { AddAudioBlockForm, AddImageBlockForm } from "./media-block-forms";
import {
  AddSimpleTextBlockForm,
  AddSlugBlockForm,
  AddTitledContentBlockForm,
} from "./text-block-forms";
import {
  AddVocabularyBlockForm,
  AddVocabularySetBlockForm,
} from "./vocabulary-block-forms";

type SelectedBlockFormProps = {
  sectionId: string;
  routeFields: RouteFields;
  selectedNewBlockType: NewBlockType;
  vocabularySetOptions: LessonBuilderVocabularySetOption[];
  onClear: () => void;
};

export function SelectedBlockForm(props: SelectedBlockFormProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/50 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-[var(--text-primary)]">
            New {getLessonBlockLabel(props.selectedNewBlockType)}
          </div>
          <div className="text-sm app-text-muted">
            Fill in the details for this new block.
          </div>
        </div>

        <Button
          type="button"
          onClick={props.onClear}
          variant="secondary"
          size="sm"
        >
          Clear
        </Button>
      </div>

      {props.selectedNewBlockType === "header" && (
        <AddSimpleTextBlockForm
          placeholder="Big heading for this section"
          defaultValue={String(getDefaultBlockData("header").content ?? "")}
          sectionId={props.sectionId}
          routeFields={props.routeFields}
          action={createHeaderBlockAction}
          buttonLabel="Add header block"
        />
      )}

      {props.selectedNewBlockType === "subheader" && (
        <AddSimpleTextBlockForm
          placeholder="Smaller heading for this section"
          defaultValue={String(getDefaultBlockData("subheader").content ?? "")}
          sectionId={props.sectionId}
          routeFields={props.routeFields}
          action={createSubheaderBlockAction}
          buttonLabel="Add subheader block"
        />
      )}

      {props.selectedNewBlockType === "divider" && (
        <form action={createDividerBlockAction} className="space-y-2">
          <BuilderHiddenFields {...props.routeFields} />
          <input type="hidden" name="sectionId" value={props.sectionId} />
          <PendingSubmitButton
            idleLabel="Add divider block"
            pendingLabel="Adding divider block..."
            className={BUILDER_PRIMARY_BUTTON_CLASS}
          />
        </form>
      )}

      {props.selectedNewBlockType === "text" && (
        <AddSimpleTextBlockForm
          placeholder="Write the text content here..."
          defaultValue={String(getDefaultBlockData("text").content ?? "")}
          sectionId={props.sectionId}
          routeFields={props.routeFields}
          action={createTextBlockAction}
          buttonLabel="Add text block"
        />
      )}

      {props.selectedNewBlockType === "note" && (
        <AddTitledContentBlockForm
          sectionId={props.sectionId}
          routeFields={props.routeFields}
          action={createNoteBlockAction}
          buttonLabel="Add note block"
          titlePlaceholder="Study tip"
          contentPlaceholder="Write the note content here..."
          defaultTitle={String(getDefaultBlockData("note").title ?? "")}
          defaultContent={String(getDefaultBlockData("note").content ?? "")}
        />
      )}

      {props.selectedNewBlockType === "callout" && (
        <AddTitledContentBlockForm
          sectionId={props.sectionId}
          routeFields={props.routeFields}
          action={createCalloutBlockAction}
          buttonLabel="Add callout block"
          titlePlaceholder="Optional title"
          contentPlaceholder="Important information or reminder..."
          defaultTitle={String(getDefaultBlockData("callout").title ?? "")}
          defaultContent={String(getDefaultBlockData("callout").content ?? "")}
        />
      )}

      {props.selectedNewBlockType === "exam-tip" && (
        <AddTitledContentBlockForm
          sectionId={props.sectionId}
          routeFields={props.routeFields}
          action={createExamTipBlockAction}
          buttonLabel="Add exam tip block"
          titlePlaceholder="Optional title"
          contentPlaceholder="Advice for exam success..."
          defaultTitle={String(getDefaultBlockData("exam-tip").title ?? "")}
          defaultContent={String(getDefaultBlockData("exam-tip").content ?? "")}
        />
      )}

      {props.selectedNewBlockType === "vocabulary" && (
        <AddVocabularyBlockForm
          sectionId={props.sectionId}
          routeFields={props.routeFields}
        />
      )}

      {props.selectedNewBlockType === "image" && (
        <AddImageBlockForm sectionId={props.sectionId} routeFields={props.routeFields} />
      )}

      {props.selectedNewBlockType === "audio" && (
        <AddAudioBlockForm sectionId={props.sectionId} routeFields={props.routeFields} />
      )}

      {props.selectedNewBlockType === "question-set" && (
        <AddSlugBlockForm
          sectionId={props.sectionId}
          routeFields={props.routeFields}
          action={createQuestionSetBlockAction}
          buttonLabel="Add question-set block"
          slugFieldName="questionSetSlug"
          slugPlaceholder="question-set-slug"
        />
      )}

      {props.selectedNewBlockType === "vocabulary-set" && (
        <AddVocabularySetBlockForm
          sectionId={props.sectionId}
          routeFields={props.routeFields}
          vocabularySetOptions={props.vocabularySetOptions}
        />
      )}
    </div>
  );
}

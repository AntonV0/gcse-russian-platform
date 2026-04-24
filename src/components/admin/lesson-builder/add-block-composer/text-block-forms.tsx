"use client";

import {
  BuilderHiddenFields,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_FIELD_CLASS,
  BUILDER_PRIMARY_BUTTON_CLASS,
  BUILDER_TEXTAREA_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import type { AddBlockAction, AddBlockFormProps } from "./shared";

type AddSimpleTextBlockFormProps = AddBlockFormProps & {
  placeholder: string;
  defaultValue?: string;
  action: AddBlockAction;
  buttonLabel: string;
};

export function AddSimpleTextBlockForm(props: AddSimpleTextBlockFormProps) {
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

type AddTitledContentBlockFormProps = AddBlockFormProps & {
  action: AddBlockAction;
  buttonLabel: string;
  titlePlaceholder: string;
  contentPlaceholder: string;
  defaultTitle?: string;
  defaultContent?: string;
};

export function AddTitledContentBlockForm(props: AddTitledContentBlockFormProps) {
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

type AddSlugBlockFormProps = AddBlockFormProps & {
  action: AddBlockAction;
  buttonLabel: string;
  slugFieldName: "questionSetSlug" | "vocabularySetSlug";
  slugPlaceholder: string;
};

export function AddSlugBlockForm(props: AddSlugBlockFormProps) {
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

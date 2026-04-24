"use client";

import {
  BuilderHiddenFields,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_FIELD_CLASS,
  BUILDER_SECONDARY_BUTTON_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import type { BlockEditorAction, BlockEditorProps } from "./shared";

type SlugBlockEditorProps = BlockEditorProps & {
  defaultTitle: string;
  defaultSlug: string;
  slugFieldName: "questionSetSlug" | "vocabularySetSlug";
  action: BlockEditorAction;
  label: string;
};

export function SlugBlockEditor(props: SlugBlockEditorProps) {
  return (
    <form action={props.action} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />
      <input
        name="title"
        defaultValue={props.defaultTitle}
        placeholder="Optional heading"
        className={BUILDER_FIELD_CLASS}
      />
      <input
        name={props.slugFieldName}
        required
        defaultValue={props.defaultSlug}
        className={BUILDER_FIELD_CLASS}
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel={`Save ${props.label}`}
          pendingLabel="Saving..."
          className={BUILDER_SECONDARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Updating linked block..." />
      </div>
    </form>
  );
}

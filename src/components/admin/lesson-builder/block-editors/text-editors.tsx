"use client";

import {
  BuilderHiddenFields,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_FIELD_CLASS,
  BUILDER_SECONDARY_BUTTON_CLASS,
  BUILDER_TEXTAREA_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import type { BlockEditorAction, BlockEditorProps } from "./shared";

type TextLikeEditorProps = BlockEditorProps & {
  defaultValue: string;
  action: BlockEditorAction;
  label: string;
};

export function TextLikeEditor(props: TextLikeEditorProps) {
  return (
    <form action={props.action} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />
      <textarea
        name="content"
        required
        rows={3}
        defaultValue={props.defaultValue}
        className={BUILDER_TEXTAREA_CLASS}
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel={`Save ${props.label}`}
          pendingLabel="Saving..."
          className={BUILDER_SECONDARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Updating block..." />
      </div>
    </form>
  );
}

type TitledContentEditorProps = BlockEditorProps & {
  defaultTitle: string;
  defaultContent: string;
  action: BlockEditorAction;
  label: string;
  titleRequired?: boolean;
};

export function TitledContentEditor(props: TitledContentEditorProps) {
  return (
    <form action={props.action} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />
      <input
        name="title"
        required={props.titleRequired ?? false}
        defaultValue={props.defaultTitle}
        className={BUILDER_FIELD_CLASS}
      />
      <textarea
        name="content"
        required
        rows={4}
        defaultValue={props.defaultContent}
        className={BUILDER_TEXTAREA_CLASS}
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel={`Save ${props.label}`}
          pendingLabel="Saving..."
          className={BUILDER_SECONDARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Updating block..." />
      </div>
    </form>
  );
}

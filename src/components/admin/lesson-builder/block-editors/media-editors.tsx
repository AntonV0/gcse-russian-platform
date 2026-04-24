"use client";

import {
  updateAudioBlockAction,
  updateImageBlockAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import {
  BuilderHiddenFields,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_FIELD_CLASS,
  BUILDER_SECONDARY_BUTTON_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import type { BlockEditorProps } from "./shared";

type ImageBlockEditorProps = BlockEditorProps & {
  defaultSrc: string;
  defaultAlt: string;
  defaultCaption: string;
};

export function ImageBlockEditor(props: ImageBlockEditorProps) {
  return (
    <form action={updateImageBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />
      <input
        name="src"
        required
        defaultValue={props.defaultSrc}
        placeholder="https://..."
        className={BUILDER_FIELD_CLASS}
      />
      <input
        name="alt"
        defaultValue={props.defaultAlt}
        placeholder="Alt text"
        className={BUILDER_FIELD_CLASS}
      />
      <input
        name="caption"
        defaultValue={props.defaultCaption}
        placeholder="Optional caption"
        className={BUILDER_FIELD_CLASS}
      />
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Save image block"
          pendingLabel="Saving image block..."
          className={BUILDER_SECONDARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Updating image block..." />
      </div>
    </form>
  );
}

type AudioBlockEditorProps = BlockEditorProps & {
  defaultTitle: string;
  defaultSrc: string;
  defaultCaption: string;
  defaultAutoPlay: boolean;
};

export function AudioBlockEditor(props: AudioBlockEditorProps) {
  return (
    <form action={updateAudioBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />
      <input
        name="title"
        defaultValue={props.defaultTitle}
        placeholder="Optional title"
        className={BUILDER_FIELD_CLASS}
      />
      <input
        name="src"
        required
        defaultValue={props.defaultSrc}
        placeholder="https://..."
        className={BUILDER_FIELD_CLASS}
      />
      <input
        name="caption"
        defaultValue={props.defaultCaption}
        placeholder="Optional caption"
        className={BUILDER_FIELD_CLASS}
      />
      <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
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
          className={BUILDER_SECONDARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Updating audio block..." />
      </div>
    </form>
  );
}

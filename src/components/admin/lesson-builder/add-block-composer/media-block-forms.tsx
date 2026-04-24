"use client";

import {
  createAudioBlockAction,
  createImageBlockAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import {
  BuilderHiddenFields,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_FIELD_CLASS,
  BUILDER_PRIMARY_BUTTON_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import type { AddBlockFormProps } from "./shared";

export function AddImageBlockForm(props: AddBlockFormProps) {
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

export function AddAudioBlockForm(props: AddBlockFormProps) {
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

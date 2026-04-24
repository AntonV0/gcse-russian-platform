"use client";

import { updateVocabularyBlockAction } from "@/app/actions/admin/admin-lesson-builder-actions";
import {
  BuilderHiddenFields,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_FIELD_CLASS,
  BUILDER_SECONDARY_BUTTON_CLASS,
  BUILDER_TEXTAREA_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import type { BlockEditorProps } from "./shared";

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

type VocabularyBlockEditorProps = BlockEditorProps & {
  defaultTitle: string;
  defaultItems: unknown;
};

export function VocabularyBlockEditor(props: VocabularyBlockEditorProps) {
  return (
    <form action={updateVocabularyBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />
      <input
        name="title"
        required
        defaultValue={props.defaultTitle}
        placeholder="Key vocabulary"
        className={BUILDER_FIELD_CLASS}
      />
      <textarea
        name="items"
        required
        rows={6}
        defaultValue={stringifyVocabularyItems(props.defaultItems)}
        placeholder={`Ð´Ð¾Ð¼ | house\nÑˆÐºÐ¾Ð»Ð° | school`}
        className={`${BUILDER_TEXTAREA_CLASS} font-mono`}
      />
      <p className="text-xs app-text-soft">
        Use one item per line in the format: russian | english
      </p>
      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Save vocabulary block"
          pendingLabel="Saving vocabulary block..."
          className={BUILDER_SECONDARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Updating vocabulary block..." />
      </div>
    </form>
  );
}

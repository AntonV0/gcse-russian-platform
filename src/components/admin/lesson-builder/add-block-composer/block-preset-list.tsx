"use client";

import { insertBlockPresetAction } from "@/app/actions/admin/admin-lesson-builder-actions";
import type { RouteFields } from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  BuilderHiddenFields,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_DASHED_EMPTY_STATE_CLASS,
  BUILDER_SECONDARY_BUTTON_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";

type BlockPresetOption = {
  id: string;
  label: string;
  description: string;
  blocksCount: number;
};

type BlockPresetListProps = {
  sectionId: string;
  routeFields: RouteFields;
  blockPresetOptions: BlockPresetOption[];
};

export function BlockPresetList(props: BlockPresetListProps) {
  if (props.blockPresetOptions.length === 0) {
    return (
      <div className={BUILDER_DASHED_EMPTY_STATE_CLASS}>
        No DB block presets found yet.
      </div>
    );
  }

  return (
    <>
      {props.blockPresetOptions.map((preset) => (
        <form
          key={preset.id}
          action={insertBlockPresetAction}
          className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/45 p-4"
        >
          <BuilderHiddenFields {...props.routeFields} />
          <input type="hidden" name="sectionId" value={props.sectionId} />
          <input type="hidden" name="presetId" value={preset.id} />

          <div className="mb-3">
            <div className="font-semibold text-[var(--text-primary)]">{preset.label}</div>
            <div className="text-sm app-text-muted">{preset.description}</div>
            <div className="mt-2 text-xs app-text-soft">
              {preset.blocksCount} block{preset.blocksCount === 1 ? "" : "s"}
            </div>
          </div>

          <div className="space-y-2">
            <PendingSubmitButton
              idleLabel="Insert preset"
              pendingLabel="Inserting preset..."
              className={BUILDER_SECONDARY_BUTTON_CLASS}
            />
            <PendingStatusText pendingText="Adding starter blocks to this section..." />
          </div>
        </form>
      ))}
    </>
  );
}

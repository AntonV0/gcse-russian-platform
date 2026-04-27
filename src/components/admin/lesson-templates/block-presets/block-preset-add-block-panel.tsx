import { createLessonBlockPresetBlockAction } from "@/app/actions/admin/admin-lesson-builder-actions";
import {
  getLessonBlockAccentClass,
  getLessonBlockGroupLabel,
  getLessonBlockLabel,
} from "@/lib/lessons/lesson-blocks";
import Button from "@/components/ui/button";
import PanelCard from "@/components/ui/panel-card";
import { BlockPresetBlockFields, templateBlockTypes } from "./block-preset-block-fields";

export function BlockPresetAddBlockPanel({ presetId }: { presetId: string }) {
  return (
    <PanelCard
      title="Add preset block"
      description="Add a new starter block to this preset."
      tone="admin"
    >
      <div className="grid gap-4">
        {templateBlockTypes.map((blockType) => (
          <form
            key={blockType}
            action={createLessonBlockPresetBlockAction}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/55 p-4"
          >
            <input type="hidden" name="presetId" value={presetId} />
            <input type="hidden" name="blockType" value={blockType} />

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${getLessonBlockAccentClass(
                  blockType
                )}`}
              >
                {getLessonBlockGroupLabel(blockType)}
              </span>
              <span className="font-medium text-[var(--text-primary)]">
                {getLessonBlockLabel(blockType)}
              </span>
            </div>

            <BlockPresetBlockFields blockType={blockType} />

            <div className="mt-3">
              <Button type="submit" variant="secondary" size="sm" icon="create">
                Add {getLessonBlockLabel(blockType).toLowerCase()}
              </Button>
            </div>
          </form>
        ))}
      </div>
    </PanelCard>
  );
}

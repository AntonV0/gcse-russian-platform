import {
  deleteLessonBlockPresetBlockAction,
  reorderLessonBlockPresetBlocksAction,
  updateLessonBlockPresetBlockAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import type { DbLessonBlockPresetBlock } from "@/lib/lessons/lesson-template-types";
import {
  getLessonBlockAccentClass,
  getLessonBlockGroupLabel,
  getLessonBlockLabel,
  getLessonBlockPreview,
} from "@/lib/lessons/lesson-blocks";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import Textarea from "@/components/ui/textarea";
import { BlockPresetBlockFields } from "./block-preset-block-fields";

export function BlockPresetBlocksPanel({
  presetId,
  blocks,
}: {
  presetId: string;
  blocks: DbLessonBlockPresetBlock[];
}) {
  return (
    <PanelCard
      title="Preset blocks"
      description="Current blocks inside this preset. Reordering is done by ordered ids for now."
      tone="admin"
      contentClassName="space-y-4"
    >
      {blocks.length === 0 ? (
        <EmptyState
          icon="blocks"
          title="No blocks in this preset yet"
          description="Add a starter block above to begin composing this preset."
        />
      ) : (
        <div className="space-y-4">
          <BlockPresetOrderForm presetId={presetId} blocks={blocks} />
          {blocks.map((block) => (
            <BlockPresetBlockEditor
              key={block.id}
              presetId={presetId}
              block={block}
            />
          ))}
        </div>
      )}
    </PanelCard>
  );
}

function BlockPresetOrderForm({
  presetId,
  blocks,
}: {
  presetId: string;
  blocks: DbLessonBlockPresetBlock[];
}) {
  return (
    <PanelCard title="Block order" tone="muted" density="compact">
      <form action={reorderLessonBlockPresetBlocksAction} className="space-y-3">
        <input type="hidden" name="presetId" value={presetId} />
        <FormField label="Ordered preset block ids">
          <Textarea
            name="orderedPresetBlockIds"
            rows={3}
            defaultValue={blocks.map((block) => block.id).join(",")}
            className="font-mono"
          />
        </FormField>
        <Button type="submit" variant="secondary" icon="save">
          Save block order
        </Button>
      </form>
    </PanelCard>
  );
}

function BlockPresetBlockEditor({
  presetId,
  block,
}: {
  presetId: string;
  block: DbLessonBlockPresetBlock;
}) {
  return (
    <PanelCard
      title={getLessonBlockLabel(block.block_type)}
      tone="default"
      density="compact"
      contentClassName="space-y-4"
      actions={
        <>
          <span
            className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${getLessonBlockAccentClass(
              block.block_type
            )}`}
          >
            {getLessonBlockGroupLabel(block.block_type)}
          </span>
          <Badge tone="muted" icon="help">
            Position {block.position}
          </Badge>
          <Badge
            tone={block.is_active ? "success" : "warning"}
            icon={block.is_active ? "completed" : "pending"}
          >
            {block.is_active ? "Active" : "Inactive"}
          </Badge>
        </>
      }
    >
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/60 px-3 py-2 text-sm app-text-muted">
        {getLessonBlockPreview({
          block_type: block.block_type,
          data: block.data,
        })}
      </div>

      <form action={updateLessonBlockPresetBlockAction} className="space-y-3">
        <input type="hidden" name="presetId" value={presetId} />
        <input type="hidden" name="presetBlockId" value={block.id} />
        <input type="hidden" name="blockType" value={block.block_type} />

        <BlockPresetBlockFields blockType={block.block_type} data={block.data} />

        <CheckboxField
          name="isActive"
          label="Active"
          defaultChecked={block.is_active}
        />

        <InlineActions>
          <Button type="submit" variant="secondary" icon="save">
            Save block
          </Button>
        </InlineActions>
      </form>

      <form action={deleteLessonBlockPresetBlockAction} className="mt-3">
        <input type="hidden" name="presetId" value={presetId} />
        <input type="hidden" name="presetBlockId" value={block.id} />
        <Button type="submit" variant="danger" icon="delete">
          Delete block
        </Button>
      </form>
    </PanelCard>
  );
}

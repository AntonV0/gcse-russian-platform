import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import { createLessonBlockPresetAction } from "@/app/actions/admin/admin-lesson-builder-actions";
import {
  getLessonBlockPresetBlocksDb,
  getLessonBlockPresetsDb,
} from "@/lib/lessons/lesson-template-helpers-db";

function CreatePresetCard() {
  return (
    <PanelCard
      title="Create block preset"
      description="Add a reusable starter block group for lesson authoring."
      tone="admin"
    >
      <form action={createLessonBlockPresetAction} className="grid gap-3 md:grid-cols-3">
        <FormField label="Title" required>
          <Input name="title" required placeholder="Preset title" />
        </FormField>
        <FormField label="Slug" required>
          <Input name="slug" required placeholder="preset-slug" />
        </FormField>
        <FormField label="Description">
          <Input name="description" placeholder="Optional description" />
        </FormField>

        <div className="md:col-span-3">
          <Button type="submit" variant="primary" icon="create">
            Create preset
          </Button>
        </div>
      </form>
    </PanelCard>
  );
}

export default async function AdminLessonBlockPresetsPage() {
  const presets = await getLessonBlockPresetsDb();
  const presetBlocks = await getLessonBlockPresetBlocksDb(presets.map((item) => item.id));

  const blockCountByPresetId = new Map<string, number>();

  for (const block of presetBlocks) {
    blockCountByPresetId.set(
      block.lesson_block_preset_id,
      (blockCountByPresetId.get(block.lesson_block_preset_id) ?? 0) + 1
    );
  }

  return (
    <main className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Block Presets"
          description="Reusable starter block groups for lesson authoring."
        />

        <Button href="/admin/lesson-templates" variant="secondary" icon="back">
          Back
        </Button>
      </div>

      <CreatePresetCard />

      {presets.length === 0 ? (
        <EmptyState
          icon="blocks"
          title="No block presets found yet"
          description="Create a reusable block preset to speed up GCSE Russian lesson authoring."
        />
      ) : (
        <div className="space-y-3">
          {presets.map((preset) => (
            <CardListItem
              key={preset.id}
              href={`/admin/lesson-templates/block-presets/${preset.id}`}
              title={preset.title}
              subtitle={preset.description ?? undefined}
              badges={
                <>
                  <Badge tone="muted" icon="file">
                    {preset.slug}
                  </Badge>

                  {preset.is_active ? (
                    <Badge tone="success" icon="completed">
                      Active
                    </Badge>
                  ) : (
                    <Badge tone="warning" icon="pending">
                      Inactive
                    </Badge>
                  )}

                  <Badge tone="muted" icon="help">
                    {blockCountByPresetId.get(preset.id) ?? 0} block(s)
                  </Badge>
                </>
              }
              actions={
                <InlineActions align="end">
                  <Button
                    href={`/admin/lesson-templates/block-presets/${preset.id}`}
                    variant="secondary"
                    size="sm"
                    icon="preview"
                  >
                    Open
                  </Button>
                </InlineActions>
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}

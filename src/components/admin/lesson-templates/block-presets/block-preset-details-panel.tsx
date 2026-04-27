import {
  deleteLessonBlockPresetAction,
  updateLessonBlockPresetAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import type { DbLessonBlockPreset } from "@/lib/lessons/lesson-template-types";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import InlineActions from "@/components/ui/inline-actions";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";

export function BlockPresetDetailsPanel({
  preset,
  blockCount,
}: {
  preset: DbLessonBlockPreset;
  blockCount: number;
}) {
  return (
    <PanelCard
      title="Block preset details"
      tone="admin"
      actions={
        <>
          <Badge tone="muted" icon="file">
            {preset.slug}
          </Badge>
          <Badge
            tone={preset.is_active ? "success" : "warning"}
            icon={preset.is_active ? "completed" : "pending"}
          >
            {preset.is_active ? "Active" : "Inactive"}
          </Badge>
          <Badge tone="muted" icon="help">
            {blockCount} block(s)
          </Badge>
        </>
      }
    >
      <form action={updateLessonBlockPresetAction} className="grid gap-4 md:grid-cols-2">
        <input type="hidden" name="presetId" value={preset.id} />

        <FormField label="Title" required>
          <Input name="title" required defaultValue={preset.title} />
        </FormField>

        <FormField label="Slug" required>
          <Input name="slug" required defaultValue={preset.slug} />
        </FormField>

        <FormField label="Description" className="md:col-span-2">
          <Input name="description" defaultValue={preset.description ?? ""} />
        </FormField>

        <CheckboxField
          className="md:col-span-2"
          name="isActive"
          label="Active"
          defaultChecked={preset.is_active}
        />

        <InlineActions className="md:col-span-2">
          <Button type="submit" variant="primary" icon="save">
            Save preset
          </Button>
        </InlineActions>
      </form>

      <form action={deleteLessonBlockPresetAction} className="mt-4">
        <input type="hidden" name="presetId" value={preset.id} />
        <Button type="submit" variant="danger" icon="delete">
          Delete preset
        </Button>
      </form>
    </PanelCard>
  );
}

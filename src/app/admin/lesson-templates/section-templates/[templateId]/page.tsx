import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import CheckboxField from "@/components/ui/checkbox-field";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import InlineActions from "@/components/ui/inline-actions";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  addPresetToLessonSectionTemplateAction,
  deleteLessonSectionTemplateAction,
  removePresetFromLessonSectionTemplateAction,
  reorderLessonSectionTemplatePresetsAction,
  updateLessonSectionTemplateAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import { getLessonSectionTemplateDetailDb } from "@/lib/lessons/lesson-template-helpers-db";

const sectionKindOptions = [
  "intro",
  "content",
  "grammar",
  "practice",
  "reading_practice",
  "writing_practice",
  "speaking_practice",
  "listening_practice",
  "summary",
];

export default async function AdminLessonSectionTemplateDetailPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const detail = await getLessonSectionTemplateDetailDb(templateId);

  if (!detail.template) {
    notFound();
  }

  const linkedPresetIds = new Set(
    detail.presetLinks.map((item) => item.lesson_block_preset_id)
  );
  const availablePresets = detail.allPresets.filter(
    (preset) => !linkedPresetIds.has(preset.id)
  );

  return (
    <main className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title={detail.template.title}
          description="Edit section template metadata and manage its ordered block preset links."
        />

        <Button
          href="/admin/lesson-templates/section-templates"
          variant="secondary"
          icon="back"
        >
          Back
        </Button>
      </div>

      <PanelCard
        title="Section template details"
        tone="admin"
        actions={
          <>
            <Badge tone="muted" icon="file">
              {detail.template.slug}
            </Badge>
            <Badge tone="muted" icon="help">
              {detail.template.default_section_kind}
            </Badge>
            <Badge
              tone={detail.template.is_active ? "success" : "warning"}
              icon={detail.template.is_active ? "completed" : "pending"}
            >
              {detail.template.is_active ? "Active" : "Inactive"}
            </Badge>
          </>
        }
      >
        <form
          action={updateLessonSectionTemplateAction}
          className="grid gap-4 md:grid-cols-2"
        >
          <input type="hidden" name="templateId" value={detail.template.id} />

          <FormField label="Title" required>
            <Input name="title" required defaultValue={detail.template.title} />
          </FormField>

          <FormField label="Slug" required>
            <Input name="slug" required defaultValue={detail.template.slug} />
          </FormField>

          <FormField label="Default section title" required>
            <Input
              name="defaultSectionTitle"
              required
              defaultValue={detail.template.default_section_title}
            />
          </FormField>

          <FormField label="Default section kind" required>
            <Select
              name="defaultSectionKind"
              required
              defaultValue={detail.template.default_section_kind}
            >
              {sectionKindOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Description" className="md:col-span-2">
            <Input name="description" defaultValue={detail.template.description ?? ""} />
          </FormField>

          <CheckboxField
            className="md:col-span-2"
            name="isActive"
            label="Active"
            defaultChecked={detail.template.is_active}
          />

          <InlineActions className="md:col-span-2">
            <Button type="submit" variant="primary" icon="save">
              Save section template
            </Button>
          </InlineActions>
        </form>

        <form action={deleteLessonSectionTemplateAction} className="mt-5">
          <input type="hidden" name="templateId" value={detail.template.id} />
          <Button type="submit" variant="danger" icon="delete">
            Delete section template
          </Button>
        </form>
      </PanelCard>

      <PanelCard
        title="Add block preset"
        description="Attach an existing block preset to this section template."
        tone="admin"
      >
        {availablePresets.length === 0 ? (
          <EmptyState
            icon="blocks"
            title="No unlinked block presets available"
            description="Every available block preset is already linked to this section template."
          />
        ) : (
          <form
            action={addPresetToLessonSectionTemplateAction}
            className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]"
          >
            <input type="hidden" name="templateId" value={detail.template.id} />

            <FormField label="Block preset">
              <Select name="presetId" required defaultValue="">
                <option value="" disabled>
                  Select a preset
                </option>
                {availablePresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.title} ({preset.slug})
                  </option>
                ))}
              </Select>
            </FormField>

            <InlineActions className="items-end">
              <Button type="submit" variant="primary" icon="create">
                Add preset
              </Button>
            </InlineActions>
          </form>
        )}
      </PanelCard>

      <PanelCard
        title="Ordered preset links"
        description="Presets are applied in this order when the section template is inserted."
        tone="admin"
        contentClassName="space-y-4"
      >
        {detail.presetLinks.length === 0 ? (
          <EmptyState
            icon="blocks"
            title="No presets linked"
            description="Add a block preset to start building this section template."
          />
        ) : (
          <>
            <PanelCard title="Preset order" tone="muted" density="compact">
              <form
                action={reorderLessonSectionTemplatePresetsAction}
                className="space-y-3"
              >
                <input type="hidden" name="templateId" value={detail.template.id} />
                <FormField label="Ordered preset ids">
                  <Textarea
                    name="orderedPresetIds"
                    rows={3}
                    defaultValue={detail.presetLinks
                      .map((link) => link.lesson_block_preset_id)
                      .join(",")}
                    className="font-mono"
                  />
                </FormField>
                <Button type="submit" variant="secondary" icon="save">
                  Save preset order
                </Button>
              </form>
            </PanelCard>

            {detail.presetLinks.map((link) => {
              const preset = detail.allPresets.find(
                (item) => item.id === link.lesson_block_preset_id
              );

              return (
                <CardListItem
                  key={link.lesson_block_preset_id}
                  title={preset?.title ?? "Unknown preset"}
                  subtitle={preset?.description ?? undefined}
                  badges={
                    <>
                      <Badge tone="muted" icon="help">
                        Position {link.position}
                      </Badge>
                      {preset ? (
                        <Badge tone="muted" icon="file">
                          {preset.slug}
                        </Badge>
                      ) : null}
                      <Badge
                        tone={preset?.is_active ? "success" : "warning"}
                        icon={preset?.is_active ? "completed" : "pending"}
                      >
                        {preset?.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </>
                  }
                  actions={
                    <form action={removePresetFromLessonSectionTemplateAction}>
                      <input
                        type="hidden"
                        name="templateId"
                        value={detail.template!.id}
                      />
                      <input
                        type="hidden"
                        name="presetId"
                        value={link.lesson_block_preset_id}
                      />
                      <Button type="submit" variant="danger" size="sm" icon="delete">
                        Remove
                      </Button>
                    </form>
                  }
                />
              );
            })}
          </>
        )}
      </PanelCard>
    </main>
  );
}

import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { appIcons } from "@/lib/shared/icons";
import {
  addPresetToLessonSectionTemplateAction,
  deleteLessonSectionTemplateAction,
  removePresetFromLessonSectionTemplateAction,
  reorderLessonSectionTemplatePresetsAction,
  updateLessonSectionTemplateAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import { getLessonSectionTemplateDetailDb } from "@/lib/lessons/lesson-template-helpers-db";

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

        <div className="flex gap-2">
          <Button
            href="/admin/lesson-templates/section-templates"
            variant="secondary"
            icon={appIcons.back}
          >
            Back
          </Button>
        </div>
      </div>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge tone="muted" icon={appIcons.file}>
            {detail.template.slug}
          </Badge>

          <Badge tone="muted" icon={appIcons.help}>
            {detail.template.default_section_kind}
          </Badge>

          {detail.template.is_active ? (
            <Badge tone="success" icon={appIcons.completed}>
              Active
            </Badge>
          ) : (
            <Badge tone="warning" icon={appIcons.pending}>
              Inactive
            </Badge>
          )}
        </div>

        <form
          action={updateLessonSectionTemplateAction}
          className="grid gap-3 md:grid-cols-2"
        >
          <input type="hidden" name="templateId" value={detail.template.id} />

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">Title</label>
            <input
              name="title"
              required
              defaultValue={detail.template.title}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">Slug</label>
            <input
              name="slug"
              required
              defaultValue={detail.template.slug}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">
              Default section title
            </label>
            <input
              name="defaultSectionTitle"
              required
              defaultValue={detail.template.default_section_title}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">
              Default section kind
            </label>
            <select
              name="defaultSectionKind"
              required
              defaultValue={detail.template.default_section_kind}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            >
              <option value="intro">intro</option>
              <option value="content">content</option>
              <option value="grammar">grammar</option>
              <option value="practice">practice</option>
              <option value="reading_practice">reading_practice</option>
              <option value="writing_practice">writing_practice</option>
              <option value="speaking_practice">speaking_practice</option>
              <option value="listening_practice">listening_practice</option>
              <option value="summary">summary</option>
            </select>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-900">Description</label>
            <input
              name="description"
              defaultValue={detail.template.description ?? ""}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="isActive"
                value="true"
                defaultChecked={detail.template.is_active}
              />
              Active
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Save section template
            </button>
          </div>
        </form>

        <form action={deleteLessonSectionTemplateAction} className="mt-4">
          <input type="hidden" name="templateId" value={detail.template.id} />
          <button
            type="submit"
            className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
          >
            Delete section template
          </button>
        </form>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4">
          <div className="font-medium text-gray-900">Add block preset</div>
          <div className="text-sm text-gray-500">
            Attach an existing block preset to this section template.
          </div>
        </div>

        {availablePresets.length === 0 ? (
          <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-gray-500">
            No unlinked block presets available.
          </div>
        ) : (
          <form
            action={addPresetToLessonSectionTemplateAction}
            className="flex flex-col gap-3 md:flex-row"
          >
            <input type="hidden" name="templateId" value={detail.template.id} />

            <select
              name="presetId"
              required
              defaultValue=""
              className="w-full rounded-xl border px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Select a preset
              </option>
              {availablePresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.title} ({preset.slug})
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Add preset
            </button>
          </form>
        )}
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4">
          <div className="font-medium text-gray-900">Ordered preset links</div>
          <div className="text-sm text-gray-500">
            Presets are applied in this order when the section template is inserted.
          </div>
        </div>

        {detail.presetLinks.length === 0 ? (
          <div className="rounded-xl border border-dashed px-4 py-8 text-sm text-gray-500">
            No presets linked to this section template yet.
          </div>
        ) : (
          <div className="space-y-4">
            <form
              action={reorderLessonSectionTemplatePresetsAction}
              className="rounded-xl border bg-gray-50 p-4"
            >
              <input type="hidden" name="templateId" value={detail.template.id} />
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Ordered preset ids
              </label>
              <textarea
                name="orderedPresetIds"
                rows={3}
                defaultValue={detail.presetLinks
                  .map((link) => link.lesson_block_preset_id)
                  .join(",")}
                className="w-full rounded-xl border px-3 py-2 font-mono text-sm"
              />
              <button
                type="submit"
                className="mt-3 rounded-lg border px-3 py-2 text-sm hover:bg-white"
              >
                Save preset order
              </button>
            </form>

            {detail.presetLinks.map((link) => {
              const preset = detail.allPresets.find(
                (item) => item.id === link.lesson_block_preset_id
              );

              return (
                <section
                  key={link.lesson_block_preset_id}
                  className="rounded-xl border p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {preset?.title ?? "Unknown preset"}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge tone="muted" icon={appIcons.help}>
                          Position {link.position}
                        </Badge>

                        {preset ? (
                          <Badge tone="muted" icon={appIcons.file}>
                            {preset.slug}
                          </Badge>
                        ) : null}

                        {preset?.is_active ? (
                          <Badge tone="success" icon={appIcons.completed}>
                            Active
                          </Badge>
                        ) : (
                          <Badge tone="warning" icon={appIcons.pending}>
                            Inactive
                          </Badge>
                        )}
                      </div>

                      {preset?.description ? (
                        <p className="mt-3 text-sm text-gray-600">{preset.description}</p>
                      ) : null}
                    </div>

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
                      <button
                        type="submit"
                        className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

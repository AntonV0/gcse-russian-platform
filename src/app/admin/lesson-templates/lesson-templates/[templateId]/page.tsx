import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import {
  addSectionToLessonTemplateAction,
  deleteLessonTemplateAction,
  removeSectionFromLessonTemplateAction,
  reorderLessonTemplateSectionsAction,
  updateLessonTemplateAction,
  updateLessonTemplateSectionAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import { getLessonTemplateDetailDb } from "@/lib/lessons/lesson-template-helpers-db";

export default async function AdminLessonTemplateDetailPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const detail = await getLessonTemplateDetailDb(templateId);

  if (!detail.template) {
    notFound();
  }

  const linkedSectionTemplateIds = new Set(
    detail.templateSections.map((item) => item.lesson_section_template_id)
  );

  const availableSectionTemplates = detail.allSectionTemplates.filter(
    (template) => !linkedSectionTemplateIds.has(template.id)
  );

  return (
    <main className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title={detail.template.title}
          description="Edit lesson template metadata and manage its ordered section template links."
        />

        <div className="flex gap-2">
          <Button
            href="/admin/lesson-templates/lesson-templates"
            variant="secondary"
            icon="back"
          >
            Back
          </Button>
        </div>
      </div>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge tone="muted" icon="file">
            {detail.template.slug}
          </Badge>

          {detail.template.is_active ? (
            <Badge tone="success" icon="completed">
              Active
            </Badge>
          ) : (
            <Badge tone="warning" icon="pending">
              Inactive
            </Badge>
          )}
        </div>

        <form action={updateLessonTemplateAction} className="grid gap-3 md:grid-cols-2">
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
              Save lesson template
            </button>
          </div>
        </form>

        <form action={deleteLessonTemplateAction} className="mt-4">
          <input type="hidden" name="templateId" value={detail.template.id} />
          <button
            type="submit"
            className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
          >
            Delete lesson template
          </button>
        </form>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4">
          <div className="font-medium text-gray-900">Add section template</div>
          <div className="text-sm text-gray-500">
            Attach an existing section template and optionally override its title or
            section kind.
          </div>
        </div>

        {availableSectionTemplates.length === 0 ? (
          <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-gray-500">
            No unlinked section templates available.
          </div>
        ) : (
          <form
            action={addSectionToLessonTemplateAction}
            className="grid gap-3 md:grid-cols-3"
          >
            <input type="hidden" name="templateId" value={detail.template.id} />

            <select
              name="sectionTemplateId"
              required
              defaultValue=""
              className="rounded-xl border px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Select a section template
              </option>
              {availableSectionTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.title} ({template.slug})
                </option>
              ))}
            </select>

            <input
              name="titleOverride"
              placeholder="Optional title override"
              className="rounded-xl border px-3 py-2 text-sm"
            />

            <select
              name="sectionKindOverride"
              defaultValue=""
              className="rounded-xl border px-3 py-2 text-sm"
            >
              <option value="">No section kind override</option>
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

            <div className="md:col-span-3">
              <button
                type="submit"
                className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Add section template
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4">
          <div className="font-medium text-gray-900">Ordered template sections</div>
          <div className="text-sm text-gray-500">
            Section templates are applied in this order when the lesson template is
            inserted.
          </div>
        </div>

        {detail.templateSections.length === 0 ? (
          <div className="rounded-xl border border-dashed px-4 py-8 text-sm text-gray-500">
            No section templates linked yet.
          </div>
        ) : (
          <div className="space-y-4">
            <form
              action={reorderLessonTemplateSectionsAction}
              className="rounded-xl border bg-gray-50 p-4"
            >
              <input type="hidden" name="templateId" value={detail.template.id} />
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Ordered lesson template section ids
              </label>
              <textarea
                name="orderedLessonTemplateSectionIds"
                rows={3}
                defaultValue={detail.templateSections.map((item) => item.id).join(",")}
                className="w-full rounded-xl border px-3 py-2 font-mono text-sm"
              />
              <button
                type="submit"
                className="mt-3 rounded-lg border px-3 py-2 text-sm hover:bg-white"
              >
                Save section order
              </button>
            </form>

            {detail.templateSections.map((section) => {
              const baseTemplate = detail.allSectionTemplates.find(
                (item) => item.id === section.lesson_section_template_id
              );

              return (
                <section key={section.id} className="rounded-xl border p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge tone="muted" icon="help">
                      Position {section.position}
                    </Badge>

                    {baseTemplate ? (
                      <>
                        <Badge tone="muted" icon="file">
                          {baseTemplate.title}
                        </Badge>
                        <Badge tone="muted" icon="help">
                          {baseTemplate.slug}
                        </Badge>
                      </>
                    ) : null}
                  </div>

                  <form
                    action={updateLessonTemplateSectionAction}
                    className="grid gap-3 md:grid-cols-2"
                  >
                    <input type="hidden" name="templateId" value={detail.template!.id} />
                    <input
                      type="hidden"
                      name="lessonTemplateSectionId"
                      value={section.id}
                    />

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-900">
                        Title override
                      </label>
                      <input
                        name="titleOverride"
                        defaultValue={section.title_override ?? ""}
                        placeholder={baseTemplate?.default_section_title ?? "No override"}
                        className="w-full rounded-xl border px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-900">
                        Section kind override
                      </label>
                      <select
                        name="sectionKindOverride"
                        defaultValue={section.section_kind_override ?? ""}
                        className="w-full rounded-xl border px-3 py-2 text-sm"
                      >
                        <option value="">No override</option>
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

                    <div className="md:col-span-2 flex flex-wrap gap-2">
                      <button
                        type="submit"
                        className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        Save linked section
                      </button>
                    </div>
                  </form>

                  <form action={removeSectionFromLessonTemplateAction} className="mt-3">
                    <input type="hidden" name="templateId" value={detail.template!.id} />
                    <input
                      type="hidden"
                      name="lessonTemplateSectionId"
                      value={section.id}
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      Remove section
                    </button>
                  </form>
                </section>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

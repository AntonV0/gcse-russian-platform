import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { appIcons } from "@/lib/icons";
import { createLessonSectionTemplateAction } from "@/app/actions/admin-lesson-builder-actions";
import {
  getLessonSectionTemplatePresetsDb,
  getLessonSectionTemplatesDb,
} from "@/lib/lesson-template-helpers-db";

function CreateSectionTemplateCard() {
  return (
    <section className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3">
        <div className="font-medium text-gray-900">Create section template</div>
        <div className="text-sm text-gray-500">
          Add a reusable section blueprint that can compose block presets.
        </div>
      </div>

      <form
        action={createLessonSectionTemplateAction}
        className="grid gap-3 md:grid-cols-2"
      >
        <input
          name="title"
          required
          placeholder="Section template title"
          className="rounded-xl border px-3 py-2 text-sm"
        />
        <input
          name="slug"
          required
          placeholder="section-template-slug"
          className="rounded-xl border px-3 py-2 text-sm"
        />
        <input
          name="defaultSectionTitle"
          required
          placeholder="Default section title"
          className="rounded-xl border px-3 py-2 text-sm"
        />
        <select
          name="defaultSectionKind"
          required
          defaultValue="content"
          className="rounded-xl border px-3 py-2 text-sm"
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
        <input
          name="description"
          placeholder="Optional description"
          className="rounded-xl border px-3 py-2 text-sm md:col-span-2"
        />

        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Create section template
          </button>
        </div>
      </form>
    </section>
  );
}

export default async function AdminLessonSectionTemplatesPage() {
  const templates = await getLessonSectionTemplatesDb();
  const links = await getLessonSectionTemplatePresetsDb(templates.map((item) => item.id));

  const presetCountByTemplateId = new Map<string, number>();

  for (const link of links) {
    presetCountByTemplateId.set(
      link.lesson_section_template_id,
      (presetCountByTemplateId.get(link.lesson_section_template_id) ?? 0) + 1
    );
  }

  return (
    <main className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Section Templates"
          description="Reusable section blueprints built from ordered block presets."
        />

        <Button href="/admin/lesson-templates" variant="secondary" icon={appIcons.back}>
          Back
        </Button>
      </div>

      <CreateSectionTemplateCard />

      {templates.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white px-4 py-8 text-sm text-gray-500">
          No section templates found yet.
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/admin/lesson-templates/section-templates/${template.id}`}
              className="block rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900">{template.title}</div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge tone="muted" icon={appIcons.file}>
                      {template.slug}
                    </Badge>

                    <Badge tone="muted" icon={appIcons.help}>
                      {template.default_section_kind}
                    </Badge>

                    <Badge tone="muted" icon={appIcons.help}>
                      {presetCountByTemplateId.get(template.id) ?? 0} preset(s)
                    </Badge>

                    {template.is_active ? (
                      <Badge tone="success" icon={appIcons.completed}>
                        Active
                      </Badge>
                    ) : (
                      <Badge tone="warning" icon={appIcons.pending}>
                        Inactive
                      </Badge>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-gray-600">
                    Default section title: {template.default_section_title}
                  </p>

                  {template.description ? (
                    <p className="mt-2 text-sm text-gray-600">{template.description}</p>
                  ) : null}
                </div>

                <div className="text-sm text-gray-500">Open</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

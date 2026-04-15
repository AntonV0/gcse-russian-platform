import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { appIcons } from "@/lib/icons";
import {
  getLessonSectionTemplatePresetsDb,
  getLessonSectionTemplatesDb,
} from "@/lib/lesson-template-helpers-db";

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

        <div className="flex gap-2">
          <Button href="/admin/lesson-templates" variant="secondary" icon={appIcons.back}>
            Back
          </Button>
          <Button href="#" variant="primary" icon={appIcons.create}>
            Create section template
          </Button>
        </div>
      </div>

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

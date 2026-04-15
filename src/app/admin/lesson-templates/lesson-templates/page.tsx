import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { appIcons } from "@/lib/icons";
import {
  getLessonTemplateSectionsDb,
  getLessonTemplatesDb,
} from "@/lib/lesson-template-helpers-db";

export default async function AdminLessonTemplatesListPage() {
  const templates = await getLessonTemplatesDb();
  const sections = await getLessonTemplateSectionsDb(templates.map((item) => item.id));

  const sectionCountByTemplateId = new Map<string, number>();

  for (const section of sections) {
    sectionCountByTemplateId.set(
      section.lesson_template_id,
      (sectionCountByTemplateId.get(section.lesson_template_id) ?? 0) + 1
    );
  }

  return (
    <main className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Lesson Templates"
          description="Full lesson scaffolds built from ordered section templates."
        />

        <div className="flex gap-2">
          <Button href="/admin/lesson-templates" variant="secondary" icon={appIcons.back}>
            Back
          </Button>
          <Button href="#" variant="primary" icon={appIcons.create}>
            Create lesson template
          </Button>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white px-4 py-8 text-sm text-gray-500">
          No lesson templates found yet.
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/admin/lesson-templates/lesson-templates/${template.id}`}
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
                      {sectionCountByTemplateId.get(template.id) ?? 0} section(s)
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

                  {template.description ? (
                    <p className="mt-3 text-sm text-gray-600">{template.description}</p>
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

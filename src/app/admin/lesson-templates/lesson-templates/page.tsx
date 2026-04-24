import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import { createLessonTemplateAction } from "@/app/actions/admin/admin-lesson-builder-actions";
import {
  getLessonTemplateSectionsDb,
  getLessonTemplatesDb,
} from "@/lib/lessons/lesson-template-helpers-db";

function CreateLessonTemplateCard() {
  return (
    <PanelCard
      title="Create lesson template"
      description="Add a reusable full lesson scaffold built from ordered section templates."
      tone="admin"
    >
      <form action={createLessonTemplateAction} className="grid gap-3 md:grid-cols-3">
        <FormField label="Title" required>
          <Input name="title" required placeholder="Lesson template title" />
        </FormField>
        <FormField label="Slug" required>
          <Input name="slug" required placeholder="lesson-template-slug" />
        </FormField>
        <FormField label="Description">
          <Input name="description" placeholder="Optional description" />
        </FormField>

        <div className="md:col-span-3">
          <Button type="submit" variant="primary" icon="create">
            Create lesson template
          </Button>
        </div>
      </form>
    </PanelCard>
  );
}

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

        <Button href="/admin/lesson-templates" variant="secondary" icon="back">
          Back
        </Button>
      </div>

      <CreateLessonTemplateCard />

      {templates.length === 0 ? (
        <EmptyState
          icon="lesson"
          title="No lesson templates found yet"
          description="Create a full lesson scaffold to build future lessons faster."
        />
      ) : (
        <div className="space-y-3">
          {templates.map((template) => (
            <CardListItem
              key={template.id}
              href={`/admin/lesson-templates/lesson-templates/${template.id}`}
              title={template.title}
              subtitle={template.description ?? undefined}
              badges={
                <>
                    <Badge tone="muted" icon="file">
                      {template.slug}
                    </Badge>

                    <Badge tone="muted" icon="help">
                      {sectionCountByTemplateId.get(template.id) ?? 0} section(s)
                    </Badge>

                    {template.is_active ? (
                      <Badge tone="success" icon="completed">
                        Active
                      </Badge>
                    ) : (
                      <Badge tone="warning" icon="pending">
                        Inactive
                      </Badge>
                    )}
                </>
              }
              actions={
                <InlineActions align="end">
                  <Button
                    href={`/admin/lesson-templates/lesson-templates/${template.id}`}
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

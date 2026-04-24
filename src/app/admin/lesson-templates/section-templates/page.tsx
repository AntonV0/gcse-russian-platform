import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import { createLessonSectionTemplateAction } from "@/app/actions/admin/admin-lesson-builder-actions";
import {
  getLessonSectionTemplatePresetsDb,
  getLessonSectionTemplatesDb,
} from "@/lib/lessons/lesson-template-helpers-db";

function CreateSectionTemplateCard() {
  return (
    <PanelCard
      title="Create section template"
      description="Add a reusable section blueprint that can compose block presets."
      tone="admin"
    >
      <form
        action={createLessonSectionTemplateAction}
        className="grid gap-3 md:grid-cols-2"
      >
        <FormField label="Title" required>
          <Input name="title" required placeholder="Section template title" />
        </FormField>
        <FormField label="Slug" required>
          <Input name="slug" required placeholder="section-template-slug" />
        </FormField>
        <FormField label="Default section title" required>
          <Input name="defaultSectionTitle" required placeholder="Default section title" />
        </FormField>
        <FormField label="Default section kind" required>
          <Select name="defaultSectionKind" required defaultValue="content">
            <option value="intro">intro</option>
            <option value="content">content</option>
            <option value="grammar">grammar</option>
            <option value="practice">practice</option>
            <option value="reading_practice">reading_practice</option>
            <option value="writing_practice">writing_practice</option>
            <option value="speaking_practice">speaking_practice</option>
            <option value="listening_practice">listening_practice</option>
            <option value="summary">summary</option>
          </Select>
        </FormField>
        <FormField label="Description" className="md:col-span-2">
          <Input name="description" placeholder="Optional description" />
        </FormField>

        <div className="md:col-span-2">
          <Button type="submit" variant="primary" icon="create">
            Create section template
          </Button>
        </div>
      </form>
    </PanelCard>
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

        <Button href="/admin/lesson-templates" variant="secondary" icon="back">
          Back
        </Button>
      </div>

      <CreateSectionTemplateCard />

      {templates.length === 0 ? (
        <EmptyState
          icon="layers"
          title="No section templates found yet"
          description="Create a section template to compose reusable GCSE Russian lesson sections."
        />
      ) : (
        <div className="space-y-3">
          {templates.map((template) => (
            <CardListItem
              key={template.id}
              href={`/admin/lesson-templates/section-templates/${template.id}`}
              title={template.title}
              subtitle={[
                `Default section title: ${template.default_section_title}`,
                template.description,
              ]
                .filter(Boolean)
                .join(" - ")}
              badges={
                <>
                    <Badge tone="muted" icon="file">
                      {template.slug}
                    </Badge>

                    <Badge tone="muted" icon="help">
                      {template.default_section_kind}
                    </Badge>

                    <Badge tone="muted" icon="help">
                      {presetCountByTemplateId.get(template.id) ?? 0} preset(s)
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
                    href={`/admin/lesson-templates/section-templates/${template.id}`}
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

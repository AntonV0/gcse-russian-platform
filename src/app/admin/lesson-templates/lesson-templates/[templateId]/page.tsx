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
  addSectionToLessonTemplateAction,
  deleteLessonTemplateAction,
  removeSectionFromLessonTemplateAction,
  reorderLessonTemplateSectionsAction,
  updateLessonTemplateAction,
  updateLessonTemplateSectionAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import { getLessonTemplateDetailDb } from "@/lib/lessons/lesson-template-helpers-db";

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

        <Button
          href="/admin/lesson-templates/lesson-templates"
          variant="secondary"
          icon="back"
        >
          Back
        </Button>
      </div>

      <PanelCard
        title="Lesson template details"
        tone="admin"
        actions={
          <>
            <Badge tone="muted" icon="file">
              {detail.template.slug}
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
        <form action={updateLessonTemplateAction} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="templateId" value={detail.template.id} />

          <FormField label="Title" required>
            <Input name="title" required defaultValue={detail.template.title} />
          </FormField>

          <FormField label="Slug" required>
            <Input name="slug" required defaultValue={detail.template.slug} />
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
              Save lesson template
            </Button>
          </InlineActions>
        </form>

        <form action={deleteLessonTemplateAction} className="mt-5">
          <input type="hidden" name="templateId" value={detail.template.id} />
          <Button type="submit" variant="danger" icon="delete">
            Delete lesson template
          </Button>
        </form>
      </PanelCard>

      <PanelCard
        title="Add section template"
        description="Attach an existing section template and optionally override its title or section kind."
        tone="admin"
      >
        {availableSectionTemplates.length === 0 ? (
          <EmptyState
            icon="layers"
            title="No unlinked section templates available"
            description="Every available section template is already linked to this lesson template."
          />
        ) : (
          <form
            action={addSectionToLessonTemplateAction}
            className="grid gap-3 md:grid-cols-3"
          >
            <input type="hidden" name="templateId" value={detail.template.id} />

            <FormField label="Section template">
              <Select name="sectionTemplateId" required defaultValue="">
                <option value="" disabled>
                  Select a section template
                </option>
                {availableSectionTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.title} ({template.slug})
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Title override">
              <Input name="titleOverride" placeholder="Optional title override" />
            </FormField>

            <FormField label="Section kind override">
              <Select name="sectionKindOverride" defaultValue="">
                <option value="">No section kind override</option>
                {sectionKindOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormField>

            <InlineActions className="md:col-span-3">
              <Button type="submit" variant="primary" icon="create">
                Add section template
              </Button>
            </InlineActions>
          </form>
        )}
      </PanelCard>

      <PanelCard
        title="Ordered template sections"
        description="Section templates are applied in this order when the lesson template is inserted."
        tone="admin"
        contentClassName="space-y-4"
      >
        {detail.templateSections.length === 0 ? (
          <EmptyState
            icon="layers"
            title="No section templates linked yet"
            description="Add a section template to start composing this lesson scaffold."
          />
        ) : (
          <>
            <PanelCard title="Section order" tone="muted" density="compact">
              <form action={reorderLessonTemplateSectionsAction} className="space-y-3">
                <input type="hidden" name="templateId" value={detail.template.id} />
                <FormField label="Ordered lesson template section ids">
                  <Textarea
                    name="orderedLessonTemplateSectionIds"
                    rows={3}
                    defaultValue={detail.templateSections
                      .map((item) => item.id)
                      .join(",")}
                    className="font-mono"
                  />
                </FormField>
                <Button type="submit" variant="secondary" icon="save">
                  Save section order
                </Button>
              </form>
            </PanelCard>

            {detail.templateSections.map((section) => {
              const baseTemplate = detail.allSectionTemplates.find(
                (item) => item.id === section.lesson_section_template_id
              );

              return (
                <PanelCard
                  key={section.id}
                  tone="default"
                  density="compact"
                  title={baseTemplate?.title ?? "Unknown section template"}
                  contentClassName="space-y-4"
                  actions={
                    <>
                      <Badge tone="muted" icon="help">
                        Position {section.position}
                      </Badge>
                      {baseTemplate ? (
                        <Badge tone="muted" icon="file">
                          {baseTemplate.slug}
                        </Badge>
                      ) : null}
                    </>
                  }
                >
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

                    <FormField label="Title override">
                      <Input
                        name="titleOverride"
                        defaultValue={section.title_override ?? ""}
                        placeholder={baseTemplate?.default_section_title ?? "No override"}
                      />
                    </FormField>

                    <FormField label="Section kind override">
                      <Select
                        name="sectionKindOverride"
                        defaultValue={section.section_kind_override ?? ""}
                      >
                        <option value="">No override</option>
                        {sectionKindOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    </FormField>

                    <InlineActions className="md:col-span-2">
                      <Button type="submit" variant="secondary" icon="save">
                        Save linked section
                      </Button>
                    </InlineActions>
                  </form>

                  <CardListItem
                    title="Remove linked section"
                    subtitle="This removes the section from this lesson template only."
                    badges={
                      <Badge tone="warning" icon="warning">
                        Reversible by adding it again
                      </Badge>
                    }
                    actions={
                      <form action={removeSectionFromLessonTemplateAction}>
                        <input
                          type="hidden"
                          name="templateId"
                          value={detail.template!.id}
                        />
                        <input
                          type="hidden"
                          name="lessonTemplateSectionId"
                          value={section.id}
                        />
                        <Button type="submit" variant="danger" size="sm" icon="delete">
                          Remove section
                        </Button>
                      </form>
                    }
                  />
                </PanelCard>
              );
            })}
          </>
        )}
      </PanelCard>
    </main>
  );
}

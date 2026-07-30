import Button from "@/components/ui/button";
import DetailList from "@/components/ui/detail-list";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import OperationsWorkspace, {
  OperationsHeader,
  OperationsSection,
} from "@/components/ui/operations-workspace";
import PanelCard from "@/components/ui/panel-card";
import Textarea from "@/components/ui/textarea";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { getQuestionSetByIdDb } from "@/lib/questions/question-helpers-db";
import { createQuestionSetFromTemplateAction } from "@/app/actions/admin/admin-question-actions";

type CreateFromTemplatePageProps = {
  params: Promise<{
    templateQuestionSetId: string;
  }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function stripCopySuffix(value: string) {
  return value
    .trim()
    .replace(/\s*\(copy(?:\s+\d+)?\)$/i, "")
    .replace(/-copy(?:-\d+)?$/i, "")
    .trim();
}

export default async function CreateQuestionSetFromTemplatePage({
  params,
}: CreateFromTemplatePageProps) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return (
      <main>
        <OperationsWorkspace>
          <OperationsHeader
            eyebrow="Admin question bank"
            title="Access denied"
            description="You need an admin account to create a question set from a template."
          />
        </OperationsWorkspace>
      </main>
    );
  }

  const { templateQuestionSetId } = await params;
  const template = await getQuestionSetByIdDb(templateQuestionSetId);

  if (!template || !template.is_template) {
    return (
      <main>
        <OperationsWorkspace>
          <OperationsHeader
            eyebrow="Admin question bank"
            title="Template not found"
            description="This template may have been deleted or the link may be out of date."
          />
        </OperationsWorkspace>
      </main>
    );
  }

  const baseTitle = stripCopySuffix(template.title);
  const suggestedTitle = `${baseTitle} (Copy)`;
  const suggestedSlug = `${slugify(template.slug ?? template.title)}-copy`;

  return (
    <main>
      <OperationsWorkspace className="max-w-4xl">
        <OperationsHeader
          eyebrow="Admin question bank"
          title="Create Question Set from Template"
          description="Create a working copy from a reusable template."
          actions={
            <Button
              href="/admin/question-sets/templates"
              variant="secondary"
              icon="back"
            >
              Back to templates
            </Button>
          }
        />

      <OperationsSection>
        <PanelCard title="Template Details" tone="admin">
          <DetailList
            items={[
              { label: "Title", value: template.title },
              { label: "Slug", value: template.slug ?? "-" },
              { label: "Template type", value: template.template_type ?? "-" },
              { label: "Description", value: template.description ?? "-" },
              { label: "Instructions", value: template.instructions ?? "-" },
            ]}
          />
        </PanelCard>
      </OperationsSection>

      <OperationsSection>
        <PanelCard title="New Question Set Details" tone="admin">
          <form action={createQuestionSetFromTemplateAction} className="space-y-4">
            <input type="hidden" name="templateQuestionSetId" value={template.id} />

            <FormField label="Title" required>
              <Input name="title" required defaultValue={suggestedTitle} />
            </FormField>

            <FormField label="Slug" required>
              <Input name="slug" required defaultValue={suggestedSlug} />
            </FormField>

            <FormField label="Description">
              <Textarea
                name="description"
                defaultValue={template.description ?? ""}
                rows={3}
              />
            </FormField>

            <FormField label="Instructions">
              <Textarea
                name="instructions"
                defaultValue={template.instructions ?? ""}
                rows={3}
              />
            </FormField>

            <Button type="submit" variant="primary" icon="create">
              Create from template
            </Button>
          </form>
        </PanelCard>
      </OperationsSection>
      </OperationsWorkspace>
    </main>
  );
}

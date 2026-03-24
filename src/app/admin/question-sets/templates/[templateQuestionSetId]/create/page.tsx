import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { requireAdminAccess } from "@/lib/admin-auth";
import { getQuestionSetByIdDb } from "@/lib/question-helpers-db";
import { createQuestionSetFromTemplateAction } from "@/app/actions/admin-question-actions";

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
    return <main>Access denied.</main>;
  }

  const { templateQuestionSetId } = await params;
  const template = await getQuestionSetByIdDb(templateQuestionSetId);

  if (!template || !template.is_template) {
    return <main>Template not found.</main>;
  }

  const baseTitle = stripCopySuffix(template.title);
  const suggestedTitle = `${baseTitle} (Copy)`;
  const suggestedSlug = `${slugify(template.slug ?? template.title)}-copy`;

  return (
    <main className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/question-sets/templates"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          Back to templates
        </Link>
      </div>

      <PageHeader
        title="Create Question Set from Template"
        description="Create a working copy from a reusable template."
      />

      <section className="mb-8">
        <DashboardCard title="Template Details">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Title:</span> {template.title}
            </p>
            <p>
              <span className="font-medium">Slug:</span> {template.slug ?? "—"}
            </p>
            {template.template_type ? (
              <p>
                <span className="font-medium">Template type:</span>{" "}
                {template.template_type}
              </p>
            ) : null}
            {template.description ? (
              <p>
                <span className="font-medium">Description:</span> {template.description}
              </p>
            ) : null}
            {template.instructions ? (
              <p>
                <span className="font-medium">Instructions:</span> {template.instructions}
              </p>
            ) : null}
          </div>
        </DashboardCard>
      </section>

      <section>
        <DashboardCard title="New Question Set Details">
          <form action={createQuestionSetFromTemplateAction} className="space-y-4">
            <input type="hidden" name="templateQuestionSetId" value={template.id} />

            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                name="title"
                required
                defaultValue={suggestedTitle}
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Slug</label>
              <input
                name="slug"
                required
                defaultValue={suggestedSlug}
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                defaultValue={template.description ?? ""}
                className="w-full rounded border px-3 py-2"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Instructions</label>
              <textarea
                name="instructions"
                defaultValue={template.instructions ?? ""}
                className="w-full rounded border px-3 py-2"
                rows={3}
              />
            </div>

            <button type="submit" className="rounded-lg bg-black px-4 py-2 text-white">
              Create from template
            </button>
          </form>
        </DashboardCard>
      </section>
    </main>
  );
}

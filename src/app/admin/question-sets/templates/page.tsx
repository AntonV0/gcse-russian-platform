import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { requireAdminAccess } from "@/lib/admin-auth";
import { getQuestionSetTemplatesDb } from "@/lib/question-helpers-db";
import { createQuestionSetFromTemplateAction } from "@/app/actions/admin-question-actions";

export default async function AdminQuestionSetTemplatesPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const templates = await getQuestionSetTemplatesDb();

  return (
    <main>
      <PageHeader
        title="Question Set Templates"
        description="Reusable templates for fast content authoring."
      />

      <div className="mb-6">
        <Link
          href="/admin/question-sets"
          className="rounded border px-4 py-2 text-sm"
        >
          Back to question sets
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">
          No templates yet.
        </div>
      ) : (
        <section className="grid gap-4">
          {templates.map((template) => (
            <DashboardCard key={template.id} title={template.title}>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Slug:</span> {template.slug}
                </p>

                {template.template_type ? (
                  <p>
                    <span className="font-medium">Template type:</span>{" "}
                    {template.template_type}
                  </p>
                ) : null}

                {template.description ? <p>{template.description}</p> : null}

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/admin/question-sets/${template.id}`}
                    className="rounded border px-4 py-2 text-sm"
                  >
                    Open template
                  </Link>

                  <form action={createQuestionSetFromTemplateAction}>
                    <input
                      type="hidden"
                      name="templateQuestionSetId"
                      value={template.id}
                    />
                    <button
                      type="submit"
                      className="rounded border px-4 py-2 text-sm"
                    >
                      Create from template
                    </button>
                  </form>
                </div>
              </div>
            </DashboardCard>
          ))}
        </section>
      )}
    </main>
  );
}
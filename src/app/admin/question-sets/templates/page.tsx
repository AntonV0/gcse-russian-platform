import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { getQuestionSetTemplatesDb } from "@/lib/questions/question-helpers-db";
import { appIcons } from "@/lib/shared/icons";

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
        <Button href="/admin/question-sets" variant="secondary" icon="back">
          Back to question sets
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-sm text-gray-600 shadow-sm">
          No templates yet.
        </div>
      ) : (
        <section className="grid gap-4">
          {templates.map((template) => (
            <DashboardCard key={template.id} title={template.title}>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="muted" icon="file">
                    {template.slug}
                  </Badge>

                  {template.template_type ? (
                    <Badge tone="info" icon="settings">
                      {template.template_type}
                    </Badge>
                  ) : null}
                </div>

                {template.description ? <p>{template.description}</p> : null}

                <div className="flex flex-wrap gap-3">
                  <Button
                    href={`/admin/question-sets/${template.id}`}
                    variant="secondary"
                    size="sm"
                    icon="preview"
                  >
                    Open template
                  </Button>

                  <Button
                    href={`/admin/question-sets/templates/${template.id}/create`}
                    variant="secondary"
                    size="sm"
                    icon="write"
                  >
                    Create from template
                  </Button>
                </div>
              </div>
            </DashboardCard>
          ))}
        </section>
      )}
    </main>
  );
}

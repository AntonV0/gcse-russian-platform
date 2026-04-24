import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import InlineActions from "@/components/ui/inline-actions";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { getQuestionSetTemplatesDb } from "@/lib/questions/question-helpers-db";

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
        <EmptyState
          icon="question"
          title="No templates yet"
          description="Reusable question-set templates will appear here once created."
        />
      ) : (
        <section className="grid gap-4">
          {templates.map((template) => (
            <CardListItem
              key={template.id}
              title={template.title}
              subtitle={template.description ?? undefined}
              badges={
                <>
                  <Badge tone="muted" icon="file">
                    {template.slug}
                  </Badge>

                  {template.template_type ? (
                    <Badge tone="info" icon="settings">
                      {template.template_type}
                    </Badge>
                  ) : null}
                </>
              }
              actions={
                <InlineActions align="end">
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
                </InlineActions>
              }
            />
          ))}
        </section>
      )}
    </main>
  );
}

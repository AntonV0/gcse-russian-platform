import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import InlineActions from "@/components/ui/inline-actions";
import OperationsWorkspace, {
  OperationsHeader,
  OperationsSection,
} from "@/components/ui/operations-workspace";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { getQuestionSetTemplatesDb } from "@/lib/questions/question-helpers-db";

export default async function AdminQuestionSetTemplatesPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return (
      <main>
        <OperationsWorkspace>
          <OperationsHeader
            eyebrow="Admin question bank"
            title="Access denied"
            description="You need an admin account to manage question-set templates."
          />
        </OperationsWorkspace>
      </main>
    );
  }

  const templates = await getQuestionSetTemplatesDb();

  return (
    <main>
      <OperationsWorkspace>
        <OperationsHeader
          eyebrow="Admin question bank"
          title="Question Set Templates"
          description="Reusable templates for fast content authoring."
          actions={
            <Button href="/admin/question-sets" variant="secondary" icon="back">
              Back to question sets
            </Button>
          }
        />

        <OperationsSection>
          {templates.length === 0 ? (
            <EmptyState
              icon="question"
              title="No templates yet"
              description="Reusable question-set templates will appear here once created."
            />
          ) : (
            <div className="grid gap-3">
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
            </div>
          )}
        </OperationsSection>
      </OperationsWorkspace>
    </main>
  );
}

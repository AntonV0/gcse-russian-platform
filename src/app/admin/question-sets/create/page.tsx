import { requireAdminAccess } from "@/lib/auth/admin-auth";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import Textarea from "@/components/ui/textarea";
import { createQuestionSetAction } from "@/app/actions/admin/admin-question-actions";

export default async function CreateQuestionSetPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <main className="max-w-xl">
      <PageHeader
        title="Create Question Set"
        description="Add a new reusable question set."
      />

      <form action={createQuestionSetAction} className="space-y-4">
        <PanelCard
          title="Question set details"
          description="Use a clear title and slug so this set is easy to find in lessons and assignment workflows."
          tone="admin"
          contentClassName="space-y-4"
        >
          <FormField label="Title" required>
            <Input name="title" required placeholder="Theme 2 translation practice" />
          </FormField>

          <FormField label="Slug" required>
            <Input
              name="slug"
              required
              placeholder="theme-2-translation-practice"
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              name="description"
              rows={3}
              placeholder="Short internal summary for this question set."
            />
          </FormField>

          <FormField label="Instructions">
            <Textarea
              name="instructions"
              rows={3}
              placeholder="Student-facing instructions shown before the questions."
            />
          </FormField>
        </PanelCard>

        <PanelCard
          title="Template settings"
          description="Save this question set as a reusable starting point for future GCSE Russian tasks."
          tone="muted"
          contentClassName="space-y-4"
        >
          <CheckboxField
            name="isTemplate"
            label="Save as template"
            description="Templates can be copied into new question sets."
          />

          <FormField label="Template type">
            <Input
              name="templateType"
              placeholder="translation_selection_based"
            />
          </FormField>
        </PanelCard>

        <InlineActions>
          <Button type="submit" variant="primary" icon="write">
            Create question set
          </Button>
        </InlineActions>
      </form>
    </main>
  );
}

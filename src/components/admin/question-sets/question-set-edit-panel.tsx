import {
  duplicateQuestionSetAction,
  updateQuestionSetAction,
} from "@/app/actions/admin/admin-question-actions";
import type { DbQuestionSet } from "@/lib/questions/question-db-types";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import InlineActions from "@/components/ui/inline-actions";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import Textarea from "@/components/ui/textarea";

export function QuestionSetEditPanel({
  questionSet,
}: {
  questionSet: DbQuestionSet;
}) {
  return (
    <PanelCard
      title="Edit question set"
      description="Update the title, student instructions, and template behaviour."
      tone="admin"
    >
      <form action={updateQuestionSetAction} className="space-y-4">
        <input type="hidden" name="questionSetId" value={questionSet.id} />

        <FormField label="Title" required>
          <Input name="title" required defaultValue={questionSet.title} />
        </FormField>

        <FormField label="Slug" required>
          <Input name="slug" required defaultValue={questionSet.slug ?? ""} />
        </FormField>

        <FormField label="Description">
          <Textarea
            name="description"
            defaultValue={questionSet.description ?? ""}
            rows={3}
          />
        </FormField>

        <FormField label="Instructions">
          <Textarea
            name="instructions"
            defaultValue={questionSet.instructions ?? ""}
            rows={3}
          />
        </FormField>

        <PanelCard
          title="Template settings"
          description="Use templates for repeatable question-set patterns."
          tone="muted"
          density="compact"
          contentClassName="space-y-4"
        >
          <CheckboxField
            name="isTemplate"
            label="This question set is a template"
            defaultChecked={Boolean(questionSet.is_template)}
          />

          <FormField label="Template type">
            <Input
              name="templateType"
              defaultValue={questionSet.template_type ?? ""}
              placeholder="translation_selection_based"
            />
          </FormField>
        </PanelCard>

        <InlineActions>
          <Button type="submit" variant="primary" icon="save">
            Save question set
          </Button>
        </InlineActions>
      </form>

      <form action={duplicateQuestionSetAction} className="mt-4">
        <input type="hidden" name="questionSetId" value={questionSet.id} />
        <Button type="submit" variant="secondary" icon="create">
          Duplicate question set
        </Button>
      </form>
    </PanelCard>
  );
}

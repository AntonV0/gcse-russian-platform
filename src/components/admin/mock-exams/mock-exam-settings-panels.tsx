import {
  deleteMockExamSetAction,
  updateMockExamSetAction,
} from "@/app/actions/admin/admin-mock-exam-actions";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  getMockExamTierLabel,
  mockExamPaperNames,
  mockExamTiers,
  type DbMockExamSet,
} from "@/lib/mock-exams/mock-exam-helpers-db";

export default function MockExamSettingsPanels({ exam }: { exam: DbMockExamSet }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
      <PanelCard
        title="Exam settings"
        description="Edit core metadata, paper identity, publication, ordering, and access."
        tone="admin"
      >
        <form action={updateMockExamSetAction} className="space-y-4">
          <input type="hidden" name="mockExamId" value={exam.id} />

          <div className="grid gap-4 lg:grid-cols-2">
            <FormField label="Title" required>
              <Input name="title" required defaultValue={exam.title} />
            </FormField>

            <FormField label="Slug" required>
              <Input name="slug" required defaultValue={exam.slug} />
            </FormField>

            <FormField label="Description">
              <Textarea name="description" rows={3} defaultValue={exam.description ?? ""} />
            </FormField>

            <FormField label="Paper number" required>
              <Select name="paperNumber" required defaultValue={String(exam.paper_number)}>
                <option value="1">Paper 1</option>
                <option value="2">Paper 2</option>
                <option value="3">Paper 3</option>
                <option value="4">Paper 4</option>
              </Select>
            </FormField>

            <FormField label="Paper name" required>
              <Select name="paperName" required defaultValue={exam.paper_name}>
                {mockExamPaperNames.map((paperName) => (
                  <option key={paperName} value={paperName}>
                    {paperName}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Tier" required>
              <Select name="tier" required defaultValue={exam.tier}>
                {mockExamTiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {getMockExamTierLabel(tier)}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Time limit minutes">
              <Input
                name="timeLimitMinutes"
                type="number"
                min="1"
                defaultValue={exam.time_limit_minutes ?? ""}
              />
            </FormField>

            <FormField label="Total marks">
              <Input
                name="totalMarks"
                type="number"
                min="0"
                step="0.5"
                defaultValue={String(exam.total_marks)}
              />
            </FormField>

            <FormField label="Sort order">
              <Input
                name="sortOrder"
                type="number"
                min="0"
                defaultValue={String(exam.sort_order)}
              />
            </FormField>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                name="isPublished"
                value="true"
                defaultChecked={exam.is_published}
              />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                name="isTrialVisible"
                value="true"
                defaultChecked={exam.is_trial_visible}
              />
              Trial visible
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                name="requiresPaidAccess"
                value="true"
                defaultChecked={exam.requires_paid_access}
              />
              Requires paid access
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                name="availableInVolna"
                value="true"
                defaultChecked={exam.available_in_volna}
              />
              Volna visible
            </label>
          </div>

          <Button type="submit" variant="primary" icon="save">
            Save exam
          </Button>
        </form>
      </PanelCard>

      <PanelCard
        title="Delete exam"
        description="Remove this exam set and all sections and questions."
        tone="muted"
      >
        <form action={deleteMockExamSetAction} className="space-y-3">
          <input type="hidden" name="mockExamId" value={exam.id} />
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            Deleting this exam also deletes all nested section and question records.
          </p>
          <AdminConfirmButton
            variant="danger"
            icon="delete"
            confirmMessage={`Delete ${exam.title}? This cannot be undone.`}
          >
            Delete exam
          </AdminConfirmButton>
        </form>
      </PanelCard>
    </section>
  );
}

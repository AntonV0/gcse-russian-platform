import { createMockExamSetAction } from "@/app/actions/admin/admin-mock-exam-actions";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import {
  getMockExamTierLabel,
  mockExamPaperNames,
  mockExamTiers,
} from "@/lib/mock-exams/mock-exam-helpers-db";

export function MockExamCreatePanel() {
  return (
    <PanelCard
      title="Create mock exam set"
      description="Start with the paper identity and access settings. Sections and questions are added on the exam detail page."
      tone="admin"
    >
      <form action={createMockExamSetAction} className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <FormField label="Title" required>
            <Input name="title" required placeholder="Foundation Paper 3 mock 1" />
          </FormField>

          <FormField label="Slug" required>
            <Input name="slug" required placeholder="foundation-paper-3-mock-1" />
          </FormField>

          <FormField label="Description">
            <Input
              name="description"
              placeholder="Original reading mock exam for revision."
            />
          </FormField>

          <FormField label="Paper number" required>
            <Select name="paperNumber" required defaultValue="3">
              <option value="1">Paper 1</option>
              <option value="2">Paper 2</option>
              <option value="3">Paper 3</option>
              <option value="4">Paper 4</option>
            </Select>
          </FormField>

          <FormField label="Paper name" required>
            <Select name="paperName" required defaultValue="Paper 3 Reading">
              {mockExamPaperNames.map((paperName) => (
                <option key={paperName} value={paperName}>
                  {paperName}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Tier" required>
            <Select name="tier" required defaultValue="foundation">
              {mockExamTiers.map((tier) => (
                <option key={tier} value={tier}>
                  {getMockExamTierLabel(tier)}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Time limit minutes">
            <Input name="timeLimitMinutes" type="number" min="1" />
          </FormField>

          <FormField label="Total marks">
            <Input
              name="totalMarks"
              type="number"
              min="0"
              step="0.5"
              defaultValue="0"
            />
          </FormField>

          <FormField label="Sort order">
            <Input name="sortOrder" type="number" min="0" defaultValue="0" />
          </FormField>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <input type="checkbox" name="isPublished" value="true" />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <input type="checkbox" name="isTrialVisible" value="true" />
            Trial visible
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <input
              type="checkbox"
              name="requiresPaidAccess"
              value="true"
              defaultChecked
            />
            Requires paid access
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <input
              type="checkbox"
              name="availableInVolna"
              value="true"
              defaultChecked
            />
            Volna visible
          </label>
        </div>

        <Button type="submit" variant="primary" icon="create">
          Create mock exam
        </Button>
      </form>
    </PanelCard>
  );
}

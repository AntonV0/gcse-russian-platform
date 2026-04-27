import { createMockExamSectionAction } from "@/app/actions/admin/admin-mock-exam-actions";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  getMockExamSectionTypeLabel,
  mockExamSectionTypes,
} from "@/lib/mock-exams/mock-exam-helpers-db";

export default function MockExamSectionCreatePanel({
  mockExamId,
}: {
  mockExamId: string;
}) {
  return (
    <SectionCard
      title="Add section"
      description="Sections map to exam paper areas such as listening, reading, writing, speaking, or translation."
      tone="admin"
    >
      <form action={createMockExamSectionAction} className="space-y-4">
        <input type="hidden" name="mockExamId" value={mockExamId} />

        <div className="grid gap-4 lg:grid-cols-2">
          <FormField label="Title" required>
            <Input name="title" required placeholder="Section A" />
          </FormField>

          <FormField label="Section type" required>
            <Select name="sectionType" required defaultValue="reading">
              {mockExamSectionTypes.map((sectionType) => (
                <option key={sectionType} value={sectionType}>
                  {getMockExamSectionTypeLabel(sectionType)}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Sort order">
            <Input name="sortOrder" type="number" min="0" defaultValue="0" />
          </FormField>
        </div>

        <FormField label="Instructions">
          <Textarea name="instructions" rows={3} />
        </FormField>

        <Button type="submit" variant="primary" icon="create">
          Add section
        </Button>
      </form>
    </SectionCard>
  );
}

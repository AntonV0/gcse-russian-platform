import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import type { TeacherGroupOption } from "@/lib/assignments/assignment-helpers-db";

type TeacherAssignmentDetailsFieldsProps = {
  groups: TeacherGroupOption[];
  groupId: string;
  title: string;
  instructions: string;
  dueAt: string;
  allowFileUpload: boolean;
  onGroupChange: (groupId: string) => void;
  onTitleChange: (title: string) => void;
  onInstructionsChange: (instructions: string) => void;
  onDueAtChange: (dueAt: string) => void;
  onAllowFileUploadChange: (allowFileUpload: boolean) => void;
};

export default function TeacherAssignmentDetailsFields({
  groups,
  groupId,
  title,
  instructions,
  dueAt,
  allowFileUpload,
  onGroupChange,
  onTitleChange,
  onInstructionsChange,
  onDueAtChange,
  onAllowFileUploadChange,
}: TeacherAssignmentDetailsFieldsProps) {
  return (
    <>
      <FormField label="Group">
        <Select value={groupId} onChange={(event) => onGroupChange(event.target.value)}>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Title" required>
        <Input
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="e.g. Week 1 homework"
        />
      </FormField>

      <FormField label="Instructions">
        <Textarea
          value={instructions}
          onChange={(event) => onInstructionsChange(event.target.value)}
          rows={4}
          placeholder="Add any instructions for students..."
        />
      </FormField>

      <FormField label="Due date">
        <Input
          type="datetime-local"
          value={dueAt}
          onChange={(event) => onDueAtChange(event.target.value)}
        />
      </FormField>

      <label className="app-checkbox-field">
        <input
          type="checkbox"
          checked={allowFileUpload}
          onChange={(event) => onAllowFileUploadChange(event.target.checked)}
          className="app-focus-ring app-checkbox-input"
        />
        <span className="app-checkbox-copy">
          <span className="app-checkbox-label">Allow file upload</span>
          <span className="app-checkbox-description">
            Students can upload an image, PDF, or file with their written work.
          </span>
        </span>
      </label>
    </>
  );
}

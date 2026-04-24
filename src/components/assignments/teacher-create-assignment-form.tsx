"use client";

import { useMemo, useState } from "react";
import { createTeacherAssignmentAction } from "@/app/actions/teacher/teacher-create-assignment-actions";
import { updateTeacherAssignmentAction } from "@/app/actions/teacher/teacher-update-assignment-actions";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import type {
  LessonOption,
  QuestionSetOption,
  TeacherGroupOption,
} from "@/lib/assignments/assignment-helpers-db";

type TeacherAssignmentFormInitialData = {
  groupId: string;
  title: string;
  instructions: string | null;
  dueAt: string | null;
  lessonIds: string[];
  questionSetIds: string[];
  customTask: string | null;
  allowFileUpload: boolean;
};

type AssignmentItem =
  | { type: "lesson"; lessonId: string }
  | { type: "question_set"; questionSetId: string }
  | { type: "custom_task"; customPrompt: string };

type TeacherCreateAssignmentFormProps = {
  groups: TeacherGroupOption[];
  lessonsByGroup: Record<string, LessonOption[]>;
  questionSets: QuestionSetOption[];
  mode?: "create" | "edit";
  assignmentId?: string;
  initialData?: TeacherAssignmentFormInitialData;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function toDateTimeLocalValue(value: string | null | undefined) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

function buildInitialItems(
  initialData?: TeacherAssignmentFormInitialData
): AssignmentItem[] {
  if (!initialData) return [];

  const lessonItems: AssignmentItem[] = initialData.lessonIds.map((id) => ({
    type: "lesson",
    lessonId: id,
  }));

  const questionSetItems: AssignmentItem[] = initialData.questionSetIds.map((id) => ({
    type: "question_set",
    questionSetId: id,
  }));

  const customTaskItems: AssignmentItem[] = initialData.customTask?.trim()
    ? [
        {
          type: "custom_task",
          customPrompt: initialData.customTask,
        },
      ]
    : [];

  return [...lessonItems, ...questionSetItems, ...customTaskItems];
}

export default function TeacherCreateAssignmentForm({
  groups,
  lessonsByGroup,
  questionSets,
  mode = "create",
  assignmentId,
  initialData,
}: TeacherCreateAssignmentFormProps) {
  const isEditMode = mode === "edit";

  const [groupId, setGroupId] = useState(initialData?.groupId ?? groups[0]?.id ?? "");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [instructions, setInstructions] = useState(initialData?.instructions ?? "");
  const [dueAt, setDueAt] = useState(toDateTimeLocalValue(initialData?.dueAt));
  const [allowFileUpload, setAllowFileUpload] = useState(
    initialData?.allowFileUpload ?? false
  );
  const [items, setItems] = useState<AssignmentItem[]>(() =>
    buildInitialItems(initialData)
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableLessons = useMemo(
    () => lessonsByGroup[groupId] ?? [],
    [lessonsByGroup, groupId]
  );

  const selectedLessonIds = useMemo(
    () => items.filter((item) => item.type === "lesson").map((item) => item.lessonId),
    [items]
  );

  const selectedQuestionSetIds = useMemo(
    () =>
      items
        .filter((item) => item.type === "question_set")
        .map((item) => item.questionSetId),
    [items]
  );

  const customTaskValue = useMemo(() => {
    const customTask = items.find((item) => item.type === "custom_task");
    return customTask?.customPrompt ?? "";
  }, [items]);

  function toggleLesson(lessonId: string) {
    setItems((prev) => {
      const exists = prev.some(
        (item) => item.type === "lesson" && item.lessonId === lessonId
      );

      if (exists) {
        return prev.filter(
          (item) => !(item.type === "lesson" && item.lessonId === lessonId)
        );
      }

      return [...prev, { type: "lesson", lessonId }];
    });
  }

  function toggleQuestionSet(questionSetId: string) {
    setItems((prev) => {
      const exists = prev.some(
        (item) => item.type === "question_set" && item.questionSetId === questionSetId
      );

      if (exists) {
        return prev.filter(
          (item) =>
            !(item.type === "question_set" && item.questionSetId === questionSetId)
        );
      }

      return [...prev, { type: "question_set", questionSetId }];
    });
  }

  function setCustomTaskValue(value: string) {
    setItems((prev) => {
      const withoutCustomTask = prev.filter((item) => item.type !== "custom_task");

      if (!value.trim()) {
        return withoutCustomTask;
      }

      return [
        ...withoutCustomTask,
        {
          type: "custom_task",
          customPrompt: value,
        },
      ];
    });
  }

  function handleGroupChange(nextGroupId: string) {
    setGroupId(nextGroupId);
    setItems((prev) => prev.filter((item) => item.type !== "lesson"));
  }

  function moveItem(index: number, direction: "up" | "down") {
    setItems((prev) => {
      const newItems = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= newItems.length) {
        return prev;
      }

      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      return newItems;
    });
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  function getItemLabel(item: AssignmentItem) {
    if (item.type === "lesson") {
      const lesson = availableLessons.find((entry) => entry.id === item.lessonId);

      return {
        title: lesson?.title ?? "Lesson",
        subtitle: lesson?.module_title ?? "",
      };
    }

    if (item.type === "question_set") {
      const questionSet = questionSets.find((entry) => entry.id === item.questionSetId);

      return {
        title: questionSet?.title ?? "Question set",
        subtitle: questionSet?.description ?? "",
      };
    }

    return {
      title: "Custom task",
      subtitle: item.customPrompt,
    };
  }

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);

    const payload = {
      groupId,
      title,
      instructions,
      dueAt: dueAt ? new Date(dueAt).toISOString() : null,
      items,
      allowFileUpload,
    };

    const result =
      isEditMode && assignmentId
        ? await updateTeacherAssignmentAction({
            assignmentId,
            ...payload,
          })
        : await createTeacherAssignmentAction(payload);

    if (result && !result.success) {
      switch (result.error) {
        case "missing_assignment_id":
          setError("Missing assignment id.");
          break;
        case "missing_title":
          setError("Please enter an assignment title.");
          break;
        case "missing_group":
          setError("Please choose a group.");
          break;
        case "missing_items":
          setError("Please add at least one assignment item.");
          break;
        case "assignment_update_failed":
          setError("Something went wrong while updating the assignment.");
          break;
        default:
          setError(
            isEditMode
              ? "Something went wrong while updating the assignment."
              : "Something went wrong while creating the assignment."
          );
      }

      setIsSubmitting(false);
    }
  }

  return (
    <div className="dev-marker-host relative">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="TeacherCreateAssignmentForm"
          filePath="src/components/assignments/teacher-create-assignment-form.tsx"
          tier="semantic"
          componentRole="Teacher assignment authoring form for selecting groups, lessons, question sets, custom tasks, and item order"
          bestFor="Teacher workflows where an assignment needs structured work items and optional file-upload settings."
          usageExamples={[
            "Create teacher assignment",
            "Edit assignment workflow",
            "Attach lessons to group work",
            "Question-set homework setup",
          ]}
          notes="Use for teacher assignment create/edit flows. Do not use for student submissions or admin lesson-builder forms."
        />
      ) : null}

      <PanelCard
        title={isEditMode ? "Edit assignment" : "New assignment"}
        description="Choose the group, add work items, and set the order students should complete them in."
        tone="default"
        contentClassName="space-y-6"
      >
        <div className="flex justify-end">
        <Button href="/teacher/assignments" variant="quiet" size="sm" icon="back">
          Back to assignments
        </Button>
        </div>

        <FormField label="Group">
        <Select value={groupId} onChange={(event) => handleGroupChange(event.target.value)}>
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
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Week 1 homework"
        />
        </FormField>

        <FormField label="Instructions">
        <Textarea
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
          rows={4}
          placeholder="Add any instructions for students..."
        />
        </FormField>

        <FormField label="Due date">
        <Input
          type="datetime-local"
          value={dueAt}
          onChange={(event) => setDueAt(event.target.value)}
        />
        </FormField>

        <label className="app-checkbox-field">
        <input
          type="checkbox"
          checked={allowFileUpload}
          onChange={(event) => setAllowFileUpload(event.target.checked)}
          className="app-focus-ring app-checkbox-input"
        />
        <span className="app-checkbox-copy">
          <span className="app-checkbox-label">Allow file upload</span>
          <span className="app-checkbox-description">
            Students can upload an image, PDF, or file with their written work.
          </span>
        </span>
        </label>

        <div className="space-y-3">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          Attach lessons
        </p>

        {availableLessons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-4 text-sm app-text-muted">
            No lessons available for this group yet.
          </div>
        ) : (
          <div className="space-y-2">
            {availableLessons.map((lesson) => (
              <label
                key={lesson.id}
                className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-3 transition hover:border-[var(--border-strong)]"
              >
                <input
                  type="checkbox"
                  checked={selectedLessonIds.includes(lesson.id)}
                  onChange={() => toggleLesson(lesson.id)}
                  className="app-focus-ring app-checkbox-input mt-1"
                />
                <span>
                  <span className="block font-medium text-[var(--text-primary)]">
                    {lesson.title}
                  </span>
                  <span className="block text-sm app-text-muted">
                    {lesson.module_title}
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
        </div>

        <div className="space-y-3">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          Attach question sets
        </p>

        {questionSets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-4 text-sm app-text-muted">
            No question sets available yet.
          </div>
        ) : (
          <div className="space-y-2">
            {questionSets.map((questionSet) => (
              <label
                key={questionSet.id}
                className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-3 transition hover:border-[var(--border-strong)]"
              >
                <input
                  type="checkbox"
                  checked={selectedQuestionSetIds.includes(questionSet.id)}
                  onChange={() => toggleQuestionSet(questionSet.id)}
                  className="app-focus-ring app-checkbox-input mt-1"
                />
                <span>
                  <span className="block font-medium text-[var(--text-primary)]">
                    {questionSet.title}
                  </span>
                  {questionSet.description ? (
                    <span className="block text-sm app-text-muted">
                      {questionSet.description}
                    </span>
                  ) : null}
                </span>
              </label>
            ))}
          </div>
        )}
        </div>

        <FormField label="Custom task">
        <Textarea
          value={customTaskValue}
          onChange={(event) => setCustomTaskValue(event.target.value)}
          rows={4}
          placeholder="Optional: add a written task or teacher instruction..."
        />
        </FormField>

        <div className="space-y-3">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          Assignment items (order)
        </p>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-4 text-sm app-text-muted">
            No items added yet.
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => {
              const label = getItemLabel(item);

              return (
                <div
                  key={`${item.type}-${index}`}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">
                      {index + 1}. {label.title}
                    </p>
                    {label.subtitle ? (
                      <p className="app-text-muted">{label.subtitle}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={() => moveItem(index, "up")}
                      variant="secondary"
                      size="sm"
                      iconOnly
                      icon="up"
                      ariaLabel="Move item up"
                    >
                      Move item up
                    </Button>
                    <Button
                      type="button"
                      onClick={() => moveItem(index, "down")}
                      variant="secondary"
                      size="sm"
                      iconOnly
                      icon="down"
                      ariaLabel="Move item down"
                    >
                      Move item down
                    </Button>
                    <Button
                      type="button"
                      onClick={() => removeItem(index)}
                      variant="danger"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>

        {error ? <FeedbackBanner tone="danger" description={error} /> : null}

        <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          variant="primary"
        >
          {isSubmitting
            ? isEditMode
              ? "Saving..."
              : "Creating..."
            : isEditMode
              ? "Save changes"
              : "Create assignment"}
        </Button>

        <Button href="/teacher/assignments" variant="quiet">
          Cancel
        </Button>
        </div>
      </PanelCard>
    </div>
  );
}

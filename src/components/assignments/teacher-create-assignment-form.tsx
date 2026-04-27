"use client";

import { useMemo, useState } from "react";
import { createTeacherAssignmentAction } from "@/app/actions/teacher/teacher-create-assignment-actions";
import { updateTeacherAssignmentAction } from "@/app/actions/teacher/teacher-update-assignment-actions";
import TeacherAssignmentDetailsFields from "@/components/assignments/teacher-assignment-details-fields";
import type {
  AssignmentItem,
  TeacherAssignmentFormInitialData,
  TeacherCreateAssignmentFormProps,
} from "@/components/assignments/teacher-assignment-form-types";
import TeacherAssignmentItemOrderList from "@/components/assignments/teacher-assignment-item-order-list";
import TeacherAssignmentResourceSelectors from "@/components/assignments/teacher-assignment-resource-selectors";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PanelCard from "@/components/ui/panel-card";
import DevComponentMarker from "@/components/ui/dev-component-marker";

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
        <div className="app-mobile-action-stack flex justify-end">
        <Button href="/teacher/assignments" variant="quiet" size="sm" icon="back">
          Back to assignments
        </Button>
        </div>

        <TeacherAssignmentDetailsFields
          groups={groups}
          groupId={groupId}
          title={title}
          instructions={instructions}
          dueAt={dueAt}
          allowFileUpload={allowFileUpload}
          onGroupChange={handleGroupChange}
          onTitleChange={setTitle}
          onInstructionsChange={setInstructions}
          onDueAtChange={setDueAt}
          onAllowFileUploadChange={setAllowFileUpload}
        />

        <TeacherAssignmentResourceSelectors
          availableLessons={availableLessons}
          questionSets={questionSets}
          selectedLessonIds={selectedLessonIds}
          selectedQuestionSetIds={selectedQuestionSetIds}
          customTaskValue={customTaskValue}
          onToggleLesson={toggleLesson}
          onToggleQuestionSet={toggleQuestionSet}
          onCustomTaskChange={setCustomTaskValue}
        />

        <TeacherAssignmentItemOrderList
          items={items}
          availableLessons={availableLessons}
          questionSets={questionSets}
          onMoveItem={moveItem}
          onRemoveItem={removeItem}
        />

        {error ? <FeedbackBanner tone="danger" description={error} /> : null}

        <div className="app-mobile-action-stack flex flex-wrap items-center gap-3">
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

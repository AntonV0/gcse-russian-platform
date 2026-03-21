"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createTeacherAssignmentAction } from "@/app/actions/teacher-create-assignment-actions";
import type {
  LessonOption,
  QuestionSetOption,
  TeacherGroupOption,
} from "@/lib/assignment-helpers-db";

type TeacherCreateAssignmentFormProps = {
  groups: TeacherGroupOption[];
  lessonsByGroup: Record<string, LessonOption[]>;
  questionSets: QuestionSetOption[];
};

export default function TeacherCreateAssignmentForm({
  groups,
  lessonsByGroup,
  questionSets,
}: TeacherCreateAssignmentFormProps) {
  const [groupId, setGroupId] = useState(groups[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [customTask, setCustomTask] = useState("");
  const [allowFileUpload, setAllowFileUpload] = useState(false);
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [selectedQuestionSetIds, setSelectedQuestionSetIds] = useState<string[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableLessons = useMemo(
    () => lessonsByGroup[groupId] ?? [],
    [lessonsByGroup, groupId]
  );

  function toggleLesson(lessonId: string) {
    setSelectedLessonIds((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  }

  function toggleQuestionSet(questionSetId: string) {
    setSelectedQuestionSetIds((prev) =>
      prev.includes(questionSetId)
        ? prev.filter((id) => id !== questionSetId)
        : [...prev, questionSetId]
    );
  }

  function handleGroupChange(nextGroupId: string) {
    setGroupId(nextGroupId);
    setSelectedLessonIds([]);
  }

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);

    const result = await createTeacherAssignmentAction({
      groupId,
      title,
      instructions,
      dueAt: dueAt ? new Date(dueAt).toISOString() : null,
      lessonIds: selectedLessonIds,
      questionSetIds: selectedQuestionSetIds,
      customTask,
      allowFileUpload,
    });

    if (result && !result.success) {
      switch (result.error) {
        case "missing_title":
          setError("Please enter an assignment title.");
          break;
        case "missing_group":
          setError("Please choose a group.");
          break;
        case "missing_items":
          setError(
            "Please select at least one lesson or question set, or add a custom task."
          );
          break;
        default:
          setError("Something went wrong while creating the assignment.");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 rounded-lg border p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">New assignment</h2>
        <Link
          href="/teacher/assignments"
          className="text-sm text-blue-600 hover:underline"
        >
          Back to assignments
        </Link>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Group</label>
        <select
          value={groupId}
          onChange={(e) => handleGroupChange(e.target.value)}
          className="w-full rounded border px-3 py-2"
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="e.g. Week 1 homework"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Instructions</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={4}
          className="w-full rounded border px-3 py-2"
          placeholder="Add any instructions for students..."
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Due date</label>
        <input
          type="datetime-local"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <label className="flex items-start gap-3 rounded border p-4">
        <input
          type="checkbox"
          checked={allowFileUpload}
          onChange={(e) => setAllowFileUpload(e.target.checked)}
          className="mt-1"
        />
        <div>
          <div className="font-medium">Allow file upload</div>
          <div className="text-sm text-gray-600">
            Students can upload an image, PDF, or file with their written work.
          </div>
        </div>
      </label>

      <div className="space-y-3">
        <p className="text-sm font-medium">Attach lessons</p>

        {availableLessons.length === 0 ? (
          <div className="rounded border p-4 text-sm text-gray-600">
            No lessons available for this group yet.
          </div>
        ) : (
          <div className="space-y-2">
            {availableLessons.map((lesson) => (
              <label
                key={lesson.id}
                className="flex cursor-pointer items-start gap-3 rounded border p-3"
              >
                <input
                  type="checkbox"
                  checked={selectedLessonIds.includes(lesson.id)}
                  onChange={() => toggleLesson(lesson.id)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">{lesson.title}</div>
                  <div className="text-sm text-gray-600">
                    {lesson.module_title}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Attach question sets</p>

        {questionSets.length === 0 ? (
          <div className="rounded border p-4 text-sm text-gray-600">
            No question sets available yet.
          </div>
        ) : (
          <div className="space-y-2">
            {questionSets.map((questionSet) => (
              <label
                key={questionSet.id}
                className="flex cursor-pointer items-start gap-3 rounded border p-3"
              >
                <input
                  type="checkbox"
                  checked={selectedQuestionSetIds.includes(questionSet.id)}
                  onChange={() => toggleQuestionSet(questionSet.id)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">{questionSet.title}</div>
                  {questionSet.description ? (
                    <div className="text-sm text-gray-600">
                      {questionSet.description}
                    </div>
                  ) : null}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Custom task</label>
        <textarea
          value={customTask}
          onChange={(e) => setCustomTask(e.target.value)}
          rows={4}
          className="w-full rounded border px-3 py-2"
          placeholder="Optional: add a written task or teacher instruction..."
        />
      </div>

      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create assignment"}
        </button>

        <Link
          href="/teacher/assignments"
          className="text-sm text-gray-600 hover:underline"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
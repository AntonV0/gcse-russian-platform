"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTeacherAssignmentAction } from "@/app/actions/teacher-create-assignment-actions";
import type { LessonOption, TeacherGroupOption } from "@/lib/assignment-helpers-db";

type TeacherCreateAssignmentFormProps = {
  groups: TeacherGroupOption[];
  lessonsByGroup: Record<string, LessonOption[]>;
};

export default function TeacherCreateAssignmentForm({
  groups,
  lessonsByGroup,
}: TeacherCreateAssignmentFormProps) {
  const router = useRouter();
  const [groupId, setGroupId] = useState(groups[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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

  function handleGroupChange(nextGroupId: string) {
    setGroupId(nextGroupId);
    setSelectedLessonIds([]);
  }

  function handleSubmit() {
    setError(null);

    startTransition(async () => {
      const result = await createTeacherAssignmentAction({
        groupId,
        title,
        instructions,
        dueAt: dueAt ? new Date(dueAt).toISOString() : null,
        lessonIds: selectedLessonIds,
      });

      if (!result.success) {
        switch (result.error) {
          case "missing_title":
            setError("Please enter an assignment title.");
            break;
          case "missing_group":
            setError("Please choose a group.");
            break;
          case "missing_lessons":
            setError("Please select at least one lesson.");
            break;
          default:
            setError("Something went wrong while creating the assignment.");
        }
        return;
      }

      router.push("/teacher/assignments");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6 rounded-lg border p-6">
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

      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create assignment"}
      </button>
    </div>
  );
}
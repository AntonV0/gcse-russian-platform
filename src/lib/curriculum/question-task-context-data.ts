import type { QuestionTaskContext } from "./question-taxonomy-types";

export const QUESTION_TASK_CONTEXTS = [
  {
    key: "standalone_practice",
    label: "Standalone practice",
    description: "A single reusable drill or practice question.",
    order: 1,
  },
  {
    key: "question_set",
    label: "Question set",
    description: "A reusable sequence of practice questions.",
    order: 2,
  },
  {
    key: "lesson_practice",
    label: "Lesson practice",
    description: "Practice embedded inside a lesson section.",
    order: 3,
  },
  {
    key: "reading_task",
    label: "Reading task",
    description: "A reading stimulus with one or more linked questions.",
    order: 4,
  },
  {
    key: "listening_task",
    label: "Listening task",
    description: "An audio stimulus with one or more linked questions.",
    order: 5,
  },
  {
    key: "writing_task",
    label: "Writing task",
    description: "A writing prompt, scaffold, draft, or upload task.",
    order: 6,
  },
  {
    key: "speaking_task",
    label: "Speaking task",
    description: "Role play, photo card, conversation, recording, or prep work.",
    order: 7,
  },
  {
    key: "mock_exam_section",
    label: "Mock exam section",
    description: "A section within a mock exam attempt.",
    order: 8,
  },
  {
    key: "assignment_task",
    label: "Assignment task",
    description: "A teacher-assigned task or question.",
    order: 9,
  },
] as const satisfies readonly QuestionTaskContext[];

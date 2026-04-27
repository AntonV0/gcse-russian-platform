import type {
  LessonOption,
  QuestionSetOption,
  TeacherGroupOption,
} from "@/lib/assignments/assignment-helpers-db";

export type TeacherAssignmentFormInitialData = {
  groupId: string;
  title: string;
  instructions: string | null;
  dueAt: string | null;
  lessonIds: string[];
  questionSetIds: string[];
  customTask: string | null;
  allowFileUpload: boolean;
};

export type AssignmentItem =
  | { type: "lesson"; lessonId: string }
  | { type: "question_set"; questionSetId: string }
  | { type: "custom_task"; customPrompt: string };

export type TeacherCreateAssignmentFormProps = {
  groups: TeacherGroupOption[];
  lessonsByGroup: Record<string, LessonOption[]>;
  questionSets: QuestionSetOption[];
  mode?: "create" | "edit";
  assignmentId?: string;
  initialData?: TeacherAssignmentFormInitialData;
};

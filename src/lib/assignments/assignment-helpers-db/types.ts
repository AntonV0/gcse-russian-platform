export type DbAssignment = {
  id: string;
  group_id: string;
  title: string;
  instructions: string | null;
  due_at: string | null;
  status: string;
  created_by: string;
  allow_file_upload: boolean;
  created_at: string;
  updated_at: string;
};

export const ASSIGNMENT_SELECT =
  "id, group_id, title, instructions, due_at, status, created_by, allow_file_upload, created_at, updated_at";

export type DbAssignmentItem = {
  id: string;
  assignment_id: string;
  item_type: string;
  lesson_id: string | null;
  question_set_id: string | null;
  custom_prompt: string | null;
  position: number;
};

export const ASSIGNMENT_ITEM_SELECT =
  "id, assignment_id, item_type, lesson_id, question_set_id, custom_prompt, position";

export type AssignmentSubmissionStatus = "not_started" | "submitted" | "reviewed";

export type DbAssignmentSubmission = {
  id: string;
  assignment_id: string;
  student_user_id: string;
  status: AssignmentSubmissionStatus;
  submitted_text: string | null;
  submitted_file_path: string | null;
  submitted_file_name: string | null;
  submitted_at: string | null;
  mark: number | null;
  feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
};

export const ASSIGNMENT_SUBMISSION_SELECT =
  "id, assignment_id, student_user_id, status, submitted_text, submitted_file_path, submitted_file_name, submitted_at, mark, feedback, reviewed_by, reviewed_at";

export const ASSIGNMENT_PROFILE_SELECT = "id, full_name, display_name, email";

export type StudentAssignmentCard = {
  assignment: DbAssignment;
  items: Array<
    DbAssignmentItem & {
      lesson: {
        id: string;
        slug: string;
        title: string;
        module_slug: string;
        variant_slug: string;
        course_slug: string;
      } | null;
    }
  >;
  submission: DbAssignmentSubmission | null;
};

export type TeacherSubmissionReviewCard = {
  submission: DbAssignmentSubmission;
  student: {
    id: string;
    full_name: string | null;
    display_name: string | null;
    email: string | null;
  } | null;
  reviewer: {
    id: string;
    full_name: string | null;
    display_name: string | null;
    email: string | null;
  } | null;
};

export type TeacherAssignmentListItem = {
  assignment: DbAssignment;
  group: {
    id: string;
    name: string;
  } | null;
  submissionCount: number;
  reviewedSubmissionCount: number;
};

export type TeacherGroupOption = {
  id: string;
  name: string;
  course_id: string | null;
  course_variant_id: string | null;
};

export type LessonOption = {
  id: string;
  title: string;
  slug: string;
  module_slug: string;
  module_title: string;
  variant_slug: string;
  course_slug: string;
};

export type QuestionSetOption = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
};

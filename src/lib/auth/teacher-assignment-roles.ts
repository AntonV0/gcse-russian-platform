export const TEACHER_ASSIGNMENT_ROLES = ["teacher", "assistant"] as const;

export function isTeacherAssignmentRole(role: string | null | undefined) {
  return TEACHER_ASSIGNMENT_ROLES.some((teacherRole) => teacherRole === role);
}

export function isStudentAssignmentRole(role: string | null | undefined) {
  return role === "student";
}

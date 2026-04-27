import { describe, expect, it } from "vitest";
import { isTeacherAssignmentRole } from "@/lib/auth/teacher-assignment-roles";

describe("isTeacherAssignmentRole", () => {
  it("allows teachers and assistants to manage assignments", () => {
    expect(isTeacherAssignmentRole("teacher")).toBe(true);
    expect(isTeacherAssignmentRole("assistant")).toBe(true);
  });

  it("rejects non-teacher group roles and empty values", () => {
    expect(isTeacherAssignmentRole("student")).toBe(false);
    expect(isTeacherAssignmentRole("")).toBe(false);
    expect(isTeacherAssignmentRole(null)).toBe(false);
    expect(isTeacherAssignmentRole(undefined)).toBe(false);
  });
});

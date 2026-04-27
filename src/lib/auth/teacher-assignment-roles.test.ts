import { describe, expect, it } from "vitest";
import {
  isStudentAssignmentRole,
  isTeacherAssignmentRole,
} from "@/lib/auth/teacher-assignment-roles";

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

describe("isStudentAssignmentRole", () => {
  it("allows only student group members to submit assignment work", () => {
    expect(isStudentAssignmentRole("student")).toBe(true);
  });

  it("rejects teacher-side assignment roles and empty values", () => {
    expect(isStudentAssignmentRole("teacher")).toBe(false);
    expect(isStudentAssignmentRole("assistant")).toBe(false);
    expect(isStudentAssignmentRole("")).toBe(false);
    expect(isStudentAssignmentRole(null)).toBe(false);
    expect(isStudentAssignmentRole(undefined)).toBe(false);
  });
});

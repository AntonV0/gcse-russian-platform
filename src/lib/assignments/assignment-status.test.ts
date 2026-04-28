import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getDueDateClass,
  getDueDateStatus,
  getDueDateUrgency,
} from "@/lib/assignments/assignment-status";

describe("assignment due-date helpers", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("reports none when no due date is set", () => {
    expect(getDueDateStatus(null)).toBe("none");
  });

  it("classifies overdue, soon, and normal due dates relative to now", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-27T12:00:00.000Z"));

    expect(getDueDateStatus("2026-04-27T11:59:59.000Z")).toBe("overdue");
    expect(getDueDateStatus("2026-04-29T12:00:00.000Z")).toBe("soon");
    expect(getDueDateStatus("2026-04-29T12:00:01.000Z")).toBe("normal");
  });

  it("maps due-date statuses to display classes", () => {
    expect(getDueDateClass("overdue")).toContain("--danger-text");
    expect(getDueDateClass("soon")).toContain("--warning-text");
    expect(getDueDateClass("normal")).toContain("--text-muted");
    expect(getDueDateClass("none")).toContain("--text-muted");
  });

  it("returns student-facing urgency copy for overdue and soon due dates", () => {
    const now = new Date("2026-04-27T12:00:00.000Z");

    expect(getDueDateUrgency("2026-04-27T11:59:59.000Z", now)).toMatchObject({
      status: "overdue",
      tone: "danger",
      title: "Past due",
      label: "Overdue",
    });
    expect(getDueDateUrgency("2026-04-29T12:00:00.000Z", now)).toMatchObject({
      status: "soon",
      tone: "warning",
      title: "Due soon",
      label: "Due soon",
    });
  });
});

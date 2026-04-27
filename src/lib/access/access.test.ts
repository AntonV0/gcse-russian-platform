import { describe, expect, it, vi } from "vitest";
import { getLessonAccessStateFromMeta } from "@/lib/access/access";

vi.mock("@/lib/auth/auth", () => ({
  getCurrentCourseAccess: vi.fn(),
  getCurrentProfile: vi.fn(),
}));

vi.mock("@/lib/courses/course-helpers-db", () => ({
  getLessonAccessMetaDb: vi.fn(),
}));

describe("getLessonAccessStateFromMeta", () => {
  it("allows admins and teachers even when lesson metadata is missing", () => {
    expect(getLessonAccessStateFromMeta(null, { is_admin: true }, null)).toBe(
      "accessible"
    );
    expect(getLessonAccessStateFromMeta(null, { is_teacher: true }, null)).toBe(
      "accessible"
    );
  });

  it("allows trial-visible lessons without a paid access grant", () => {
    expect(
      getLessonAccessStateFromMeta(
        { is_trial_visible: true, available_in_volna: false },
        null,
        null
      )
    ).toBe("accessible");
  });

  it("locks paid lessons without an access grant", () => {
    expect(
      getLessonAccessStateFromMeta(
        { is_trial_visible: false, available_in_volna: true },
        null,
        null
      )
    ).toBe("locked");
  });

  it("allows full grants and only allows volna grants for Volna lessons", () => {
    const paidVolnaLesson = { is_trial_visible: false, available_in_volna: true };
    const paidNonVolnaLesson = {
      is_trial_visible: false,
      available_in_volna: false,
    };

    expect(
      getLessonAccessStateFromMeta(paidNonVolnaLesson, null, { access_mode: "full" })
    ).toBe("accessible");
    expect(
      getLessonAccessStateFromMeta(paidVolnaLesson, null, { access_mode: "volna" })
    ).toBe("accessible");
    expect(
      getLessonAccessStateFromMeta(paidNonVolnaLesson, null, {
        access_mode: "volna",
      })
    ).toBe("locked");
  });
});

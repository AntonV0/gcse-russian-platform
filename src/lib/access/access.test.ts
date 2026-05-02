import { describe, expect, it, vi } from "vitest";
import { getCurrentCourseAccess, getCurrentProfile } from "@/lib/auth/auth";
import { getLessonAccessMetaDb } from "@/lib/courses/course-helpers-db";
import { getLessonAccessState, getLessonAccessStateFromMeta } from "@/lib/access/access";

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

  it("requires a trial grant for trial-visible lessons", () => {
    expect(
      getLessonAccessStateFromMeta(
        { is_trial_visible: true, available_in_volna: false },
        null,
        null
      )
    ).toBe("locked");

    expect(
      getLessonAccessStateFromMeta(
        { is_trial_visible: true, available_in_volna: false },
        null,
        { access_mode: "trial" }
      )
    ).toBe("accessible");
  });

  it("allows free lessons without an access grant", () => {
    expect(
      getLessonAccessStateFromMeta(
        {
          is_trial_visible: true,
          requires_paid_access: false,
          available_in_volna: false,
        },
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

describe("getLessonAccessState", () => {
  it("fetches course access for trial-visible lessons so trial users can open them", async () => {
    vi.mocked(getCurrentProfile).mockResolvedValue({
      is_admin: false,
      is_teacher: false,
    });
    vi.mocked(getLessonAccessMetaDb).mockResolvedValue({
      is_trial_visible: true,
      available_in_volna: false,
    });
    vi.mocked(getCurrentCourseAccess).mockResolvedValue({
      access_mode: "trial",
    });

    await expect(
      getLessonAccessState(
        "gcse-russian",
        "foundation",
        "introduction-to-the-course",
        "lesson-design-showcase"
      )
    ).resolves.toBe("accessible");

    expect(getCurrentCourseAccess).toHaveBeenCalledWith("gcse-russian", "foundation");
  });

  it("keeps trial-visible lessons locked for guests without a grant", async () => {
    vi.mocked(getCurrentProfile).mockResolvedValue(null);
    vi.mocked(getLessonAccessMetaDb).mockResolvedValue({
      is_trial_visible: true,
      available_in_volna: false,
    });
    vi.mocked(getCurrentCourseAccess).mockResolvedValue(null);

    await expect(
      getLessonAccessState(
        "gcse-russian",
        "foundation",
        "introduction-to-the-course",
        "lesson-design-showcase"
      )
    ).resolves.toBe("locked");
  });
});

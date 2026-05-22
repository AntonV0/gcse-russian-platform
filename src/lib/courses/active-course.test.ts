import { describe, expect, it } from "vitest";
import {
  DEFAULT_ACTIVE_COURSE_SLUG,
  getActiveCoursePath,
  getDefaultActiveCourseSlug,
  resolveActiveCourseSlug,
} from "@/lib/courses/active-course";

describe("active course context", () => {
  it("keeps GCSE Russian as the default active course", () => {
    expect(DEFAULT_ACTIVE_COURSE_SLUG).toBe("gcse-russian");
    expect(getDefaultActiveCourseSlug()).toBe("gcse-russian");
    expect(resolveActiveCourseSlug()).toBe("gcse-russian");
    expect(resolveActiveCourseSlug(null)).toBe("gcse-russian");
    expect(resolveActiveCourseSlug("")).toBe("gcse-russian");
  });

  it("builds active course paths with the default course slug", () => {
    expect(getActiveCoursePath("foundation")).toBe(
      "/courses/gcse-russian/foundation"
    );
  });

  it("supports an explicit course slug without changing the fallback route", () => {
    expect(getActiveCoursePath("foundation", "a-level-russian")).toBe(
      "/courses/a-level-russian/foundation"
    );
    expect(getActiveCoursePath(null, "a-level-russian")).toBe("/courses");
    expect(getActiveCoursePath(undefined, "a-level-russian")).toBe("/courses");
  });
});

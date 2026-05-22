import { describe, expect, it } from "vitest";
import { getActiveCoursePath } from "@/lib/access/routes";

describe("access routes", () => {
  it("keeps existing active course route behaviour", () => {
    expect(getActiveCoursePath("foundation")).toBe(
      "/courses/gcse-russian/foundation"
    );
    expect(getActiveCoursePath(null)).toBe("/courses");
    expect(getActiveCoursePath(undefined)).toBe("/courses");
  });

  it("allows active course route callers to pass a course slug", () => {
    expect(getActiveCoursePath("foundation", "a-level-russian")).toBe(
      "/courses/a-level-russian/foundation"
    );
  });
});

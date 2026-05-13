import { describe, expect, it } from "vitest";

import {
  formatLessonProgressLabel,
  formatLessonProgressRatio,
  formatLessonTotalLabel,
  hasAvailableLessonTotal,
} from "./progress-labels";

describe("course progress labels", () => {
  it("formats available lesson totals", () => {
    expect(hasAvailableLessonTotal(12)).toBe(true);
    expect(formatLessonProgressLabel(3, 12)).toBe("3 of 12 lessons");
    expect(formatLessonProgressRatio(3, 12)).toBe("3 / 12");
    expect(formatLessonTotalLabel(12)).toBe("12");
  });

  it("uses student-facing copy when totals are unavailable", () => {
    expect(hasAvailableLessonTotal(0)).toBe(false);
    expect(hasAvailableLessonTotal(null)).toBe(false);
    expect(formatLessonProgressLabel(0, 0)).toBe("Lessons not available yet");
    expect(formatLessonProgressLabel(0, undefined)).toBe("Lessons not available yet");
    expect(formatLessonProgressRatio(0, 0)).toBe("Not available yet");
    expect(formatLessonTotalLabel(undefined)).toBe("Not available yet");
  });
});

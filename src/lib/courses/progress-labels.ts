const UNAVAILABLE_LESSON_TOTAL_LABEL = "Lessons not available yet";
const UNAVAILABLE_LESSON_COUNT_LABEL = "Not available yet";

export function hasAvailableLessonTotal(totalLessons: number | null | undefined) {
  return typeof totalLessons === "number" && totalLessons > 0;
}

export function formatLessonProgressLabel(
  completedLessons: number | null | undefined,
  totalLessons: number | null | undefined
) {
  if (!hasAvailableLessonTotal(totalLessons)) {
    return UNAVAILABLE_LESSON_TOTAL_LABEL;
  }

  return `${completedLessons ?? 0} of ${totalLessons} lessons`;
}

export function formatLessonProgressRatio(
  completedLessons: number | null | undefined,
  totalLessons: number | null | undefined
) {
  if (!hasAvailableLessonTotal(totalLessons)) {
    return UNAVAILABLE_LESSON_COUNT_LABEL;
  }

  return `${completedLessons ?? 0} / ${totalLessons}`;
}

export function formatLessonTotalLabel(totalLessons: number | null | undefined) {
  if (!hasAvailableLessonTotal(totalLessons)) {
    return UNAVAILABLE_LESSON_COUNT_LABEL;
  }

  return String(totalLessons);
}

import type { LessonSection } from "@/types/lesson";

export function clampStepIndex(stepValue: string | undefined, totalSteps: number) {
  if (totalSteps <= 0) return 0;

  const parsed = Number(stepValue);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  const normalized = Math.floor(parsed) - 1;

  if (normalized < 0) return 0;
  if (normalized >= totalSteps) return totalSteps - 1;

  return normalized;
}

export function getMaxVisitedIndex(
  sections: LessonSection[],
  visitedSectionIds: Set<string>
) {
  let maxVisitedIndex = -1;

  sections.forEach((section, index) => {
    if (visitedSectionIds.has(section.id)) {
      maxVisitedIndex = index;
    }
  });

  return maxVisitedIndex;
}

export function getVisitedSectionCount(
  sections: LessonSection[],
  visitedSectionIds: Set<string>
) {
  return sections.reduce(
    (count, section) => (visitedSectionIds.has(section.id) ? count + 1 : count),
    0
  );
}

export function getLessonProgressSummary(
  sections: LessonSection[],
  visitedSectionIds: Set<string>
) {
  const visitedCount = getVisitedSectionCount(sections, visitedSectionIds);
  const totalSections = sections.length;
  const percent =
    totalSections > 0 ? Math.round((visitedCount / totalSections) * 100) : 0;

  return {
    visitedCount,
    totalSections,
    percent,
    allVisited: totalSections > 0 && visitedCount >= totalSections,
  };
}

export function getAllowedMaxIndex(totalSteps: number, maxVisitedIndex: number) {
  if (totalSteps <= 0) return 0;
  return Math.min(maxVisitedIndex + 1, totalSteps - 1);
}

export function getEffectiveStepIndex(
  requestedStepIndex: number,
  allowedMaxIndex: number
) {
  return Math.min(requestedStepIndex, allowedMaxIndex);
}

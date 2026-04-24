import { getLessonPath } from "@/lib/access/routes";

export function buildLessonStepHref(params: {
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  stepNumber: number;
}) {
  return `${getLessonPath(
    params.courseSlug,
    params.variantSlug,
    params.moduleSlug,
    params.lessonSlug
  )}?step=${params.stepNumber}`;
}

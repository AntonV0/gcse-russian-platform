import Link from "next/link";
import LessonPageTemplate from "@/components/lesson-blocks/lesson-page-template";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { appIcons } from "@/lib/shared/icons";
import { loadLessonPageData } from "@/lib/courses/course-helpers-db";
import { canUserAccessLesson } from "@/lib/access/access";
import { loadLessonContentByLessonIdDb } from "@/lib/lessons/lesson-content-helpers-db";
import { getVariantPath } from "@/lib/access/routes";

type LessonPageProps = {
  params: Promise<{
    courseSlug: string;
    variantSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
  searchParams?: Promise<{
    step?: string;
  }>;
};

function getVariantLabel(variantSlug: string) {
  if (variantSlug === "foundation") return "Foundation";
  if (variantSlug === "higher") return "Higher";
  return "Volna";
}

export default async function LessonPage({ params, searchParams }: LessonPageProps) {
  const { courseSlug, variantSlug, moduleSlug, lessonSlug } = await params;
  const resolvedSearchParams = await searchParams;
  const currentStep = resolvedSearchParams?.step;

  const { course, module, lesson } = await loadLessonPageData(
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug
  );

  if (!course || !module || !lesson) {
    return <main>Lesson not found.</main>;
  }

  const canAccess = await canUserAccessLesson(
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug
  );

  if (!canAccess) {
    return (
      <main className="space-y-8">
        <section className="app-surface-brand app-section-padding-lg">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)] xl:items-start">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <Badge tone="info" icon={appIcons.school}>
                  {course.title}
                </Badge>
                <Badge tone="muted" icon={appIcons.layers}>
                  {getVariantLabel(variantSlug)}
                </Badge>
                <Badge tone="warning" icon={appIcons.locked}>
                  Locked lesson
                </Badge>
              </div>

              <div className="space-y-2">
                <h1 className="app-title max-w-3xl">{lesson.title}</h1>
                <p className="app-subtitle max-w-2xl">
                  This lesson is not currently available on your account. Continue through
                  your course path to unlock more content or review your access.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  href={getVariantPath(courseSlug, variantSlug)}
                  variant="primary"
                  icon={appIcons.back}
                >
                  Back to module path
                </Button>

                <Button href="/courses" variant="secondary" icon={appIcons.courses}>
                  Browse courses
                </Button>
              </div>
            </div>

            <div className="app-card p-5">
              <h2 className="mb-2 text-base font-semibold text-[var(--text-primary)]">
                Access guidance
              </h2>

              <div className="space-y-3 text-sm app-text-muted">
                <p>
                  Lessons in this course may unlock progressively depending on your
                  current progress and access mode.
                </p>
                <p>
                  Complete earlier lessons first, or return to your course dashboard to
                  continue from the recommended next step.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const lessonContent = await loadLessonContentByLessonIdDb(lesson.id);

  if (lessonContent.sections.length === 0) {
    return <main>Lesson content not found.</main>;
  }

  return (
    <LessonPageTemplate
      courseSlug={courseSlug}
      variantSlug={variantSlug}
      moduleSlug={moduleSlug}
      lessonSlug={lessonSlug}
      sections={lessonContent.sections}
      currentStep={currentStep}
    />
  );
}

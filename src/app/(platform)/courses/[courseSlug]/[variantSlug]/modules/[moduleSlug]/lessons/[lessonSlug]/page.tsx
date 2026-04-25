import LessonPageTemplate from "@/components/lesson-blocks/lesson-page-template";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import LockedContentCard from "@/components/ui/locked-content-card";
import { loadLessonPageData } from "@/lib/courses/course-helpers-db";
import { canUserAccessLesson } from "@/lib/access/access";
import { loadLessonContentByLessonIdDb } from "@/lib/lessons/lesson-content-helpers-db";
import { getModulePath, getVariantPath } from "@/lib/access/routes";

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
    return (
      <main>
        <EmptyState
          icon="search"
          iconTone="brand"
          title="Lesson not found"
          description="This lesson could not be found. Return to your course path and choose an available lesson."
          action={
            <Button href="/courses" variant="primary" icon="courses">
              Browse courses
            </Button>
          }
        />
      </main>
    );
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
                <Badge tone="info" icon="school">
                  {course.title}
                </Badge>
                <Badge tone="muted" icon="layers">
                  {getVariantLabel(variantSlug)}
                </Badge>
                <Badge tone="warning" icon="locked">
                  Locked lesson
                </Badge>
              </div>

              <div className="space-y-2">
                <h1 className="app-title max-w-3xl">{lesson.title}</h1>
                <p className="app-subtitle max-w-2xl">
                  This lesson is locked for now. Continue through the module first, or
                  review your course access if you expected this lesson to be available.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  href={getVariantPath(courseSlug, variantSlug)}
                  variant="primary"
                  icon="back"
                >
                  Back to module path
                </Button>

                <Button href="/courses" variant="secondary" icon="courses">
                  Browse courses
                </Button>
              </div>
            </div>

            <LockedContentCard
              title="Unlock this lesson"
              description="Lessons may unlock as you complete earlier work, and some lessons require the right course access. Start with the module path so the next available step is clear."
              accessLabel={getVariantLabel(variantSlug)}
              statusLabel="Locked"
              primaryActionHref={getModulePath(courseSlug, variantSlug, moduleSlug)}
              primaryActionLabel="Back to module"
              secondaryActionHref="/account/billing"
              secondaryActionLabel="Review access"
            />
          </div>
        </section>
      </main>
    );
  }

  const lessonContent = await loadLessonContentByLessonIdDb(lesson.id);

  if (lessonContent.sections.length === 0) {
    return (
      <main>
        <EmptyState
          icon="lessonContent"
          iconTone="brand"
          title="Lesson content is not ready yet"
          description="The lesson exists, but no published content is available right now. Return to the module and choose another lesson."
          action={
            <Button
              href={getModulePath(courseSlug, variantSlug, moduleSlug)}
              variant="primary"
              icon="back"
            >
              Back to module
            </Button>
          }
        />
      </main>
    );
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

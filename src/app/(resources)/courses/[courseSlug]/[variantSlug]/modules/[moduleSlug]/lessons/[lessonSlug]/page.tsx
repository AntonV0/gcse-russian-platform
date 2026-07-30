import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LessonPageTemplate from "@/components/lesson-blocks/lesson-page-template";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import LearningSheet, { LearningSheetSection } from "@/components/ui/learning-sheet";
import LockedContentCard from "@/components/ui/locked-content-card";
import { loadLessonPageData } from "@/lib/courses/course-helpers-db";
import { canUserAccessLesson } from "@/lib/access/access";
import { loadLessonContentByLessonIdDb } from "@/lib/lessons/lesson-content-helpers-db";
import { getModulePath } from "@/lib/access/routes";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";
import { getVariantDisplayName } from "@/lib/courses/journey-state";
import { getLessonProgress } from "@/lib/progress/progress";

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

export const metadata: Metadata = {
  title: "GCSE Russian lesson",
};

export default async function LessonPage({ params, searchParams }: LessonPageProps) {
  const { courseSlug, variantSlug, moduleSlug, lessonSlug } = await params;
  const resolvedSearchParams = await searchParams;
  const currentStep = resolvedSearchParams?.step;

  const [profile, user] = await Promise.all([getCurrentProfile(), getCurrentUser()]);
  const lessonPageData = await loadLessonPageData(
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug,
    {
      includeAdminTestingModules: !!profile?.is_admin,
    }
  );
  const { course, module, lesson } = lessonPageData;

  if (!course || !module || !lesson) {
    notFound();
  }

  const canPreviewDraftLesson = !!profile?.is_admin || !!profile?.is_teacher;

  if (!lesson.is_published && !canPreviewDraftLesson) {
    notFound();
  }

  const [canAccess, lessonProgress] = await Promise.all([
    canUserAccessLesson(courseSlug, variantSlug, moduleSlug, lessonSlug),
    getLessonProgress(courseSlug, variantSlug, moduleSlug, lessonSlug),
  ]);
  const canReviewCompletedLesson = !!lessonProgress?.completed;

  if (!canAccess && !canReviewCompletedLesson) {
    const isGuest = !user;

    return (
      <main>
        <LearningSheet>
        <LearningSheetSection divided={false}>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)] xl:items-start">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <Badge tone="info" icon="school">
                  {course.title}
                </Badge>
                <Badge tone="muted" icon="layers">
                  {getVariantDisplayName(variantSlug, variantSlug)}
                </Badge>
                <Badge tone="warning" icon="locked">
                  Locked lesson
                </Badge>
              </div>

              <div className="space-y-2">
                <h1 className="app-title max-w-3xl">{lesson.title}</h1>
                <p className="app-subtitle max-w-2xl">
                  {isGuest
                    ? "Create a trial account to open sample lessons, choose a tier, and save progress."
                    : "This lesson is locked for now. Continue through the module first, or review your course access if you expected this lesson to be available."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  href={
                    isGuest
                      ? "/signup?from=app"
                      : getModulePath(courseSlug, variantSlug, moduleSlug)
                  }
                  variant="primary"
                  icon={isGuest ? "create" : "back"}
                >
                  {isGuest ? "Start trial" : "Back to module"}
                </Button>

                <Button href="/courses" variant="secondary" icon="courses">
                  Browse courses
                </Button>
              </div>
            </div>

            <LockedContentCard
              title="Unlock this lesson"
              description={
                isGuest
                  ? "Lesson content is part of the trial account experience. Sign up to try sample lessons and see the full path in context."
                  : "Lessons may unlock as you complete earlier work, and some lessons require the right course access. Start with the module path so the next available step is clear."
              }
              accessLabel={
                isGuest
                  ? "Trial account"
                  : getVariantDisplayName(variantSlug, variantSlug)
              }
              statusLabel={isGuest ? "Signup required" : "Locked"}
              primaryActionHref={
          isGuest
            ? "/signup?from=app"
            : getModulePath(courseSlug, variantSlug, moduleSlug)
              }
              primaryActionLabel={isGuest ? "Create trial account" : "Back to module"}
              secondaryActionHref={isGuest ? "/courses" : "/account/billing"}
              secondaryActionLabel={isGuest ? "Course preview" : "Review access"}
            />
          </div>
        </LearningSheetSection>
        </LearningSheet>
      </main>
    );
  }

  const lessonContent = await loadLessonContentByLessonIdDb(lesson.id);

  if (lessonContent.sections.length === 0) {
    return (
      <main>
        <LearningSheet>
          <LearningSheetSection divided={false}>
            <EmptyState
              icon="lessonContent"
              iconTone="brand"
              title={lesson.title}
              description="Lesson content is not ready yet. Return to the module and choose another lesson for now."
              headingLevel={1}
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
          </LearningSheetSection>
        </LearningSheet>
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
      lessonProgress={lessonProgress}
      lessonPageData={{
        ...lessonPageData,
        previousLesson: getAdjacentPublishedLesson(
          lessonPageData.lessons,
          lesson.slug,
          "previous",
          canPreviewDraftLesson
        ),
        nextLesson: getAdjacentPublishedLesson(
          lessonPageData.lessons,
          lesson.slug,
          "next",
          canPreviewDraftLesson
        ),
      }}
    />
  );
}

function getAdjacentPublishedLesson(
  lessons: Awaited<ReturnType<typeof loadLessonPageData>>["lessons"],
  currentLessonSlug: string,
  direction: "previous" | "next",
  canPreviewDraftLesson: boolean
) {
  const currentIndex = lessons.findIndex(
    (moduleLesson) => moduleLesson.slug === currentLessonSlug
  );

  if (currentIndex === -1) return null;

  const step = direction === "previous" ? -1 : 1;

  for (
    let index = currentIndex + step;
    index >= 0 && index < lessons.length;
    index += step
  ) {
    const lesson = lessons[index];

    if (canPreviewDraftLesson || lesson.is_published) {
      return lesson;
    }
  }

  return null;
}

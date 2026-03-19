import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import {
  getCourseBySlugDb,
  getModuleBySlugDb,
  getLessonsByModuleDb,
} from "@/lib/course-helpers-db";
import { getLessonPath } from "@/lib/routes";
import { getModuleProgress } from "@/lib/progress-module";
import { getLessonAccessState } from "@/lib/access";

type ModulePageProps = {
  params: Promise<{
    courseSlug: string;
    variantSlug: string;
    moduleSlug: string;
  }>;
};

export default async function ModulePage({ params }: ModulePageProps) {
  const { courseSlug, variantSlug, moduleSlug } = await params;

  const course = await getCourseBySlugDb(courseSlug);
  const module = await getModuleBySlugDb(courseSlug, variantSlug, moduleSlug);
  const lessons = await getLessonsByModuleDb(courseSlug, variantSlug, moduleSlug);

  if (!course || !module) {
    return <main>Module not found.</main>;
  }

  const progress = await getModuleProgress(courseSlug, variantSlug, moduleSlug);

  const completedMap = new Map(
    progress.map((p) => [p.lesson_slug, p.completed])
  );

  const completedCount = progress.filter((p) => p.completed).length;
  const totalLessons = lessons.length;

  const lessonAccessEntries = await Promise.all(
    lessons.map(async (lesson) => {
      const accessState = await getLessonAccessState(
        courseSlug,
        variantSlug,
        moduleSlug,
        lesson.slug
      );

      return [lesson.slug, accessState] as const;
    })
  );

  const lessonAccessMap = new Map(lessonAccessEntries);

  return (
    <main>
      <PageHeader title={module.title} description={module.description} />

      <div className="mb-4 text-sm text-gray-600">
        Progress: {completedCount} / {totalLessons} lessons completed
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {lessons.map((lesson, index) => {
          const isCompleted = completedMap.get(lesson.slug);
          const accessState = lessonAccessMap.get(lesson.slug);
          const canAccessLesson = accessState === "accessible";

          const card = (
            <div className="transition hover:-translate-y-0.5">
              <DashboardCard title={`Lesson ${index + 1}: ${lesson.title}`}>
                <div className="flex items-center justify-between gap-4">
                  <span>{lesson.summary ?? ""}</span>

                  <span className="text-sm">
                    {isCompleted ? (
                      <span className="font-medium text-green-600">
                        ✓ Completed
                      </span>
                    ) : canAccessLesson ? (
                      <span className="text-gray-400">Not started</span>
                    ) : (
                      <span className="text-gray-400">🔒 Locked</span>
                    )}
                  </span>
                </div>
              </DashboardCard>
            </div>
          );

          return canAccessLesson ? (
            <Link
              key={lesson.slug}
              href={getLessonPath(course.slug, variantSlug, module.slug, lesson.slug)}
              className="block"
            >
              {card}
            </Link>
          ) : (
            <div key={lesson.slug} className="cursor-not-allowed opacity-70">
              {card}
            </div>
          );
        })}
      </section>
    </main>
  );
}
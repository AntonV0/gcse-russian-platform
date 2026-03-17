import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { getCourseBySlug, getModuleBySlug } from "@/lib/course-helpers";
import { getLessonPath } from "@/lib/routes";
import { getModuleProgress } from "@/lib/progress-module";

type ModulePageProps = {
  params: Promise<{
    courseSlug: string;
    moduleSlug: string;
  }>;
};

export default async function ModulePage({ params }: ModulePageProps) {
  const { courseSlug, moduleSlug } = await params;

  const course = getCourseBySlug(courseSlug);
  const module = getModuleBySlug(courseSlug, moduleSlug);

  if (!course || !module) {
    return <main>Module not found.</main>;
  }

  const progress = await getModuleProgress(courseSlug, moduleSlug);

  // Convert to lookup map
  const completedMap = new Map(
    progress.map((p) => [p.lesson_slug, p.completed])
  );

  // Progress summary
  const completedCount = progress.filter((p) => p.completed).length;
  const totalLessons = module.lessons.length;

  return (
    <main>
      <PageHeader title={module.title} description={module.description} />

      {/* Progress summary */}
      <div className="mb-4 text-sm text-gray-600">
        Progress: {completedCount} / {totalLessons} lessons completed
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {module.lessons.map((lesson, index) => {
          const isCompleted = completedMap.get(lesson.slug);

          return (
            <Link
              key={lesson.slug}
              href={getLessonPath(course.slug, module.slug, lesson.slug)}
              className="block"
            >
              <div className="transition hover:-translate-y-0.5">
                <DashboardCard
                  title={`Lesson ${index + 1}: ${lesson.title}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{lesson.description}</span>

                    {/* Completion status */}
                    <span className="text-sm">
                      {isCompleted ? (
                        <span className="font-medium text-green-600">
                          ✓ Completed
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          Not started
                        </span>
                      )}
                    </span>
                  </div>
                </DashboardCard>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { getCourseBySlug, getModuleBySlug } from "@/lib/course-helpers";

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

  return (
    <main>
      <PageHeader title={module.title} description={module.description} />

      <section className="grid gap-4 md:grid-cols-2">
        {module.lessons.map((lesson, index) => (
          <Link
            key={lesson.slug}
            href={`/courses/${course.slug}/lessons/${lesson.slug}`}
            className="block"
          >
            <div className="transition hover:-translate-y-0.5">
              <DashboardCard title={`Lesson ${index + 1}: ${lesson.title}`}>
                {lesson.description}
              </DashboardCard>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
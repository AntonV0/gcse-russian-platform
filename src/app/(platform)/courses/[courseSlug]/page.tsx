import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { getCourseBySlug } from "@/lib/course-helpers";

type CoursePageProps = {
  params: Promise<{
    courseSlug: string;
  }>;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = await params;

  const course = getCourseBySlug(courseSlug);

  if (!course) {
    return <main>Course not found.</main>;
  }

  return (
    <main>
      <PageHeader title={course.title} description={course.description} />

      <section className="mb-8 grid gap-4 md:grid-cols-2">
        <DashboardCard title="Course overview">
          This course will contain modules, lessons, revision tools, and exam
          skills practice.
        </DashboardCard>

        <DashboardCard title="Status">
          Early development build with placeholder content.
        </DashboardCard>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Modules</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {course.modules.map((module) => (
            <Link
              key={module.slug}
              href={`/courses/${course.slug}/modules/${module.slug}`}
              className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-black"
            >
              <h3 className="mb-2 font-semibold">{module.title}</h3>
              <p className="text-sm text-gray-600">{module.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
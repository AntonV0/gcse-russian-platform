import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { getCourses } from "@/lib/course-helpers";

export default function CoursesPage() {
  const courses = getCourses();

  return (
    <main>
      <PageHeader
        title="Courses"
        description="Choose a course to continue learning."
      />

      <section className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <Link key={course.slug} href={`/courses/${course.slug}`} className="block">
            <div className="transition hover:-translate-y-0.5">
              <DashboardCard title={course.title}>
                {course.description}
              </DashboardCard>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { getCoursesDb } from "@/lib/course-helpers-db";
import { getCoursePath } from "@/lib/routes";

export default async function CoursesPage() {
  const courses = await getCoursesDb();

  return (
    <main>
      <PageHeader title="Courses" description="Choose a course to continue learning." />

      <section className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <Link key={course.slug} href={getCoursePath(course.slug)} className="block">
            <div className="transition hover:-translate-y-0.5">
              <DashboardCard title={course.title}>{course.description}</DashboardCard>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

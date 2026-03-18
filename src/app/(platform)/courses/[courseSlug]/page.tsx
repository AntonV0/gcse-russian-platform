import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { getCourseBySlug } from "@/lib/course-helpers";
import { getVariantPath } from "@/lib/routes";

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

      <section className="grid gap-4 md:grid-cols-2">
        {course.variants.map((variant) => (
          <Link
            key={variant.slug}
            href={getVariantPath(course.slug, variant.slug)}
            className="block"
          >
            <div className="transition hover:-translate-y-0.5">
              <DashboardCard title={variant.title}>
                {variant.description}
              </DashboardCard>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
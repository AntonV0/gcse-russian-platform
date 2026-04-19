import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { appIcons } from "@/lib/shared/icons";
import { loadCoursePageData } from "@/lib/courses/course-helpers-db";
import { getCoursesPath, getVariantPath } from "@/lib/access/routes";

type CoursePageProps = {
  params: Promise<{
    courseSlug: string;
  }>;
};

function getVariantTone(slug: string): "info" | "success" | "muted" {
  if (slug === "higher") return "info";
  if (slug === "foundation") return "success";
  return "muted";
}

function getVariantLabel(slug: string) {
  if (slug === "higher") return "Higher";
  if (slug === "foundation") return "Foundation";
  return "Volna";
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = await params;
  const { course, variants } = await loadCoursePageData(courseSlug);

  if (!course) {
    return <main>Course not found.</main>;
  }

  const primaryVariant = variants[0] ?? null;

  return (
    <main className="space-y-8">
      <PageHeader
        title={course.title}
        description={
          course.description ?? "Choose the learning path that fits your study goals."
        }
      />

      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)] xl:items-start">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="school">
                GCSE Russian
              </Badge>
              <Badge tone="muted" icon="layers">
                Foundation + Higher
              </Badge>
              <Badge tone="muted" icon="language">
                Structured course journey
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="app-title max-w-3xl">Choose your learning path</h2>
              <p className="app-subtitle max-w-2xl">
                Start with the course path that matches your level and study goals, then
                work through modules and lessons step by step.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {primaryVariant ? (
                <Button
                  href={getVariantPath(course.slug, primaryVariant.slug)}
                  variant="primary"
                  icon="next"
                >
                  Continue to {primaryVariant.title}
                </Button>
              ) : null}

              <Button href={getCoursesPath()} variant="secondary" icon="back">
                Back to courses
              </Button>
            </div>
          </div>

          <DashboardCard title="Course overview" className="h-full">
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-xl bg-[var(--background-muted)] p-3">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                    Variants
                  </div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    {variants.length}
                  </div>
                </div>

                <div className="rounded-xl bg-[var(--background-muted)] p-3">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                    Journey
                  </div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    Variant → Module → Lesson
                  </div>
                </div>
              </div>

              <p className="text-sm app-text-muted">
                Each path gives students a clearer route into the course instead of one
                flat list of content.
              </p>
            </div>
          </DashboardCard>
        </div>
      </section>

      {variants.length === 0 ? (
        <EmptyState
          title="No learning paths available yet"
          description="This course has no visible variants at the moment."
          action={
            <Button href={getCoursesPath()} variant="secondary" icon="back">
              Back to courses
            </Button>
          }
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {variants.map((variant, index) => (
            <Link
              key={variant.slug}
              href={getVariantPath(course.slug, variant.slug)}
              className="block"
            >
              <DashboardCard className="h-full transition hover:-translate-y-0.5">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={getVariantTone(variant.slug)} icon="layers">
                      {getVariantLabel(variant.slug)}
                    </Badge>

                    {index === 0 ? <Badge tone="muted">Suggested</Badge> : null}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      {variant.title}
                    </h3>

                    <p className="text-sm app-text-muted">
                      {variant.description ??
                        "Open this path to view modules and continue learning."}
                    </p>
                  </div>

                  <div className="pt-1 text-sm font-medium app-brand-text">
                    Open path →
                  </div>
                </div>
              </DashboardCard>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}

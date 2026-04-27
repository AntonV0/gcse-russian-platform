import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
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
    return (
      <main>
        <EmptyState
          icon="search"
          iconTone="brand"
          title="Course not found"
          description="This course could not be found. Return to the course list and choose an available course."
          visual={
            <VisualPlaceholder
              category="learningPath"
              ariaLabel="Course not found placeholder"
            />
          }
          action={
            <Button href={getCoursesPath()} variant="primary" icon="courses">
              Courses
            </Button>
          }
        />
      </main>
    );
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
                Foundation and Higher
              </Badge>
              <Badge tone="muted" icon="language">
                Structured course journey
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="app-heading-hero max-w-3xl">Choose your learning path</h2>
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
              <VisualPlaceholder
                category="learningPath"
                ariaLabel="Course overview placeholder"
                className="mx-auto"
              />

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="app-stat-tile">
                  <div className="app-stat-label">Paths</div>
                  <div className="app-stat-value">{variants.length}</div>
                </div>

                <div className="app-stat-tile">
                  <div className="app-stat-label">Journey</div>
                  <div className="app-stat-value">Path, module, lesson</div>
                </div>
              </div>

              <p className="text-sm app-text-muted">
                Choose the path that matches your level, then follow the modules in order.
              </p>
            </div>
          </DashboardCard>
        </div>
      </section>

      {variants.length === 0 ? (
        <EmptyState
          title="No learning paths available yet"
          description="This course has no visible paths at the moment."
          visual={
            <VisualPlaceholder
              category="learningPath"
              ariaLabel="Learning path empty state placeholder"
            />
          }
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
                    <h3 className="app-heading-subsection">{variant.title}</h3>

                    <p className="app-text-body-muted">
                      {variant.description ??
                        "Open this path to view modules and continue learning."}
                    </p>
                  </div>

                  <div className="pt-1 text-sm font-medium app-brand-text">Open path</div>
                </div>
              </DashboardCard>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}

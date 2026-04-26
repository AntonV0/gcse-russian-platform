import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { loadVariantPageData } from "@/lib/courses/course-helpers-db";
import { getCoursePath, getCoursesPath, getModulePath } from "@/lib/access/routes";

type VariantPageProps = {
  params: Promise<{
    courseSlug: string;
    variantSlug: string;
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

export default async function VariantPage({ params }: VariantPageProps) {
  const { courseSlug, variantSlug } = await params;
  const { course, variant, modules } = await loadVariantPageData(courseSlug, variantSlug);

  if (!course || !variant) {
    return (
      <main>
        <EmptyState
          icon="search"
          iconTone="brand"
          title="Learning path not found"
          description="This learning path could not be found. Return to the course list and choose an available path."
          action={
            <Button href={getCoursesPath()} variant="primary" icon="courses">
              Courses
            </Button>
          }
        />
      </main>
    );
  }

  const primaryModule = modules[0] ?? null;

  return (
    <main className="space-y-8">
      <PageHeader
        title={variant.title}
        description={
          variant.description ?? "Choose a module and continue your learning journey."
        }
      />

      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)] xl:items-start">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="school">
                {course.title}
              </Badge>
              <Badge tone={getVariantTone(variant.slug)} icon="layers">
                {getVariantLabel(variant.slug)}
              </Badge>
              <Badge tone="muted" icon="modules">
                {modules.length} module{modules.length === 1 ? "" : "s"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="app-heading-hero max-w-3xl">
                Choose your next module
              </h2>
              <p className="app-subtitle max-w-2xl">
                Work through the modules in order to keep your learning structured and
                easier to follow.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {primaryModule ? (
                <Button
                  href={getModulePath(course.slug, variant.slug, primaryModule.slug)}
                  variant="primary"
                  icon="next"
                >
                  Continue to {primaryModule.title}
                </Button>
              ) : null}

              <Button href={getCoursePath(course.slug)} variant="secondary" icon="back">
                Back to {course.title}
              </Button>
            </div>
          </div>

          <DashboardCard title="Path overview" className="h-full">
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="app-stat-tile">
                  <div className="app-stat-label">
                    Path
                  </div>
                  <div className="app-stat-value">
                    {getVariantLabel(variant.slug)}
                  </div>
                </div>

                <div className="app-stat-tile">
                  <div className="app-stat-label">
                    Modules
                  </div>
                  <div className="app-stat-value">
                    {modules.length}
                  </div>
                </div>
              </div>

              <p className="text-sm app-text-muted">
                Start with the first available module, then continue in order as new
                lessons unlock.
              </p>
            </div>
          </DashboardCard>
        </div>
      </section>

      {modules.length === 0 ? (
        <EmptyState
          title="No modules available yet"
          description="This learning path does not have any visible modules right now."
          action={
            <Button href={getCoursePath(course.slug)} variant="secondary" icon="back">
              Back to {course.title}
            </Button>
          }
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module, index) => (
            <Link
              key={module.slug}
              href={getModulePath(course.slug, variant.slug, module.slug)}
              className="block"
            >
              <DashboardCard className="h-full transition hover:-translate-y-0.5">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="muted" icon="modules">
                      Module {index + 1}
                    </Badge>

                    {index === 0 ? <Badge tone="success">Start here</Badge> : null}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      {module.title}
                    </h3>

                    <p className="text-sm app-text-muted">
                      {module.description ??
                        "Open this module to view lessons and continue learning."}
                    </p>
                  </div>

                  <div className="pt-1 text-sm font-medium app-brand-text">
                    Open module
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

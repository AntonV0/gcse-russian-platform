import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { loadVariantPageData } from "@/lib/course-helpers-db";
import { getModulePath } from "@/lib/routes";

type VariantPageProps = {
  params: Promise<{
    courseSlug: string;
    variantSlug: string;
  }>;
};

export default async function VariantPage({ params }: VariantPageProps) {
  const { courseSlug, variantSlug } = await params;

  const { course, variant, modules } = await loadVariantPageData(courseSlug, variantSlug);

  if (!course || !variant) {
    return <main>Variant not found.</main>;
  }

  return (
    <main>
      <PageHeader title={variant.title} description={variant.description ?? undefined} />

      <section className="grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <Link
            key={module.slug}
            href={getModulePath(course.slug, variant.slug, module.slug)}
            className="block"
          >
            <div className="transition hover:-translate-y-0.5">
              <DashboardCard title={module.title}>
                {module.description ?? undefined}
              </DashboardCard>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

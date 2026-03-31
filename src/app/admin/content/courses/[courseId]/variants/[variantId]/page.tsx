import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import {
  getCourseByIdDb,
  getModulesByVariantIdDb,
  getVariantByIdDb,
} from "@/lib/course-helpers-db";

type AdminVariantDetailPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
  }>;
};

export default async function AdminVariantDetailPage({
  params,
}: AdminVariantDetailPageProps) {
  const { courseId, variantId } = await params;

  const [course, variant, modules] = await Promise.all([
    getCourseByIdDb(courseId),
    getVariantByIdDb(variantId),
    getModulesByVariantIdDb(variantId),
  ]);

  if (!course || !variant || variant.course_id !== course.id) {
    return <main>Variant not found.</main>;
  }

  return (
    <main>
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <Link href="/admin/content" className="text-blue-600 hover:underline">
          ← Back to content
        </Link>

        <Link
          href={`/admin/content/courses/${course.id}`}
          className="text-blue-600 hover:underline"
        >
          Back to {course.title}
        </Link>
      </div>

      <PageHeader
        title={variant.title}
        description={variant.description ?? "Manage modules in this variant."}
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Variant Details</div>

          <div className="space-y-3 px-4 py-4 text-sm">
            <div>
              <span className="font-medium">Course:</span> {course.title}
            </div>
            <div>
              <span className="font-medium">Title:</span> {variant.title}
            </div>
            <div>
              <span className="font-medium">Slug:</span> {variant.slug}
            </div>
            <div>
              <span className="font-medium">Position:</span> {variant.position}
            </div>
            <div>
              <span className="font-medium">Active:</span>{" "}
              {variant.is_active ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium">Published:</span>{" "}
              {variant.is_published ? "Yes" : "No"}
            </div>
            {variant.description ? (
              <div>
                <span className="font-medium">Description:</span> {variant.description}
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Actions</div>

          <div className="flex flex-col gap-3 px-4 py-4 text-sm">
            <button
              type="button"
              className="rounded border px-3 py-2 text-left hover:bg-gray-50"
            >
              Edit variant
            </button>

            <button
              type="button"
              className="rounded border px-3 py-2 text-left hover:bg-gray-50"
            >
              Add module
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="rounded-lg border bg-white">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="font-medium">Modules</div>
            <button type="button" className="text-sm text-blue-600 hover:underline">
              + Add Module
            </button>
          </div>

          <div className="divide-y">
            {modules.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-500">
                No modules found for this variant.
              </div>
            ) : (
              modules.map((module) => (
                <Link
                  key={module.id}
                  href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium">{module.title}</div>
                    <div className="text-sm text-gray-500">
                      {module.slug} · Position {module.position}
                    </div>
                  </div>

                  <span className="text-sm text-gray-400">→</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

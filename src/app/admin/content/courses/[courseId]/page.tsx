import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import { getCourseByIdDb, getVariantsByCourseIdDb } from "@/lib/course-helpers-db";

type AdminCourseDetailPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function AdminCourseDetailPage({
  params,
}: AdminCourseDetailPageProps) {
  const { courseId } = await params;

  const [course, variants] = await Promise.all([
    getCourseByIdDb(courseId),
    getVariantsByCourseIdDb(courseId),
  ]);

  if (!course) {
    return <main>Course not found.</main>;
  }

  return (
    <main>
      <div className="mb-4">
        <Link href="/admin/content" className="text-sm text-blue-600 hover:underline">
          ← Back to content
        </Link>
      </div>

      <PageHeader
        title={course.title}
        description={course.description ?? "Manage course variants and structure."}
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Course Details</div>

          <div className="space-y-3 px-4 py-4 text-sm">
            <div>
              <span className="font-medium">Title:</span> {course.title}
            </div>
            <div>
              <span className="font-medium">Slug:</span> {course.slug}
            </div>
            <div>
              <span className="font-medium">Active:</span>{" "}
              {course.is_active ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium">Published:</span>{" "}
              {course.is_published ? "Yes" : "No"}
            </div>
            {course.description ? (
              <div>
                <span className="font-medium">Description:</span> {course.description}
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
              Edit course
            </button>

            <button
              type="button"
              className="rounded border px-3 py-2 text-left hover:bg-gray-50"
            >
              Add variant
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="rounded-lg border bg-white">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="font-medium">Variants</div>
            <button type="button" className="text-sm text-blue-600 hover:underline">
              + Add Variant
            </button>
          </div>

          <div className="divide-y">
            {variants.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-500">
                No variants found for this course.
              </div>
            ) : (
              variants.map((variant) => (
                <Link
                  key={variant.id}
                  href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium">{variant.title}</div>
                    <div className="text-sm text-gray-500">
                      {variant.slug} · Position {variant.position}
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

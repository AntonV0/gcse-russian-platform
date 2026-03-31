import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import {
  getCourseByIdDb,
  getLessonsByModuleIdDb,
  getModuleByIdDb,
  getVariantByIdDb,
} from "@/lib/course-helpers-db";

type AdminModuleDetailPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
    moduleId: string;
  }>;
};

export default async function AdminModuleDetailPage({
  params,
}: AdminModuleDetailPageProps) {
  const { courseId, variantId, moduleId } = await params;

  const [course, variant, module, lessons] = await Promise.all([
    getCourseByIdDb(courseId),
    getVariantByIdDb(variantId),
    getModuleByIdDb(moduleId),
    getLessonsByModuleIdDb(moduleId),
  ]);

  if (
    !course ||
    !variant ||
    !module ||
    variant.course_id !== course.id ||
    module.course_variant_id !== variant.id
  ) {
    return <main>Module not found.</main>;
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

        <Link
          href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
          className="text-blue-600 hover:underline"
        >
          Back to {variant.title}
        </Link>
      </div>

      <PageHeader
        title={module.title}
        description={module.description ?? "Manage lessons in this module."}
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Module Details</div>

          <div className="space-y-3 px-4 py-4 text-sm">
            <div>
              <span className="font-medium">Course:</span> {course.title}
            </div>
            <div>
              <span className="font-medium">Variant:</span> {variant.title}
            </div>
            <div>
              <span className="font-medium">Title:</span> {module.title}
            </div>
            <div>
              <span className="font-medium">Slug:</span> {module.slug}
            </div>
            <div>
              <span className="font-medium">Position:</span> {module.position}
            </div>
            <div>
              <span className="font-medium">Published:</span>{" "}
              {module.is_published ? "Yes" : "No"}
            </div>
            {module.description ? (
              <div>
                <span className="font-medium">Description:</span> {module.description}
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
              Edit module
            </button>

            <button
              type="button"
              className="rounded border px-3 py-2 text-left hover:bg-gray-50"
            >
              Add lesson
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="rounded-lg border bg-white">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="font-medium">Lessons</div>
            <button type="button" className="text-sm text-blue-600 hover:underline">
              + Add Lesson
            </button>
          </div>

          <div className="divide-y">
            {lessons.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-500">
                No lessons found for this module.
              </div>
            ) : (
              lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium">{lesson.title}</div>
                    <div className="text-sm text-gray-500">
                      {lesson.slug} · Position {lesson.position}
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

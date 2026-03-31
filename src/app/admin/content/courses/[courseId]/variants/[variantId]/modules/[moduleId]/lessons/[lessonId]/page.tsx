import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import {
  getCourseByIdDb,
  getLessonByIdDb,
  getModuleByIdDb,
  getVariantByIdDb,
} from "@/lib/course-helpers-db";

type AdminLessonDetailPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
    moduleId: string;
    lessonId: string;
  }>;
};

function formatBoolean(value: boolean) {
  return value ? "Yes" : "No";
}

export default async function AdminLessonDetailPage({
  params,
}: AdminLessonDetailPageProps) {
  const { courseId, variantId, moduleId, lessonId } = await params;

  const [course, variant, module, lesson] = await Promise.all([
    getCourseByIdDb(courseId),
    getVariantByIdDb(variantId),
    getModuleByIdDb(moduleId),
    getLessonByIdDb(lessonId),
  ]);

  if (
    !course ||
    !variant ||
    !module ||
    !lesson ||
    variant.course_id !== course.id ||
    module.course_variant_id !== variant.id ||
    lesson.module_id !== module.id
  ) {
    return <main>Lesson not found.</main>;
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

        <Link
          href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
          className="text-blue-600 hover:underline"
        >
          Back to {module.title}
        </Link>
      </div>

      <PageHeader
        title={lesson.title}
        description={lesson.summary ?? "Manage lesson details and content source."}
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Lesson Details</div>

          <div className="space-y-3 px-4 py-4 text-sm">
            <div>
              <span className="font-medium">Course:</span> {course.title}
            </div>
            <div>
              <span className="font-medium">Variant:</span> {variant.title}
            </div>
            <div>
              <span className="font-medium">Module:</span> {module.title}
            </div>
            <div>
              <span className="font-medium">Title:</span> {lesson.title}
            </div>
            <div>
              <span className="font-medium">Slug:</span> {lesson.slug}
            </div>
            <div>
              <span className="font-medium">Summary:</span> {lesson.summary ?? "—"}
            </div>
            <div>
              <span className="font-medium">Lesson type:</span> {lesson.lesson_type}
            </div>
            <div>
              <span className="font-medium">Position:</span> {lesson.position}
            </div>
            <div>
              <span className="font-medium">Estimated minutes:</span>{" "}
              {lesson.estimated_minutes ?? "—"}
            </div>
            <div>
              <span className="font-medium">Published:</span>{" "}
              {formatBoolean(lesson.is_published)}
            </div>
            <div>
              <span className="font-medium">Trial visible:</span>{" "}
              {formatBoolean(lesson.is_trial_visible)}
            </div>
            <div>
              <span className="font-medium">Requires paid access:</span>{" "}
              {formatBoolean(lesson.requires_paid_access)}
            </div>
            <div>
              <span className="font-medium">Available in Volna:</span>{" "}
              {formatBoolean(lesson.available_in_volna)}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Actions</div>

          <div className="flex flex-col gap-3 px-4 py-4 text-sm">
            <Link
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}/edit`}
              className="rounded border px-3 py-2 text-left hover:bg-gray-50"
            >
              Edit lesson metadata
            </Link>

            <Link
              href={`/courses/${course.slug}/${variant.slug}/modules/${module.slug}/lessons/${lesson.slug}`}
              target="_blank"
              rel="noreferrer"
              className="rounded border px-3 py-2 text-left hover:bg-gray-50"
            >
              Open public lesson
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Content Source</div>

          <div className="space-y-3 px-4 py-4 text-sm">
            <div>
              <span className="font-medium">Source:</span> {lesson.content_source}
            </div>
            <div>
              <span className="font-medium">Content key:</span>{" "}
              {lesson.content_key ?? "—"}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Future Lesson Builder</div>

          <div className="space-y-3 px-4 py-4 text-sm text-gray-600">
            <p>
              This page is ready to expand later with lesson blocks, question set linking,
              and database-backed lesson content management.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

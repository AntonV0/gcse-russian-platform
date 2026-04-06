import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import AdminLessonBuilder from "@/components/admin/admin-lesson-builder";
import {
  getCourseByIdDb,
  getLessonByIdDb,
  getModuleByIdDb,
  getVariantByIdDb,
} from "@/lib/course-helpers-db";
import { getLessonSectionsWithBlocksDb } from "@/lib/lesson-admin-helpers-db";
import { unpublishLessonAction } from "@/app/actions/admin-content-actions";

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

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-5 py-4 font-semibold text-gray-900">{title}</div>
      <div className="p-5">{children}</div>
    </section>
  );
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

  const sections = await getLessonSectionsWithBlocksDb(lesson.id);

  return (
    <main className="space-y-6">
      <div className="flex flex-wrap gap-4 text-sm">
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
        description={lesson.summary ?? "Manage lesson details and lesson content."}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_380px]">
        <InfoCard title="Lesson details">
          <div className="grid gap-3 text-sm sm:grid-cols-2">
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

          <div className="mt-4 rounded-xl border bg-gray-50 p-4 text-sm">
            <span className="font-medium">Summary:</span> {lesson.summary ?? "—"}
          </div>
        </InfoCard>

        <div className="space-y-6">
          <InfoCard title="Actions">
            <div className="flex flex-col gap-3 text-sm">
              <Link
                href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}/edit`}
                className="rounded-xl border px-3 py-2 hover:bg-gray-50"
              >
                Edit lesson metadata
              </Link>

              <Link
                href={`/courses/${course.slug}/${variant.slug}/modules/${module.slug}/lessons/${lesson.slug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border px-3 py-2 hover:bg-gray-50"
              >
                Open public lesson
              </Link>
            </div>
          </InfoCard>

          <InfoCard title="Content source">
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Source:</span> {lesson.content_source}
              </div>
              <div>
                <span className="font-medium">Content key:</span>{" "}
                {lesson.content_key ?? "—"}
              </div>
            </div>
          </InfoCard>

          <section className="rounded-2xl border border-red-200 bg-white shadow-sm">
            <div className="border-b border-red-200 px-5 py-4 font-semibold text-red-700">
              Danger zone
            </div>

            <div className="space-y-3 p-5 text-sm">
              <p className="text-gray-600">
                Unpublishing this lesson will hide it from normal public use, but it will
                not hard delete its data.
              </p>

              <form action={unpublishLessonAction}>
                <input type="hidden" name="courseId" value={course.id} />
                <input type="hidden" name="variantId" value={variant.id} />
                <input type="hidden" name="moduleId" value={module.id} />
                <input type="hidden" name="lessonId" value={lesson.id} />
                <button
                  type="submit"
                  className="rounded-xl border border-red-300 px-4 py-2 text-red-700 hover:bg-red-50"
                >
                  Unpublish lesson
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Lesson builder</h2>
          <p className="text-sm text-gray-600">
            Build and organise lesson sections and blocks for long-form authoring.
          </p>
        </div>

        <AdminLessonBuilder
          lessonId={lesson.id}
          courseId={course.id}
          variantId={variant.id}
          moduleId={module.id}
          lessonSlug={lesson.slug}
          courseSlug={course.slug}
          variantSlug={variant.slug}
          moduleSlug={module.slug}
          sections={sections}
        />
      </section>
    </main>
  );
}

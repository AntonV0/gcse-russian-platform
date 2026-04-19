import BackNav from "@/components/ui/back-nav";
import Button from "@/components/ui/button";
import PageHeader from "@/components/layout/page-header";
import AdminLessonBuilder from "@/components/admin/admin-lesson-builder";
import { appIcons } from "@/lib/shared/icons";
import {
  getCourseByIdDb,
  getVariantByIdDb,
  getModuleByIdDb,
  getLessonByIdDb,
} from "@/lib/courses/course-helpers-db";
import { getLessonSectionsWithBlocksDb } from "@/lib/lessons/lesson-admin-helpers-db";
import { getLessonBuilderTemplateOptionsDb } from "@/lib/lessons/lesson-template-helpers-db";

type AdminLessonDetailPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
    moduleId: string;
    lessonId: string;
  }>;
};

function CompactDisclosure({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <details className="rounded-2xl border bg-white shadow-sm">
      <summary className="cursor-pointer select-none px-5 py-4 font-semibold text-gray-900">
        {title}
        {description ? (
          <div className="mt-1 text-sm text-gray-600">{description}</div>
        ) : null}
      </summary>
      <div className="border-t p-5">{children}</div>
    </details>
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
  const templateOptions = await getLessonBuilderTemplateOptionsDb();

  return (
    <main className="space-y-6">
      <BackNav
        items={[
          { href: "/admin/content", label: "Back to content" },
          {
            href: `/admin/content/courses/${course.id}`,
            label: `Back to ${course.title}`,
          },
          {
            href: `/admin/content/courses/${course.id}/variants/${variant.id}`,
            label: `Back to ${variant.title}`,
          },
          {
            href: `/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`,
            label: `Back to ${module.title}`,
          },
        ]}
      />

      <section className="space-y-4">
        <PageHeader
          title={lesson.title}
          description={lesson.summary ?? "Manage lesson details and lesson content."}
        />

        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Lesson builder</h2>
            <p className="text-sm text-gray-600">
              Build and organise lesson sections and blocks for long-form authoring.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <Button
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}/edit`}
              variant="secondary"
              icon="edit"
            >
              Edit lesson metadata
            </Button>

            <Button
              href={`/courses/${course.slug}/${variant.slug}/modules/${module.slug}/lessons/${lesson.slug}`}
              variant="secondary"
              icon="preview"
            >
              Open public lesson
            </Button>
          </div>
        </div>
      </section>

      <AdminLessonBuilder
        lessonId={lesson.id}
        courseId={courseId}
        variantId={variantId}
        moduleId={moduleId}
        lessonSlug={lesson.slug}
        courseSlug={course.slug}
        variantSlug={variant.slug}
        moduleSlug={module.slug}
        sections={sections}
        templateOptions={templateOptions}
      />

      <CompactDisclosure
        title="Lesson admin details"
        description="Metadata, publishing information, content source, and danger zone."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-xl border p-4 text-sm">
            <div className="space-y-2">
              <div>
                <span className="font-medium">Title:</span> {lesson.title}
              </div>
              <div>
                <span className="font-medium">Slug:</span> {lesson.slug}
              </div>
              <div>
                <span className="font-medium">Type:</span> {lesson.lesson_type}
              </div>
              <div>
                <span className="font-medium">Content source:</span>{" "}
                {lesson.content_source}
              </div>
              {lesson.content_key ? (
                <div>
                  <span className="font-medium">Content key:</span> {lesson.content_key}
                </div>
              ) : null}
              {lesson.summary ? (
                <div>
                  <span className="font-medium">Summary:</span> {lesson.summary}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border p-4 text-sm">
            <div className="space-y-2">
              <div>
                <span className="font-medium">Published:</span>{" "}
                {lesson.is_published ? "Yes" : "No"}
              </div>
              <div>
                <span className="font-medium">Trial visible:</span>{" "}
                {lesson.is_trial_visible ? "Yes" : "No"}
              </div>
              <div>
                <span className="font-medium">Requires paid access:</span>{" "}
                {lesson.requires_paid_access ? "Yes" : "No"}
              </div>
              <div>
                <span className="font-medium">Available in Volna:</span>{" "}
                {lesson.available_in_volna ? "Yes" : "No"}
              </div>
              <div>
                <span className="font-medium">Estimated minutes:</span>{" "}
                {lesson.estimated_minutes ?? "—"}
              </div>
              <div>
                <span className="font-medium">Position:</span> {lesson.position}
              </div>
            </div>
          </div>
        </div>
      </CompactDisclosure>
    </main>
  );
}

import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import AdminLessonBuilder from "@/components/admin/admin-lesson-builder";
import { appIcons } from "@/lib/shared/icons";
import { getLessonBuilderTemplateOptionsDb } from "@/lib/lesson-template-helpers-db";
import {
  getCourseByIdDb,
  getLessonByIdDb,
  getModuleByIdDb,
  getVariantByIdDb,
} from "@/lib/courses/course-helpers-db";
import { getLessonSectionsWithBlocksDb } from "@/lib/lesson-admin-helpers-db";
import { unpublishLessonAction } from "@/app/actions/admin/admin-content-actions";

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

function CompactDisclosure({
  title,
  description,
  children,
  defaultOpen = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="rounded-2xl border bg-white shadow-sm [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="cursor-pointer select-none px-5 py-4 hover:bg-gray-50">
        <div className="font-semibold text-gray-900">{title}</div>
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
      <div className="flex flex-wrap gap-2">
        <Button href="/admin/content" variant="quiet" icon={appIcons.back}>
          Back to content
        </Button>

        <Button
          href={`/admin/content/courses/${course.id}`}
          variant="quiet"
          icon={appIcons.back}
        >
          Back to {course.title}
        </Button>

        <Button
          href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
          variant="quiet"
          icon={appIcons.back}
        >
          Back to {variant.title}
        </Button>

        <Button
          href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
          variant="quiet"
          icon={appIcons.back}
        >
          Back to {module.title}
        </Button>
      </div>

      <PageHeader
        title={lesson.title}
        description={lesson.summary ?? "Manage lesson details and lesson content."}
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
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
              icon={appIcons.edit}
            >
              Edit lesson metadata
            </Button>

            <Button
              href={`/courses/${course.slug}/${variant.slug}/modules/${module.slug}/lessons/${lesson.slug}`}
              variant="secondary"
              icon={appIcons.preview}
            >
              Open public lesson
            </Button>
          </div>
        </div>

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
      </section>

      <CompactDisclosure
        title="Lesson admin details"
        description="Metadata, publishing information, content source, and danger zone."
      >
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

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge
                tone={lesson.is_published ? "info" : "muted"}
                icon={appIcons.preview}
              >
                {lesson.is_published ? "Published" : "Draft"}
              </Badge>
              <Badge
                tone={lesson.is_trial_visible ? "success" : "muted"}
                icon={appIcons.help}
              >
                {lesson.is_trial_visible ? "Trial visible" : "No trial"}
              </Badge>
              <Badge
                tone={lesson.available_in_volna ? "success" : "muted"}
                icon={appIcons.users}
              >
                {lesson.available_in_volna ? "Available in Volna" : "Not in Volna"}
              </Badge>
            </div>
          </InfoCard>

          <div className="space-y-6">
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
                  Unpublishing this lesson will hide it from normal public use, but it
                  will not hard delete its data.
                </p>

                <form action={unpublishLessonAction}>
                  <input type="hidden" name="courseId" value={course.id} />
                  <input type="hidden" name="variantId" value={variant.id} />
                  <input type="hidden" name="moduleId" value={module.id} />
                  <input type="hidden" name="lessonId" value={lesson.id} />
                  <Button type="submit" variant="danger" icon={appIcons.delete}>
                    Unpublish lesson
                  </Button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </CompactDisclosure>
    </main>
  );
}

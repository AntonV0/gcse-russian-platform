import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { appIcons } from "@/lib/icons";
import { getCourseByIdDb, getVariantsByCourseIdDb } from "@/lib/course-helpers-db";
import {
  createVariantAction,
  moveVariantAction,
} from "@/app/actions/admin-content-actions";

type AdminCourseDetailPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-gray-600">{description}</p> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-900">{label}</label>
      {children}
    </div>
  );
}

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
    <main className="space-y-6">
      <Button href="/admin/content" variant="quiet" icon={appIcons.back}>
        Back to content
      </Button>

      <PageHeader
        title={course.title}
        description={course.description ?? "Manage course variants and structure."}
      />

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <SectionCard title="Course details">
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Title:</span> {course.title}
            </div>
            <div>
              <span className="font-medium">Slug:</span> {course.slug}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Badge
                tone={course.is_active ? "success" : "warning"}
                icon={appIcons.completed}
              >
                {course.is_active ? "Active" : "Inactive"}
              </Badge>

              <Badge
                tone={course.is_published ? "info" : "muted"}
                icon={appIcons.preview}
              >
                {course.is_published ? "Published" : "Draft"}
              </Badge>
            </div>

            {course.description ? (
              <div>
                <span className="font-medium">Description:</span> {course.description}
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard title="Actions">
          <div className="flex flex-col gap-3">
            <Button
              href={`/admin/content/courses/${course.id}/edit`}
              variant="secondary"
              icon={appIcons.edit}
            >
              Edit course
            </Button>

            <Button
              href={`/courses/${course.slug}`}
              variant="secondary"
              icon={appIcons.preview}
            >
              Open public course
            </Button>
          </div>
        </SectionCard>
      </section>

      <details className="rounded-2xl border bg-white shadow-sm">
        <summary className="cursor-pointer select-none px-5 py-4 font-semibold text-gray-900">
          Add Variant
        </summary>

        <div className="border-t p-5">
          <form action={createVariantAction} className="space-y-4 text-sm">
            <input type="hidden" name="courseId" value={course.id} />

            <Field label="Title">
              <input
                name="title"
                required
                className="w-full rounded-xl border px-3 py-2"
              />
            </Field>

            <Field label="Slug">
              <input
                name="slug"
                required
                className="w-full rounded-xl border px-3 py-2"
              />
            </Field>

            <Field label="Description">
              <textarea
                name="description"
                rows={3}
                className="w-full rounded-xl border px-3 py-2"
              />
            </Field>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="isActive" value="true" defaultChecked />
              Active
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="isPublished" value="true" />
              Published
            </label>

            <Button type="submit" variant="primary" icon={appIcons.create}>
              Create variant
            </Button>
          </form>
        </div>
      </details>

      <SectionCard title={`Variants (${variants.length})`}>
        <div className="space-y-3">
          {variants.length === 0 ? (
            <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-gray-500">
              No variants found for this course.
            </div>
          ) : (
            variants.map((variant, index) => (
              <div
                key={variant.id}
                className="flex items-start justify-between gap-4 rounded-xl border p-4"
              >
                <Link
                  href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
                  className="min-w-0 flex-1"
                >
                  <div className="font-medium text-gray-900">{variant.title}</div>
                  <div className="mt-1 text-sm text-gray-500">
                    {variant.slug} · Position {variant.position}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <Badge
                      tone={variant.is_active ? "success" : "warning"}
                      icon={variant.is_active ? appIcons.completed : appIcons.pending}
                    >
                      {variant.is_active ? "Active" : "Inactive"}
                    </Badge>

                    <Badge
                      tone={variant.is_published ? "info" : "muted"}
                      icon={appIcons.preview}
                    >
                      {variant.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </Link>

                <div className="flex items-start gap-2">
                  <div className="flex flex-col gap-2">
                    <form action={moveVariantAction}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <input type="hidden" name="variantId" value={variant.id} />
                      <input type="hidden" name="direction" value="up" />
                      <Button
                        type="submit"
                        size="sm"
                        variant="secondary"
                        disabled={index === 0}
                        icon={appIcons.up}
                        iconOnly
                        ariaLabel="Move variant up"
                      />
                    </form>

                    <form action={moveVariantAction}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <input type="hidden" name="variantId" value={variant.id} />
                      <input type="hidden" name="direction" value="down" />
                      <Button
                        type="submit"
                        size="sm"
                        variant="secondary"
                        disabled={index === variants.length - 1}
                        icon={appIcons.down}
                        iconOnly
                        ariaLabel="Move variant down"
                      />
                    </form>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      href={`/admin/content/courses/${course.id}/variants/${variant.id}/edit`}
                      size="sm"
                      variant="secondary"
                      icon={appIcons.edit}
                    >
                      Edit
                    </Button>

                    <Button
                      href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
                      size="sm"
                      variant="secondary"
                      icon={appIcons.preview}
                    >
                      Open
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    </main>
  );
}

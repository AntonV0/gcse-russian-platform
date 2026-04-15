import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { appIcons } from "@/lib/icons";
import {
  getCourseByIdDb,
  getModulesByVariantIdDb,
  getVariantByIdDb,
} from "@/lib/course-helpers-db";
import {
  archiveVariantAction,
  createModuleAction,
  moveModuleAction,
} from "@/app/actions/admin-content-actions";

type AdminVariantDetailPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
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
      </div>

      <PageHeader
        title={variant.title}
        description={variant.description ?? "Manage modules in this variant."}
      />

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <SectionCard title="Variant details">
          <div className="space-y-3 text-sm">
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

            <div className="flex flex-wrap gap-2 pt-1">
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

            {variant.description ? (
              <div>
                <span className="font-medium">Description:</span> {variant.description}
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard title="Actions">
          <div className="flex flex-col gap-3">
            <Button
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/edit`}
              variant="secondary"
              icon={appIcons.edit}
            >
              Edit variant
            </Button>

            <Button
              href={`/courses/${course.slug}/${variant.slug}`}
              variant="secondary"
              icon={appIcons.preview}
            >
              Open public variant
            </Button>
          </div>
        </SectionCard>
      </section>

      <details className="rounded-2xl border bg-white shadow-sm">
        <summary className="cursor-pointer select-none px-5 py-4 font-semibold text-gray-900">
          Add Module
        </summary>

        <div className="border-t p-5">
          <form action={createModuleAction} className="space-y-4 text-sm">
            <input type="hidden" name="courseId" value={course.id} />
            <input type="hidden" name="variantId" value={variant.id} />

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
              <input type="checkbox" name="isPublished" value="true" />
              Published
            </label>

            <Button type="submit" variant="primary" icon={appIcons.create}>
              Create module
            </Button>
          </form>
        </div>
      </details>

      <section className="rounded-2xl border border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-200 px-5 py-4 font-semibold text-red-700">
          Danger zone
        </div>

        <div className="space-y-3 p-5 text-sm">
          <p className="text-gray-600">
            Archiving this variant will make it inactive and unpublished, but it will not
            hard delete its data.
          </p>

          <form action={archiveVariantAction}>
            <input type="hidden" name="courseId" value={course.id} />
            <input type="hidden" name="variantId" value={variant.id} />
            <Button type="submit" variant="danger" icon={appIcons.delete}>
              Archive variant
            </Button>
          </form>
        </div>
      </section>

      <SectionCard title={`Modules (${modules.length})`}>
        <div className="space-y-3">
          {modules.length === 0 ? (
            <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-gray-500">
              No modules found for this variant.
            </div>
          ) : (
            modules.map((module, index) => (
              <div
                key={module.id}
                className="flex items-center justify-between gap-4 rounded-xl border p-4"
              >
                <a
                  href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
                  className="min-w-0 flex-1"
                >
                  <div className="font-medium text-gray-900">{module.title}</div>
                  <div className="mt-1 text-sm text-gray-500">
                    {module.slug} · Position {module.position}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge
                      tone={module.is_published ? "info" : "muted"}
                      icon={appIcons.preview}
                    >
                      {module.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </a>

                <div className="flex flex-wrap items-center gap-2">
                  <form action={moveModuleAction}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <input type="hidden" name="variantId" value={variant.id} />
                    <input type="hidden" name="moduleId" value={module.id} />
                    <input type="hidden" name="direction" value="up" />
                    <Button
                      type="submit"
                      size="sm"
                      variant="secondary"
                      disabled={index === 0}
                      icon={appIcons.back}
                    >
                      Up
                    </Button>
                  </form>

                  <form action={moveModuleAction}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <input type="hidden" name="variantId" value={variant.id} />
                    <input type="hidden" name="moduleId" value={module.id} />
                    <input type="hidden" name="direction" value="down" />
                    <Button
                      type="submit"
                      size="sm"
                      variant="secondary"
                      disabled={index === modules.length - 1}
                      icon={appIcons.next}
                    >
                      Down
                    </Button>
                  </form>

                  <Button
                    href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/edit`}
                    size="sm"
                    variant="secondary"
                    icon={appIcons.edit}
                  >
                    Edit
                  </Button>

                  <Button
                    href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
                    size="sm"
                    variant="secondary"
                    icon={appIcons.preview}
                  >
                    Open
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    </main>
  );
}

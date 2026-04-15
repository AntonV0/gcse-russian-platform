import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import AppIcon from "@/components/ui/app-icon";
import { getCoursesDb } from "@/lib/course-helpers-db";
import { createCourseAction } from "@/app/actions/admin-content-actions";
import { appIcons } from "@/lib/icons";

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
      <div className="border-b px-4 py-4">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-gray-600">{description}</p> : null}
      </div>
      <div className="p-4">{children}</div>
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

export default async function AdminContentPage() {
  const courses = await getCoursesDb();

  return (
    <main>
      <div className="mb-8 flex items-start justify-between gap-4">
        <PageHeader
          title="Content Management"
          description="Manage courses, variants, modules, and lessons."
        />

        <Button href="/admin/ui" variant="secondary" icon={appIcons.uiLab}>
          Open UI Lab
        </Button>
      </div>

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <SectionCard
          title="Courses"
          description="Select a course to manage its variants, modules, and lessons."
        >
          {courses.length === 0 ? (
            <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-gray-500">
              No courses found.
            </div>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/admin/content/courses/${course.id}`}
                  className="block rounded-xl border bg-white p-4 transition hover:-translate-y-0.5 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <AppIcon
                          icon={appIcons.courses}
                          size={18}
                          className="text-gray-700"
                        />
                        <div className="font-medium text-gray-900">{course.title}</div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge tone="muted" icon={appIcons.file}>
                          {course.slug}
                        </Badge>

                        {course.is_active ? (
                          <Badge tone="success" icon={appIcons.completed}>
                            Active
                          </Badge>
                        ) : (
                          <Badge tone="warning" icon={appIcons.pending}>
                            Inactive
                          </Badge>
                        )}

                        {course.is_published ? (
                          <Badge tone="info" icon={appIcons.preview}>
                            Published
                          </Badge>
                        ) : (
                          <Badge tone="muted" icon={appIcons.help}>
                            Unpublished
                          </Badge>
                        )}
                      </div>

                      {course.description ? (
                        <p className="mt-3 text-sm text-gray-600">{course.description}</p>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Open</span>
                      <AppIcon icon={appIcons.next} size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Add Course"
          description="Create a new top-level course entry."
        >
          <form action={createCourseAction} className="space-y-4 text-sm">
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

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="isActive" value="true" defaultChecked />
                Active
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="isPublished" value="true" />
                Published
              </label>
            </div>

            <Button type="submit" variant="primary" icon={appIcons.create}>
              Create course
            </Button>
          </form>
        </SectionCard>
      </section>
    </main>
  );
}

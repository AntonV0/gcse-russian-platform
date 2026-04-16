import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import AppIcon from "@/components/ui/app-icon";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import CheckboxField from "@/components/ui/checkbox-field";
import { getCoursesDb } from "@/lib/courses/course-helpers-db";
import { createCourseAction } from "@/app/actions/admin/admin-content-actions";
import { appIcons } from "@/lib/shared/icons";
import SectionCard from "@/components/ui/section-card";

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
            <FormField label="Title">
              <Input name="title" required />
            </FormField>

            <FormField label="Slug">
              <Input name="slug" required />
            </FormField>

            <FormField label="Description">
              <Textarea name="description" rows={3} />
            </FormField>

            <div className="space-y-2">
              <CheckboxField name="isActive" label="Active" defaultChecked />
              <CheckboxField name="isPublished" label="Published" />
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

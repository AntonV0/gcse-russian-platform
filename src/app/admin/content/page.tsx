import Link from "next/link";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import Textarea from "@/components/ui/textarea";
import CheckboxField from "@/components/ui/checkbox-field";
import { getCoursesDb } from "@/lib/courses/course-helpers-db";
import { createCourseAction } from "@/app/actions/admin/admin-content-actions";

export default async function AdminContentPage() {
  const courses = await getCoursesDb();

  return (
    <main className="space-y-3">
      <PageIntroPanel
        tone="admin"
        eyebrow="Admin content"
        title="Content Management"
        description="Manage courses, variants, modules, and lessons from one central admin workspace."
        badges={
          <>
            <Badge tone="info">Content structure</Badge>
            <Badge tone="muted">Courses → Variants → Modules → Lessons</Badge>
          </>
        }
        actions={
          <>
            <Button href="/admin/ui" variant="secondary" icon="uiLab">
              Open UI Lab
            </Button>
            <Button href="#add-course" variant="primary" icon="create">
              Add course
            </Button>
          </>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          <Badge
            tone="success"
            icon="completed"
            className="justify-center md:justify-start"
          >
            {courses.length} course{courses.length === 1 ? "" : "s"}
          </Badge>
          <Badge tone="info" icon="courses" className="justify-center md:justify-start">
            Top-level content entries
          </Badge>
          <Badge tone="muted" icon="next" className="justify-center md:justify-start">
            Select a course to manage deeper structure
          </Badge>
        </div>
      </PageIntroPanel>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)] xl:items-start">
        <div className="space-y-3">
          <SectionCard
            title="Courses"
            description="Select a course to manage its variants, modules, and lessons."
            tone="brand"
          >
            {courses.length === 0 ? (
              <EmptyState
                icon="courses"
                iconTone="brand"
                title="No courses found"
                description="Create your first top-level course to start building variants, modules, and lessons."
                action={
                  <Button href="#add-course" variant="primary" icon="create">
                    Add course
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/admin/content/courses/${course.id}`}
                    className="block"
                  >
                    <SectionCard
                      title={course.title}
                      description={
                        course.description || "No description added yet for this course."
                      }
                      density="compact"
                      className="transition-transform duration-200 hover:-translate-y-0.5"
                      headerClassName="min-h-[104px]"
                      actions={
                        <div className="flex flex-wrap gap-2">
                          <Badge tone="muted" icon="file">
                            {course.slug}
                          </Badge>

                          {course.is_active ? (
                            <Badge tone="success" icon="completed">
                              Active
                            </Badge>
                          ) : (
                            <Badge tone="warning" icon="pending">
                              Inactive
                            </Badge>
                          )}

                          {course.is_published ? (
                            <Badge tone="info" icon="preview">
                              Published
                            </Badge>
                          ) : (
                            <Badge tone="muted" icon="help">
                              Unpublished
                            </Badge>
                          )}
                        </div>
                      }
                      footer={
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm app-text-muted">
                            Open course structure
                          </div>
                          <Button
                            variant="quiet"
                            size="sm"
                            icon="next"
                            ariaLabel={`Open ${course.title}`}
                            iconOnly
                          />
                        </div>
                      }
                    />
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-3">
          <SectionCard
            title="Add course"
            description="Create a new top-level course entry."
            tone="muted"
            id="add-course"
          >
            <form action={createCourseAction} className="space-y-4">
              <FormField
                label="Title"
                description="Used across admin navigation, content views, and course listings."
              >
                <Input name="title" required placeholder="GCSE Russian" />
              </FormField>

              <FormField
                label="Slug"
                description="Short internal URL-friendly identifier."
              >
                <Input name="slug" required placeholder="gcse-russian" />
              </FormField>

              <FormField
                label="Description"
                description="Optional summary shown in course lists and admin previews."
              >
                <Textarea
                  name="description"
                  rows={4}
                  placeholder="Structured GCSE Russian learning with guided lessons, practice, and progress support."
                />
              </FormField>

              <div className="space-y-2">
                <CheckboxField name="isActive" label="Active" defaultChecked />
                <CheckboxField name="isPublished" label="Published" />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="primary" icon="create">
                  Create course
                </Button>
              </div>
            </form>
          </SectionCard>

          <SectionCard
            title="Admin guidance"
            description="Suggested flow for managing content structure."
            tone="student"
            density="compact"
          >
            <div className="space-y-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
                <div className="text-sm font-semibold text-[var(--text-primary)]">
                  Start with courses
                </div>
                <div className="mt-1 text-sm app-text-muted">
                  Courses are the top-level shell for everything underneath.
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
                <div className="text-sm font-semibold text-[var(--text-primary)]">
                  Then build deeper structure
                </div>
                <div className="mt-1 text-sm app-text-muted">
                  Open a course to manage variants, modules, and lessons.
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
                <div className="text-sm font-semibold text-[var(--text-primary)]">
                  Validate UI before custom styling
                </div>
                <div className="mt-1 text-sm app-text-muted">
                  Use the UI Lab when a new content-management pattern starts repeating.
                </div>
                <div className="mt-3">
                  <Button href="/admin/ui" variant="quiet" size="sm" icon="uiLab">
                    Open UI Lab
                  </Button>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}

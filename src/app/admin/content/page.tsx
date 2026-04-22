import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
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
      />

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
                  <CardListItem
                    key={course.id}
                    href={`/admin/content/courses/${course.id}`}
                    title={course.title}
                    subtitle={
                      course.description || "No description added yet for this course."
                    }
                    badges={
                      <>
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
                      </>
                    }
                    actions={
                      <div className="flex items-center gap-2 text-sm app-text-muted">
                        <span>Open</span>
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
            title="Content flow"
            description="Courses are the top-level shell for variants, modules, and lessons."
            tone="student"
            density="compact"
          >
            <div className="space-y-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
                <div className="text-sm font-semibold text-[var(--text-primary)]">
                  Recommended path
                </div>
                <div className="mt-1 text-sm app-text-muted">
                  Create or open a course first, then manage variants, modules, and
                  lessons inside that course structure.
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button href="/admin/ui" variant="quiet" size="sm" icon="uiLab">
                  Open UI Lab
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}

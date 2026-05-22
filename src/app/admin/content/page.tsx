import ActiveStatusBadge from "@/components/ui/active-status-badge";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import CheckboxField from "@/components/ui/checkbox-field";
import { getCoursesDb } from "@/lib/courses/course-helpers-db";
import { createCourseAction } from "@/app/actions/admin/admin-content-actions";
import ExpandableAdminFormPanel from "@/components/admin/expandable-admin-form-panel";

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
            <Badge tone="info" icon="courses">
              Content structure
            </Badge>
            <Badge tone="muted" icon="layers">
              Courses → Variants → Modules → Lessons
            </Badge>
          </>
        }
        actions={
          <Button href="/admin/ui" variant="secondary" icon="uiLab">
            Open UI Lab
          </Button>
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
                        <Badge tone="muted">{course.qualification_level}</Badge>
                        <Badge tone="muted">{course.curriculum_code}</Badge>

                        <ActiveStatusBadge isActive={course.is_active} />
                        <PublishStatusBadge
                          isPublished={course.is_published}
                          draftLabel="Unpublished"
                        />
                      </>
                    }
                    actions={
                      <Button
                        variant="quiet"
                        size="sm"
                        icon="next"
                        ariaLabel={`Open ${course.title}`}
                        iconOnly
                      />
                    }
                  />
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-3">
          <ExpandableAdminFormPanel
            id="add-course"
            title="Add course"
            description="Create a new top-level course entry."
            collapsedDescription="Create a new top-level course entry."
            openLabel="Hide form"
            closedLabel="Add course"
            defaultOpen={courses.length === 0}
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

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  label="Qualification level"
                  description="Internal course level used for curriculum grouping."
                >
                  <Select
                    name="qualificationLevel"
                    required
                    defaultValue="gcse"
                  >
                    <option value="gcse">GCSE</option>
                    <option value="a_level">A-Level</option>
                  </Select>
                </FormField>

                <FormField
                  label="Exam board"
                  description="Exam board or awarding body for this course."
                >
                  <Select name="examBoard" required defaultValue="pearson_edexcel">
                    <option value="pearson_edexcel">Pearson Edexcel</option>
                  </Select>
                </FormField>

                <FormField
                  label="Curriculum code"
                  description="Specification or curriculum identifier."
                >
                  <Input name="curriculumCode" required defaultValue="1RU0" />
                </FormField>

                <FormField
                  label="Language code"
                  description="BCP 47 style language code for the course language."
                >
                  <Input name="languageCode" required defaultValue="ru" />
                </FormField>

                <FormField
                  label="Language name"
                  description="Readable language name used by internal tools."
                >
                  <Input name="languageName" required defaultValue="Russian" />
                </FormField>
              </div>

              <div className="space-y-2">
                <CheckboxField name="isActive" label="Active" defaultChecked />
                <CheckboxField name="isPublished" label="Published" />
              </div>

              <div className="flex flex-wrap gap-3">
                <LoadingButton
                  idleLabel="Create course"
                  pendingLabel="Creating course..."
                  idleIcon="create"
                  variant="primary"
                />
              </div>
            </form>
          </ExpandableAdminFormPanel>
        </div>
      </div>
    </main>
  );
}

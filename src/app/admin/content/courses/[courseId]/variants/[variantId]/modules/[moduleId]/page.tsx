import BackNav from "@/components/ui/back-nav";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import ExpandableAdminFormPanel from "@/components/admin/expandable-admin-form-panel";
import DangerZone from "@/components/ui/danger-zone";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import CheckboxField from "@/components/ui/checkbox-field";

import {
  getCourseByIdDb,
  getLessonsByModuleIdDb,
  getModuleByIdDb,
  getVariantByIdDb,
} from "@/lib/courses/course-helpers-db";

import {
  createLessonAction,
  moveLessonAction,
  unpublishModuleAction,
} from "@/app/actions/admin/admin-content-actions";

type AdminModuleDetailPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
    moduleId: string;
  }>;
};

export default async function AdminModuleDetailPage({
  params,
}: AdminModuleDetailPageProps) {
  const { courseId, variantId, moduleId } = await params;

  const [course, variant, module, lessons] = await Promise.all([
    getCourseByIdDb(courseId),
    getVariantByIdDb(variantId),
    getModuleByIdDb(moduleId),
    getLessonsByModuleIdDb(moduleId),
  ]);

  if (
    !course ||
    !variant ||
    !module ||
    variant.course_id !== course.id ||
    module.course_variant_id !== variant.id
  ) {
    return <main>Module not found.</main>;
  }

  return (
    <main className="space-y-3">
      <BackNav
        items={[
          { href: "/admin/content", label: "Content" },
          { href: `/admin/content/courses/${course.id}`, label: course.title },
          {
            href: `/admin/content/courses/${course.id}/variants/${variant.id}`,
            label: variant.title,
          },
        ]}
      />

      <PageIntroPanel
        tone="admin"
        eyebrow="Module"
        title={module.title}
        description={module.description ?? "Manage lessons within this module."}
        badges={
          <>
            <Badge tone="muted" icon="file">
              {module.slug}
            </Badge>
            <Badge tone="muted">Position {module.position}</Badge>
            <PublishStatusBadge isPublished={module.is_published} />
          </>
        }
        actions={
          <>
            <Button
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/edit`}
              variant="secondary"
              icon="edit"
            >
              Edit module
            </Button>
            <Button
              href={`/courses/${course.slug}/${variant.slug}/modules/${module.slug}`}
              variant="secondary"
              icon="preview"
            >
              Open public
            </Button>
          </>
        }
      />

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)] xl:items-start">
        <div className="space-y-3">
          <SectionCard
            title={`Lessons (${lessons.length})`}
            description="Manage lesson structure and ordering."
            tone="brand"
          >
            {lessons.length === 0 ? (
              <EmptyState
                icon="lessons"
                title="No lessons yet"
                description="Create your first lesson to begin building this module."
              />
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <CardListItem
                    key={lesson.id}
                    href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
                    title={lesson.title}
                    subtitle={lesson.summary || `Position ${lesson.position}`}
                    badges={
                      <>
                        <Badge tone="muted" icon="file">
                          {lesson.slug}
                        </Badge>
                        <Badge tone="muted">Position {lesson.position}</Badge>
                        <PublishStatusBadge isPublished={lesson.is_published} />
                        <Badge
                          tone={lesson.is_trial_visible ? "success" : "muted"}
                          icon="help"
                        >
                          {lesson.is_trial_visible ? "Trial" : "No Trial"}
                        </Badge>
                        <Badge
                          tone={lesson.available_in_volna ? "success" : "muted"}
                          icon="users"
                        >
                          {lesson.available_in_volna ? "Volna" : "No Volna"}
                        </Badge>
                        <Badge tone="muted" icon="file">
                          {lesson.content_source}
                        </Badge>
                      </>
                    }
                    actions={
                      <div className="flex items-start gap-2">
                        <div className="flex flex-col gap-2">
                          <form action={moveLessonAction}>
                            <input type="hidden" name="courseId" value={course.id} />
                            <input type="hidden" name="variantId" value={variant.id} />
                            <input type="hidden" name="moduleId" value={module.id} />
                            <input type="hidden" name="lessonId" value={lesson.id} />
                            <input type="hidden" name="direction" value="up" />
                            <Button
                              type="submit"
                              size="sm"
                              variant="secondary"
                              disabled={index === 0}
                              icon="up"
                              iconOnly
                              ariaLabel="Move lesson up"
                            />
                          </form>

                          <form action={moveLessonAction}>
                            <input type="hidden" name="courseId" value={course.id} />
                            <input type="hidden" name="variantId" value={variant.id} />
                            <input type="hidden" name="moduleId" value={module.id} />
                            <input type="hidden" name="lessonId" value={lesson.id} />
                            <input type="hidden" name="direction" value="down" />
                            <Button
                              type="submit"
                              size="sm"
                              variant="secondary"
                              disabled={index === lessons.length - 1}
                              icon="down"
                              iconOnly
                              ariaLabel="Move lesson down"
                            />
                          </form>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}/edit`}
                            size="sm"
                            variant="secondary"
                            icon="edit"
                          >
                            Edit
                          </Button>

                          <Button
                            href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
                            size="sm"
                            variant="quiet"
                            icon="next"
                            iconPosition="right"
                          >
                            Open
                          </Button>
                        </div>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-3">
          <ExpandableAdminFormPanel
            id="add-lesson"
            title="Add lesson"
            description="Create a new lesson within this module."
            collapsedDescription="Create a new lesson within this module."
            closedLabel="Add lesson"
            openLabel="Hide form"
            defaultOpen={lessons.length === 0}
          >
            <form action={createLessonAction} className="space-y-4">
              <input type="hidden" name="courseId" value={course.id} />
              <input type="hidden" name="variantId" value={variant.id} />
              <input type="hidden" name="moduleId" value={module.id} />

              <FormField label="Title">
                <Input name="title" required />
              </FormField>

              <FormField label="Slug">
                <Input name="slug" required />
              </FormField>

              <FormField label="Summary">
                <Textarea name="summary" rows={3} />
              </FormField>

              <FormField label="Lesson type">
                <Input name="lessonType" defaultValue="lesson" />
              </FormField>

              <FormField label="Estimated minutes">
                <Input name="estimatedMinutes" type="number" min="1" />
              </FormField>

              <FormField label="Content source">
                <Select name="contentSource" defaultValue="code">
                  <option value="code">code</option>
                  <option value="database">database</option>
                </Select>
              </FormField>

              <FormField label="Content key">
                <Input name="contentKey" />
              </FormField>

              <div className="space-y-2">
                <CheckboxField name="isPublished" label="Published" />
                <CheckboxField name="isTrialVisible" label="Trial visible" />
                <CheckboxField
                  name="requiresPaidAccess"
                  label="Requires paid access"
                  defaultChecked
                />
                <CheckboxField name="availableInVolna" label="Available in Volna" />
              </div>

              <Button type="submit" variant="primary" icon="create">
                Create lesson
              </Button>
            </form>
          </ExpandableAdminFormPanel>

          <DangerZone
            title="Unpublish module"
            description="Hide this module from public use without deleting its data."
            action={
              <form action={unpublishModuleAction}>
                <input type="hidden" name="courseId" value={course.id} />
                <input type="hidden" name="variantId" value={variant.id} />
                <input type="hidden" name="moduleId" value={module.id} />
                <Button type="submit" variant="danger" icon="delete">
                  Unpublish module
                </Button>
              </form>
            }
          />
        </div>
      </div>
    </main>
  );
}

import BackNav from "@/components/ui/back-nav";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  getCourseByIdDb,
  getLessonByIdDb,
  getModuleByIdDb,
  getVariantByIdDb,
} from "@/lib/courses/course-helpers-db";
import { updateLessonAction } from "@/app/actions/admin/admin-content-actions";

type AdminLessonEditPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
    moduleId: string;
    lessonId: string;
  }>;
};

export default async function AdminLessonEditPage({ params }: AdminLessonEditPageProps) {
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
    return (
      <main>
        <EmptyState
          icon="search"
          iconTone="brand"
          title="Lesson not found"
          description="This lesson could not be found in the selected course structure."
          action={
            <Button href="/admin/content" variant="primary" icon="back">
              Back to content
            </Button>
          }
        />
      </main>
    );
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
          {
            href: `/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`,
            label: module.title,
          },
          {
            href: `/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`,
            label: lesson.title,
          },
        ]}
      />

      <PageIntroPanel
        tone="admin"
        eyebrow="Lesson settings"
        title={`Edit ${lesson.title}`}
        description="Update lesson metadata, access settings, and ordering."
        badges={
          <>
            <Badge tone="muted" icon="file">
              {lesson.slug}
            </Badge>
            <Badge tone="muted">{lesson.lesson_type}</Badge>
            <Badge tone="muted">Position {lesson.position}</Badge>
            <PublishStatusBadge isPublished={lesson.is_published} />
          </>
        }
        actions={
          <>
            <Button
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
              variant="secondary"
              icon="back"
            >
              Back to lesson
            </Button>
            <Button
              href={`/courses/${course.slug}/${variant.slug}/modules/${module.slug}/lessons/${lesson.slug}`}
              variant="secondary"
              icon="preview"
            >
              Open public
            </Button>
          </>
        }
      />

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] xl:items-start">
        <SectionCard
          title="Lesson settings"
          description="Make structural, metadata, and access changes to this lesson."
          tone="brand"
        >
          <form action={updateLessonAction} className="space-y-4">
            <input type="hidden" name="courseId" value={course.id} />
            <input type="hidden" name="variantId" value={variant.id} />
            <input type="hidden" name="moduleId" value={module.id} />
            <input type="hidden" name="lessonId" value={lesson.id} />

            <FormField
              label="Title"
              description="Used across admin structure views, student navigation, and lesson headers."
            >
              <Input name="title" required defaultValue={lesson.title} />
            </FormField>

            <FormField label="Slug" description="Short internal URL-friendly identifier.">
              <Input name="slug" required defaultValue={lesson.slug} />
            </FormField>

            <FormField
              label="Summary"
              description="Optional summary used in lesson listings and previews."
            >
              <Textarea name="summary" rows={4} defaultValue={lesson.summary ?? ""} />
            </FormField>

            <FormField
              label="Lesson type"
              description="Internal type label for this lesson."
            >
              <Input name="lessonType" defaultValue={lesson.lesson_type} />
            </FormField>

            <FormField
              label="Position"
              description="Controls this lesson’s ordering within the parent module."
            >
              <Input
                name="position"
                type="number"
                min="1"
                defaultValue={lesson.position}
              />
            </FormField>

            <FormField
              label="Estimated minutes"
              description="Optional estimate for lesson duration."
            >
              <Input
                name="estimatedMinutes"
                type="number"
                min="1"
                defaultValue={lesson.estimated_minutes ?? ""}
              />
            </FormField>

            <FormField
              label="Content source"
              description="Defines where this lesson’s content is loaded from."
            >
              <Select name="contentSource" defaultValue={lesson.content_source}>
                <option value="code">code</option>
                <option value="database">database</option>
              </Select>
            </FormField>

            <FormField
              label="Content key"
              description="Optional key used when the content source requires a mapped reference."
            >
              <Input name="contentKey" defaultValue={lesson.content_key ?? ""} />
            </FormField>

            <div className="space-y-2">
              <CheckboxField
                name="isPublished"
                label="Published"
                defaultChecked={lesson.is_published}
              />

              <CheckboxField
                name="isTrialVisible"
                label="Trial visible"
                defaultChecked={lesson.is_trial_visible}
              />

              <CheckboxField
                name="requiresPaidAccess"
                label="Requires paid access"
                defaultChecked={lesson.requires_paid_access}
              />

              <CheckboxField
                name="availableInVolna"
                label="Available in Volna"
                defaultChecked={lesson.available_in_volna}
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" variant="primary" icon="completed">
                Save lesson
              </Button>

              <Button
                href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
                variant="secondary"
                icon="back"
              >
                Cancel
              </Button>
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Editing guidance"
          description="Keep lesson metadata clear and aligned with student access behaviour."
          tone="muted"
          density="compact"
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Keep titles specific
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Lesson titles should be easy to understand in module lists and
                student-facing navigation.
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Check access settings carefully
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Trial visibility, paid access, and Volna availability affect who can see
                and use this lesson.
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Match content source and key
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Keep the content source and optional content key aligned so the lesson
                renders from the correct location.
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}

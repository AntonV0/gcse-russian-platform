import BackNav from "@/components/ui/back-nav";
import ActiveStatusBadge from "@/components/ui/active-status-badge";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import OperationsWorkspace, {
  OperationsHeader,
  OperationsSection,
} from "@/components/ui/operations-workspace";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import CheckboxField from "@/components/ui/checkbox-field";
import { getCourseByIdDb } from "@/lib/courses/course-helpers-db";
import { updateCourseAction } from "@/app/actions/admin/admin-content-actions";

type AdminCourseEditPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function AdminCourseEditPage({ params }: AdminCourseEditPageProps) {
  const { courseId } = await params;

  const course = await getCourseByIdDb(courseId);

  if (!course) {
    return (
      <main>
        <OperationsWorkspace>
          <OperationsHeader
            eyebrow="Course settings"
            title="Course not found"
            description="This course may have been deleted or the link may be out of date."
          />
        </OperationsWorkspace>
      </main>
    );
  }

  return (
    <main>
      <OperationsWorkspace>
        <OperationsHeader
          eyebrow="Course settings"
          title={`Edit ${course.title}`}
          description="Update course title, slug, description, and visibility settings."
          badges={
            <>
              <Badge tone="muted" icon="file">
                {course.slug}
              </Badge>
              <Badge tone="muted">{course.qualification_level}</Badge>
              <Badge tone="muted">{course.curriculum_code}</Badge>
              <ActiveStatusBadge isActive={course.is_active} />
              <PublishStatusBadge isPublished={course.is_published} />
            </>
          }
          actions={
            <>
              <Button
                href={`/admin/content/courses/${course.id}`}
                variant="secondary"
                icon="back"
              >
                Back to course
              </Button>
              <Button href={`/courses/${course.slug}`} variant="secondary" icon="preview">
                Open public course
              </Button>
            </>
          }
        >
          <BackNav
            items={[
              { href: "/admin/content", label: "Back to content" },
              {
                href: `/admin/content/courses/${course.id}`,
                label: `Back to ${course.title}`,
              },
            ]}
          />
        </OperationsHeader>

        <OperationsSection>
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] xl:items-start">
        <SectionCard
          title="Course settings"
          description="Make structural and visibility changes to this course."
          tone="brand"
        >
          <form action={updateCourseAction} className="space-y-4">
            <input type="hidden" name="courseId" value={course.id} />

            <FormField
              label="Title"
              description="Used across admin navigation, content listings, and the public course view."
            >
              <Input name="title" required defaultValue={course.title} />
            </FormField>

            <FormField label="Slug" description="Short internal URL-friendly identifier.">
              <Input name="slug" required defaultValue={course.slug} />
            </FormField>

            <FormField
              label="Description"
              description="Optional summary used in course listings and admin previews."
            >
              <Textarea
                name="description"
                rows={4}
                defaultValue={course.description ?? ""}
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
                  defaultValue={course.qualification_level}
                >
                  <option value="gcse">GCSE</option>
                  <option value="a_level">A-Level</option>
                </Select>
              </FormField>

              <FormField
                label="Exam board"
                description="Exam board or awarding body for this course."
              >
                <Select name="examBoard" required defaultValue={course.exam_board}>
                  <option value="pearson_edexcel">Pearson Edexcel</option>
                </Select>
              </FormField>

              <FormField
                label="Curriculum code"
                description="Specification or curriculum identifier."
              >
                <Input
                  name="curriculumCode"
                  required
                  defaultValue={course.curriculum_code}
                />
              </FormField>

              <FormField
                label="Language code"
                description="BCP 47 style language code for the course language."
              >
                <Input
                  name="languageCode"
                  required
                  defaultValue={course.language_code}
                />
              </FormField>

              <FormField
                label="Language name"
                description="Readable language name used by internal tools."
              >
                <Input
                  name="languageName"
                  required
                  defaultValue={course.language_name}
                />
              </FormField>
            </div>

            <div className="space-y-2">
              <CheckboxField
                name="isActive"
                label="Active"
                defaultChecked={course.is_active}
              />
              <CheckboxField
                name="isPublished"
                label="Published"
                defaultChecked={course.is_published}
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <LoadingButton
                idleLabel="Save course"
                pendingLabel="Saving course..."
                idleIcon="save"
                variant="primary"
              />

              <Button
                href={`/admin/content/courses/${course.id}`}
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
          description="Keep this course clean and predictable before building deeper structure."
          tone="muted"
          density="compact"
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Keep titles stable
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Course titles appear across admin and public-facing areas, so rename with
                care.
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Use clear slugs
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Slugs should stay short, readable, and consistent with the course title.
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Check visibility settings
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Active and published states control whether this course should be visible
                and usable across the platform.
              </div>
            </div>
          </div>
        </SectionCard>
          </div>
        </OperationsSection>
      </OperationsWorkspace>
    </main>
  );
}

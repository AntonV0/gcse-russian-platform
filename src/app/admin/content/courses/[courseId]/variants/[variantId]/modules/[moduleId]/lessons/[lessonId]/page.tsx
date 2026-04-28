import BackNav from "@/components/ui/back-nav";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import AdminLessonBuilder from "@/components/admin/admin-lesson-builder";
import {
  getCourseByIdDb,
  getVariantByIdDb,
  getModuleByIdDb,
  getLessonByIdDb,
} from "@/lib/courses/course-helpers-db";
import { getLessonSectionsWithBlocksDb } from "@/lib/lessons/lesson-admin-helpers-db";
import { getLessonBuilderTemplateOptionsDb } from "@/lib/lessons/lesson-template-helpers-db";
import { getGrammarSetsDb } from "@/lib/grammar/grammar-helpers-db";
import { getVocabularySetOptionsDb } from "@/lib/vocabulary/sets/set-options";

type AdminLessonDetailPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
    moduleId: string;
    lessonId: string;
  }>;
};

function CompactDisclosure({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <PanelCard
      title={title}
      description={description}
      tone="muted"
      density="compact"
      contentClassName="space-y-4"
    >
      {children}
    </PanelCard>
  );
}

export default async function AdminLessonDetailPage({
  params,
}: AdminLessonDetailPageProps) {
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

  const [sections, templateOptions, vocabularySets, grammarSets] = await Promise.all([
    getLessonSectionsWithBlocksDb(lesson.id),
    getLessonBuilderTemplateOptionsDb(),
    getVocabularySetOptionsDb({ excludeSetTypes: ["specification"] }),
    getGrammarSetsDb(),
  ]);

  const vocabularySetOptions = vocabularySets.map((set) => ({
    id: set.id,
    title: set.title,
    slug: set.slug as string,
    isPublished: set.is_published,
    tier: set.tier,
    listMode: set.list_mode,
    setType: set.set_type,
    lists: set.lists.map((list) => ({
      id: list.id,
      title: list.title,
      slug: list.slug,
      isPublished: list.is_published,
      tier: list.tier,
      listMode: list.list_mode,
    })),
  }));
  const grammarSetOptions = grammarSets.map((set) => ({
    id: set.id,
    title: set.title,
    slug: set.slug,
    isPublished: set.is_published,
    tier: set.tier,
    themeKey: set.theme_key,
    topicKey: set.topic_key,
    pointCount: set.point_count,
  }));

  return (
    <main className="space-y-3">
      <BackNav
        items={[
          { href: "/admin/content", label: "Content" },
          {
            href: `/admin/content/courses/${course.id}`,
            label: course.title,
          },
          {
            href: `/admin/content/courses/${course.id}/variants/${variant.id}`,
            label: variant.title,
          },
          {
            href: `/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`,
            label: module.title,
          },
        ]}
      />

      <PageIntroPanel
        tone="admin"
        eyebrow="Lesson"
        title={lesson.title}
        description={lesson.summary ?? "Manage lesson details and lesson content."}
        badges={
          <>
            <Badge tone="muted" icon="file">
              {lesson.slug}
            </Badge>
            <Badge tone="muted">{lesson.lesson_type}</Badge>
            <PublishStatusBadge isPublished={lesson.is_published} />
            <Badge tone={lesson.is_trial_visible ? "success" : "muted"} icon="help">
              {lesson.is_trial_visible ? "Trial" : "No Trial"}
            </Badge>
            <Badge tone={lesson.available_in_volna ? "success" : "muted"} icon="users">
              {lesson.available_in_volna ? "Volna" : "No Volna"}
            </Badge>
          </>
        }
        actions={
          <>
            <Button
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}/edit`}
              variant="secondary"
              icon="edit"
            >
              Edit lesson metadata
            </Button>

            <Button
              href={`/courses/${course.slug}/${variant.slug}/modules/${module.slug}/lessons/${lesson.slug}`}
              variant="secondary"
              icon="preview"
            >
              Open public lesson
            </Button>
          </>
        }
      />

      <SectionCard
        title="Lesson builder"
        description="Build and organise lesson sections and blocks for long-form authoring."
        tone="brand"
      >
        <AdminLessonBuilder
          lessonId={lesson.id}
          courseId={courseId}
          variantId={variantId}
          moduleId={moduleId}
          lessonSlug={lesson.slug}
          courseSlug={course.slug}
          variantSlug={variant.slug}
          moduleSlug={module.slug}
          sections={sections}
          templateOptions={templateOptions}
          vocabularySetOptions={vocabularySetOptions}
          grammarSetOptions={grammarSetOptions}
        />
      </SectionCard>

      <CompactDisclosure
        title="Lesson admin details"
        description="Metadata, publishing information, content source, and internal lesson settings."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-[var(--text-primary)]">Title:</span>{" "}
                <span className="app-text-muted">{lesson.title}</span>
              </div>
              <div>
                <span className="font-medium text-[var(--text-primary)]">Slug:</span>{" "}
                <span className="app-text-muted">{lesson.slug}</span>
              </div>
              <div>
                <span className="font-medium text-[var(--text-primary)]">Type:</span>{" "}
                <span className="app-text-muted">{lesson.lesson_type}</span>
              </div>
              <div>
                <span className="font-medium text-[var(--text-primary)]">
                  Content source:
                </span>{" "}
                <span className="app-text-muted">{lesson.content_source}</span>
              </div>
              {lesson.content_key ? (
                <div>
                  <span className="font-medium text-[var(--text-primary)]">
                    Content key:
                  </span>{" "}
                  <span className="app-text-muted">{lesson.content_key}</span>
                </div>
              ) : null}
              {lesson.summary ? (
                <div>
                  <span className="font-medium text-[var(--text-primary)]">Summary:</span>{" "}
                  <span className="app-text-muted">{lesson.summary}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-[var(--text-primary)]">Published:</span>{" "}
                <span className="app-text-muted">
                  {lesson.is_published ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <span className="font-medium text-[var(--text-primary)]">
                  Trial visible:
                </span>{" "}
                <span className="app-text-muted">
                  {lesson.is_trial_visible ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <span className="font-medium text-[var(--text-primary)]">
                  Requires paid access:
                </span>{" "}
                <span className="app-text-muted">
                  {lesson.requires_paid_access ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <span className="font-medium text-[var(--text-primary)]">
                  Available in Volna:
                </span>{" "}
                <span className="app-text-muted">
                  {lesson.available_in_volna ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <span className="font-medium text-[var(--text-primary)]">
                  Estimated minutes:
                </span>{" "}
                <span className="app-text-muted">{lesson.estimated_minutes ?? "—"}</span>
              </div>
              <div>
                <span className="font-medium text-[var(--text-primary)]">Position:</span>{" "}
                <span className="app-text-muted">{lesson.position}</span>
              </div>
            </div>
          </div>
        </div>
      </CompactDisclosure>
    </main>
  );
}

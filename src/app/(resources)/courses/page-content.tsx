import type { Metadata } from "next";
import Image from "next/image";
import JourneyProgressBar from "@/components/courses/journey-progress-bar";
import AppIcon from "@/components/ui/app-icon";
import DashboardCard from "@/components/ui/dashboard-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import LockedContentCard from "@/components/ui/locked-content-card";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import {
  getCoursesDb,
  getVariantsByCourseIdDb,
  type DbCourse,
  type DbCourseVariant,
} from "@/lib/courses/course-helpers-db";
import { getCoursePath, getOnlineClassesPath, getVariantPath } from "@/lib/access/routes";
import {
  formatCoursePathRemainingMinutes,
  getVariantPathProgressSummaries,
  type VariantPathProgressSummary,
} from "@/lib/courses/path-progress";
import {
  formatLessonProgressLabel,
  formatLessonProgressRatio,
} from "@/lib/courses/progress-labels";
import {
  getDashboardVariantSlug,
  getVariantActionState,
  getVariantDisplayName,
  getVariantTone,
  getVisibleCourseVariants,
} from "@/lib/courses/journey-state";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import type { AppIconKey } from "@/lib/shared/icons";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Course Hub",
  description:
    "Browse structured GCSE Russian course paths, lessons, vocabulary, grammar, past papers, and mock exam practice for Pearson Edexcel 1RU0.",
  path: "/courses",
  ogTitle: "GCSE Russian Course Hub",
  ogDescription:
    "Explore the GCSE Russian learning platform and see how lessons, revision, and exam practice connect.",
  ogImagePath: getOgImagePath("course"),
});

type CourseHubItem = {
  course: DbCourse;
  variants: DbCourseVariant[];
  summaries: Map<string, VariantPathProgressSummary>;
  activeVariant: DbCourseVariant | null;
  activeSummary: VariantPathProgressSummary | null;
};

const studyAreas = [
  {
    title: "Course lessons",
    description: "Follow the structured GCSE Russian path and keep the next step clear.",
    href: "/courses",
    icon: "courses",
  },
  {
    title: "Vocabulary and grammar",
    description:
      "Revise the language that supports speaking, writing, listening, and reading.",
    href: "/vocabulary",
    secondaryHref: "/grammar",
    secondaryLabel: "Grammar",
    icon: "vocabulary",
  },
  {
    title: "Past papers",
    description:
      "Use official paper links and exam resources when you want board-style practice.",
    href: "/past-papers",
    icon: "pastPapers",
  },
  {
    title: "Mock exams",
    description: "Start or resume platform mock attempts for exam-condition preparation.",
    href: "/mock-exams",
    icon: "mockExam",
  },
] satisfies Array<{
  title: string;
  description: string;
  href: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  icon: AppIconKey;
}>;

const guestPreviewAreas = [
  {
    title: "Course map",
    description:
      "See how Foundation and Higher fit into one GCSE Russian route before choosing a trial path.",
    href: "/courses",
    action: "You are here",
    icon: "courses",
  },
  {
    title: "Vocabulary preview",
    description:
      "Browse public vocabulary sets and see the study surface before saving progress.",
    href: "/vocabulary",
    action: "Open vocabulary",
    icon: "vocabulary",
  },
  {
    title: "Grammar preview",
    description:
      "Check the grammar hub, topics, and reference style without creating an account.",
    href: "/grammar",
    action: "Open grammar",
    icon: "grammar",
  },
  {
    title: "Past papers",
    description:
      "Use open official-resource links while deciding whether the structured course is useful.",
    href: "/past-papers",
    action: "Open papers",
    icon: "pastPapers",
  },
] satisfies Array<{
  title: string;
  description: string;
  href: string;
  action: string;
  icon: AppIconKey;
}>;

type CourseAction = {
  href: string;
  label: string;
  icon: AppIconKey;
  badge: string;
  title: string;
  description: string;
};

function getCourseAction(item: CourseHubItem): CourseAction {
  if (!item.activeVariant || !item.activeSummary) {
    return {
      href: getCoursePath(item.course.slug),
      label: "View course paths",
      icon: "layers",
      badge: "Choose a path",
      title: "Choose your GCSE Russian path",
      description:
        "Pick Foundation or Higher first, then the course page will become a focused next-lesson hub.",
    };
  }

  const variantName = getVariantDisplayName(
    item.activeVariant.slug,
    item.activeVariant.title
  );

  if (item.activeSummary.nextLesson) {
    const isStarting = item.activeSummary.completedLessons === 0;

    return {
      href: item.activeSummary.nextLesson.href,
      label: isStarting ? "Start first lesson" : "Continue lesson",
      icon: "next",
      badge: isStarting ? "First lesson ready" : "Next lesson ready",
      title: isStarting
        ? `Start your ${variantName} course`
        : `Continue your ${variantName} course`,
      description: `${item.activeSummary.nextLesson.title} is ready in ${item.activeSummary.nextLesson.moduleTitle}.`,
    };
  }

  if (item.activeSummary.isComplete) {
    return {
      href: getVariantPath(item.course.slug, item.activeVariant.slug),
      label: "Review course",
      icon: "completed",
      badge: "Path complete",
      title: `${variantName} path complete`,
      description:
        "All available lessons are complete. Use the path page to revisit modules and keep exam knowledge warm.",
    };
  }

  return {
    href: getVariantPath(item.course.slug, item.activeVariant.slug),
    label: "Open path",
    icon: "courses",
    badge: `${variantName} path selected`,
    title: `Open your ${variantName} path`,
    description:
      "Your course path is selected. Open it to view modules and start the first available lesson.",
  };
}

async function getCourseHubItems(
  courses: DbCourse[],
  activeVariantSlug: string | null
): Promise<CourseHubItem[]> {
  return Promise.all(
    courses.map(async (course) => {
      const variants = await getVariantsByCourseIdDb(course.id);
      const summaries = await getVariantPathProgressSummaries(course.slug, variants);
      const activeVariant = activeVariantSlug
        ? (variants.find((variant) => variant.slug === activeVariantSlug) ?? null)
        : null;
      const activeSummary = activeVariant
        ? (summaries.get(activeVariant.slug) ?? null)
        : null;

      return {
        course,
        variants,
        summaries,
        activeVariant,
        activeSummary,
      };
    })
  );
}

function CourseHubCard({ item }: { item: CourseHubItem }) {
  const action = getCourseAction(item);
  const summary = item.activeSummary;
  const variantName = item.activeVariant
    ? getVariantDisplayName(item.activeVariant.slug, item.activeVariant.title)
    : "No path selected";

  return (
    <DashboardCard className="h-full">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <Badge tone="info" icon="school">
            GCSE Russian
          </Badge>
          <Badge
            tone={item.activeVariant ? getVariantTone(item.activeVariant.slug) : "muted"}
            icon="layers"
          >
            {variantName}
          </Badge>
          <Badge tone={summary?.nextLesson ? "success" : "muted"} icon={action.icon}>
            {action.badge}
          </Badge>
        </div>

        <div className="space-y-2">
          <h2 className="app-heading-section">{action.title}</h2>
          <p className="app-text-body-muted">{action.description}</p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-[var(--text-primary)]">
              {summary?.progressPercent ?? 0}% complete
            </span>
            <span className="app-text-muted">
              {formatLessonProgressLabel(
                summary?.completedLessons,
                summary?.totalLessons
              )}
            </span>
          </div>
          <JourneyProgressBar
            value={summary?.progressPercent}
            label={`${item.course.title} progress`}
            isComplete={!!summary?.isComplete}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="app-stat-tile">
            <div className="app-stat-label">Next up</div>
            <div className="app-stat-value">
              {summary?.nextLesson?.title ??
                (summary?.isComplete ? "Review ready" : "Choose path")}
            </div>
          </div>
          <div className="app-stat-tile">
            <div className="app-stat-label">Study time left</div>
            <div className="app-stat-value">
              {formatCoursePathRemainingMinutes(
                summary?.remainingMinutes,
                !!summary?.isComplete
              )}
            </div>
          </div>
          <div className="app-stat-tile">
            <div className="app-stat-label">Modules</div>
            <div className="app-stat-value">
              {summary?.totalModules ? String(summary.totalModules) : "No modules yet"}
            </div>
          </div>
        </div>

        <div className="app-mobile-action-stack flex flex-wrap gap-3">
          <Button href={action.href} variant="journey" icon={action.icon}>
            {action.label}
          </Button>
          <Button
            href={getCoursePath(item.course.slug)}
            variant="secondary"
            icon="courses"
          >
            View all paths
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}

function VariantPathCards({
  item,
  dashboard,
}: {
  item: CourseHubItem;
  dashboard: DashboardInfo;
}) {
  const variants = getVisibleCourseVariants(item.variants, dashboard.accessState);

  return (
    <section aria-labelledby="course-paths-heading">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="course-paths-heading" className="app-heading-section">
            Course paths
          </h2>
          <p className="mt-2 max-w-2xl app-text-body-muted">
            Keep one route active for day-to-day study, with upgrade and review paths
            visible when they apply.
          </p>
        </div>

        <Button href={getCoursePath(item.course.slug)} variant="secondary" icon="layers">
          All paths
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {variants.map((variant) => {
          const summary = item.summaries.get(variant.slug);
          const isActive = item.activeVariant?.slug === variant.slug;
          const isUpgrade =
            dashboard.accessState === "full_foundation" && variant.slug === "higher";
          const href = isUpgrade
            ? "/account/billing"
            : (summary?.nextLesson?.href ??
              getVariantPath(item.course.slug, variant.slug));
          const actionState = getVariantActionState({
            isUpgrade,
            hasNextLesson: !!summary?.nextLesson,
            isComplete: !!summary?.isComplete,
            completedLessons: summary?.completedLessons ?? 0,
          });
          const ariaLabel = `${actionState.ariaPrefix} ${getVariantDisplayName(
            variant.slug,
            variant.title
          )} path`;

          return (
            <DashboardCard
              key={variant.slug}
              className={[
                "app-card-interaction-subtle h-full",
                isActive
                  ? "border-[var(--accent-selected-border)] shadow-[0_16px_34px_color-mix(in_srgb,var(--accent-border-ink)_14%,transparent)]"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge tone={getVariantTone(variant.slug)} icon="layers">
                    {getVariantDisplayName(variant.slug, variant.title)}
                  </Badge>
                  {isActive ? (
                    <Badge tone="success" icon="completed">
                      Current path
                    </Badge>
                  ) : dashboard.accessState === "full_foundation" &&
                    variant.slug === "higher" ? (
                    <Badge tone="warning" icon="billing">
                      Upgrade path
                    </Badge>
                  ) : null}
                </div>

                <div>
                  <h3 className="app-heading-card">{variant.title}</h3>
                  <p className="mt-2 app-text-body-muted">
                    {variant.description ??
                      "Open this route to view modules and available lessons."}
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-[var(--text-primary)]">
                      {summary?.progressPercent ?? 0}% complete
                    </span>
                    <span className="app-text-muted">
                      {formatLessonProgressRatio(
                        summary?.completedLessons,
                        summary?.totalLessons
                      )}
                    </span>
                  </div>
                  <JourneyProgressBar
                    value={summary?.progressPercent}
                    label={`${variant.title} path progress`}
                    isComplete={!!summary?.isComplete}
                  />
                </div>

                {summary?.nextLesson ? (
                  <p className="text-sm app-text-muted">
                    Next: {summary.nextLesson.title}
                  </p>
                ) : null}

                {isUpgrade ? (
                  <Button
                    href="/account/billing"
                    variant="accent"
                    icon="billing"
                    ariaLabel={ariaLabel}
                  >
                    {actionState.label}
                  </Button>
                ) : (
                  <Button
                    href={href}
                    ariaLabel={ariaLabel}
                    variant={isActive ? "journey" : "secondary"}
                    icon={actionState.icon}
                    iconPosition="right"
                  >
                    {actionState.label}
                  </Button>
                )}
              </div>
            </DashboardCard>
          );
        })}
      </div>
    </section>
  );
}

function SpeakingIntensiveCard() {
  return (
    <DashboardCard title="Speaking Exam Intensive" className="h-full">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge tone="info" icon="speaking">
            Paper 2 support
          </Badge>
          <Badge tone="muted" icon="teacher">
            4 private online lessons
          </Badge>
        </div>

        <p>
          Prepare for role play, picture-based questions, conversation, pronunciation, and
          confident live responses with one of our GCSE Russian teachers.
        </p>

        <ul className="grid gap-2 text-sm text-[var(--text-secondary)]">
          {[
            "Lesson 1: diagnose strengths and speaking targets",
            "Lesson 2: role play and question handling",
            "Lesson 3: picture task and conversation answers",
            "Lesson 4: timed exam-style rehearsal and next steps",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <AppIcon
                icon="confirm"
                size={15}
                className="mt-0.5 shrink-0 text-[var(--accent-ink)]"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="app-mobile-action-stack flex flex-wrap gap-3 pt-1">
          <Button href={getOnlineClassesPath()} variant="accent" icon="speaking">
            Explore speaking support
          </Button>
          <Button href="/gcse-russian-speaking-exam" variant="secondary" icon="exam">
            Speaking guide
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}

export default async function CoursesPage() {
  const [courses, dashboard] = await Promise.all([getCoursesDb(), getDashboardInfo()]);

  if (dashboard.role === "guest") {
    return (
      <main className="space-y-8">
        <section className="app-surface-brand app-section-padding-lg overflow-hidden">
          <div className="grid gap-7 xl:grid-cols-[minmax(0,0.86fr)_minmax(430px,560px)] xl:items-stretch">
            <div className="space-y-5 xl:py-2">
              <div className="flex flex-wrap gap-2">
                <Badge tone="info" icon="school">
                  GCSE Russian
                </Badge>
                <Badge tone="muted" icon="locked">
                  Lessons require trial
                </Badge>
              </div>

              <div className="space-y-2">
                <h1 className="app-heading-hero max-w-3xl">
                  Preview the GCSE Russian app before signup
                </h1>
                <p className="app-subtitle max-w-2xl">
                  Look around the course map, public vocabulary, grammar, papers, and
                  mock-exam area first. Create a trial when you want to choose Foundation
                  or Higher, open lessons, and save progress.
                </p>
              </div>

              <div className="app-mobile-action-stack flex flex-wrap gap-3">
                <Button href="/signup" variant="primary" icon="create">
                  Create trial account
                </Button>
                <Button href="/vocabulary" variant="secondary" icon="vocabulary">
                  Browse vocabulary
                </Button>
              </div>
            </div>

            <div className="relative -mx-1 -mb-4 mt-1 min-h-[250px] sm:min-h-[310px] xl:-mr-4 xl:-mt-3 xl:mb-0 xl:ml-0 xl:min-h-[330px]">
              <Image
                src="/illustrations/course-pathway-next-lesson-v3.png"
                alt="GCSE Russian next lesson course pathway illustration"
                width={1240}
                height={657}
                priority
                sizes="(min-width: 1280px) 620px, 92vw"
                className="absolute right-0 top-1/2 h-full w-auto max-w-none -translate-y-1/2 object-contain object-right drop-shadow-[0_18px_34px_color-mix(in_srgb,var(--text-primary)_10%,transparent)]"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {guestPreviewAreas.map((area) => (
            <DashboardCard key={area.title} className="h-full">
              <div className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--accent-ink)]">
                  <AppIcon icon={area.icon} size={20} />
                </div>
                <div>
                  <h2 className="app-heading-card">{area.title}</h2>
                  <p className="mt-2 app-text-body-muted">{area.description}</p>
                </div>
                <Button
                  href={area.href}
                  variant={area.href === "/courses" ? "quiet" : "secondary"}
                  size="sm"
                  icon={area.icon}
                >
                  {area.action}
                </Button>
              </div>
            </DashboardCard>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <DashboardCard key={course.id} title={course.title} className="h-full">
              <div className="space-y-3">
                <p>{course.description ?? "Structured GCSE Russian course content."}</p>
                <Badge tone="warning" icon="locked">
                  Trial unlocks path choice
                </Badge>
              </div>
            </DashboardCard>
          ))}
        </section>

        <LockedContentCard
          title="Create a trial to choose Foundation or Higher"
          description="The public app preview stays open. Trial accounts add the student layer: tier choice, sample lesson access, saved progress, mock attempts, and account tools."
          accessLabel="Trial account"
          statusLabel="Signup required"
          primaryActionHref="/signup"
          primaryActionLabel="Create trial account"
          secondaryActionHref="/gcse-russian-course"
          secondaryActionLabel="Read course details"
        />
      </main>
    );
  }

  const activeVariantSlug = getDashboardVariantSlug(dashboard.variant);
  const courseHubItems = await getCourseHubItems(courses, activeVariantSlug);
  const primaryCourse = courseHubItems[0] ?? null;
  const primaryAction = primaryCourse ? getCourseAction(primaryCourse) : null;
  const primarySummary = primaryCourse?.activeSummary ?? null;
  const primaryVariantName = primaryCourse?.activeVariant
    ? getVariantDisplayName(
        primaryCourse.activeVariant.slug,
        primaryCourse.activeVariant.title
      )
    : "Choose path";

  return (
    <main className="space-y-8">
      <section className="app-surface-brand app-section-padding-lg overflow-hidden">
        <div className="grid gap-7 xl:grid-cols-[minmax(0,0.86fr)_minmax(430px,560px)] xl:items-stretch">
          <div className="space-y-5 xl:py-2">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="school">
                GCSE Russian
              </Badge>
              <Badge
                tone={primaryCourse?.activeVariant ? "success" : "muted"}
                icon="layers"
              >
                {primaryVariantName}
              </Badge>
              {primaryAction ? (
                <Badge tone="success" icon={primaryAction.icon}>
                  {primaryAction.badge}
                </Badge>
              ) : null}
            </div>

            <div className="space-y-2">
              <h1 className="app-heading-hero max-w-3xl">
                {primaryAction?.title ?? "Your GCSE Russian course"}
              </h1>
              <p className="app-subtitle max-w-2xl">
                {primaryAction?.description ??
                  "Open the course page to choose a route and begin structured GCSE Russian study."}
              </p>
            </div>

            <div className="app-mobile-action-stack flex flex-wrap gap-3">
              {primaryAction ? (
                <Button
                  href={primaryAction.href}
                  variant="journey"
                  icon={primaryAction.icon}
                >
                  {primaryAction.label}
                </Button>
              ) : null}
              {primaryCourse ? (
                <Button
                  href={getCoursePath(primaryCourse.course.slug)}
                  variant="secondary"
                  icon="layers"
                >
                  View paths
                </Button>
              ) : null}
            </div>
          </div>

          <div className="relative -mx-1 -mb-4 mt-1 min-h-[250px] sm:min-h-[310px] xl:-mr-4 xl:-mt-3 xl:mb-0 xl:ml-0 xl:min-h-[330px]">
            <Image
              src="/illustrations/course-pathway-next-lesson-v3.png"
              alt="GCSE Russian next lesson course pathway illustration"
              width={1240}
              height={657}
              priority
              sizes="(min-width: 1280px) 620px, 92vw"
              className="absolute right-0 top-1/2 h-full w-auto max-w-none -translate-y-1/2 object-contain object-right drop-shadow-[0_18px_34px_color-mix(in_srgb,var(--text-primary)_10%,transparent)]"
            />
          </div>
        </div>
      </section>

      {courses.length === 0 ? (
        <EmptyState
          icon="courses"
          iconTone="brand"
          title="No courses available yet"
          description="There are no courses available right now. Return to your dashboard and check again later."
          visual={
            <VisualPlaceholder
              category="learningPath"
              ariaLabel="Course empty state placeholder"
            />
          }
          action={
            <Button href="/dashboard" variant="primary" icon="dashboard">
              Dashboard
            </Button>
          }
        />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryStatCard
              title="Current path"
              value={primaryVariantName}
              description={
                primaryCourse?.activeVariant
                  ? "selected for this account"
                  : "choose Foundation or Higher"
              }
              icon="lesson"
              tone="brand"
              compact
            />
            <SummaryStatCard
              title="Completed"
              value={primarySummary?.completedLessons ?? 0}
              description={
                primarySummary
                  ? `${primarySummary.progressPercent}% of your path`
                  : "starts after path selection"
              }
              icon="completed"
              tone="success"
              compact
            />
            <SummaryStatCard
              title="Next lesson"
              value={primarySummary?.nextLesson ? "Ready" : "Choose"}
              description={
                primarySummary?.nextLesson?.title ??
                (primarySummary?.isComplete ? "review available" : "open variants")
              }
              icon="layers"
              compact
            />
            <SummaryStatCard
              title="Study time"
              value={formatCoursePathRemainingMinutes(
                primarySummary?.remainingMinutes,
                !!primarySummary?.isComplete
              )}
              description="remaining on current path"
              icon="pending"
              tone="info"
              compact
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
            <div className="grid gap-4">
              {courseHubItems.map((item) => (
                <CourseHubCard key={item.course.id} item={item} />
              ))}
            </div>

            <SpeakingIntensiveCard />
          </section>

          {primaryCourse ? (
            <VariantPathCards item={primaryCourse} dashboard={dashboard} />
          ) : null}

          <section>
            <div className="mb-4">
              <h2 className="app-heading-section">Revision tools</h2>
              <p className="mt-2 max-w-2xl app-text-body-muted">
                Keep these close to the course path, but let the next lesson remain the
                main job on this page.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {studyAreas.map((area) => {
                const primaryHref =
                  area.title === "Course lessons" && primaryCourse
                    ? getCoursePath(primaryCourse.course.slug)
                    : area.href;

                return (
                  <DashboardCard key={area.title} className="h-full">
                    <div className="space-y-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--accent-ink)]">
                        <AppIcon icon={area.icon} size={20} />
                      </div>
                      <div>
                        <h3 className="app-heading-card">{area.title}</h3>
                        <p className="mt-2 app-text-body-muted">{area.description}</p>
                      </div>
                      <div className="app-mobile-action-stack flex flex-wrap gap-2">
                        <Button
                          href={primaryHref}
                          variant="secondary"
                          size="sm"
                          icon={area.icon}
                        >
                          {area.title === "Vocabulary and grammar"
                            ? "Open vocabulary"
                            : area.title === "Course lessons"
                              ? "Open course"
                              : `Open ${area.title.toLowerCase()}`}
                        </Button>
                        {area.secondaryHref ? (
                          <Button
                            href={area.secondaryHref}
                            variant="secondary"
                            size="sm"
                            icon="grammar"
                          >
                            {area.secondaryLabel ?? "Open"}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </DashboardCard>
                );
              })}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

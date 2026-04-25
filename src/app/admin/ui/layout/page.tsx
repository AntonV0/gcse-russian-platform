import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import LessonFooterNav from "@/components/layout/lesson-footer-nav";
import LessonHeader from "@/components/layout/lesson-header";
import PageContainer from "@/components/layout/page-container";
import PageHeader from "@/components/layout/page-header";
import PlatformSidebar from "@/components/layout/platform-sidebar";
import SiteFooter from "@/components/layout/site-footer";
import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import PanelCard from "@/components/ui/panel-card";
import SectionHeader from "@/components/ui/section-header";
import StatusSummaryCard from "@/components/ui/status-summary-card";
import Surface from "@/components/ui/surface";

const pageNavItems = [
  { id: "boundary-components", label: "Boundaries" },
  { id: "page-boundaries", label: "Page boundaries" },
  { id: "shells", label: "Shells" },
  { id: "grids", label: "Grids" },
  { id: "density", label: "Density" },
  { id: "responsive", label: "Responsive" },
  { id: "future-components", label: "Future" },
];

function DemoBlock({
  title,
  description,
  className = "",
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <Card className={["p-4", className].filter(Boolean).join(" ")}>
      <div className="mb-2 font-semibold text-[var(--text-primary)]">{title}</div>
      <p className="text-sm app-text-muted">{description}</p>
    </Card>
  );
}

function DemoAdminShell() {
  return (
    <PanelCard
      title="Admin content-management shell"
      description="Dense but still structured: page header, summary row, primary work area, and supporting side context."
      contentClassName="space-y-4"
    >
      <Surface variant="default" padding="md">
        <SectionHeader
          title="Course content"
          description="Manage modules, lessons, status, and publishing."
          actions={
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" icon="filter">
                Filter
              </Button>
              <Button variant="primary" icon="create">
                Add lesson
              </Button>
            </div>
          }
        />
      </Surface>

      <div className="grid gap-4 md:grid-cols-3">
        <DemoBlock
          title="Published lessons"
          description="34 lessons across all variants."
        />
        <DemoBlock title="Draft lessons" description="7 items needing review." />
        <DemoBlock title="Last update" description="Teacher tools refined yesterday." />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.85fr)]">
        <DemoBlock
          title="Primary work area"
          description="Tables, editors, builder workspaces, and detailed review areas belong here."
          className="min-h-[220px]"
        />
        <DemoBlock
          title="Secondary rail"
          description="Metadata, filters, settings, help, and inspector controls live here."
          className="min-h-[220px]"
        />
      </div>
    </PanelCard>
  );
}

function DemoStudentShell() {
  return (
    <PanelCard
      title="Student dashboard shell"
      description="Lighter rhythm, calmer spacing, and clearer motivational hierarchy."
      contentClassName="space-y-4"
    >
      <Surface variant="brand" padding="lg">
        <div className="max-w-2xl">
          <div className="app-label">Continue learning</div>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
            You are halfway through Theme 1
          </h3>
          <p className="mt-3 text-sm leading-6 app-text-muted">
            A student-facing page can feel softer and more encouraging while still staying
            inside the same design system.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="inverse" icon="next" iconPosition="right">
              Continue lesson
            </Button>
            <Button variant="secondary" icon="preview">
              View course map
            </Button>
          </div>
        </div>
      </Surface>

      <div className="grid gap-4 md:grid-cols-3">
        <DemoBlock title="Completed" description="12 lessons finished this term." />
        <DemoBlock
          title="Current goal"
          description="Finish speaking practice by Friday."
        />
        <DemoBlock title="Teacher note" description="Keep revising past tense endings." />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <DemoBlock
          title="Main dashboard flow"
          description="Course continuation, assignments, and recommended next actions."
          className="min-h-[180px]"
        />
        <DemoBlock
          title="Support rail"
          description="Smaller reminders, streaks, access status, or upcoming online classes."
          className="min-h-[180px]"
        />
      </div>
    </PanelCard>
  );
}

function DemoLessonShell() {
  return (
    <PanelCard
      title="Lesson page direction"
      description="Long-form learning pages need strong reading rhythm rather than dashboard density."
      contentClassName="space-y-4"
    >
      <Surface variant="muted" padding="lg">
        <div className="max-w-3xl">
          <div className="app-label">Lesson intro</div>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
            School and daily routine
          </h3>
          <p className="mt-3 text-sm leading-6 app-text-muted">
            Lesson pages should lead with context, then move into content sections with a
            calmer vertical rhythm than admin pages.
          </p>
        </div>
      </Surface>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.72fr)]">
        <div className="space-y-4">
          <DemoBlock
            title="Section stack"
            description="Vocabulary, explanation blocks, worked examples, and practice sections stack vertically."
            className="min-h-[140px]"
          />
          <DemoBlock
            title="Follow-up section"
            description="Use repeated surfaces and consistent spacing instead of inventing new layout rules per lesson."
            className="min-h-[140px]"
          />
        </div>

        <DemoBlock
          title="Lesson rail"
          description="Progress summary, quick navigation, glossary support, or access prompts."
          className="min-h-[300px]"
        />
      </div>
    </PanelCard>
  );
}

function DemoGridPatterns() {
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 font-semibold text-[var(--text-primary)]">
          Two-column pairs
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <DemoBlock
            title="Balanced split"
            description="Best for paired content or moderate-density admin sections."
          />
          <DemoBlock
            title="Balanced split"
            description="Works when both blocks have similar importance and depth."
          />
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-[var(--text-primary)]">
          Three-column summaries
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <DemoBlock title="Metric" description="Compact overview or KPI card." />
          <DemoBlock title="Metric" description="Compact overview or KPI card." />
          <DemoBlock title="Metric" description="Compact overview or KPI card." />
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-[var(--text-primary)]">
          Main + sidebar
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.85fr)]">
          <DemoBlock
            title="Main content"
            description="Use for detailed editing, learning content, review queues, or tables."
            className="min-h-[180px]"
          />
          <DemoBlock
            title="Sidebar"
            description="Use for metadata, filters, supporting context, or actions."
            className="min-h-[180px]"
          />
        </div>
      </div>
    </div>
  );
}

function DemoDensityComparison() {
  const patterns = [
    {
      title: "Dense admin layer",
      description:
        "Tighter spacing is acceptable when users are scanning rows, settings, or content structures repeatedly.",
      icon: "layout" as const,
    },
    {
      title: "Calmer student layer",
      description:
        "Use more breathing room and softer pacing when the user is reading, revising, or choosing the next lesson.",
      icon: "courses" as const,
    },
    {
      title: "Focused utility rail",
      description:
        "Side rails should stay compact and supporting, not compete with the main task flow.",
      icon: "info" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {patterns.map((item) => (
        <Card key={item.title} className="h-full p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl [background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
            <AppIcon icon={item.icon} size={18} />
          </div>
          <div className="mb-2 font-semibold text-[var(--text-primary)]">
            {item.title}
          </div>
          <p className="text-sm app-text-muted">{item.description}</p>
        </Card>
      ))}
    </div>
  );
}

function DemoStackingRhythm() {
  return (
    <div className="space-y-4">
      <Surface variant="default" padding="md">
        <SectionHeader
          title="Page header layer"
          description="Page title, description, and key actions should be the first clear layer."
          actions={
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" icon="filter">
                Filter
              </Button>
              <Button variant="primary" icon="create">
                Create
              </Button>
            </div>
          }
        />
      </Surface>

      <div className="grid gap-4 md:grid-cols-3">
        <DemoBlock
          title="Summary layer"
          description="Metrics, status, or quick summary."
        />
        <DemoBlock
          title="Summary layer"
          description="Keep this row compact and scannable."
        />
        <DemoBlock
          title="Summary layer"
          description="Do not bury the main task above it."
        />
      </div>

      <DemoBlock
        title="Primary content layer"
        description="Large sections, tables, editors, or the main lesson content belong here."
      />

      <DemoBlock
        title="Secondary/supporting layer"
        description="Use this for notes, history, related items, help, or lower-priority details."
      />
    </div>
  );
}

function DemoResponsiveRules() {
  const rules = [
    "Default to one-column stacking, then open into two or three columns only when the content still breathes.",
    "Summary rows should collapse before editors and form controls start feeling cramped.",
    "Main + sidebar layouts should only appear when both columns remain readable and usable.",
    "Headers and action groups should wrap cleanly before their spacing becomes strained.",
    "Student pages should preserve readable line length even when lots of card content exists.",
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {rules.map((rule) => (
        <Card key={rule} className="p-4">
          <div className="flex items-start gap-3">
            <AppIcon icon="layout" size={16} className="mt-0.5 app-brand-text" />
            <p className="text-sm app-text-muted">{rule}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default async function AdminUiLayoutPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Layout"
      description="Reference page for shells, grids, density decisions, and responsive page composition."
      currentPath="/admin/ui/layout"
    >
      <UiLabPageNav items={pageNavItems} />

      <UiLabSection
        id="boundary-components"
        title="Production layout boundaries"
        description="These are the real shared layout components, shown separately from future layout ideas. AppShell and SiteHeader are already active around this UI Lab page, so they are documented here rather than nested again."
      >
        <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
          <Card className="max-h-[620px] overflow-auto p-3">
            <PlatformSidebar role="student" accessMode="full" pathname="/courses" />
          </Card>

          <div className="space-y-4">
            <Surface variant="muted" padding="md">
              <LessonHeader
                backHref="/courses"
                backLabel="Back to Theme 1"
                moduleTitle="Theme 1 / Identity and culture"
                lessonTitle="School and daily routine"
                lessonDescription="A realistic lesson header using the production reading-page component."
              />

              <Card className="p-4">
                <p className="text-sm app-text-muted">
                  Lesson content sits between the header and footer navigation in the real
                  student learning flow.
                </p>
              </Card>

              <LessonFooterNav
                moduleHref="/courses/theme-1"
                previousLesson={{
                  href: "/courses/theme-1/family",
                  label: "Family and relationships",
                }}
                nextLesson={{
                  href: "/courses/theme-1/free-time",
                  label: "Free time activities",
                }}
              />
            </Surface>

            <Card className="overflow-hidden">
              <SiteFooter />
            </Card>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatusSummaryCard
            title="AppShell"
            description="Active around the page; avoid rendering nested app shells inside UI Lab examples."
            badgeTone="info"
            badgeLabel="Boundary"
          />
          <StatusSummaryCard
            title="SiteHeader"
            description="Active at the top of the page, including theme and account utilities."
            badgeTone="success"
            badgeLabel="Visible"
          />
          <StatusSummaryCard
            title="LogoutButton"
            description="Displayed through PlatformSidebar and SiteHeader utility areas."
            badgeTone="muted"
            badgeLabel="Utility"
          />
        </div>
      </UiLabSection>

      <UiLabSection
        id="page-boundaries"
        title="Page boundaries"
        description="Use PageContainer and PageHeader at the page layout boundary before composing internal sections."
      >
        <PageContainer>
          <Surface variant="muted" padding="md">
            <PageHeader
              title="Vocabulary management"
              description="Manage GCSE Russian vocabulary sets, item counts, publication status, and theme coverage."
            />
            <div className="grid gap-4 md:grid-cols-3">
              <DemoBlock title="Sets" description="12 vocabulary sets configured." />
              <DemoBlock title="Items" description="438 words and phrases." />
              <DemoBlock title="Coverage" description="Themes 1-5 in progress." />
            </div>
          </Surface>
        </PageContainer>
      </UiLabSection>

      <UiLabSection
        id="shells"
        title="Real page-shell directions"
        description="The layout system should answer how admin, student, and lesson pages are composed — not just how wide a container is."
      >
        <div className="space-y-4">
          <DemoAdminShell />
          <DemoStudentShell />
          <DemoLessonShell />
        </div>
      </UiLabSection>

      <UiLabSection
        id="grids"
        title="Grid patterns"
        description="These are the most reusable grid structures worth standardising across the product."
      >
        <DemoGridPatterns />
      </UiLabSection>

      <UiLabSection
        id="density"
        title="Density and hierarchy"
        description="The same design system can serve different page moods by changing density, emphasis, and pacing."
      >
        <DemoDensityComparison />
      </UiLabSection>

      <UiLabSection
        title="Page stacking rhythm"
        description="Section order matters as much as spacing — especially when pages mix summaries, actions, and detailed work."
      >
        <DemoStackingRhythm />
      </UiLabSection>

      <UiLabSection
        id="responsive"
        title="Responsive rules"
        description="Use these rules before creating page-specific exceptions."
      >
        <DemoResponsiveRules />
      </UiLabSection>

      <UiLabSection
        title="Readiness"
        description="The layout language is now strong enough to guide real implementation across the platform."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatusSummaryCard
            title="Stable now"
            description="Shell structure, summary rows, main + sidebar composition, and reading-focused lesson layouts."
            badgeTone="success"
            badgeLabel="Ready"
          />

          <StatusSummaryCard
            title="Refine carefully"
            description="Builder workspace density, very compact admin tools, and a few smaller breakpoint decisions."
            badgeTone="warning"
            badgeLabel="Refine"
          />

          <StatusSummaryCard
            title="Future add-ons"
            description="Drawer patterns, overlay inspectors, and a wider mobile layout comparison set."
            badgeTone="muted"
            badgeLabel="Later"
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Empty-shell fallback"
        description="Even when a page has no content yet, the layout should still feel intentional."
      >
        <EmptyState
          icon="layout"
          iconTone="brand"
          title="No page sections configured yet"
          description="Start with a page header, add one summary layer only if it helps, then build the primary content area before adding extra supporting rails."
          action={
            <Button variant="secondary" icon="create">
              Add first section
            </Button>
          }
        />
      </UiLabSection>

      <UiLabFutureSection
        items={[
          "AppShell preview harness for admin, platform, and public layouts.",
          "ResponsivePreviewFrame for desktop, tablet, and mobile comparisons.",
          "TwoPaneLayout for editors, inspectors, and review workflows.",
          "StickyActionBar for long forms and builder screens.",
          "MobileDrawerLayout for compact navigation and inspectors.",
          "PageSectionStack helper for consistent vertical rhythm.",
        ]}
      />
    </UiLabShell>
  );
}

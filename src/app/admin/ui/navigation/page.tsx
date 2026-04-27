import { requireAdminAccess } from "@/lib/auth/admin-auth";
import type { AppIconKey } from "@/lib/shared/icons";
import { uiLabPages } from "@/lib/ui/ui-lab";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import AppLogo from "@/components/ui/app-logo";
import AppIcon from "@/components/ui/app-icon";
import BackNav from "@/components/ui/back-nav";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import PanelCard from "@/components/ui/panel-card";
import SectionHeader from "@/components/ui/section-header";
import ThemeToggle from "@/components/ui/theme-toggle";

const pageNavItems = [
  { id: "platform-header", label: "Header" },
  { id: "sidebars", label: "Sidebars" },
  { id: "secondary-nav", label: "Secondary" },
  { id: "utility-controls", label: "Utility controls" },
  { id: "rules", label: "Rules" },
  { id: "future-components", label: "Future" },
];

type PrimaryNavItem = {
  label: string;
  icon?: AppIconKey;
  active?: boolean;
  locked?: boolean;
  badge?: React.ReactNode;
};

type NavGroup = {
  title: string;
  items: PrimaryNavItem[];
};

function DemoHeaderLink({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <span
      className={[
        "rounded-full px-3 py-2 text-sm font-medium transition",
        active
          ? "app-selected-surface"
          : "text-[var(--text-secondary)] hover:bg-[var(--background-muted)] hover:text-[var(--text-primary)]",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function DemoSidebarItem({
  item,
  compact = false,
}: {
  item: PrimaryNavItem;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center gap-3 rounded-2xl border transition",
        compact ? "px-3 py-2.5" : "px-3.5 py-3",
        item.active
          ? "app-selected-surface"
          : item.locked
            ? "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-secondary)] opacity-80"
            : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)]",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          item.active
            ? "[background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]"
            : "bg-[var(--background-muted)] text-[var(--text-secondary)]",
        ].join(" ")}
      >
        <AppIcon icon={item.icon ?? "file"} size={18} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{item.label}</div>
      </div>

      {item.badge ? <div className="shrink-0">{item.badge}</div> : null}
      {item.locked ? <AppIcon icon="locked" size={16} className="shrink-0" /> : null}
    </div>
  );
}

function DemoNavGroup({
  title,
  items,
  compact = false,
}: NavGroup & { compact?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="px-1 text-xs font-semibold uppercase tracking-[0.08em] app-text-soft">
        {title}
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <DemoSidebarItem key={item.label} item={item} compact={compact} />
        ))}
      </div>
    </div>
  );
}

function DemoPlatformHeader() {
  const primaryItems: { label: string; active?: boolean }[] = [
    { label: "Home" },
    { label: "Dashboard", active: true },
    { label: "Courses" },
    { label: "Past Papers" },
    { label: "Account" },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[var(--border)] bg-[var(--background)]/92 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <AppLogo size="sm" className="shrink-0" />

            <nav className="hidden items-center gap-1 md:flex">
              {primaryItems.map((item) => (
                <DemoHeaderLink
                  key={item.label}
                  label={item.label}
                  active={item.active}
                />
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Button
              type="button"
              variant="quiet"
              size="sm"
              icon="moon"
              iconOnly
              ariaLabel="Toggle theme"
            />
            <Badge tone="muted" icon="user">
              parent@example.com
            </Badge>
            <Button variant="secondary" size="sm" icon="userX">
              Log out
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button
              type="button"
              variant="quiet"
              size="sm"
              icon="moon"
              iconOnly
              ariaLabel="Toggle theme"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon="menu"
              iconOnly
              ariaLabel="Open navigation"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-3 text-sm app-text-muted sm:px-6">
        Shared top-navigation direction for public and student-facing pages: active state,
        account utility actions, and compact mobile controls.
      </div>
    </Card>
  );
}

function DemoAdminSidebar() {
  const designLinks: PrimaryNavItem[] = uiLabPages.map((item) => ({
    label: item.label,
    icon: item.href === "/admin/ui" ? "uiLab" : "file",
    active: item.href === "/admin/ui/navigation",
    badge:
      item.href === "/admin/ui/navigation" ? (
        <Badge tone="info">Open</Badge>
      ) : item.status === "complete" ? (
        <Badge tone="success">Ready</Badge>
      ) : undefined,
  }));

  const contentGroups: NavGroup[] = [
    {
      title: "Core",
      items: [
        { label: "Dashboard", icon: "dashboard" },
        { label: "Content", icon: "courses", active: true },
        { label: "Question Sets", icon: "help" },
        { label: "Vocabulary", icon: "translation" },
      ],
    },
    {
      title: "People",
      items: [
        { label: "Students", icon: "user" },
        { label: "Teachers", icon: "user" },
        { label: "Teaching Groups", icon: "school" },
      ],
    },
  ];

  return (
    <PanelCard
      title="Admin sidebar"
      description="Dense, grouped, and hierarchy-aware navigation for CMS workflows."
      contentClassName="space-y-6"
    >
      <DemoNavGroup title="Design / UI Lab" items={designLinks} compact />

      {contentGroups.map((group) => (
        <DemoNavGroup key={group.title} title={group.title} items={group.items} compact />
      ))}

      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] p-4">
        <div className="mb-1 text-sm font-medium text-[var(--text-primary)]">
          Utility area
        </div>
        <p className="text-sm app-text-muted">
          Settings, profile, billing, and logout should sit visually below the main work
          navigation.
        </p>
      </div>
    </PanelCard>
  );
}

function DemoStudentNavigation() {
  const studentGroups: NavGroup[] = [
    {
      title: "Foundation / self-study",
      items: [
        { label: "Dashboard", icon: "dashboard", active: true },
        { label: "Course overview", icon: "courses" },
        { label: "Current lesson", icon: "lessons" },
        {
          label: "Higher-only grammar clinic",
          icon: "translation",
          locked: true,
          badge: <Badge tone="warning">Upgrade</Badge>,
        },
      ],
    },
    {
      title: "Volna / teacher-linked",
      items: [
        { label: "Assignments", icon: "file", active: true },
        { label: "Course lessons", icon: "lessons" },
        { label: "Teacher feedback", icon: "info" },
        {
          label: "Online classes",
          icon: "school",
          badge: <Badge tone="muted">Shown only for non-Volna users</Badge>,
        },
      ],
    },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {studentGroups.map((group) => (
        <PanelCard
          key={group.title}
          title={group.title}
          description="Access-aware sidebar direction with locked, visible, and utility states."
          contentClassName="space-y-4"
        >
          <DemoNavGroup title="Primary navigation" items={group.items} compact />
        </PanelCard>
      ))}
    </div>
  );
}

function DemoTeacherNavigation() {
  const groups: NavGroup[] = [
    {
      title: "Teaching flow",
      items: [
        { label: "Assignments", icon: "file", active: true },
        {
          label: "Submissions to review",
          icon: "pending",
          badge: <Badge tone="warning">12</Badge>,
        },
        { label: "Teaching groups", icon: "school" },
      ],
    },
    {
      title: "Reference",
      items: [
        { label: "Course materials", icon: "courses" },
        { label: "Lesson plans", icon: "lessons" },
        { label: "Student progress", icon: "completed" },
      ],
    },
  ];

  return (
    <PanelCard
      title="Teacher / Volna navigation"
      description="More task-oriented than the student nav, but still part of the same system."
      contentClassName="space-y-4"
    >
      {groups.map((group) => (
        <DemoNavGroup key={group.title} title={group.title} items={group.items} compact />
      ))}
    </PanelCard>
  );
}

function DemoSecondaryNavigation() {
  const tabs = [
    { label: "Overview", active: false },
    { label: "Progress", active: true },
    { label: "Assignments", active: false },
    { label: "Resources", active: false },
  ];

  const compactItems: { label: string; icon: AppIconKey; active: boolean }[] = [
    { label: "Home", icon: "home", active: false },
    { label: "Courses", icon: "courses", active: true },
    { label: "Account", icon: "user", active: false },
    { label: "More", icon: "menu", active: false },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <PanelCard
        title="Tabs / sibling navigation"
        description="Use for page families within one area, not for primary shell navigation."
        contentClassName="space-y-4"
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition",
                tab.active
                  ? "app-selected-surface"
                  : "bg-[var(--background-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-dashed border-[var(--border)] p-4 text-sm app-text-muted">
          Keep sibling tab labels short. Tabs should switch context within one page
          family, while the sidebar and header move users between major areas.
        </div>
      </PanelCard>

      <PanelCard
        title="Compact / mobile direction"
        description="Use a small, touch-friendly bar for compact navigation patterns."
        contentClassName="space-y-4"
      >
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--background-elevated)] p-3 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
          <div className="grid grid-cols-4 gap-2">
            {compactItems.map((item) => (
              <div
                key={item.label}
                className={[
                  "rounded-2xl px-3 py-3 text-center",
                  item.active
                    ? "[background:var(--accent-gradient-selected)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]"
                    : "text-[var(--text-secondary)]",
                ].join(" ")}
              >
                <div className="mb-2 flex justify-center">
                  <AppIcon icon={item.icon} size={18} />
                </div>
                <div className="text-xs font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm app-text-muted">
          Compact nav should prioritise the 3–4 most important destinations and move
          overflow actions behind a menu.
        </p>
      </PanelCard>
    </div>
  );
}

function DemoBreadcrumbs() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <Card className="p-5">
        <SectionHeader
          title="Back-nav and breadcrumb direction"
          description="Use back-nav for content drill-down flows and breadcrumb-like context for dense admin editing."
        />

        <div className="mt-4 space-y-5">
          <BackNav
            items={[
              { href: "/admin/content", label: "Back to content" },
              {
                href: "/admin/content/courses/demo-course",
                label: "Back to GCSE Russian",
              },
              {
                href: "/admin/content/courses/demo-course/variants/higher",
                label: "Back to Higher",
              },
            ]}
          />

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-[var(--text-primary)]">Admin</span>
              <AppIcon icon="next" size={14} className="text-[var(--text-muted)]" />
              <span className="font-medium text-[var(--text-primary)]">Content</span>
              <AppIcon icon="next" size={14} className="text-[var(--text-muted)]" />
              <span className="font-medium text-[var(--text-primary)]">GCSE Russian</span>
              <AppIcon icon="next" size={14} className="text-[var(--text-muted)]" />
              <span className="font-medium text-[var(--text-primary)]">Higher</span>
              <AppIcon icon="next" size={14} className="text-[var(--text-muted)]" />
              <span className="text-[var(--text-secondary)]">
                School and daily routine
              </span>
            </div>
          </div>
        </div>
      </Card>

      <PanelCard
        title="When to use what"
        description="These patterns solve different navigation problems."
        contentClassName="space-y-3"
      >
        <div className="space-y-2 text-sm app-text-muted">
          <p>
            <strong className="text-[var(--text-primary)]">Header nav</strong> → major
            destinations.
          </p>
          <p>
            <strong className="text-[var(--text-primary)]">Sidebar nav</strong> → deeper
            product structure.
          </p>
          <p>
            <strong className="text-[var(--text-primary)]">Tabs</strong> → sibling views.
          </p>
          <p>
            <strong className="text-[var(--text-primary)]">Back-nav</strong> → return to
            the parent context quickly.
          </p>
          <p>
            <strong className="text-[var(--text-primary)]">
              Breadcrumb-style context
            </strong>{" "}
            → remind users where they are inside dense hierarchies.
          </p>
        </div>
      </PanelCard>
    </div>
  );
}

function DemoNavigationRules() {
  const rules = [
    "Use one strong active state per navigation family.",
    "Show locked destinations clearly instead of hiding every unavailable area.",
    "Keep utility actions visually separated from primary work navigation.",
    "Use the same icon semantics across admin, student, and teacher areas.",
    "Compact navigation should reduce destinations, not just shrink the same dense menu.",
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {rules.map((rule) => (
        <Card key={rule} className="h-full p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl [background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
              <AppIcon icon="navigation" size={16} />
            </span>
            <p className="text-sm app-text-muted">{rule}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default async function AdminUiNavigationPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Navigation"
      description="Reference page for headers, sidebars, breadcrumb direction, tabs, and access-aware navigation patterns."
      currentPath="/admin/ui/navigation"
    >
      <UiLabPageNav items={pageNavItems} />

      <UiLabSection
        id="platform-header"
        title="Platform header"
        description="Primary shell direction for public and student-facing navigation."
      >
        <DemoPlatformHeader />
      </UiLabSection>

      <UiLabSection
        id="sidebars"
        title="Sidebar systems"
        description="Admin, student, and teacher navigation should share one visual language while reflecting different priorities."
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(300px,0.95fr)_minmax(0,1.05fr)]">
          <DemoAdminSidebar />

          <div className="space-y-4">
            <DemoStudentNavigation />
            <DemoTeacherNavigation />
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        id="secondary-nav"
        title="Back-nav, breadcrumb direction, and tabs"
        description="Use lighter secondary navigation for context and sibling movement inside one area."
      >
        <div className="space-y-4">
          <DemoBreadcrumbs />
          <DemoSecondaryNavigation />
        </div>
      </UiLabSection>

      <UiLabSection
        id="utility-controls"
        title="Utility controls"
        description="Theme, settings, profile, and logout controls should sit outside the main learning/work navigation."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <PanelCard
            title="Theme utility"
            description="Use the production ThemeToggle in app chrome, not as ordinary page content."
            contentClassName="space-y-4"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
              <ThemeToggle />
              <div>
                <div className="font-semibold text-[var(--text-primary)]">
                  Quick theme override
                </div>
                <p className="text-sm app-text-muted">
                  Keep one instance in the header or sidebar utility area.
                </p>
              </div>
            </div>
          </PanelCard>

          <PanelCard
            title="Utility placement"
            description="Settings and logout should remain visually separate from daily work routes."
            contentClassName="space-y-3"
          >
            <DemoNavGroup
              title="Utility"
              compact
              items={[
                { label: "Profile", icon: "user" },
                { label: "Settings", icon: "settings" },
                { label: "Log out", icon: "userX" },
              ]}
            />
          </PanelCard>
        </div>
      </UiLabSection>

      <UiLabSection
        id="rules"
        title="Navigation rules"
        description="System-level rules to keep admin, student, and teacher navigation coherent."
      >
        <DemoNavigationRules />
      </UiLabSection>

      <UiLabSection
        title="Fallback state"
        description="Even when a destination is empty or unavailable, navigation should keep users oriented."
      >
        <EmptyState
          icon="navigation"
          iconTone="brand"
          title="No secondary navigation configured yet"
          description="Use the shell navigation to keep orientation stable, then add local tabs or breadcrumb context only when a page family actually needs them."
          action={
            <Button variant="secondary" icon="create">
              Add local navigation
            </Button>
          }
        />
      </UiLabSection>

      <UiLabFutureSection
        items={[
          "Tabs component for sibling views inside course, user, and settings areas.",
          "Breadcrumbs component for dense admin hierarchy paths.",
          "MobileNavDrawer for compact platform and admin navigation.",
          "SidebarNavItem to replace repeated sidebar item styling.",
          "UtilityNavGroup for settings, profile, billing, and logout placement.",
          "AccessAwareNavPreview for trial, full, and Volna student states.",
        ]}
      />
    </UiLabShell>
  );
}

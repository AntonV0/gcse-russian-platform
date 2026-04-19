import { requireAdminAccess } from "@/lib/auth/admin-auth";
import type { AppIconKey } from "@/lib/shared/icons";
import { uiLabPages } from "@/lib/ui/ui-lab";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import AppIcon from "@/components/ui/app-icon";
import BackNav from "@/components/ui/back-nav";
import Badge from "@/components/ui/badge";

type SidebarTopLink = {
  label: string;
  icon: AppIconKey;
  active: boolean;
};

type SidebarSectionLink = {
  label: string;
  icon: AppIconKey;
};

type SidebarSectionGroup = {
  title: string;
  links: SidebarSectionLink[];
};

function DemoSiteHeader() {
  const navItems = [
    { href: "#", label: "Home", active: true },
    { href: "#", label: "Dashboard", active: false },
    { href: "#", label: "Courses", active: false },
    { href: "#", label: "Account", active: false },
  ];

  return (
    <div className="app-card overflow-hidden">
      <div className="border-b border-[var(--border)] bg-[var(--background)]/88 px-4 py-3 shadow-[0_2px_8px_rgba(16,32,51,0.04)] backdrop-blur sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="app-brand-lockup shrink-0">
            <span className="app-brand-mark ring-1 ring-[var(--border)]">
              <AppIcon icon="school" size={18} className="app-brand-text" />
            </span>

            <span className="text-lg font-semibold tracking-tight app-brand-text">
              GCSE Russian
            </span>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <nav className="flex items-center gap-4 text-sm">
              {navItems.map((item) => (
                <span
                  key={item.label}
                  className={[
                    "app-nav-link",
                    item.active ? "app-nav-link-active" : "",
                  ].join(" ")}
                >
                  {item.label}
                </span>
              ))}
            </nav>

            <div className="mx-1 h-5 w-px bg-[var(--border)]" />

            <button type="button" className="app-icon-button">
              <AppIcon icon="moon" size={17} className="app-icon-button-icon" />
            </button>

            <span className="max-w-[220px] truncate text-sm text-[color:var(--text-muted)]/85">
              parent@example.com
            </span>

            <div className="app-btn-base app-btn-accent rounded-lg px-3 py-2 text-sm">
              <AppIcon icon="userX" size={16} />
              Log out
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button type="button" className="app-icon-button">
              <AppIcon icon="moon" size={17} className="app-icon-button-icon" />
            </button>

            <button type="button" className="app-icon-button">
              <AppIcon icon="menu" size={18} className="app-icon-button-icon" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-[var(--border)] px-4 py-3 text-sm app-text-muted sm:px-6">
        Public / platform header pattern with active state, theme control, account
        metadata, and mobile actions.
      </div>
    </div>
  );
}

function DemoAdminSidebar() {
  const topLinks: SidebarTopLink[] = [
    { label: "Dashboard", icon: "dashboard", active: false },
  ];

  const uiLinks = uiLabPages.map((item) => ({
    label: item.label,
    active: item.href === "/admin/ui/navigation",
  }));

  const sectionGroups: SidebarSectionGroup[] = [
    {
      title: "Content",
      links: [
        { label: "Courses / Modules / Lessons", icon: "courses" },
        { label: "Lesson Templates", icon: "file" },
      ],
    },
    {
      title: "Questions",
      links: [
        { label: "Question Sets", icon: "help" },
        { label: "Templates", icon: "file" },
      ],
    },
  ];

  return (
    <div className="max-w-[320px] app-card p-4">
      <div className="mb-6 text-lg font-semibold text-[var(--text-primary)]">
        Admin Panel
      </div>

      <nav className="flex flex-col gap-1 text-sm">
        {topLinks.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-[var(--text-primary)] hover:bg-[var(--background-muted)]"
          >
            <AppIcon icon={item.icon} size={18} />
            <span>{item.label}</span>
          </div>
        ))}

        <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wide app-text-soft">
          Design
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-[var(--background-muted)] px-3 py-2 font-medium text-[var(--text-primary)]">
          <AppIcon icon="uiLab" size={18} />
          <span className="flex-1">UI Lab</span>
          <AppIcon icon="down" size={16} />
        </div>

        <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-[var(--border)] pl-3">
          {uiLinks.map((item) => (
            <div
              key={item.label}
              className={[
                "rounded-lg px-3 py-2 text-sm",
                item.active
                  ? "bg-[var(--background-muted)] font-medium text-[var(--text-primary)]"
                  : "text-[var(--text-primary)] hover:bg-[var(--background-muted)]",
              ].join(" ")}
            >
              {item.label}
            </div>
          ))}
        </div>

        {sectionGroups.map((group) => (
          <div key={group.title}>
            <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wide app-text-soft">
              {group.title}
            </div>

            {group.links.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-[var(--text-primary)] hover:bg-[var(--background-muted)]"
              >
                <AppIcon icon={item.icon} size={18} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
}

function DemoTabBar() {
  const tabs = [
    { label: "Overview", active: false },
    { label: "Progress", active: true },
    { label: "Assignments", active: false },
    { label: "Resources", active: false },
  ];

  return (
    <div className="app-card p-4">
      <div className="mb-3 font-semibold">Tab-style secondary navigation</div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={[
              "rounded-full px-4 py-2 text-sm transition",
              tab.active
                ? "bg-[var(--brand-blue-soft)] font-medium text-[var(--brand-blue)]"
                : "bg-[var(--background-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>
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
      description="Compare headers, sidebars, back-navigation, active states, and reusable navigation patterns."
      currentPath="/admin/ui/navigation"
    >
      <UiLabSection
        title="Platform header"
        description="Reference pattern for the public and student-facing top navigation."
      >
        <DemoSiteHeader />
      </UiLabSection>

      <UiLabSection
        title="Admin sidebar"
        description="Reference pattern for admin navigation, submenu grouping, and hierarchy."
      >
        <DemoAdminSidebar />
      </UiLabSection>

      <UiLabSection
        title="Back navigation"
        description="Use back-navigation patterns for content hierarchies and detail/edit pages."
      >
        <div className="app-card p-4">
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
        </div>
      </UiLabSection>

      <UiLabSection
        title="Sub-navigation patterns"
        description="Secondary navigation should stay simple, readable, and clearly state the active area."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <DemoTabBar />

          <div className="app-card p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="font-semibold">Navigation status cues</div>
              <Badge tone="info">Current pattern</Badge>
            </div>

            <div className="space-y-2 text-sm app-text-muted">
              <p>Use top-level nav for major areas only.</p>
              <p>Use submenu items for grouped internal tools like UI Lab.</p>
              <p>Use back-nav when users move down a content hierarchy.</p>
              <p>Use tab-style navigation for sibling views within one page family.</p>
            </div>
          </div>
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}

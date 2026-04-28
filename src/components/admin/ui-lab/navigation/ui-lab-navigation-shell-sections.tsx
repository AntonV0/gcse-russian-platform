import type {
  UiLabNavGroup,
  UiLabPrimaryNavItem,
} from "@/components/admin/ui-lab/navigation/ui-lab-navigation-primitives";

import { uiLabPages } from "@/lib/ui/ui-lab";
import UiLabSection from "@/components/admin/ui-lab/shell/ui-lab-section";
import {
  UiLabDemoHeaderLink,
  UiLabDemoNavGroup,
} from "@/components/admin/ui-lab/navigation/ui-lab-navigation-primitives";
import AppLogo from "@/components/ui/app-logo";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import PanelCard from "@/components/ui/panel-card";

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
                <UiLabDemoHeaderLink
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
  const designLinks: UiLabPrimaryNavItem[] = uiLabPages.map((item) => ({
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

  const contentGroups: UiLabNavGroup[] = [
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
      <UiLabDemoNavGroup title="Design / UI Lab" items={designLinks} compact />

      {contentGroups.map((group) => (
        <UiLabDemoNavGroup
          key={group.title}
          title={group.title}
          items={group.items}
          compact
        />
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
  const studentGroups: UiLabNavGroup[] = [
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
          <UiLabDemoNavGroup title="Primary navigation" items={group.items} compact />
        </PanelCard>
      ))}
    </div>
  );
}

function DemoTeacherNavigation() {
  const groups: UiLabNavGroup[] = [
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
        <UiLabDemoNavGroup
          key={group.title}
          title={group.title}
          items={group.items}
          compact
        />
      ))}
    </PanelCard>
  );
}

export function UiLabNavigationShellSections() {
  return (
    <>
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
    </>
  );
}

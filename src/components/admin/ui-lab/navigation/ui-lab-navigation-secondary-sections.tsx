import type { AppIconKey } from "@/lib/shared/icons";

import {
  NAVIGATION_FUTURE_ITEMS,
  NAVIGATION_RULES,
} from "@/components/admin/ui-lab/navigation/ui-lab-navigation-data";
import { UiLabDemoNavGroup } from "@/components/admin/ui-lab/navigation/ui-lab-navigation-primitives";
import UiLabFutureSection from "@/components/admin/ui-lab/shell/ui-lab-future-section";
import UiLabSection from "@/components/admin/ui-lab/shell/ui-lab-section";
import AppIcon from "@/components/ui/app-icon";
import BackNav from "@/components/ui/back-nav";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import PanelCard from "@/components/ui/panel-card";
import SectionHeader from "@/components/ui/section-header";
import ThemeToggle from "@/components/ui/theme-toggle";

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
          Compact nav should prioritise the 3-4 most important destinations and move
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
            <strong className="text-[var(--text-primary)]">Header nav</strong> - major
            destinations.
          </p>
          <p>
            <strong className="text-[var(--text-primary)]">Sidebar nav</strong> - deeper
            product structure.
          </p>
          <p>
            <strong className="text-[var(--text-primary)]">Tabs</strong> - sibling views.
          </p>
          <p>
            <strong className="text-[var(--text-primary)]">Back-nav</strong> - return to
            the parent context quickly.
          </p>
          <p>
            <strong className="text-[var(--text-primary)]">
              Breadcrumb-style context
            </strong>{" "}
            - remind users where they are inside dense hierarchies.
          </p>
        </div>
      </PanelCard>
    </div>
  );
}

function DemoUtilityControls() {
  return (
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
        <UiLabDemoNavGroup
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
  );
}

function DemoNavigationRules() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {NAVIGATION_RULES.map((rule) => (
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

export function UiLabNavigationSecondarySections() {
  return (
    <>
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
        <DemoUtilityControls />
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

      <UiLabFutureSection items={NAVIGATION_FUTURE_ITEMS} />
    </>
  );
}

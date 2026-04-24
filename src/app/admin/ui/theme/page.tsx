import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import ThemeModeSelector from "@/components/settings/theme-mode-selector";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PanelCard from "@/components/ui/panel-card";
import Surface from "@/components/ui/surface";
import ThemeToggle from "@/components/ui/theme-toggle";

const pageNavItems = [
  { id: "theme-controls", label: "Controls" },
  { id: "token-checks", label: "Token checks" },
  { id: "dark-surfaces", label: "Dark surfaces" },
  { id: "guidance", label: "Guidance" },
  { id: "future-components", label: "Future" },
];

const tokenSamples = [
  ["Background", "var(--background)"],
  ["Elevated", "var(--background-elevated)"],
  ["Muted", "var(--background-muted)"],
  ["Primary text", "var(--text-primary)"],
  ["Secondary text", "var(--text-secondary)"],
  ["Border", "var(--border)"],
] as const;

export default async function AdminUiThemePage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Theme"
      description="Reference for light, dark, and system appearance controls, token usage, and dark-surface compatibility checks."
      currentPath="/admin/ui/theme"
    >
      <UiLabPageNav items={pageNavItems} />

      <UiLabSection
        id="theme-controls"
        title="Theme controls"
        description="Use the quick toggle in chrome and the full selector in settings-like contexts."
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <PanelCard
            title="Header quick toggle"
            description="This is the production utility control for quick light/dark switching."
            tone="admin"
            contentClassName="space-y-4"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
              <ThemeToggle />
              <div>
                <div className="font-semibold text-[var(--text-primary)]">
                  ThemeToggle
                </div>
                <p className="text-sm app-text-muted">
                  Keep this in app chrome, not repeated inside ordinary page content.
                </p>
              </div>
            </div>
          </PanelCard>

          <PanelCard
            title="Settings selector"
            description="Use this when the user needs explicit Light, Dark, and System choices."
            tone="muted"
            contentClassName="space-y-4"
          >
            <ThemeModeSelector />
          </PanelCard>
        </div>
      </UiLabSection>

      <UiLabSection
        id="token-checks"
        title="Token checks"
        description="Components should use CSS variables rather than hardcoded theme-specific colours."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tokenSamples.map(([label, token]) => (
            <Card key={token}>
              <CardBody className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-[var(--text-primary)]">{label}</div>
                  <Badge tone="muted">Token</Badge>
                </div>
                <code className="block rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-3 py-2 text-xs text-[var(--text-secondary)]">
                  {token}
                </code>
              </CardBody>
            </Card>
          ))}
        </div>
      </UiLabSection>

      <UiLabSection
        id="dark-surfaces"
        title="Dark-surface compatibility"
        description="Strong emphasis surfaces should still preserve readable hierarchy, badge contrast, and action clarity."
      >
        <div
          data-theme="dark"
          className="rounded-[1.75rem] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(135deg,#0b1a30_0%,#142742_100%)] p-5 shadow-[0_16px_34px_rgba(16,32,51,0.24)]"
        >
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge tone="info" icon="moon">
              Dark check
            </Badge>
            <Badge tone="success" icon="completed">
              Token based
            </Badge>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Surface variant="default" padding="md">
              <div className="font-semibold text-[var(--text-primary)]">
                Default surface
              </div>
              <p className="mt-2 text-sm app-text-muted">
                Should remain readable inside a stronger dark frame.
              </p>
            </Surface>

            <Surface variant="muted" padding="md">
              <div className="font-semibold text-[var(--text-primary)]">
                Muted surface
              </div>
              <p className="mt-2 text-sm app-text-muted">
                Useful for secondary support content and nested grouping.
              </p>
            </Surface>

            <Surface variant="brand" padding="md">
              <div className="font-semibold text-[var(--text-primary)]">
                Brand surface
              </div>
              <p className="mt-2 text-sm app-text-muted">
                Use sparingly so premium moments keep their emphasis.
              </p>
            </Surface>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="primary" icon="next">
              Continue lesson
            </Button>
            <Button variant="secondary" icon="settings">
              Settings
            </Button>
            <Button variant="quiet" icon="preview">
              Preview
            </Button>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        id="guidance"
        title="Theme guidance"
        description="Rules for keeping new components compatible with the global theme system."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <FeedbackBanner
            tone="info"
            title="Use data-theme and variables"
            description="Theme mode is applied through the html data-theme attribute and consumed through CSS variables."
          />
          <FeedbackBanner
            tone="warning"
            title="Avoid hardcoded page colours"
            description="Hardcoded one-off colours make dark mode and future accent themes harder to maintain."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Quick toggle", "Use ThemeToggle once in the main app chrome."],
            ["Full selector", "Use ThemeModeSelector in settings or profile areas."],
            ["Dark checks", "Validate tables, forms, badges, and buttons on dark surfaces."],
            ["Future themes", "Keep token discipline so accent themes remain possible."],
          ].map(([title, description]) => (
            <Card key={title}>
              <CardBody className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <AppIcon icon="palette" size={16} className="app-brand-text" />
                  <div className="font-semibold text-[var(--text-primary)]">{title}</div>
                </div>
                <p className="text-sm app-text-muted">{description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </UiLabSection>

      <UiLabFutureSection
        items={[
          "ThemePreviewGrid for side-by-side light, dark, and system examples.",
          "TokenInspector to document semantic variables and intended usage.",
          "AccentThemePreview for future blue, green, or school-specific palettes.",
          "ContrastCheckPanel for badges, buttons, forms, and tables.",
          "ThemeAwareMedia guidance for images and illustration assets.",
          "ReducedMotionPreview for motion-sensitive interaction states.",
        ]}
      />
    </UiLabShell>
  );
}

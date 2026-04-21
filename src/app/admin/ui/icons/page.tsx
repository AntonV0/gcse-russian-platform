import { requireAdminAccess } from "@/lib/auth/admin-auth";
import type { AppIconKey } from "@/lib/shared/icons";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import AllIconsBrowser from "@/components/admin/all-icons-browser";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import PanelCard from "@/components/ui/panel-card";

const curatedGroups: {
  title: string;
  description: string;
  icons: AppIconKey[];
}[] = [
  {
    title: "Navigation",
    description:
      "Use these for primary navigation, shell controls, and directional movement.",
    icons: ["dashboard", "courses", "back", "next", "menu", "settings"],
  },
  {
    title: "Learning",
    description:
      "Use these for lessons, content types, study actions, and learner-facing flows.",
    icons: ["lessons", "audio", "translation", "question", "completed"],
  },
  {
    title: "Status",
    description:
      "Use these consistently for progress, warnings, locked states, and guidance.",
    icons: ["completed", "pending", "warning", "info", "locked"],
  },
];

function DemoSizeRules() {
  const sizes = [16, 18, 20, 24, 28];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {sizes.map((size) => (
        <Card key={size} className="p-4 text-center">
          <div className="mb-3 flex justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--brand-blue)]">
              <AppIcon icon="navigation" size={size} />
            </span>
          </div>
          <div className="font-semibold text-[var(--text-primary)]">{size}px</div>
          <p className="mt-2 text-sm app-text-muted">
            {size <= 16
              ? "Compact metadata or dense rows"
              : size <= 20
                ? "Default UI controls and nav items"
                : "Feature emphasis or larger callouts"}
          </p>
        </Card>
      ))}
    </div>
  );
}

function DemoIconWithLabelPatterns() {
  const rows: {
    label: string;
    icon: AppIconKey;
    badge: React.ReactNode;
  }[] = [
    {
      label: "Dashboard",
      icon: "dashboard",
      badge: <Badge tone="info">Active</Badge>,
    },
    {
      label: "Assignments",
      icon: "file",
      badge: <Badge tone="warning">12</Badge>,
    },
    {
      label: "Locked lesson",
      icon: "locked",
      badge: <Badge tone="warning">Upgrade</Badge>,
    },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <PanelCard
        title="Icon + label rows"
        description="The most important icon pattern in the product."
        contentClassName="space-y-3"
      >
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--brand-blue)]">
              <AppIcon icon={row.icon} size={18} />
            </span>
            <span className="min-w-0 flex-1 truncate font-medium text-[var(--text-primary)]">
              {row.label}
            </span>
            <span className="shrink-0">{row.badge}</span>
          </div>
        ))}
      </PanelCard>

      <PanelCard
        title="Buttons and badges"
        description="Icons should stay semantically tied to the label, not just decorative."
        contentClassName="space-y-4"
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" icon="create">
            Create lesson
          </Button>
          <Button variant="secondary" icon="preview">
            Preview course
          </Button>
          <Button variant="quiet" icon="filter">
            Filter
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge tone="success" icon="completed">
            Published
          </Badge>
          <Badge tone="warning" icon="pending">
            Needs review
          </Badge>
          <Badge tone="muted" icon="info">
            Teacher note
          </Badge>
        </div>
      </PanelCard>
    </div>
  );
}

function DemoIconOnlyControls() {
  const controls: {
    label: string;
    icon: AppIconKey;
    variant: "quiet" | "secondary" | "soft";
  }[] = [
    { label: "Theme", icon: "moon", variant: "quiet" },
    { label: "Settings", icon: "settings", variant: "secondary" },
    { label: "Open menu", icon: "menu", variant: "secondary" },
    { label: "Preview", icon: "preview", variant: "soft" },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <PanelCard
        title="Icon-only controls"
        description="Use only when the action is already strongly familiar or accompanied by nearby context."
        contentClassName="space-y-4"
      >
        <div className="flex flex-wrap gap-3">
          {controls.map((control) => (
            <Button
              key={control.label}
              type="button"
              variant={control.variant}
              icon={control.icon}
              iconOnly
              ariaLabel={control.label}
            />
          ))}
        </div>

        <p className="text-sm app-text-muted">
          Icon-only controls must always include an accessible label and should be
          reserved for familiar utility actions, not primary decisions.
        </p>
      </PanelCard>

      <PanelCard
        title="Status icon semantics"
        description="Use the same meanings consistently across dashboards, rows, and banners."
        contentClassName="space-y-3"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2 text-[var(--success)]">
              <AppIcon icon="completed" size={18} />
              <span className="font-semibold text-[var(--text-primary)]">Completed</span>
            </div>
            <p className="text-sm app-text-muted">
              Use for finished work, reviewed items, or stable states.
            </p>
          </Card>

          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2 text-[var(--warning)]">
              <AppIcon icon="pending" size={18} />
              <span className="font-semibold text-[var(--text-primary)]">Pending</span>
            </div>
            <p className="text-sm app-text-muted">
              Use for work in progress, review queues, or waiting states.
            </p>
          </Card>

          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2 text-[var(--info)]">
              <AppIcon icon="info" size={18} />
              <span className="font-semibold text-[var(--text-primary)]">Info</span>
            </div>
            <p className="text-sm app-text-muted">
              Use for context, guidance, and secondary callouts.
            </p>
          </Card>

          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2 text-[var(--warning)]">
              <AppIcon icon="locked" size={18} />
              <span className="font-semibold text-[var(--text-primary)]">Locked</span>
            </div>
            <p className="text-sm app-text-muted">
              Use for restricted access and upgrade-aware states.
            </p>
          </Card>
        </div>
      </PanelCard>
    </div>
  );
}

function DemoSemanticGroups() {
  return (
    <div className="space-y-6">
      {curatedGroups.map((group) => (
        <div key={group.title}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">{group.title}</h3>
              <p className="mt-1 text-sm app-text-muted">{group.description}</p>
            </div>
            <Badge tone="muted">{group.icons.length} icons</Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {group.icons.map((key) => (
              <div key={key} className="app-card p-4 text-center">
                <div className="mb-3 flex justify-center">
                  <AppIcon icon={key} size={20} className="app-brand-text" />
                </div>
                <div className="text-sm font-medium">{key}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function AdminUiIconsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Icons"
      description="Practical icon reference for sizing, semantics, controls, and consistent usage across the platform."
      currentPath="/admin/ui/icons"
    >
      <UiLabSection
        title="Sizing rules"
        description="Most UI icons should stay within a small, consistent size range."
      >
        <DemoSizeRules />
      </UiLabSection>

      <UiLabSection
        title="Icon + label patterns"
        description="The most reusable icon pattern is still the icon paired with clear text."
      >
        <DemoIconWithLabelPatterns />
      </UiLabSection>

      <UiLabSection
        title="Icon-only controls and status meaning"
        description="Icon-only controls should be limited, while status semantics should stay very consistent."
      >
        <DemoIconOnlyControls />
      </UiLabSection>

      <UiLabSection
        title="Semantic icon groups"
        description="Use the curated icon set first so product meaning stays stable."
      >
        <DemoSemanticGroups />
      </UiLabSection>

      <UiLabSection
        title="Full Lucide browser"
        description="Use this only when the curated app set does not already cover the meaning you need."
      >
        <AllIconsBrowser />
      </UiLabSection>
    </UiLabShell>
  );
}

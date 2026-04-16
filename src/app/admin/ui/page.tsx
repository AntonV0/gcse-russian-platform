import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import AppIcon from "@/components/ui/app-icon";
import { appIcons } from "@/lib/shared/icons";
import { uiLabPages } from "@/lib/ui/ui-lab";

export default async function AdminUiOverviewPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const completeCount = uiLabPages.filter((item) => item.status === "complete").length;
  const inProgressCount = uiLabPages.filter(
    (item) => item.status === "in_progress"
  ).length;
  const plannedCount = uiLabPages.filter((item) => item.status === "planned").length;

  return (
    <UiLabShell
      title="UI Lab"
      description="Internal design-system workspace for comparing styles, components, states, and unfinished areas."
      currentPath="/admin/ui"
    >
      <UiLabSection
        title="Progress snapshot"
        description="A quick view of how complete the current UI system is."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon={appIcons.completed} size={18} className="app-brand-text" />
              <div className="font-semibold">Complete</div>
            </div>
            <div className="text-2xl font-bold">{completeCount}</div>
            <p className="mt-1 text-sm app-text-muted">Pages mostly ready for reuse</p>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon={appIcons.pending} size={18} className="app-brand-text" />
              <div className="font-semibold">In progress</div>
            </div>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="mt-1 text-sm app-text-muted">
              Sections being refined as the platform grows
            </p>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon={appIcons.help} size={18} className="app-brand-text" />
              <div className="font-semibold">Planned</div>
            </div>
            <div className="text-2xl font-bold">{plannedCount}</div>
            <p className="mt-1 text-sm app-text-muted">
              Areas to flesh out after core screens stabilise
            </p>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Current style direction"
        description="Use this as the baseline when comparing future screens against the design system."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="app-card p-4">
            <div className="mb-2 font-semibold">Visual style</div>
            <div className="space-y-1 text-sm app-text-muted">
              <p>Premium, modern, lightly branded</p>
              <p>Soft surfaces and subtle shadows</p>
              <p>Blue-led palette with restrained accents</p>
            </div>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 font-semibold">Audience fit</div>
            <div className="space-y-1 text-sm app-text-muted">
              <p>Readable for students aged 12–16</p>
              <p>Trustworthy for parents</p>
              <p>Clear enough for admin and teacher workflows</p>
            </div>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 font-semibold">Rules to keep</div>
            <div className="space-y-1 text-sm app-text-muted">
              <p>Use shared components first</p>
              <p>Refine content and hierarchy before over-styling</p>
              <p>Prefer consistency over one-off visual tricks</p>
            </div>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Design tokens at a glance"
        description="A compact preview of the main design ingredients used throughout the app."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="app-card p-4">
            <div className="mb-3 font-semibold">Colour cues</div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="info">Primary blue</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="warning">In progress</Badge>
              <Badge tone="danger">Destructive</Badge>
              <Badge tone="muted">Neutral surfaces</Badge>
            </div>
          </div>

          <div className="app-card p-4">
            <div className="mb-3 font-semibold">Core patterns</div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="muted">Cards</Badge>
              <Badge tone="muted">Buttons</Badge>
              <Badge tone="muted">Badges</Badge>
              <Badge tone="muted">Icons</Badge>
              <Badge tone="muted">Typography</Badge>
            </div>
          </div>
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}

import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import Button from "@/components/ui/button";

export default async function AdminUiButtonsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Buttons"
      description="Reference for button variants, icon patterns, interaction states, and shared component inspection in development."
      currentPath="/admin/ui/buttons"
    >
      <UiLabSection
        title="Dev marker behaviour"
        description="In development, shared buttons now show a subtle corner marker. Click it to inspect the reusable component name and source path without covering the button itself."
      >
        <div className="app-card app-section-padding flex flex-col gap-4 border border-dashed border-[var(--border-strong)] bg-[var(--background-muted)]">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Shared component inspection
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              This page is the first safe reference area for validating the new marker
              system on compact controls before expanding it across the shared UI layer.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Inspect primary button</Button>
            <Button variant="secondary" icon="settings">
              Inspect secondary button
            </Button>
            <Button
              variant="quiet"
              icon="search"
              iconOnly
              ariaLabel="Inspect icon button"
            />
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Primary actions"
        description="Use primary buttons sparingly for the main action in a section or page."
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="primary" icon="dashboard">
            With icon
          </Button>
          <Button variant="primary" icon="next" iconPosition="right">
            Continue
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Secondary and subtle actions"
        description="Secondary buttons are the default choice for safe actions and navigation."
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">Secondary</Button>
          <Button variant="secondary" icon="back">
            Back
          </Button>
          <Button variant="secondary" icon="next" iconPosition="right">
            Next step
          </Button>
          <Button variant="quiet">Quiet</Button>
          <Button variant="quiet" icon="edit">
            Quiet with icon
          </Button>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Status and destructive actions"
        description="Reserve these for clearly meaningful states or destructive operations."
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="success" icon="completed">
            Success
          </Button>
          <Button variant="warning" icon="pending">
            In progress
          </Button>
          <Button variant="danger" icon="userX">
            Destructive
          </Button>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Sizes and icon-only controls"
        description="Use smaller buttons in dense admin areas, but keep tap targets usable."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="sm">
            Small primary
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon="search"
            iconOnly
            ariaLabel="Search"
          />
          <Button variant="secondary" icon="settings" iconOnly ariaLabel="Settings" />
          <Button
            variant="danger"
            size="sm"
            icon="userX"
            iconOnly
            ariaLabel="Remove user"
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Link buttons"
        description="Shared buttons also need to behave cleanly when rendered as links, including with the dev marker enabled."
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/admin/ui" variant="secondary" icon="back">
            Back to UI Lab
          </Button>
          <Button
            href="/admin/ui/components"
            variant="primary"
            icon="next"
            iconPosition="right"
          >
            Go to components
          </Button>
          <Button href="/admin/ui/navigation" variant="quiet">
            View navigation patterns
          </Button>
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}

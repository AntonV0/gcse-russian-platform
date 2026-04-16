import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import Button from "@/components/ui/button";
import { appIcons } from "@/lib/shared/icons";

export default async function AdminUiButtonsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Buttons"
      description="Reference for button variants, icon patterns, and interaction states."
      currentPath="/admin/ui/buttons"
    >
      <UiLabSection
        title="Primary actions"
        description="Use primary buttons sparingly for the main action in a section or page."
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="primary" icon={appIcons.dashboard}>
            With icon
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
          <Button variant="secondary" icon={appIcons.back}>
            Back
          </Button>
          <Button variant="quiet">Quiet</Button>
          <Button variant="quiet" icon={appIcons.edit}>
            Quiet with icon
          </Button>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Status and destructive actions"
        description="Reserve these for clearly meaningful states or destructive operations."
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="success" icon={appIcons.completed}>
            Success
          </Button>
          <Button variant="warning" icon={appIcons.pending}>
            In progress
          </Button>
          <Button variant="danger" icon={appIcons.userX}>
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
            icon={appIcons.search}
            iconOnly
            ariaLabel="Search"
          />
          <Button
            variant="secondary"
            icon={appIcons.settings}
            iconOnly
            ariaLabel="Settings"
          />
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}

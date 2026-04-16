import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";

export default async function AdminUiSurfacesPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Surfaces"
      description="Compare cards, panels, branded surfaces, and spacing behaviour."
      currentPath="/admin/ui/surfaces"
    >
      <UiLabSection
        title="Surface types"
        description="Use these examples to decide whether a section should feel neutral, elevated, or branded."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="app-surface p-5">
            <div className="font-semibold">app-surface</div>
            <p className="mt-2 text-sm app-text-muted">
              Good for generic containers with light elevation.
            </p>
          </div>

          <div className="app-card p-5">
            <div className="font-semibold">app-card</div>
            <p className="mt-2 text-sm app-text-muted">
              Best for modular cards and repeated content blocks.
            </p>
          </div>

          <div className="app-surface-brand p-5">
            <div className="font-semibold">app-surface-brand</div>
            <p className="mt-2 text-sm app-text-muted">
              Useful for hero areas and key branded moments.
            </p>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Spacing rhythm"
        description="Keep section spacing predictable so screens feel consistent."
      >
        <div className="space-y-4">
          <div className="app-card p-4">Compact card padding</div>
          <div className="app-card app-section-padding">Standard section padding</div>
          <div className="app-card app-section-padding-lg">Large hero-style padding</div>
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}

import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { LAYOUT_PAGE_NAV_ITEMS } from "@/components/admin/ui-lab-layout-data";
import { UiLabLayoutBoundarySections } from "@/components/admin/ui-lab-layout-boundary-sections";
import { UiLabLayoutGridResponsiveSections } from "@/components/admin/ui-lab-layout-grid-responsive-sections";
import { UiLabLayoutShellSections } from "@/components/admin/ui-lab-layout-shell-sections";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";

export default async function AdminUiLayoutPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Layout"
      description="Reference page for shells, grids, density decisions, and responsive page composition."
      currentPath="/admin/ui/layout"
    >
      <UiLabPageNav items={LAYOUT_PAGE_NAV_ITEMS} />
      <UiLabLayoutBoundarySections />
      <UiLabLayoutShellSections />
      <UiLabLayoutGridResponsiveSections />
    </UiLabShell>
  );
}

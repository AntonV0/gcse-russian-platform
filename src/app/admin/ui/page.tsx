import UiLabOverviewPanels from "@/components/admin/ui-lab-overview-panels";
import { UI_LAB_OVERVIEW_NAV_ITEMS } from "@/components/admin/ui-lab-overview-data";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";
import { requireAdminAccess } from "@/lib/auth/admin-auth";

export default async function AdminUiOverviewPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab"
      description="Internal design-system workspace for comparing styles, tracking completeness, and standardising reusable UI across the platform."
      currentPath="/admin/ui"
    >
      <UiLabPageNav items={UI_LAB_OVERVIEW_NAV_ITEMS} />
      <UiLabOverviewPanels />
    </UiLabShell>
  );
}

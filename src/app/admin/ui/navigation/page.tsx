import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { NAVIGATION_PAGE_NAV_ITEMS } from "@/components/admin/ui-lab/navigation/ui-lab-navigation-data";
import { UiLabNavigationSecondarySections } from "@/components/admin/ui-lab/navigation/ui-lab-navigation-secondary-sections";
import { UiLabNavigationShellSections } from "@/components/admin/ui-lab/navigation/ui-lab-navigation-shell-sections";
import UiLabPageNav from "@/components/admin/ui-lab/shell/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab/shell/ui-lab-shell";

export default async function AdminUiNavigationPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Navigation"
      description="Reference page for headers, sidebars, breadcrumb direction, tabs, and access-aware navigation patterns."
      currentPath="/admin/ui/navigation"
    >
      <UiLabPageNav items={NAVIGATION_PAGE_NAV_ITEMS} />
      <UiLabNavigationShellSections />
      <UiLabNavigationSecondarySections />
    </UiLabShell>
  );
}

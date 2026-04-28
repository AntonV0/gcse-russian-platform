import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { TABLES_PAGE_NAV_ITEMS } from "@/components/admin/ui-lab/tables/ui-lab-tables-data";
import { UiLabTablesEmptyGuidanceSections } from "@/components/admin/ui-lab/tables/ui-lab-tables-empty-guidance-sections";
import { UiLabTablesRowHierarchySections } from "@/components/admin/ui-lab/tables/ui-lab-tables-row-hierarchy-sections";
import { UiLabTablesStandardSections } from "@/components/admin/ui-lab/tables/ui-lab-tables-standard-sections";
import UiLabPageNav from "@/components/admin/ui-lab/shell/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab/shell/ui-lab-shell";

export default async function AdminUiTablesPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Tables"
      description="Compare table structures, row actions, toolbars, statuses, and empty-state patterns before applying them to real admin pages."
      currentPath="/admin/ui/tables"
    >
      <UiLabPageNav items={TABLES_PAGE_NAV_ITEMS} />
      <UiLabTablesStandardSections />
      <UiLabTablesRowHierarchySections />
      <UiLabTablesEmptyGuidanceSections />
    </UiLabShell>
  );
}

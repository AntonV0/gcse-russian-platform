import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { ADMIN_PATTERNS_PAGE_NAV_ITEMS } from "@/components/admin/ui-lab-admin-patterns-data";
import { UiLabAdminPatternDashboardFormSections } from "@/components/admin/ui-lab-admin-pattern-dashboard-form-sections";
import { UiLabAdminPatternOperationalSections } from "@/components/admin/ui-lab-admin-pattern-operational-sections";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";

export default async function AdminUiAdminPatternsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Admin Patterns"
      description="Reference patterns for CMS dashboards, expandable forms, destructive actions, confirmation buttons, and admin-only workflow utilities."
      currentPath="/admin/ui/admin-patterns"
    >
      <UiLabPageNav items={ADMIN_PATTERNS_PAGE_NAV_ITEMS} />
      <UiLabAdminPatternDashboardFormSections />
      <UiLabAdminPatternOperationalSections />
    </UiLabShell>
  );
}

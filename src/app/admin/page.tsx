import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import AdminDashboardMainPanels from "@/components/admin/admin-dashboard-main-panels";
import AdminDashboardSidebar from "@/components/admin/admin-dashboard-sidebar";
import { getAdminDashboardSummary } from "@/lib/admin/dashboard-summary";
import { requireAdminAccess } from "@/lib/auth/admin-auth";

export default async function AdminPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const summary = await getAdminDashboardSummary();

  return (
    <main className="space-y-3">
      <PageIntroPanel
        tone="admin"
        eyebrow="Admin workspace"
        title="Admin Panel"
        description="Internal content, user, teaching, and system management tools for the GCSE Russian Course Platform."
        badges={
          <>
            <Badge tone="info">Admin access</Badge>
            <Badge tone="muted">Platform management</Badge>
          </>
        }
        actions={
          <>
            <Button href="/admin/ui" variant="secondary" icon="uiLab">
              Open UI Lab
            </Button>
            <Button href="/admin/content" variant="primary" icon="courses">
              Manage content
            </Button>
          </>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          <SummaryStatCard
            title="Courses"
            value={summary.courseCount}
            icon="courses"
            compact
            description="Top-level course entries."
          />
          <SummaryStatCard
            title="Teaching groups"
            value={summary.teachingGroupCount}
            icon="users"
            compact
            description="Structured teaching cohorts."
          />
          <SummaryStatCard
            title="Active students"
            value={summary.activeStudents}
            icon="completed"
            tone="success"
            compact
            description="Students with active access."
          />
        </div>
      </PageIntroPanel>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.28fr)_minmax(340px,0.72fr)] xl:items-start">
        <AdminDashboardMainPanels summary={summary} />
        <AdminDashboardSidebar summary={summary} />
      </div>
    </main>
  );
}

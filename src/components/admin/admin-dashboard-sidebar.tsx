import Button from "@/components/ui/button";
import PanelCard from "@/components/ui/panel-card";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import ContinueWhereLeftOffPanel from "@/components/admin/continue-where-left-off-panel";
import type { AdminDashboardSummary } from "@/lib/admin/dashboard-summary";

export default function AdminDashboardSidebar({
  summary,
}: {
  summary: AdminDashboardSummary;
}) {
  return (
    <div className="space-y-3">
      <ContinueWhereLeftOffPanel />

      <PanelCard
        title="Admin guidance"
        description="A simple recommended flow for common admin work."
        tone="muted"
        density="compact"
        contentClassName="space-y-3"
      >
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            Start in content
          </div>
          <div className="mt-1 text-sm app-text-muted">
            Courses, variants, modules, and lessons are the foundation of most admin
            work.
          </div>
          <div className="mt-3">
            <Button href="/admin/content" variant="soft" size="sm" icon="courses">
              Manage content
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            Then review teaching flow
          </div>
          <div className="mt-1 text-sm app-text-muted">
            Keep assignments and teaching groups aligned with the current content
            structure.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              href="/teacher/assignments"
              variant="secondary"
              size="sm"
              icon="assignments"
            >
              Assignments
            </Button>
            <Button
              href="/admin/teaching-groups"
              variant="secondary"
              size="sm"
              icon="users"
            >
              Teaching groups
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            Validate UI patterns before reuse
          </div>
          <div className="mt-1 text-sm app-text-muted">
            Use the UI Lab to test shared styling patterns before introducing new one-off
            UI.
          </div>
          <div className="mt-3">
            <Button href="/admin/ui" variant="quiet" size="sm" icon="uiLab">
              Open UI Lab
            </Button>
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="Design system shortcut"
        description="Shared premium patterns should be validated in the UI Lab before broader reuse."
        tone="student"
        density="compact"
        actions={
          <Button href="/admin/ui" variant="inverse" icon="next" iconPosition="right">
            Open UI Lab
          </Button>
        }
        contentClassName="space-y-3"
      >
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            Shared premium blocks
          </div>
          <div className="mt-1 text-sm app-text-muted">
            Page intro panels, stat cards, premium section panels, badges, buttons, forms,
            and navigation patterns.
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            Best use
          </div>
          <div className="mt-1 text-sm app-text-muted">
            Validate patterns in the UI Lab first, then reuse them in admin, student, and
            teacher pages.
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="Access state"
        description="Compact signals for account and teaching visibility."
        tone="muted"
        density="compact"
        contentClassName="space-y-3"
      >
        <SummaryStatCard
          title="Teaching groups"
          value={summary.teachingGroupCount}
          icon="users"
          compact
          layout="inline"
          description="Current teaching group structures."
        />

        <SummaryStatCard
          title="Inactive students"
          value={summary.inactiveStudents}
          icon="pending"
          tone={summary.inactiveStudents > 0 ? "warning" : "success"}
          compact
          layout="inline"
          description={
            summary.inactiveStudents > 0
              ? "Students currently without active access."
              : "All student accounts currently have active access."
          }
        />

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            Recommended next step
          </div>
          <div className="mt-1 text-sm app-text-muted">
            Review student and teaching-group pages when account structure or access state
            changes.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button href="/admin/students" variant="secondary" size="sm" icon="user">
              View students
            </Button>
            <Button
              href="/admin/teaching-groups"
              variant="secondary"
              size="sm"
              icon="users"
            >
              Teaching groups
            </Button>
          </div>
        </div>
      </PanelCard>
    </div>
  );
}

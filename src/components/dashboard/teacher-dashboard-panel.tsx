import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import OperationsWorkspace, {
  OperationsHeader,
  OperationsSection,
} from "@/components/ui/operations-workspace";
import PanelCard from "@/components/ui/panel-card";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  formatDashboardLabel,
  getDashboardAccessLabel,
  getDashboardVariantLabel,
} from "@/lib/dashboard/learning-plan";

export function TeacherDashboardPanel({
  dashboard,
  userEmail,
}: {
  dashboard: DashboardInfo;
  userEmail?: string | null;
}) {
  return (
    <OperationsWorkspace>
      <OperationsHeader
        eyebrow="Teacher workspace"
        title="Teacher dashboard"
        description="Manage assignments, review submissions, and support students through their teacher-led learning workflow."
        badges={
          <>
            <Badge tone="info" icon="teacher">
              Teacher workspace
            </Badge>
            <Badge tone="muted" icon="school">
              Volna
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/teacher/assignments" variant="secondary" icon="assignments">
              Open assignments
            </Button>

            <Button href="/teacher/assignments/new" variant="primary" icon="create">
              Create assignment
            </Button>
          </>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          <SummaryStatCard
            title="Role"
            value={formatDashboardLabel(dashboard.role)}
            icon="teacher"
            compact
            description="Teacher-led tools."
          />
          <SummaryStatCard
            title="Variant"
            value={getDashboardVariantLabel(dashboard.variant)}
            icon="layers"
            compact
            description="Current course context."
          />
          <SummaryStatCard
            title="Access"
            value={getDashboardAccessLabel(dashboard.accessMode)}
            icon="unlocked"
            compact
            description="Account permissions."
          />
        </div>
      </OperationsHeader>

      <OperationsSection>
        <div className="grid gap-4 xl:grid-cols-2">
          <PanelCard
            title="Assignments"
            description="View, create, and manage teacher assignments for your student groups."
            tone="admin"
            density="compact"
          >
            <div className="space-y-3">
              <p className="app-text-body-muted">
                Keep assignment setup, student submissions, and review work in one
                teacher workspace.
              </p>

              <Button
                href="/teacher/assignments"
                variant="secondary"
                size="sm"
                icon="assignments"
              >
                Open teacher assignments
              </Button>
            </div>
          </PanelCard>

          <PanelCard
            title="Account"
            description="Current signed-in teacher identity."
            tone="muted"
            density="compact"
          >
            <div className="grid gap-3 text-sm leading-6 text-[var(--text-secondary)]">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-3 py-2">
                <span className="font-medium text-[var(--text-primary)]">Email:</span>{" "}
                {userEmail ?? "Not logged in"}
              </div>

              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-3 py-2">
                <span className="font-medium text-[var(--text-primary)]">Role:</span>{" "}
                {formatDashboardLabel(dashboard.role)}
              </div>
            </div>
          </PanelCard>
        </div>
      </OperationsSection>
    </OperationsWorkspace>
  );
}

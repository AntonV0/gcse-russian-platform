import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
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
    <>
      <section className="app-surface-brand app-section-padding-lg">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="info" icon="teacher">
              Teacher workspace
            </Badge>
            <Badge tone="muted" icon="school">
              Volna
            </Badge>
          </div>

          <div className="space-y-2">
            <h2 className="app-heading-hero max-w-3xl">Teacher dashboard</h2>
            <p className="app-subtitle max-w-2xl">
              Manage assignments, review submissions, and support students through
              their teacher-led learning workflow.
            </p>
          </div>

          <div className="app-mobile-action-stack flex flex-wrap gap-3">
            <Button href="/teacher/assignments" variant="primary" icon="assignments">
              Open assignments
            </Button>

            <Button href="/teacher/assignments/new" variant="secondary" icon="create">
              Create assignment
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardCard title="Role">{formatDashboardLabel(dashboard.role)}</DashboardCard>

        <DashboardCard title="Variant">
          {getDashboardVariantLabel(dashboard.variant)}
        </DashboardCard>

        <DashboardCard title="Access">
          {getDashboardAccessLabel(dashboard.accessMode)}
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DashboardCard title="Assignments">
          <div className="space-y-3">
            <p>View, create, and manage teacher assignments for your student groups.</p>

            <Link
              href="/teacher/assignments"
              className="inline-flex items-center gap-2 font-medium app-brand-text"
            >
              Open teacher assignments
              <AppIcon icon="next" size={14} />
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard title="Account">
          <div className="space-y-2">
            <div>
              <span className="font-medium text-[var(--text-primary)]">Email:</span>{" "}
              {userEmail ?? "Not logged in"}
            </div>

            <div>
              <span className="font-medium text-[var(--text-primary)]">Role:</span>{" "}
              {formatDashboardLabel(dashboard.role)}
            </div>
          </div>
        </DashboardCard>
      </section>
    </>
  );
}

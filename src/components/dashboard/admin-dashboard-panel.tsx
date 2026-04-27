import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  formatDashboardLabel,
  getDashboardAccessLabel,
  getDashboardVariantLabel,
} from "@/lib/dashboard/learning-plan";

export function AdminDashboardPanel({ dashboard }: { dashboard: DashboardInfo }) {
  return (
    <>
      <section className="app-surface-brand app-section-padding-lg">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="info" icon="admin">
              Admin workspace
            </Badge>
          </div>

          <div className="space-y-2">
            <h2 className="app-heading-hero max-w-3xl">Admin control center</h2>
            <p className="app-subtitle max-w-2xl">
              Open content, question, template, user, and lesson-builder tools from one
              place.
            </p>
          </div>

          <div className="app-mobile-action-stack flex flex-wrap gap-3">
            <Button href="/admin" variant="primary" icon="dashboard">
              Open admin
            </Button>

            <Button href="/admin/content" variant="secondary" icon="courses">
              Content
            </Button>

            <Button href="/admin/question-sets" variant="secondary" icon="question">
              Question sets
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
    </>
  );
}

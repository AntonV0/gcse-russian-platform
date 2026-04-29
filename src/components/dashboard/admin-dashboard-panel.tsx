import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import type { AppIconKey } from "@/lib/shared/icons";
import {
  formatDashboardLabel,
  getDashboardAccessLabel,
  getDashboardVariantLabel,
} from "@/lib/dashboard/learning-plan";

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

const adminWorkspaceLinks: {
  href: string;
  title: string;
  description: string;
  icon: AppIconKey;
}[] = [
  {
    href: "/admin/content",
    title: "Content structure",
    description: "Courses, variants, modules, and lessons",
    icon: "courses",
  },
  {
    href: "/admin/vocabulary",
    title: "Vocabulary",
    description: "Sets, items, metadata, and coverage",
    icon: "vocabulary",
  },
  {
    href: "/admin/grammar",
    title: "Grammar",
    description: "Sets, points, examples, and tables",
    icon: "grammar",
  },
  {
    href: "/admin/question-sets",
    title: "Question sets",
    description: "Practice banks, templates, and ordering",
    icon: "questionSet",
  },
  {
    href: "/admin/past-papers",
    title: "Past papers",
    description: "Resources, papers, and publication state",
    icon: "pastPapers",
  },
  {
    href: "/admin/students",
    title: "Students",
    description: "Learners, access, and account support",
    icon: "users",
  },
];

export function AdminDashboardPanel({ dashboard }: { dashboard: DashboardInfo }) {
  return (
    <>
      <section className="dev-marker-host relative app-surface-brand app-section-padding-lg">
        {SHOW_UI_DEBUG ? (
          <DevComponentMarker
            componentName="AdminDashboardPanel"
            filePath="src/components/dashboard/admin-dashboard-panel.tsx"
            tier="semantic"
            componentRole="Admin dashboard control center"
            bestFor="Admin users who need a compact launch panel for content, question, template, user, and lesson-builder tools."
            usageExamples={[
              "Admin account dashboard",
              "Admin workspace entry point",
              "Content management shortcut panel",
              "Question set and lesson-builder navigation",
            ]}
            notes="Keep this panel focused on high-level admin entry points. Use DashboardCard below it for small account facts, status values, or supporting metadata."
          />
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] xl:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="admin">
                Admin workspace
              </Badge>
              <Badge tone="muted" icon="layers">
                {adminWorkspaceLinks.length} core areas
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

          <div className="border-t border-[var(--border-subtle)] pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Workspace map
                </h3>
                <p className="mt-1 text-xs app-text-muted">
                  Jump straight into the admin area you need.
                </p>
              </div>
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl [background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
                <AppIcon icon="admin" size={17} />
              </span>
            </div>

            <div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-1">
              {adminWorkspaceLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="app-focus-ring group flex min-w-0 items-start gap-3 rounded-xl px-2.5 py-2 transition hover:bg-[var(--background-muted)]"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] text-[var(--text-secondary)] shadow-[var(--shadow-xs)] transition group-hover:border-[color-mix(in_srgb,var(--accent)_24%,var(--border-strong))] group-hover:text-[var(--accent-ink)]">
                    <AppIcon icon={item.icon} size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-5 text-[var(--text-primary)]">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 app-text-muted">
                      {item.description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
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

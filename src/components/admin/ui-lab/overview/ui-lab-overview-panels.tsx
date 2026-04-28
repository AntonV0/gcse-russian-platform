import Link from "next/link";
import UiLabFutureSection from "@/components/admin/ui-lab/shell/ui-lab-future-section";
import UiLabSection from "@/components/admin/ui-lab/shell/ui-lab-section";
import {
  audienceFit,
  designPrinciples,
  getAudiencePanelTone,
  getUiLabStatusLabel,
  getUiLabStatusTone,
  productionPatterns,
  refinementAreas,
} from "@/components/admin/ui-lab/overview/ui-lab-overview-data";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import PanelCard from "@/components/ui/panel-card";
import type { AppIconKey } from "@/lib/shared/icons";
import { uiLabPages } from "@/lib/ui/ui-lab";

function OverviewHero({
  completeCount,
  inProgressCount,
  plannedCount,
}: {
  completeCount: number;
  inProgressCount: number;
  plannedCount: number;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <div className="app-surface-brand border border-[var(--border)] p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="info" icon="uiLab">
            Internal design system
          </Badge>
          <Badge tone="muted">Admin Â· Student Â· Teacher</Badge>
        </div>

        <h2 className="mt-4 app-heading-hero max-w-3xl">
          A working UI reference for the full GCSE Russian platform
        </h2>

        <p className="mt-4 max-w-2xl app-subtitle">
          The UI Lab is where shared patterns are tested before they spread into real
          pages. It should help us build consistent admin tools, calmer student
          experiences, teacher-facing workflows, and access-aware states without visual
          drift.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/ui/navigation"
            className="app-btn-base app-btn-primary rounded-[var(--radius-md)] px-4 py-2.5 text-sm"
          >
            <AppIcon icon="next" size={16} />
            <span>Open navigation</span>
          </Link>

          <Link
            href="/admin/ui/typography"
            className="app-btn-base app-btn-secondary rounded-[var(--radius-md)] px-4 py-2.5 text-sm"
          >
            <AppIcon icon="text" size={16} />
            <span>Review typography</span>
          </Link>
        </div>
      </div>

      <PanelCard
        title="Snapshot"
        description="A quick signal of how mature the current system is."
        contentClassName="space-y-4"
      >
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {[
            {
              icon: "completed" as const,
              label: "Complete",
              value: completeCount,
              description: "Pages ready for direct reuse",
            },
            {
              icon: "pending" as const,
              label: "In progress",
              value: inProgressCount,
              description: "Areas actively being refined",
            },
            {
              icon: "help" as const,
              label: "Planned",
              value: plannedCount,
              description: "Areas to add as the product expands",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <AppIcon icon={item.icon} size={18} className="app-brand-text" />
                <div className="font-semibold text-[var(--text-primary)]">
                  {item.label}
                </div>
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {item.value}
              </div>
              <p className="mt-1 text-sm app-text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}

function DemoMiniPreview({
  icon,
  title,
  description,
}: {
  icon: AppIconKey;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl [background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
          <AppIcon icon={icon} size={18} />
        </span>
        <div className="font-semibold text-[var(--text-primary)]">{title}</div>
      </div>
      <p className="text-sm app-text-muted">{description}</p>
    </div>
  );
}

export default function UiLabOverviewPanels() {
  const completeCount = uiLabPages.filter((item) => item.status === "complete").length;
  const inProgressCount = uiLabPages.filter(
    (item) => item.status === "in_progress"
  ).length;
  const plannedCount = uiLabPages.filter((item) => item.status === "planned").length;

  return (
    <>
      <UiLabSection
        id="system-overview"
        title="System overview"
        description="Use this page as the entry point for the UI Lab and the current design-system status."
      >
        <OverviewHero
          completeCount={completeCount}
          inProgressCount={inProgressCount}
          plannedCount={plannedCount}
        />
      </UiLabSection>

      <UiLabSection
        id="sections"
        title="UI Lab sections"
        description="Each section should help guide real implementation, not just isolated demos."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {uiLabPages.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="app-card app-card-hover block p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-[var(--text-primary)]">
                    {item.label}
                  </div>
                  <div className="mt-1 text-sm app-text-soft">{item.href}</div>
                </div>

                <Badge tone={getUiLabStatusTone(item.status)}>
                  {getUiLabStatusLabel(item.status)}
                </Badge>
              </div>

              <p className="mb-5 text-sm leading-6 app-text-muted">{item.description}</p>

              <div className="flex items-center gap-2 text-sm font-medium app-brand-text">
                <span>Open section</span>
                <AppIcon icon="next" size={14} />
              </div>
            </Link>
          ))}
        </div>
      </UiLabSection>

      <UiLabSection
        id="audience-fit"
        title="Audience fit"
        description="Use this as the tone check for UI Lab examples: modern and premium, motivating for GCSE students, reassuring for parents, and still mature enough for adult learners."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {audienceFit.map((item) => (
            <PanelCard
              key={item.title}
              title={item.title}
              description={item.description}
              tone={getAudiencePanelTone(item.tone)}
              contentClassName="space-y-4"
            >
              <div className="flex flex-wrap gap-2">
                <Badge tone={item.tone}>{item.badge}</Badge>
                <Badge tone="muted">Design check</Badge>
              </div>

              <div className="space-y-2">
                {item.checks.map((check) => (
                  <div
                    key={check}
                    className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2 text-sm app-text-muted"
                  >
                    <AppIcon icon="completed" size={15} className="app-brand-text" />
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </PanelCard>
          ))}
        </div>
      </UiLabSection>

      <UiLabSection
        id="coverage"
        title="What this system is already helping us build"
        description="The UI Lab should support real production implementation across different parts of the platform."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {productionPatterns.map((item) => (
            <PanelCard
              key={item.title}
              title={item.title}
              description={item.description}
              contentClassName="pt-1"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl [background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
                  <AppIcon icon={item.icon} size={18} />
                </span>
                <div className="text-sm app-text-muted">
                  This pattern is already shaping live platform direction.
                </div>
              </div>
            </PanelCard>
          ))}
        </div>
      </UiLabSection>

      <UiLabSection
        title="Preview of system coverage"
        description="These categories show the type of product work the UI Lab is intended to support."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          <DemoMiniPreview
            icon="navigation"
            title="Admin and CMS patterns"
            description="Dense, structured interfaces for editing, organising, and managing content without losing clarity."
          />
          <DemoMiniPreview
            icon="learning"
            title="Student learning patterns"
            description="Calmer, more readable surfaces for dashboards, lessons, progress, and motivating next-step experiences."
          />
          <DemoMiniPreview
            icon="school"
            title="Teacher and Volna patterns"
            description="Task-focused tools for assignments, submissions, feedback, and teacher-linked workflow states."
          />
        </div>
      </UiLabSection>

      <UiLabSection
        id="consistency-next"
        title="Needs consistency next"
        description="These are the areas most likely to create visual drift if left unstandardised."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {refinementAreas.map((item) => (
            <Card key={item} className="p-4">
              <div className="flex items-start gap-3">
                <AppIcon icon="warning" size={16} className="mt-0.5 app-brand-text" />
                <div className="text-sm app-text-muted">{item}</div>
              </div>
            </Card>
          ))}
        </div>
      </UiLabSection>

      <UiLabSection
        id="principles"
        title="Design principles"
        description="Use these rules when making design decisions so the product stays coherent as more pages are added."
      >
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {designPrinciples.map((item) => (
            <Card key={item} className="p-4">
              <div className="flex items-start gap-3">
                <AppIcon icon="idea" size={16} className="mt-0.5 app-brand-text" />
                <div className="text-sm app-text-muted">{item}</div>
              </div>
            </Card>
          ))}
        </div>
      </UiLabSection>

      <UiLabFutureSection
        items={[
          "AudienceToneExamples for student, parent, teacher, and adult-learner copy checks.",
          "PremiumExampleGallery for polished GCSE Russian page compositions.",
          "StudentMotivationPatterns for progress, streaks, revision prompts, and next-step CTAs.",
          "ParentConfidencePatterns for pricing, access, safety, and value reassurance.",
          "AdultLearnerCompatibility checks for mature wording and calmer interaction states.",
          "VisualQualityChecklist for spacing, hierarchy, colour balance, and example realism.",
        ]}
      />
    </>
  );
}

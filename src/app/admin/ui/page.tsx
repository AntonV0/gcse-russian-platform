import Link from "next/link";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import type { AppIconKey } from "@/lib/shared/icons";
import { uiLabPages } from "@/lib/ui/ui-lab";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import PanelCard from "@/components/ui/panel-card";

function getStatusTone(status: "complete" | "in_progress" | "planned") {
  switch (status) {
    case "complete":
      return "success" as const;
    case "in_progress":
      return "warning" as const;
    case "planned":
    default:
      return "muted" as const;
  }
}

function getStatusLabel(status: "complete" | "in_progress" | "planned") {
  switch (status) {
    case "complete":
      return "Complete";
    case "in_progress":
      return "In progress";
    case "planned":
    default:
      return "Planned";
  }
}

type ProductionPattern = {
  title: string;
  description: string;
  icon: AppIconKey;
};

const productionPatterns: ProductionPattern[] = [
  {
    title: "Homepage and public-facing direction",
    description:
      "Premium brand presentation, clear hero hierarchy, and parent-friendly structure for first impressions.",
    icon: "home",
  },
  {
    title: "Platform shell and navigation",
    description:
      "Shared top-level navigation, sidebar direction, and access-aware movement across student, admin, and teacher areas.",
    icon: "navigation",
  },
  {
    title: "Shared UI primitives",
    description:
      "Buttons, badges, cards, typography, forms, and icon usage now shape most pages before page-specific styling is added.",
    icon: "component",
  },
  {
    title: "Content and dashboard composition",
    description:
      "Structured cards, sections, summaries, and denser admin layouts are beginning to feel like one cohesive product.",
    icon: "layout",
  },
];

const refinementAreas = [
  "Validation and inline field errors",
  "Toast-style feedback patterns",
  "Dense inspector and builder controls",
  "Dashboard-specific card patterns",
  "Lesson block visual consistency",
  "Mobile navigation refinement",
];

const designPrinciples = [
  "Premium and modern without feeling cold",
  "Readable for students aged 12-16 and reassuring for parents",
  "Consistent hierarchy before decorative styling",
  "Shared components first, page-specific styling second",
  "Use restrained branding and clear content structure",
  "Support admin density and student calmness within one system",
];

const pageNavItems = [
  { id: "system-overview", label: "Overview" },
  { id: "sections", label: "Sections" },
  { id: "audience-fit", label: "Audience fit" },
  { id: "coverage", label: "Coverage" },
  { id: "consistency-next", label: "Consistency" },
  { id: "principles", label: "Principles" },
  { id: "future-components", label: "Future" },
];

const audienceFit = [
  {
    title: "Students aged 12-16",
    badge: "Primary",
    tone: "info" as const,
    description:
      "Use confident, friendly examples with clear next steps, visible progress, and enough energy to feel motivating without becoming childish.",
    checks: ["Short labels", "Recognisable GCSE content", "Encouraging progression"],
  },
  {
    title: "Parents and guardians",
    badge: "Important",
    tone: "success" as const,
    description:
      "Surfaces should feel trustworthy, polished, and worth paying for. Avoid clutter, vague copy, or playful styling that weakens confidence.",
    checks: ["Premium restraint", "Clear value", "Stable hierarchy"],
  },
  {
    title: "Adult learners",
    badge: "Secondary",
    tone: "muted" as const,
    description:
      "Keep the system mature enough for older learners by using readable typography, practical task language, and calm support panels.",
    checks: ["Readable rhythm", "Practical examples", "No teen-only slang"],
  },
] as const;

function getAudiencePanelTone(tone: (typeof audienceFit)[number]["tone"]) {
  if (tone === "info") return "student" as const;
  if (tone === "success") return "brand" as const;
  return "muted" as const;
}

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
          <Badge tone="muted">Admin · Student · Teacher</Badge>
        </div>

        <h2 className="mt-4 app-title max-w-3xl">
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
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon="completed" size={18} className="app-brand-text" />
              <div className="font-semibold text-[var(--text-primary)]">Complete</div>
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              {completeCount}
            </div>
            <p className="mt-1 text-sm app-text-muted">Pages ready for direct reuse</p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon="pending" size={18} className="app-brand-text" />
              <div className="font-semibold text-[var(--text-primary)]">In progress</div>
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              {inProgressCount}
            </div>
            <p className="mt-1 text-sm app-text-muted">Areas actively being refined</p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon="help" size={18} className="app-brand-text" />
              <div className="font-semibold text-[var(--text-primary)]">Planned</div>
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              {plannedCount}
            </div>
            <p className="mt-1 text-sm app-text-muted">
              Areas to add as the product expands
            </p>
          </div>
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
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--background-muted)] text-[var(--brand-blue)]">
          <AppIcon icon={icon} size={18} />
        </span>
        <div className="font-semibold text-[var(--text-primary)]">{title}</div>
      </div>
      <p className="text-sm app-text-muted">{description}</p>
    </div>
  );
}

export default async function AdminUiOverviewPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const completeCount = uiLabPages.filter((item) => item.status === "complete").length;
  const inProgressCount = uiLabPages.filter(
    (item) => item.status === "in_progress"
  ).length;
  const plannedCount = uiLabPages.filter((item) => item.status === "planned").length;

  return (
    <UiLabShell
      title="UI Lab"
      description="Internal design-system workspace for comparing styles, tracking completeness, and standardising reusable UI across the platform."
      currentPath="/admin/ui"
    >
      <UiLabPageNav items={pageNavItems} />

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

                <Badge tone={getStatusTone(item.status)}>
                  {getStatusLabel(item.status)}
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
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--background-elevated)] text-[var(--brand-blue)]">
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
    </UiLabShell>
  );
}

import Link from "next/link";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { appIcons } from "@/lib/shared/icons";
import { uiLabPages } from "@/lib/ui/ui-lab";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import AppIcon from "@/components/ui/app-icon";

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

const productionPatterns = [
  {
    title: "Homepage hero",
    description:
      "Branded premium landing section with GCSE-specific messaging and audience-focused structure.",
    icon: appIcons.home,
  },
  {
    title: "Platform header",
    description:
      "Shared site header with active states, theme toggle, account metadata, and mobile menu.",
    icon: appIcons.header,
  },
  {
    title: "Admin sidebar",
    description:
      "Reusable admin navigation pattern with grouped sections and nested UI Lab links.",
    icon: appIcons.navigation,
  },
  {
    title: "Shared primitives",
    description:
      "Buttons, badges, cards, typography, inputs, and icons are now shaping most screens.",
    icon: appIcons.component,
  },
];

const refinementAreas = [
  "Validation and inline field errors",
  "Toast-style feedback patterns",
  "Dense inspector / builder controls",
  "Dashboard-specific card patterns",
  "Lesson block visual consistency",
  "Mobile navigation refinement",
];

const designPrinciples = [
  "Premium and modern without feeling cold",
  "Readable for students aged 12–16 and reassuring for parents",
  "Consistent hierarchy before decorative styling",
  "Shared components first, page-specific styling second",
  "Use restrained branding and clear content structure",
];

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
      <UiLabSection
        title="Progress snapshot"
        description="A quick view of how complete the current UI system is."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon={appIcons.completed} size={18} className="app-brand-text" />
              <div className="font-semibold">Complete</div>
            </div>
            <div className="text-2xl font-bold">{completeCount}</div>
            <p className="mt-1 text-sm app-text-muted">
              Pages or sections ready for real reuse
            </p>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon={appIcons.pending} size={18} className="app-brand-text" />
              <div className="font-semibold">In progress</div>
            </div>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="mt-1 text-sm app-text-muted">
              Areas being refined as the platform grows
            </p>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon={appIcons.help} size={18} className="app-brand-text" />
              <div className="font-semibold">Planned</div>
            </div>
            <div className="text-2xl font-bold">{plannedCount}</div>
            <p className="mt-1 text-sm app-text-muted">
              Areas to build once core screens stabilize
            </p>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="UI completeness matrix"
        description="Use this as the main checklist for what is production-ready versus still being standardised."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {uiLabPages.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="app-card app-card-hover block p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="font-semibold text-[var(--text-primary)]">
                  {item.label}
                </div>
                <Badge tone={getStatusTone(item.status)}>
                  {getStatusLabel(item.status)}
                </Badge>
              </div>

              <p className="mb-4 text-sm app-text-muted">{item.description}</p>

              <div className="flex items-center gap-2 text-sm app-brand-text">
                <span>Open section</span>
                <AppIcon icon={appIcons.next} size={14} />
              </div>
            </Link>
          ))}
        </div>
      </UiLabSection>

      <UiLabSection
        title="Current production patterns"
        description="These are the patterns already shaping real pages in the live app shell."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {productionPatterns.map((item) => (
            <div key={item.title} className="app-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <AppIcon icon={item.icon} size={18} className="app-brand-text" />
                <div className="font-semibold">{item.title}</div>
              </div>

              <p className="text-sm app-text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </UiLabSection>

      <UiLabSection
        title="Needs consistency next"
        description="These are the areas most likely to create visual drift if left unstandardised."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {refinementAreas.map((item) => (
            <div key={item} className="app-card p-4">
              <div className="flex items-start gap-3">
                <AppIcon
                  icon={appIcons.warning}
                  size={16}
                  className="mt-0.5 app-brand-text"
                />
                <div className="text-sm app-text-muted">{item}</div>
              </div>
            </div>
          ))}
        </div>
      </UiLabSection>

      <UiLabSection
        title="Design principles"
        description="Use these rules when making design decisions so the product stays coherent as more pages are added."
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {designPrinciples.map((item) => (
            <div key={item} className="app-card p-4">
              <div className="flex items-start gap-3">
                <AppIcon
                  icon={appIcons.idea}
                  size={16}
                  className="mt-0.5 app-brand-text"
                />
                <div className="text-sm app-text-muted">{item}</div>
              </div>
            </div>
          ))}
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}

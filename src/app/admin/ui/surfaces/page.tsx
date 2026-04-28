import UiLabFutureSection from "@/components/admin/ui-lab/shell/ui-lab-future-section";
import UiLabPageNav from "@/components/admin/ui-lab/shell/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab/shell/ui-lab-shell";
import {
  DarkSurfaceHierarchySection,
  NestedSurfacesSection,
  SpacingRhythmSection,
  StackedPageCompositionSection,
  SurfaceUsageRulesSection,
} from "@/components/admin/ui-lab/surfaces/ui-lab-surfaces-composition";
import { surfacePageNavItems } from "@/components/admin/ui-lab/surfaces/ui-lab-surfaces-data";
import {
  SurfaceCardAnatomySection,
  SurfaceFoundationsSection,
  SurfacePrimitivesSection,
  SurfaceToneDensitySection,
} from "@/components/admin/ui-lab/surfaces/ui-lab-surfaces-foundations";
import {
  SemanticExtractionDirectionSection,
  SemanticSurfacePatternsSection,
  SurfaceIntentGuideSection,
} from "@/components/admin/ui-lab/surfaces/ui-lab-surfaces-semantic";
import { requireAdminAccess } from "@/lib/auth/admin-auth";

export default async function AdminUiSurfacesPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Surfaces"
      description="Compare cards, panels, branded containers, and spacing patterns so pages feel consistent across the platform."
      currentPath="/admin/ui/surfaces"
    >
      <UiLabPageNav items={surfacePageNavItems} />

      <SurfaceFoundationsSection />
      <SurfacePrimitivesSection />
      <SurfaceCardAnatomySection />
      <SurfaceToneDensitySection />
      <SemanticSurfacePatternsSection />
      <SemanticExtractionDirectionSection />
      <SurfaceIntentGuideSection />
      <DarkSurfaceHierarchySection />
      <SpacingRhythmSection />
      <NestedSurfacesSection />
      <StackedPageCompositionSection />
      <SurfaceUsageRulesSection />

      <UiLabFutureSection
        items={[
          "Dialog and modal surfaces for confirmation and focused editing.",
          "Drawer surface for mobile navigation and side inspectors.",
          "MediaCard for image, audio, and future video previews.",
          "CalloutPanel for reusable informational, exam-tip, and warning blocks.",
          "PricingComparisonSurface for plan and upgrade decisions.",
          "TimelineSurface for future activity, audit, and progress history.",
        ]}
      />
    </UiLabShell>
  );
}

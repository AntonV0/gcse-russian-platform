import { COMPONENT_LOGO_DIRECTIONS } from "@/components/admin/ui-lab/components/ui-lab-components-data";
import UiLabSection from "@/components/admin/ui-lab/shell/ui-lab-section";
import AppLogo from "@/components/ui/app-logo";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import SummaryStatCard from "@/components/ui/summary-stat-card";

function DemoInspectionCluster() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
      <div className="app-card p-5 space-y-4">
        <div className="space-y-1">
          <div className="app-label">Marker test cluster</div>
          <p className="text-sm app-text-muted">
            Buttons and badges should now expose a subtle dev-only corner marker that can
            be opened without covering the component itself. This section keeps them
            together so shared primitives are easy to inspect side by side.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary" icon="create">
            Primary action
          </Button>
          <Button variant="secondary" icon="edit">
            Secondary action
          </Button>
          <Button variant="quiet" icon="search">
            Quiet action
          </Button>
          <Button variant="secondary" icon="settings" iconOnly ariaLabel="Settings" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge tone="info" icon="preview">
            Shared badge
          </Badge>
          <Badge tone="success" icon="completed">
            Stable pattern
          </Badge>
          <Badge tone="warning" icon="pending">
            Still refining
          </Badge>
          <Badge tone="muted" icon="file">
            Reusable primitive
          </Badge>
        </div>
      </div>

      <div className="app-card p-5 space-y-3">
        <div className="app-label">Why this matters</div>
        <div className="space-y-2 text-sm app-text-muted">
          <p>Helps distinguish shared components from one-off page markup.</p>
          <p>Makes reuse gaps easier to spot during admin UI refinement.</p>
          <p>Gives the UI Lab a stronger role as the internal design reference area.</p>
        </div>
      </div>
    </div>
  );
}

function DemoLogoDirections() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-3">
        {COMPONENT_LOGO_DIRECTIONS.map((direction) => (
          <div
            key={direction.variant}
            className="app-card flex h-full flex-col gap-5 p-5"
          >
            <div className="space-y-3">
              <AppLogo variant={direction.variant} size="lg" />

              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  {direction.title}
                </h3>
                <p className="mt-1 text-sm app-text-muted">{direction.description}</p>
              </div>
            </div>

            <div className="mt-auto rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] p-3 text-sm app-text-muted">
              {direction.bestFor}
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-3">
              <AppLogo variant={direction.variant} size="sm" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <PanelCard
          title="Header and theme checks"
          description="The component keeps the existing footprint while allowing accent and neutral tones."
          contentClassName="space-y-4"
        >
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/80 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <AppLogo size="md" />
              <div className="hidden items-center gap-4 text-sm app-text-muted sm:flex">
                <span>Dashboard</span>
                <span>Courses</span>
                <span>Account</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
              <div className="mb-3 text-sm font-medium text-[var(--text-primary)]">
                Full lockup
              </div>
              <AppLogo size="md" />
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
              <div className="mb-3 text-sm font-medium text-[var(--text-primary)]">
                Domain lockup
              </div>
              <AppLogo variant="domain" size="md" />
            </div>
          </div>
        </PanelCard>

        <PanelCard
          title="Sidebar and compact checks"
          description="Use subtitle support for platform sidebar contexts without forking the lockup."
          contentClassName="space-y-4"
        >
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/55 px-3 py-3">
            <AppLogo size="md" subtitle="Full access" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {COMPONENT_LOGO_DIRECTIONS.map((direction) => (
              <div
                key={direction.variant}
                className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4"
              >
                <div className="flex justify-center">
                  <AppLogo
                    variant={direction.variant}
                    size="lg"
                    ariaLabel={`${direction.title} logo mark`}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm app-text-muted">
            Scholar dialogue is still the recommended direction, but production
            replacement should wait until you choose the final mark.
          </p>
        </PanelCard>
      </div>
    </div>
  );
}

function DemoIntroPanels() {
  return (
    <div className="space-y-4">
      <PageIntroPanel
        tone="admin"
        headingLevel={3}
        eyebrow="Content management"
        title="GCSE Russian course"
        description="Manage variants, modules, lessons, publishing state, and internal structure from one shared content area."
        badges={
          <>
            <Badge tone="info">Admin view</Badge>
            <Badge tone="muted">3 variants</Badge>
            <Badge tone="success">Published</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary" icon="edit">
              Edit details
            </Button>
            <Button variant="primary" icon="create">
              Add module
            </Button>
          </>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          <SummaryStatCard
            title="Modules"
            value="8"
            icon="layout"
            compact
            description="Structured and visible."
          />
          <SummaryStatCard
            title="Lessons"
            value="42"
            icon="lessons"
            compact
            description="Across all variants."
          />
          <SummaryStatCard
            title="Draft items"
            value="5"
            icon="edit"
            tone="warning"
            compact
            description="Need review before publishing."
          />
        </div>
      </PageIntroPanel>

      <PageIntroPanel
        tone="student"
        headingLevel={3}
        eyebrow="Continue learning"
        title="Theme 2: Local area, holiday and travel"
        description="Build confidence with vocabulary, listening, and exam-style practice through structured lessons and clear next steps."
        badges={
          <>
            <Badge tone="info">Higher tier</Badge>
            <Badge tone="success">18 lessons completed</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary" icon="preview">
              Review overview
            </Button>
            <Button variant="primary" icon="next" iconPosition="right">
              Continue lesson
            </Button>
          </>
        }
      />

      <PageIntroPanel
        tone="brand"
        headingLevel={3}
        eyebrow="Full access"
        title="Unlock the complete GCSE Russian experience"
        description="Get structured lesson paths, progress tracking, premium revision support, and the full higher-tier learning journey."
        badges={
          <>
            <Badge tone="warning">Upgrade available</Badge>
            <Badge tone="muted">Trial currently active</Badge>
          </>
        }
        actions={
          <>
            <Button variant="inverse" icon="next" iconPosition="right">
              Unlock full course
            </Button>
            <Button variant="secondary" icon="preview">
              Compare access
            </Button>
          </>
        }
      />
    </div>
  );
}

export function UiLabComponentsBrandSections() {
  return (
    <>
      <UiLabSection
        id="inspection"
        title="Shared component inspection"
        description="Use this area to verify which elements are coming from shared UI primitives and to test the dev marker behaviour in realistic grouped layouts."
      >
        <DemoInspectionCluster />
      </UiLabSection>

      <UiLabSection
        id="brand-logo"
        title="Brand logo directions"
        description="Preview bespoke SVG logo concepts before replacing production header, sidebar, and footer usage."
      >
        <DemoLogoDirections />
      </UiLabSection>

      <UiLabSection
        id="intro-panels"
        title="Page intro panels"
        description="This is the preferred premium top-of-page pattern for admin overviews, student course screens, and access or upgrade entry points."
      >
        <DemoIntroPanels />
      </UiLabSection>
    </>
  );
}

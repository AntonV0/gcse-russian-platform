import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";

const pageNavItems = [
  { id: "dev-markers", label: "Dev markers" },
  { id: "core-hierarchy", label: "Core hierarchy" },
  { id: "states", label: "States" },
  { id: "dense-patterns", label: "Dense patterns" },
  { id: "project-examples", label: "Project examples" },
  { id: "future-components", label: "Future" },
];

export default async function AdminUiButtonsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Buttons"
      description="Reference for button variants, icon patterns, interaction states, and shared component inspection in development."
      currentPath="/admin/ui/buttons"
    >
      <UiLabPageNav items={pageNavItems} />

      <UiLabSection
        id="dev-markers"
        title="Dev marker behaviour"
        description="In development, shared buttons now show a subtle corner marker. Click it to inspect the reusable component name and source path without covering the button itself."
      >
        <div className="app-card app-section-padding flex flex-col gap-4 border border-dashed border-[var(--border-strong)] bg-[var(--background-muted)]">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Shared component inspection
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              This page is the first safe reference area for validating the new marker
              system on compact controls before expanding it across the shared UI layer.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Inspect primary button</Button>
            <Button variant="secondary" icon="settings">
              Inspect secondary button
            </Button>
            <Button
              variant="quiet"
              icon="search"
              iconOnly
              ariaLabel="Inspect icon button"
            />
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        id="core-hierarchy"
        title="Core hierarchy"
        description="These are the main reusable button hierarchies for admin pages, forms, and platform navigation."
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="quiet">Quiet</Button>
          <Button variant="inverse">Inverse</Button>
          <Button variant="soft">Soft</Button>
          <Button variant="accent">Accent</Button>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Hover emphasis comparison"
        description="Use this area to compare how clearly each variant responds on hover. The interaction should feel deliberate, not just slightly lifted."
      >
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Main actions
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" icon="completed">
                  Save progress
                </Button>
                <Button variant="accent" icon="create">
                  Start challenge
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Supporting actions
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" icon="preview">
                  Preview
                </Button>
                <Button variant="soft" icon="next" iconPosition="right">
                  Continue revision
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Low-emphasis actions
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="quiet" icon="edit">
                  Save draft
                </Button>
                <Button variant="quiet" icon="file">
                  View notes
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Animated interaction ideas"
        description="These are slightly more expressive motion patterns for teen-facing or momentum-oriented actions. Use them sparingly so the main system still feels polished."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Slide-forward CTA
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  icon="next"
                  iconPosition="right"
                  className="motion-safe:hover:pr-5 motion-safe:hover:pl-4"
                >
                  Keep going
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Lift + glow emphasis
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="accent"
                  icon="create"
                  className="motion-safe:hover:scale-[1.02] motion-safe:hover:-rotate-[0.4deg]"
                >
                  Launch sprint
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Calm reveal utility
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="soft"
                  icon="preview"
                  className="motion-safe:hover:translate-x-[2px]"
                >
                  Reveal next task
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Primary actions"
        description="Use primary buttons sparingly for the main action in a section or page."
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="primary" icon="dashboard">
            With icon
          </Button>
          <Button variant="primary" icon="next" iconPosition="right">
            Continue
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Secondary and subtle actions"
        description="Secondary buttons are the default choice for safe actions and navigation."
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">Secondary</Button>
          <Button variant="secondary" icon="back">
            Back
          </Button>
          <Button variant="secondary" icon="next" iconPosition="right">
            Next step
          </Button>
          <Button variant="quiet">Quiet</Button>
          <Button variant="quiet" icon="edit">
            Quiet with icon
          </Button>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Status and destructive actions"
        description="Reserve these for clearly meaningful states or destructive operations."
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="success" icon="completed">
            Success
          </Button>
          <Button variant="warning" icon="pending">
            In progress
          </Button>
          <Button variant="danger" icon="userX">
            Destructive
          </Button>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Student-friendly and promotional styles"
        description="These variants are useful for more energetic student-facing CTAs, progression moments, and upgrade prompts."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Lesson / learning actions
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="soft" icon="next" iconPosition="right">
                  Start lesson
                </Button>
                <Button variant="soft" icon="completed">
                  Mark ready
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Motivational / highlight actions
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="accent" icon="completed">
                  Unlock next step
                </Button>
                <Button variant="accent" icon="create">
                  Join revision sprint
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Hero / strong contrast actions
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="inverse" icon="preview">
                  View course path
                </Button>
                <Button variant="inverse" icon="next" iconPosition="right">
                  Explore full access
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Dark-surface contrast check"
        description="Use this section to quickly validate contrast and hover clarity on darker surfaces, especially for inverse, accent, and soft variants."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(135deg,var(--dark-surface-elevated)_0%,var(--dark-surface-muted)_58%,var(--dark-surface-strong)_100%)] p-5 shadow-[0_14px_30px_rgba(16,32,51,0.22)]">
            <div className="mb-3 text-sm font-semibold text-white">
              Strong CTAs on dark surface
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" icon="next" iconPosition="right">
                Continue course
              </Button>
              <Button variant="accent" icon="create">
                Start mock exam
              </Button>
              <Button variant="inverse" icon="preview">
                View overview
              </Button>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(135deg,var(--dark-surface-elevated)_0%,var(--dark-surface-muted)_100%)] p-5 shadow-[0_14px_30px_rgba(16,32,51,0.22)]">
            <div className="mb-3 text-sm font-semibold text-white">
              Subtle and utility actions on dark surface
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" icon="settings">
                Settings
              </Button>
              <Button variant="soft" icon="completed">
                Keep revising
              </Button>
              <Button variant="quiet" icon="file">
                View notes
              </Button>
            </div>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Sizes and icon-only controls"
        description="Use smaller buttons in dense admin areas, but keep tap targets usable."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="sm">
            Small primary
          </Button>
          <Button variant="soft" size="sm">
            Small soft
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon="search"
            iconOnly
            ariaLabel="Search"
          />
          <Button variant="secondary" icon="settings" iconOnly ariaLabel="Settings" />
          <Button variant="soft" icon="preview" iconOnly ariaLabel="Preview" />
          <Button
            variant="danger"
            size="sm"
            icon="userX"
            iconOnly
            ariaLabel="Remove user"
          />
        </div>
      </UiLabSection>

      <UiLabSection
        id="states"
        title="Disabled states by hierarchy"
        description="Disabled buttons should remain readable, clearly inactive, and still preserve the intended action hierarchy."
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" disabled>
            Save changes
          </Button>
          <Button variant="secondary" disabled icon="back">
            Cancel
          </Button>
          <Button variant="quiet" disabled icon="edit">
            Edit later
          </Button>
          <Button variant="soft" disabled icon="preview">
            Start revision
          </Button>
          <Button variant="success" disabled icon="completed">
            Completed
          </Button>
          <Button variant="warning" disabled icon="pending">
            Waiting
          </Button>
          <Button variant="danger" disabled icon="userX">
            Delete
          </Button>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Long labels and content balance"
        description="Buttons should hold up with more realistic labels used in admin actions, checkout flows, and navigation prompts."
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" icon="completed">
            Save lesson changes
          </Button>
          <Button variant="secondary" icon="next" iconPosition="right">
            Continue to module overview
          </Button>
          <Button variant="danger" icon="delete">
            Permanently remove selected lesson
          </Button>
          <Button variant="quiet" icon="preview">
            Preview in student view
          </Button>
        </div>
      </UiLabSection>

      <UiLabSection
        id="dense-patterns"
        title="Toolbar and dense admin patterns"
        description="These patterns are useful for list screens, builder toolbars, inspectors, and table action bars."
      >
        <div className="flex flex-col gap-4">
          <Card>
            <CardBody className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="secondary" size="sm" icon="filter">
                  Filter
                </Button>
                <Button variant="secondary" size="sm" icon="search">
                  Search
                </Button>
                <Button variant="secondary" size="sm" icon="settings">
                  Settings
                </Button>
                <Button variant="quiet" size="sm" icon="refresh">
                  Refresh
                </Button>
                <Button variant="primary" size="sm" icon="create">
                  Add item
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="secondary" size="sm" icon="back">
                  Back
                </Button>
                <Button variant="primary" size="sm" icon="completed">
                  Save
                </Button>
                <Button variant="secondary" size="sm" icon="preview">
                  Preview
                </Button>
                <Button variant="danger" size="sm" icon="delete">
                  Delete
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="soft"
                  size="sm"
                  icon="next"
                  iconPosition="right"
                  className="motion-safe:hover:translate-x-[2px]"
                >
                  Continue
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  icon="create"
                  className="motion-safe:hover:scale-[1.02]"
                >
                  Launch revision sprint
                </Button>
                <Button variant="inverse" size="sm" icon="preview">
                  Open student view
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Form action rows"
        description="These are common action combinations for create, edit, and settings forms. The primary action should remain visually clear."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Standard edit form
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" icon="completed">
                  Save changes
                </Button>
                <Button variant="secondary" icon="back">
                  Cancel
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Destructive confirmation
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="danger" icon="delete">
                  Delete lesson
                </Button>
                <Button variant="secondary">Keep lesson</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Grouped action hierarchy"
        description="Useful for content screens where one action is primary, one is supportive, and one is optional or low emphasis."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Content publishing
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" icon="completed">
                  Publish now
                </Button>
                <Button variant="secondary" icon="preview">
                  Preview
                </Button>
                <Button variant="quiet">Save draft</Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Account / membership action row
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary">Manage subscription</Button>
                <Button variant="primary" icon="next" iconPosition="right">
                  Upgrade plan
                </Button>
                <Button variant="quiet">Compare options</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>

      <UiLabSection
        id="project-examples"
        title="Project-specific examples"
        description="These are closer to how buttons could be used in GCSE Russian lessons, revision flows, and sales funnel moments."
      >
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Student dashboard
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="soft" icon="next" iconPosition="right">
                  Continue revision
                </Button>
                <Button variant="secondary" icon="preview">
                  Open module
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Exam prep CTA
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="accent" icon="create">
                  Start mock exam
                </Button>
                <Button variant="quiet" icon="file">
                  View tips
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Upgrade / funnel CTA
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="inverse" icon="next" iconPosition="right">
                  Unlock full course
                </Button>
                <Button variant="secondary">See pricing</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Teen-friendly energy check"
        description="These combinations are slightly more expressive and motivational, but should still feel polished enough for the platform and parent-facing moments."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Momentum actions
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="accent"
                  icon="next"
                  iconPosition="right"
                  className="motion-safe:hover:scale-[1.015]"
                >
                  Keep the streak going
                </Button>
                <Button variant="soft" icon="completed">
                  I’m ready
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Revision prompts
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  icon="create"
                  className="motion-safe:hover:-rotate-[0.3deg]"
                >
                  Start vocab challenge
                </Button>
                <Button variant="secondary" icon="file">
                  Review mistakes
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Upgrade moments
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="inverse" icon="next" iconPosition="right">
                  See full course path
                </Button>
                <Button
                  variant="accent"
                  icon="preview"
                  className="motion-safe:hover:scale-[1.02]"
                >
                  Unlock premium tools
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Link buttons"
        description="Shared buttons also need to behave cleanly when rendered as links, including with the dev marker enabled."
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/admin/ui" variant="secondary" icon="back">
            Back to UI Lab
          </Button>
          <Button
            href="/admin/ui/components"
            variant="primary"
            icon="next"
            iconPosition="right"
          >
            Go to components
          </Button>
          <Button href="/admin/ui/navigation" variant="quiet">
            View navigation patterns
          </Button>
        </div>
      </UiLabSection>

      <UiLabFutureSection
        items={[
          "LoadingButton for server action pending states.",
          "SplitButton for create-and-add-another admin flows.",
          "SegmentedControl for compact mode or variant switching.",
          "CommandButton for keyboard-aware editor actions.",
          "IconTooltipButton for dense builder and toolbar controls.",
          "ButtonGroup for grouped mutually related actions.",
        ]}
      />
    </UiLabShell>
  );
}

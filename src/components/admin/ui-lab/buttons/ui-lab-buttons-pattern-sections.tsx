import ButtonExampleCard from "@/components/admin/ui-lab/buttons/ui-lab-button-example-card";
import UiLabFutureSection from "@/components/admin/ui-lab/shell/ui-lab-future-section";
import UiLabSection from "@/components/admin/ui-lab/shell/ui-lab-section";
import { PricingOptionButton } from "@/components/billing/pricing/pricing-option-button";
import ActionPill from "@/components/ui/action-pill";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import SelectableCardButton from "@/components/ui/selectable-card-button";

export default function UiLabButtonsPatternSections() {
  return (
    <>
      <UiLabSection
        id="dense-patterns"
        title="Toolbar and dense admin patterns"
        description="These patterns are useful for list screens, builder toolbars, inspectors, and table action bars."
      >
        <div className="flex flex-col gap-4">
          {[
            [
              <Button key="filter" variant="secondary" size="sm" icon="filter">
                Filter
              </Button>,
              <Button key="search" variant="secondary" size="sm" icon="search">
                Search
              </Button>,
              <Button key="settings" variant="secondary" size="sm" icon="settings">
                Settings
              </Button>,
              <Button
                key="refresh"
                variant="quiet"
                size="sm"
                icon="refresh"
                interaction="flat"
              >
                Refresh
              </Button>,
              <Button key="add" variant="primary" size="sm" icon="create">
                Add item
              </Button>,
            ],
            [
              <Button key="back" variant="secondary" size="sm" icon="back">
                Back
              </Button>,
              <Button key="save" variant="primary" size="sm" icon="completed">
                Save
              </Button>,
              <Button key="preview" variant="secondary" size="sm" icon="preview">
                Preview
              </Button>,
              <Button key="delete" variant="danger" size="sm" icon="delete">
                Delete
              </Button>,
            ],
            [
              <Button
                key="continue"
                variant="soft"
                size="sm"
                icon="next"
                iconPosition="right"
              >
                Continue
              </Button>,
              <Button key="sprint" variant="accent" size="sm" icon="create">
                Launch revision sprint
              </Button>,
              <Button key="student" variant="inverse" size="sm" icon="preview">
                Open student view
              </Button>,
            ],
          ].map((row, index) => (
            <Card key={index}>
              <CardBody className="p-4">
                <div className="flex flex-wrap items-center gap-2">{row}</div>
              </CardBody>
            </Card>
          ))}
        </div>
      </UiLabSection>

      <UiLabSection
        title="Form action rows"
        description="These are common action combinations for create, edit, and settings forms. The primary action should remain visually clear while supporting actions stay calmer."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <ButtonExampleCard title="Standard edit form">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" icon="completed">
                Save changes
              </Button>
              <Button variant="secondary" icon="back">
                Cancel
              </Button>
            </div>
          </ButtonExampleCard>

          <ButtonExampleCard title="Destructive confirmation">
            <div className="flex flex-wrap gap-3">
              <Button variant="danger" icon="delete">
                Delete lesson
              </Button>
              <Button variant="secondary">Keep lesson</Button>
            </div>
          </ButtonExampleCard>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Grouped action hierarchy"
        description="Useful for content screens where one action is primary, one is supportive, and one is optional or low emphasis."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <ButtonExampleCard title="Content publishing">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" icon="completed">
                Publish now
              </Button>
              <Button variant="secondary" icon="preview">
                Preview
              </Button>
              <Button variant="quiet">Save draft</Button>
            </div>
          </ButtonExampleCard>

          <ButtonExampleCard title="Account / membership action row">
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary">Manage subscription</Button>
              <Button variant="accent" icon="billing">
                Upgrade plan
              </Button>
              <Button variant="quiet">Compare options</Button>
            </div>
          </ButtonExampleCard>
        </div>
      </UiLabSection>

      <UiLabSection
        id="card-choice-interactions"
        title="Card and choice interactions"
        description="Clickable cards, selection rows, pricing options, and card CTAs use their own tactile layer so they do not compete with primary button motion."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <ButtonExampleCard title="Clickable card CTAs">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="app-card app-card-hover app-card-interaction-subtle group flex min-h-36 flex-col justify-between rounded-2xl p-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Continue module
                  </p>
                  <p className="mt-1 text-sm app-text-muted">
                    Card lift stays softer than a journey button.
                  </p>
                </div>
                <ActionPill>Open module</ActionPill>
              </div>

              <div className="app-card app-card-hover app-card-interaction-flat group flex min-h-36 flex-col justify-between rounded-2xl p-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Admin utility
                  </p>
                  <p className="mt-1 text-sm app-text-muted">
                    Flat cards use border and tint before elevation.
                  </p>
                </div>
                <ActionPill tone="muted" icon="settings">
                  Configure
                </ActionPill>
              </div>

              <div className="app-card app-card-interaction-flat group flex min-h-36 flex-col justify-between rounded-2xl border-dashed p-4 opacity-85">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Locked lesson
                  </p>
                  <p className="mt-1 text-sm app-text-muted">
                    Locked CTAs stay calm and informational.
                  </p>
                </div>
                <ActionPill tone="locked" icon="locked">
                  Access required
                </ActionPill>
              </div>
            </div>
          </ButtonExampleCard>

          <ButtonExampleCard title="Selection and pricing rows">
            <div className="grid gap-3 lg:grid-cols-2">
              <SelectableCardButton
                active
                label="Foundation practice"
                description="Selected cards should feel anchored, not floatier than buttons."
                icon="completed"
                statusLabel="Current"
              />
              <SelectableCardButton
                active={false}
                label="Higher extension"
                description="Unselected cards can respond without shouting."
                icon="modules"
                statusLabel="Available"
              />
              <PricingOptionButton
                label="Unlock Volna"
                meta="Full course access and practice tools"
                badgeLabel="Best value"
                trailingLabel="Upgrade"
                recommended
              />
              <PricingOptionButton
                label="Current plan"
                meta="You already have access to this tier"
                trailingLabel="Active"
                state="owned"
              />
            </div>
          </ButtonExampleCard>
        </div>
      </UiLabSection>

      <UiLabSection
        id="project-examples"
        title="Project-specific examples"
        description="These are closer to how buttons could be used in GCSE Russian lessons, revision flows, and sales funnel moments."
      >
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <ButtonExampleCard title="Student dashboard">
            <div className="flex flex-wrap gap-3">
              <Button variant="soft" icon="next" iconPosition="right">
                Continue revision
              </Button>
              <Button variant="secondary" icon="preview">
                Open module
              </Button>
            </div>
          </ButtonExampleCard>

          <ButtonExampleCard title="Exam prep CTA">
            <div className="flex flex-wrap gap-3">
              <Button variant="accent" icon="create">
                Start mock exam
              </Button>
              <Button variant="quiet" icon="file">
                View tips
              </Button>
            </div>
          </ButtonExampleCard>

          <ButtonExampleCard title="Upgrade / funnel CTA">
            <div className="flex flex-wrap gap-3">
              <Button variant="inverse" icon="next" iconPosition="right">
                Unlock full course
              </Button>
              <Button variant="secondary">See pricing</Button>
            </div>
          </ButtonExampleCard>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Teen-friendly energy check"
        description="These combinations are slightly more expressive and motivational, but should still feel polished enough for the platform and parent-facing moments."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <ButtonExampleCard title="Momentum actions">
            <div className="flex flex-wrap gap-3">
              <Button variant="accent" icon="next" iconPosition="right">
                Keep the streak going
              </Button>
              <Button variant="soft" icon="completed">
                {"I'm ready"}
              </Button>
            </div>
          </ButtonExampleCard>

          <ButtonExampleCard title="Revision prompts">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" icon="create">
                Start vocab challenge
              </Button>
              <Button variant="secondary" icon="file">
                Review mistakes
              </Button>
            </div>
          </ButtonExampleCard>

          <ButtonExampleCard title="Upgrade moments">
            <div className="flex flex-wrap gap-3">
              <Button variant="inverse" icon="next" iconPosition="right">
                See full course path
              </Button>
              <Button variant="accent" icon="preview">
                Unlock premium tools
              </Button>
            </div>
          </ButtonExampleCard>
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
          "SplitButton for create-and-add-another admin flows.",
          "SegmentedControl for compact mode or variant switching.",
          "CommandButton for keyboard-aware editor actions.",
          "IconTooltipButton for dense builder and toolbar controls.",
          "ButtonGroup for grouped mutually related actions.",
        ]}
      />
    </>
  );
}

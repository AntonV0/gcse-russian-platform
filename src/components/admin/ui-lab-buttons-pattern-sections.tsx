import ButtonExampleCard from "@/components/admin/ui-lab-button-example-card";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabSection from "@/components/admin/ui-lab-section";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";

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
              <Button key="refresh" variant="quiet" size="sm" icon="refresh">
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
        description="These are common action combinations for create, edit, and settings forms. The primary action should remain visually clear."
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
              <Button variant="primary" icon="next" iconPosition="right">
                Upgrade plan
              </Button>
              <Button variant="quiet">Compare options</Button>
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

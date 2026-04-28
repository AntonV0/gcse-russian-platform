import ButtonExampleCard from "@/components/admin/ui-lab/buttons/ui-lab-button-example-card";
import UiLabSection from "@/components/admin/ui-lab/shell/ui-lab-section";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import LoadingButton from "@/components/ui/loading-button";

export default function UiLabButtonsStateSections() {
  return (
    <>
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
          <Button variant="exit" icon="userX">
            Log out
          </Button>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Student-friendly and promotional styles"
        description="These variants are useful for more energetic student-facing CTAs, progression moments, and upgrade prompts."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <ButtonExampleCard title="Lesson / learning actions">
            <div className="flex flex-wrap gap-3">
              <Button variant="soft" icon="next" iconPosition="right">
                Start lesson
              </Button>
              <Button variant="soft" icon="completed">
                Mark ready
              </Button>
            </div>
          </ButtonExampleCard>

          <ButtonExampleCard title="Motivational / highlight actions">
            <div className="flex flex-wrap gap-3">
              <Button variant="accent" icon="completed">
                Unlock next step
              </Button>
              <Button variant="accent" icon="create">
                Join revision sprint
              </Button>
            </div>
          </ButtonExampleCard>

          <ButtonExampleCard title="Hero / strong contrast actions">
            <div className="flex flex-wrap gap-3">
              <Button variant="inverse" icon="preview">
                View course path
              </Button>
              <Button variant="inverse" icon="next" iconPosition="right">
                Explore full access
              </Button>
            </div>
          </ButtonExampleCard>
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
              <Button variant="exit" icon="userX">
                Log out
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
          <Button variant="exit" size="sm" icon="userX" iconOnly ariaLabel="Log out" />
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
          <Button variant="exit" disabled icon="userX">
            Log out
          </Button>
        </div>
      </UiLabSection>

      <UiLabSection
        id="exit-loading"
        title="Exit and loading states"
        description="Logout should be noticeable without looking like account deletion. Pending examples show the current disabled-button pattern before a dedicated LoadingButton exists."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <ButtonExampleCard title="Account exit">
            <div className="flex flex-wrap gap-3">
              <Button variant="exit" icon="userX">
                Log out
              </Button>
              <Button variant="exit" size="sm" icon="userX">
                Log out
              </Button>
              <Button variant="secondary" size="sm" icon="settings">
                Account settings
              </Button>
            </div>
          </ButtonExampleCard>

          <ButtonExampleCard title="Pending actions">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" disabled icon="pending">
                Saving...
              </Button>
              <Button variant="secondary" disabled icon="pending">
                Loading preview...
              </Button>
              <Button variant="danger" disabled icon="pending">
                Deleting...
              </Button>
            </div>
          </ButtonExampleCard>

          <ButtonExampleCard title="Shared primitives">
            <form className="flex flex-wrap gap-3">
              <LoadingButton
                idleLabel="Save with LoadingButton"
                pendingLabel="Saving..."
                idleIcon="save"
                variant="primary"
              />
              <IconButton icon="settings" label="Shared icon settings" />
              <IconButton icon="search" label="Shared icon search" variant="quiet" />
            </form>
          </ButtonExampleCard>
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
    </>
  );
}

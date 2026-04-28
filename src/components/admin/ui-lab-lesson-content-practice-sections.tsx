import { LESSON_CONTENT_FUTURE_ITEMS } from "@/components/admin/ui-lab-lesson-content-data";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import VisualPlaceholder from "@/components/ui/visual-placeholder";

function DemoVisualStrategy() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
      <PageIntroPanel
        tone="student"
        headingLevel={3}
        eyebrow="Student visual slot"
        title="A calm visual can support page context"
        description="Intro visuals should reinforce the learning area, fit the theme tokens, and stay secondary to the title, badges, and actions."
        badges={
          <>
            <Badge tone="info" icon="image">
              Optional visual
            </Badge>
            <Badge tone="muted">No asset required yet</Badge>
          </>
        }
        visual={
          <VisualPlaceholder
            category="learningPath"
            size="wide"
            ariaLabel="Abstract learning path placeholder"
          />
        }
      />

      <div className="grid gap-4">
        <EmptyState
          title="Visual empty state"
          description="Use a neutral placeholder when an empty state needs warmth, but keep the action and explanation clear."
          visual={
            <VisualPlaceholder
              category="emptyState"
              ariaLabel="Neutral empty state placeholder"
            />
          }
        />

        <PanelCard
          title="Category placeholders"
          description="Reusable placeholders can stand in for future vocabulary, grammar, and topic images."
          tone="muted"
        >
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <VisualPlaceholder
              category="vocabulary"
              ariaLabel="Vocabulary placeholder"
              className="mx-auto"
            />
            <VisualPlaceholder
              category="grammar"
              ariaLabel="Grammar placeholder"
              className="mx-auto"
            />
            <VisualPlaceholder
              category="school"
              ariaLabel="School topic placeholder"
              className="mx-auto"
            />
          </div>
        </PanelCard>
      </div>
    </div>
  );
}

function DemoPracticeBlocks() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <PanelCard
        title="Short-answer prompt"
        description="Translate the sentence into Russian."
        tone="student"
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 text-sm text-[var(--text-primary)]">
            I like maths because it is useful.
          </div>
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-5 text-sm app-text-soft">
            Student answer area
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" icon="completed">
              Check answer
            </Button>
            <Button variant="secondary" icon="preview">
              Show hint
            </Button>
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="Feedback state"
        description="The answer has been checked and needs a correction."
        tone="muted"
      >
        <div className="space-y-4">
          <Badge tone="warning" icon="pending">
            Not quite
          </Badge>
          <Card>
            <CardBody className="p-4">
              <div className="font-semibold text-[var(--text-primary)]">
                Correct answer
              </div>
              <p className="mt-2 text-sm app-text-muted">
                ÐœÐ½Ðµ Ð½Ñ€Ð°Ð²Ð¸Ñ‚ÑÑ Ð¼Ð°Ñ‚ÐµÐ¼Ð°Ñ‚Ð¸ÐºÐ°, Ð¿Ð¾Ñ‚Ð¾Ð¼Ñƒ Ñ‡Ñ‚Ð¾ Ð¾Ð½Ð° Ð¿Ð¾Ð»ÐµÐ·Ð½Ð°Ñ.
              </p>
            </CardBody>
          </Card>
          <Button variant="soft" icon="refresh">
            Try another
          </Button>
        </div>
      </PanelCard>
    </div>
  );
}

function DemoProgressionStates() {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      <Card>
        <CardBody className="space-y-3 p-4">
          <Badge tone="success" icon="completed">
            Completed
          </Badge>
          <div className="font-semibold text-[var(--text-primary)]">
            Section 1 finished
          </div>
          <p className="text-sm app-text-muted">The learner can return anytime.</p>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-3 p-4">
          <Badge tone="info" icon="next">
            Current
          </Badge>
          <div className="font-semibold text-[var(--text-primary)]">Section 2 open</div>
          <p className="text-sm app-text-muted">This is the next recommended step.</p>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-3 p-4">
          <Badge tone="warning" icon="locked">
            Locked
          </Badge>
          <div className="font-semibold text-[var(--text-primary)]">
            Section 3 unavailable
          </div>
          <p className="text-sm app-text-muted">Visit the current section first.</p>
        </CardBody>
      </Card>

      <EmptyState
        icon="lessons"
        iconTone="brand"
        title="No progress yet"
        description="Open the first section to begin tracking lesson progress."
      />
    </div>
  );
}

export function UiLabLessonContentPracticeSections() {
  return (
    <>
      <UiLabSection
        id="visual-strategy"
        title="Visual strategy"
        description="Use visuals as learning support and orientation, not decoration. These placeholders reserve layout space before real GCSE Russian images are added."
      >
        <DemoVisualStrategy />
      </UiLabSection>

      <UiLabSection
        id="practice-blocks"
        title="Practice and question blocks"
        description="Practice states should clearly separate prompt, answer area, feedback, and next step."
      >
        <DemoPracticeBlocks />
      </UiLabSection>

      <UiLabSection
        id="progression"
        title="Progression and locked states"
        description="Lesson pages need clear signals for current, completed, unavailable, and no-progress states."
      >
        <DemoProgressionStates />
      </UiLabSection>

      <UiLabFutureSection items={LESSON_CONTENT_FUTURE_ITEMS} />
    </>
  );
}

import {
  FEEDBACK_FUTURE_ITEMS,
  FEEDBACK_GUIDANCE_ITEMS,
} from "@/components/admin/ui-lab/feedback/ui-lab-feedback-data";
import UiLabFutureSection from "@/components/admin/ui-lab/shell/ui-lab-future-section";
import UiLabSection from "@/components/admin/ui-lab/shell/ui-lab-section";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import StatusSummaryCard from "@/components/ui/status-summary-card";

function FeedbackGuidanceCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardBody className="p-4">
        <div className="mb-2 font-semibold text-[var(--text-primary)]">{title}</div>
        <p className="text-sm app-text-muted">{description}</p>
      </CardBody>
    </Card>
  );
}

function DemoEmptyStates() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-2">
        <EmptyState
          title="No modules yet"
          description="Create your first module to start structuring this course variant."
          icon="courses"
          action={
            <Button variant="primary" icon="create">
              Add module
            </Button>
          }
        />

        <EmptyState
          title="No assignments to review"
          description="Once students submit work, it will appear here for marking and feedback."
          icon="assignments"
          action={
            <Button variant="secondary" icon="search">
              View submissions
            </Button>
          }
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <EmptyState
          title="No vocabulary matches your search"
          description="Try a broader keyword, remove one of the active filters, or switch to another theme."
          icon="search"
          action={
            <Button variant="secondary" icon="refresh">
              Reset filters
            </Button>
          }
        />

        <EmptyState
          title="No uploaded work yet"
          description="Students can upload speaking recordings, written answers, and revision tasks here."
          icon="upload"
          action={
            <Button variant="soft" icon="next" iconPosition="right">
              View upload guide
            </Button>
          }
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <EmptyState
          title="Start your first lesson"
          description="There is no progress yet. Open a lesson to begin building your revision streak."
          icon="next"
          action={
            <Button variant="primary" icon="create">
              Begin revision
            </Button>
          }
        />

        <EmptyState
          title="Higher tier content locked"
          description="This section is available only to Higher students or users with upgraded access."
          icon="lock"
          action={
            <Button variant="accent" icon="next" iconPosition="right">
              Unlock access
            </Button>
          }
        />

        <EmptyState
          title="Could not load submissions"
          description="Something went wrong while loading this area. Try refreshing or come back in a moment."
          icon="alert"
          action={
            <Button variant="secondary" icon="refresh">
              Retry
            </Button>
          }
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <EmptyState
          title="No mock exams scheduled"
          description="Create a mock exam window to give students a timed practice session and markable submission flow."
          icon="calendar"
          action={
            <Button variant="primary" icon="create">
              Schedule mock exam
            </Button>
          }
        />

        <EmptyState
          title="No messages yet"
          description="Teacher notes, feedback updates, and revision reminders will appear here once the course is active."
          icon="chat"
          action={
            <Button variant="secondary" icon="info">
              How messaging works
            </Button>
          }
        />
      </div>
    </div>
  );
}

function DemoStatusSummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatusSummaryCard
        title="Publishing"
        description="Use when content is ready for students."
        badgeTone="info"
        badgeLabel="Published"
      />
      <StatusSummaryCard
        title="Progress"
        description="Use when work is still being built or reviewed."
        badgeTone="warning"
        badgeLabel="In progress"
      />
      <StatusSummaryCard
        title="Completion"
        description="Use when a workflow or task is fully done."
        badgeTone="success"
        badgeLabel="Complete"
      />
      <StatusSummaryCard
        title="Attention"
        description="Use sparingly for problems that block progress."
        badgeTone="danger"
        badgeLabel="Required"
      />
    </div>
  );
}

function DemoFeedbackJourneys() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="app-card p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone="warning" icon="pending">
            Waiting on submission
          </Badge>
          <Badge tone="info" icon="preview">
            Higher
          </Badge>
        </div>

        <FeedbackBanner
          tone="warning"
          title="Student action still needed"
          description="The speaking task has been opened, but the audio response has not been uploaded yet."
        >
          <div className="mt-3 flex flex-wrap gap-3">
            <Button variant="warning" icon="pending">
              Review task status
            </Button>
            <Button variant="secondary" icon="chat">
              Message student
            </Button>
          </div>
        </FeedbackBanner>
      </div>

      <div className="app-card p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone="success" icon="completed">
            Ready to unlock
          </Badge>
          <Badge tone="default" icon="courses">
            Full course
          </Badge>
        </div>

        <FeedbackBanner
          tone="success"
          title="Revision milestone reached"
          description="This learner has completed the current review cycle and can move on to the next module."
        >
          <div className="mt-3 flex flex-wrap gap-3">
            <Button variant="soft" icon="next" iconPosition="right">
              Open next module
            </Button>
            <Button variant="secondary" icon="preview">
              View progress
            </Button>
          </div>
        </FeedbackBanner>
      </div>
    </div>
  );
}

export function UiLabFeedbackEmptyGuidanceSections() {
  return (
    <>
      <UiLabSection
        id="empty-states"
        title="Empty states"
        description="Empty states should explain what is missing, why it matters, and what the next useful action is."
      >
        <DemoEmptyStates />
      </UiLabSection>

      <UiLabSection
        title="Status summary cards"
        description="Use these when a page needs more context than a badge alone can provide."
      >
        <DemoStatusSummaryCards />
      </UiLabSection>

      <UiLabSection
        title="Feedback journeys"
        description="These grouped examples combine banners, badges, and buttons into realistic flows that can be reused across admin and student-facing pages."
      >
        <DemoFeedbackJourneys />
      </UiLabSection>

      <UiLabSection
        title="Guidance"
        description="These rules keep feedback patterns consistent across admin and platform pages."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {FEEDBACK_GUIDANCE_ITEMS.map((item) => (
            <FeedbackGuidanceCard
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </UiLabSection>

      <UiLabFutureSection items={FEEDBACK_FUTURE_ITEMS} />
    </>
  );
}

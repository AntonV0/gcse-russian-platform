import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import AdminFeedbackBanner from "@/components/admin/admin-feedback-banner";
import QuestionFeedback from "@/components/questions/question-feedback";
import Badge from "@/components/ui/badge";
import EmptyState from "@/components/ui/empty-state";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import FeedbackBanner from "@/components/ui/feedback-banner";
import StatusBadge from "@/components/ui/status-badge";
import StatusSummaryCard from "@/components/ui/status-summary-card";

const pageNavItems = [
  { id: "badges", label: "Badges" },
  { id: "status-badges", label: "Status badges" },
  { id: "banners", label: "Banners" },
  { id: "admin-feedback", label: "Admin feedback" },
  { id: "question-feedback", label: "Question feedback" },
  { id: "empty-states", label: "Empty states" },
  { id: "future-components", label: "Future" },
];

const statusBadgeExamples: Array<{
  title: string;
  status: "not_started" | "submitted" | "reviewed" | "returned";
  description: string;
}> = [
  {
    title: "Not started",
    status: "not_started",
    description: "Default state before work begins.",
  },
  {
    title: "Submitted",
    status: "submitted",
    description: "Use for work waiting on review.",
  },
  {
    title: "Reviewed",
    status: "reviewed",
    description: "Use when a marking workflow is done.",
  },
  {
    title: "Returned",
    status: "returned",
    description: "Use when feedback has gone back to the student.",
  },
];

const feedbackGuidanceItems = [
  {
    title: "Prefer badges for compact state",
    description:
      "Use badges inside cards, tables, and list items where space is limited.",
  },
  {
    title: "Use banners for page-level messaging",
    description:
      "Save results, warnings, and important guidance should be easier to notice than a badge.",
  },
  {
    title: "Empty states need a next action",
    description: "Avoid dead ends. Give users a clear first step wherever possible.",
  },
  {
    title: "Reserve danger for real blockers",
    description:
      "Overusing destructive colour weakens hierarchy and makes interfaces feel noisy.",
  },
];

function StatusBadgeExampleCard({
  title,
  status,
  description,
}: {
  title: string;
  status: "not_started" | "submitted" | "reviewed" | "returned";
  description: string;
}) {
  return (
    <Card>
      <CardBody className="space-y-3 p-4">
        <div className="font-semibold text-[var(--text-primary)]">{title}</div>
        <StatusBadge status={status} />
        <p className="text-sm app-text-muted">{description}</p>
      </CardBody>
    </Card>
  );
}

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

export default async function AdminUiFeedbackPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Feedback"
      description="Compare badges, banners, alerts, empty states, and status messaging patterns used across the platform."
      currentPath="/admin/ui/feedback"
    >
      <UiLabPageNav items={pageNavItems} />

      <UiLabSection
        id="badges"
        title="Badge hierarchy"
        description="Use badges for compact state, metadata, and short semantic emphasis. They should feel more polished than plain labels, but less dominant than buttons."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="app-card p-4">
            <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              Core tones
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge tone="muted">Muted</Badge>
              <Badge tone="default">Default</Badge>
              <Badge tone="info">Info</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="warning">Warning</Badge>
              <Badge tone="danger">Danger</Badge>
            </div>
          </div>

          <div className="app-card p-4">
            <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              With icons
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge tone="muted" icon="file">
                Draft
              </Badge>
              <Badge tone="info" icon="preview">
                Published
              </Badge>
              <Badge tone="success" icon="completed">
                Complete
              </Badge>
              <Badge tone="warning" icon="pending">
                In progress
              </Badge>
              <Badge tone="danger" icon="warning">
                Needs attention
              </Badge>
              <Badge tone="default" icon="info">
                Selected
              </Badge>
            </div>
          </div>

          <div className="app-card p-4">
            <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              Real UI labels
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge tone="info" icon="preview">
                Higher only
              </Badge>
              <Badge tone="default" icon="courses">
                Theme 1
              </Badge>
              <Badge tone="muted" icon="file">
                6 blocks
              </Badge>
              <Badge tone="success" icon="completed">
                Marked
              </Badge>
            </div>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="High-emphasis badge usage"
        description="These examples show where badges should stand out more because they communicate access, urgency, or progression at a glance."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="app-card p-4">
            <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              Access + availability
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge tone="info" icon="preview">
                Trial access
              </Badge>
              <Badge tone="default" icon="courses">
                Foundation
              </Badge>
              <Badge tone="warning" icon="pending">
                Limited
              </Badge>
            </div>
          </div>

          <div className="app-card p-4">
            <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              Student progress moments
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge tone="success" icon="completed">
                Marked correct
              </Badge>
              <Badge tone="warning" icon="pending">
                Needs revision
              </Badge>
              <Badge tone="danger" icon="warning">
                Missing work
              </Badge>
            </div>
          </div>

          <div className="app-card p-4">
            <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              Publishing + workflow
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge tone="muted" icon="file">
                Draft
              </Badge>
              <Badge tone="info" icon="preview">
                Ready to publish
              </Badge>
              <Badge tone="success" icon="completed">
                Live now
              </Badge>
            </div>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        id="status-badges"
        title="Status badge mappings"
        description="Use StatusBadge where the underlying state is semantic and repeatable, so pages do not have to reimplement label and tone logic."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statusBadgeExamples.map((example) => (
            <StatusBadgeExampleCard
              key={example.status}
              title={example.title}
              status={example.status}
              description={example.description}
            />
          ))}
        </div>
      </UiLabSection>

      <UiLabSection
        title="Badges on darker surfaces"
        description="This section helps validate contrast when badges sit inside darker cards, dashboards, or high-emphasis surfaces."
      >
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(135deg,var(--dark-surface-elevated)_0%,var(--dark-surface-muted)_100%)] p-5 shadow-[0_14px_30px_rgba(16,32,51,0.22)]">
          <div className="mb-3 text-sm font-semibold text-white">
            Dark-surface badge check
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge tone="muted" icon="file">
              Draft
            </Badge>
            <Badge tone="default" icon="info">
              Selected
            </Badge>
            <Badge tone="info" icon="preview">
              Published
            </Badge>
            <Badge tone="success" icon="completed">
              Complete
            </Badge>
            <Badge tone="warning" icon="pending">
              Waiting
            </Badge>
            <Badge tone="danger" icon="warning">
              Blocked
            </Badge>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        id="banners"
        title="Banner patterns"
        description="Use banners for page-level feedback, save results, warnings, or important next-step guidance."
      >
        <div className="space-y-4">
          <FeedbackBanner
            tone="info"
            title="Informational update"
            description="This lesson is visible to Higher students only and includes shared sections linked by canonical key."
          />
          <FeedbackBanner
            tone="success"
            title="Changes saved"
            description="Your course settings were updated successfully and are now available across the platform."
          />
          <FeedbackBanner
            tone="warning"
            title="Still in progress"
            description="Some lesson sections are still unpublished, so students will not see them yet."
          />
          <FeedbackBanner
            tone="danger"
            title="Action needed"
            description="A required field is missing. Review the section metadata before publishing."
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Banner patterns with actions"
        description="Use these when the message should immediately guide the user toward the next step instead of just informing them."
      >
        <div className="space-y-4">
          <FeedbackBanner
            tone="info"
            title="Trial lesson available"
            description="This student can unlock the first lesson now and continue into the guided trial flow."
          >
            <div className="mt-3 flex flex-wrap gap-3">
              <Button variant="soft" icon="next" iconPosition="right">
                Open trial lesson
              </Button>
              <Button variant="secondary" icon="preview">
                Preview student view
              </Button>
            </div>
          </FeedbackBanner>

          <FeedbackBanner
            tone="warning"
            title="Mock exam still incomplete"
            description="One section has not been submitted yet, so final review cannot be started."
          >
            <div className="mt-3 flex flex-wrap gap-3">
              <Button variant="warning" icon="pending">
                Review missing section
              </Button>
              <Button variant="secondary" icon="back">
                Back to submissions
              </Button>
            </div>
          </FeedbackBanner>

          <FeedbackBanner
            tone="danger"
            title="Access required"
            description="This block is locked for the current plan and needs an upgraded course path to continue."
          >
            <div className="mt-3 flex flex-wrap gap-3">
              <Button variant="accent" icon="next" iconPosition="right">
                Unlock full course
              </Button>
              <Button variant="secondary" icon="preview">
                Compare access
              </Button>
            </div>
          </FeedbackBanner>
        </div>
      </UiLabSection>

      <UiLabSection
        id="admin-feedback"
        title="Admin feedback wrapper"
        description="Use AdminFeedbackBanner for quick success and error messaging in admin forms, edit screens, and save flows without reassembling banner styles each time."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="app-card p-4">
            <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              Success only
            </div>
            <AdminFeedbackBanner success="Course settings saved successfully." />
          </div>

          <div className="app-card p-4">
            <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              Error only
            </div>
            <AdminFeedbackBanner error="A required field is missing before this section can be published." />
          </div>

          <div className="app-card p-4">
            <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              Stacked feedback
            </div>
            <AdminFeedbackBanner
              success="Lesson draft saved."
              error="Audio file upload is still missing."
            />
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        id="question-feedback"
        title="Question feedback states"
        description="Question feedback is a different pattern from banners. Use it inside exercises and marked interactions to show outcome, correction, and explanation."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardBody className="space-y-4 p-4">
              <div>
                <div className="font-semibold text-[var(--text-primary)]">
                  Correct answer
                </div>
                <p className="mt-1 text-sm app-text-muted">
                  Simple success state after a correct response.
                </p>
              </div>

              <QuestionFeedback
                isCorrect
                statusLabel="Correct."
                explanation="Great job — this matches the expected answer and meaning."
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4 p-4">
              <div>
                <div className="font-semibold text-[var(--text-primary)]">
                  Incorrect with correction
                </div>
                <p className="mt-1 text-sm app-text-muted">
                  Use when the student needs the expected answer shown clearly.
                </p>
              </div>

              <QuestionFeedback
                isCorrect={false}
                statusLabel="Not quite."
                correctAnswerText="Я люблю читать."
                explanation="The verb and infinitive need to stay together in this phrase."
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4 p-4">
              <div>
                <div className="font-semibold text-[var(--text-primary)]">
                  Incorrect with accepted answers
                </div>
                <p className="mt-1 text-sm app-text-muted">
                  Useful when multiple valid phrasings are accepted.
                </p>
              </div>

              <QuestionFeedback
                isCorrect={false}
                statusLabel="Try again."
                correctAnswerText="в школе"
                acceptedAnswerTexts={["в школе", "на уроке"]}
                explanation="Both answers fit the context here, but your response did not match either accepted form."
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4 p-4">
              <div>
                <div className="font-semibold text-[var(--text-primary)]">
                  Minimal correct state
                </div>
                <p className="mt-1 text-sm app-text-muted">
                  A lighter success result when no extra explanation is needed.
                </p>
              </div>

              <QuestionFeedback isCorrect statusLabel="Well done." />
            </CardBody>
          </Card>
        </div>
      </UiLabSection>

      <UiLabSection
        id="empty-states"
        title="Empty states"
        description="Empty states should explain what is missing, why it matters, and what the next useful action is."
      >
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
      </UiLabSection>

      <UiLabSection
        title="Status summary cards"
        description="Use these when a page needs more context than a badge alone can provide."
      >
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
      </UiLabSection>

      <UiLabSection
        title="Feedback journeys"
        description="These grouped examples combine banners, badges, and buttons into realistic flows that can be reused across admin and student-facing pages."
      >
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
      </UiLabSection>

      <UiLabSection
        title="Guidance"
        description="These rules keep feedback patterns consistent across admin and platform pages."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {feedbackGuidanceItems.map((item) => (
            <FeedbackGuidanceCard
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </UiLabSection>

      <UiLabFutureSection
        items={[
          "Toast notifications for transient save and copy events.",
          "ConfirmDialog for destructive actions with richer context.",
          "InlineValidationSummary for long admin forms.",
          "LoadingState and Skeleton patterns for async lists and dashboards.",
          "ProgressAlert for unlock, completion, and next-step learning moments.",
          "ReviewOutcomeBanner for teacher marking and returned-work flows.",
        ]}
      />
    </UiLabShell>
  );
}

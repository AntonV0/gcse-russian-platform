import AdminFeedbackBanner from "@/components/admin/admin-feedback-banner";
import UiLabSection from "@/components/admin/ui-lab/shell/ui-lab-section";
import QuestionFeedback from "@/components/questions/question-feedback";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import FeedbackBanner from "@/components/ui/feedback-banner";

const CARD_TITLE_CLASS = "font-semibold text-[var(--text-primary)]";
const SECTION_HEADING_CLASS = "mb-3 text-sm font-semibold text-[var(--text-primary)]";

function DemoBanners() {
  return (
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
  );
}

function DemoActionBanners() {
  return (
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
  );
}

function DemoAdminFeedback() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="app-card p-4">
        <div className={SECTION_HEADING_CLASS}>Success only</div>
        <AdminFeedbackBanner success="Course settings saved successfully." />
      </div>

      <div className="app-card p-4">
        <div className={SECTION_HEADING_CLASS}>Error only</div>
        <AdminFeedbackBanner error="A required field is missing before this section can be published." />
      </div>

      <div className="app-card p-4">
        <div className={SECTION_HEADING_CLASS}>Stacked feedback</div>
        <AdminFeedbackBanner
          success="Lesson draft saved."
          error="Audio file upload is still missing."
        />
      </div>
    </div>
  );
}

function DemoQuestionFeedback() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardBody className="space-y-4 p-4">
          <div>
            <div className={CARD_TITLE_CLASS}>Correct answer</div>
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
            <div className={CARD_TITLE_CLASS}>Incorrect with correction</div>
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
            <div className={CARD_TITLE_CLASS}>Incorrect with accepted answers</div>
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
            <div className={CARD_TITLE_CLASS}>Minimal correct state</div>
            <p className="mt-1 text-sm app-text-muted">
              A lighter success result when no extra explanation is needed.
            </p>
          </div>

          <QuestionFeedback isCorrect statusLabel="Well done." />
        </CardBody>
      </Card>
    </div>
  );
}

export function UiLabFeedbackBannerQuestionSections() {
  return (
    <>
      <UiLabSection
        id="banners"
        title="Banner patterns"
        description="Use banners for page-level feedback, save results, warnings, or important next-step guidance."
      >
        <DemoBanners />
      </UiLabSection>

      <UiLabSection
        title="Banner patterns with actions"
        description="Use these when the message should immediately guide the user toward the next step instead of just informing them."
      >
        <DemoActionBanners />
      </UiLabSection>

      <UiLabSection
        id="admin-feedback"
        title="Admin feedback wrapper"
        description="Use AdminFeedbackBanner for quick success and error messaging in admin forms, edit screens, and save flows without reassembling banner styles each time."
      >
        <DemoAdminFeedback />
      </UiLabSection>

      <UiLabSection
        id="question-feedback"
        title="Question feedback states"
        description="Question feedback is a different pattern from banners. Use it inside exercises and marked interactions to show outcome, correction, and explanation."
      >
        <DemoQuestionFeedback />
      </UiLabSection>
    </>
  );
}

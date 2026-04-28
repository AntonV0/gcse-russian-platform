import {
  ADMIN_PATTERN_SIDEBAR_GUIDANCE,
  ADMIN_PATTERNS_FUTURE_ITEMS,
} from "@/components/admin/ui-lab-admin-patterns-data";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabSection from "@/components/admin/ui-lab-section";
import AdminQuestionForm from "@/components/admin/admin-question-form";
import AdminSidebar from "@/components/admin/admin-sidebar";
import Badge from "@/components/ui/badge";
import Card, { CardBody } from "@/components/ui/card";
import PanelCard from "@/components/ui/panel-card";

async function previewQuestionAction() {
  "use server";
}

function DemoQuestionAuthoring() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.75fr)]">
      <Card className="max-h-[720px] overflow-auto p-5">
        <AdminQuestionForm
          mode="edit"
          action={previewQuestionAction}
          questionSetId="ui-lab-question-set"
          questionId="ui-lab-question"
          submitLabel="Preview save"
          defaultValues={{
            questionType: "translation",
            answerStrategy: "text_input",
            prompt: "Translate: I study Russian because it is interesting.",
            explanation:
              "Use this field for concise answer guidance shown after marking.",
            marks: "2",
            position: "1",
            audioPath: "/audio/theme-1/school-routine.mp3",
            isActive: true,
            translationDirection: "to_russian",
            placeholder: "Type your Russian answer",
            sourceLanguageLabel: "English",
            targetLanguageLabel: "Russian",
            instruction: "Translate into Russian",
            ignorePunctuation: true,
            collapseWhitespace: true,
            acceptedAnswersText:
              "Ð¯ Ð¸Ð·ÑƒÑ‡Ð°ÑŽ Ñ€ÑƒÑÑÐºÐ¸Ð¹, Ð¿Ð¾Ñ‚Ð¾Ð¼Ñƒ Ñ‡Ñ‚Ð¾ ÑÑ‚Ð¾ Ð¸Ð½Ñ‚ÐµÑ€ÐµÑÐ½Ð¾.\nÐ¯ ÑƒÑ‡Ñƒ Ñ€ÑƒÑÑÐºÐ¸Ð¹, Ð¿Ð¾Ñ‚Ð¾Ð¼Ñƒ Ñ‡Ñ‚Ð¾ ÑÑ‚Ð¾ Ð¸Ð½Ñ‚ÐµÑ€ÐµÑÐ½Ð¾.",
            metadata: '{ "theme": "school", "skill": "translation" }',
          }}
        />
      </Card>

      <PanelCard
        title="Refactor note"
        description="This component is useful and current, but should be migrated onto the shared form primitives before it becomes a polished design-system example."
        tone="muted"
        density="compact"
      >
        <div className="space-y-3 text-sm app-text-muted">
          <p>
            Keep it visible in UI Lab so styling gaps are easy to inspect during the next
            admin form pass.
          </p>
          <p>
            Do not copy its raw input classes into new forms; prefer FormField, Input,
            Textarea, Select, CheckboxField, PanelCard, and SectionCard.
          </p>
          <Badge tone="warning">Existing component, not future potential</Badge>
        </div>
      </PanelCard>
    </div>
  );
}

function DemoAdminSidebar() {
  return (
    <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card className="h-[560px] overflow-hidden">
        <AdminSidebar />
      </Card>

      <PanelCard
        title="Sidebar guidance"
        description="Navigation should stay grouped by real work, not by implementation detail."
        contentClassName="space-y-3"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {ADMIN_PATTERN_SIDEBAR_GUIDANCE.map((item) => (
            <Card key={item}>
              <CardBody className="p-4 text-sm app-text-muted">{item}</CardBody>
            </Card>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}

function DemoOperationalExclusions() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardBody className="space-y-3 p-4">
          <Badge tone="info">App boundary</Badge>
          <div className="font-semibold text-[var(--text-primary)]">
            AdminRouteTracker
          </div>
          <p className="text-sm app-text-muted">
            Tracks admin navigation globally. It is already part of the admin shell
            behaviour and is not meaningful as a standalone visual component.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-3 p-4">
          <Badge tone="warning">Data-dependent</Badge>
          <div className="font-semibold text-[var(--text-primary)]">
            DebugBillingPanel
          </div>
          <p className="text-sm app-text-muted">
            Reads live billing and access data for a user. Keep it out of visual UI Lab
            examples to avoid slow, user-specific, or misleading snapshots.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

export function UiLabAdminPatternOperationalSections() {
  return (
    <>
      <UiLabSection
        id="question-authoring"
        title="Question authoring form"
        description="The existing AdminQuestionForm is shown here as a current admin component, but it should be treated as a refactor target because it still uses older raw field styling."
      >
        <DemoQuestionAuthoring />
      </UiLabSection>

      <UiLabSection
        id="admin-sidebar"
        title="Admin sidebar"
        description="The production sidebar is the source of truth for admin route grouping and UI Lab navigation."
      >
        <DemoAdminSidebar />
      </UiLabSection>

      <UiLabSection
        id="operational-exclusions"
        title="Operational components not visually showcased"
        description="These are current components, but they should remain documented separately from future components because rendering them in UI Lab would duplicate app boundaries or query live user data."
      >
        <DemoOperationalExclusions />
      </UiLabSection>

      <UiLabFutureSection items={ADMIN_PATTERNS_FUTURE_ITEMS} />
    </>
  );
}

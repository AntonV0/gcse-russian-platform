import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import AdminFeedbackBanner from "@/components/admin/admin-feedback-banner";
import AdminQuestionForm from "@/components/admin/admin-question-form";
import AdminSidebar from "@/components/admin/admin-sidebar";
import ContinueWhereLeftOffPanel from "@/components/admin/continue-where-left-off-panel";
import ExpandableAdminFormPanel from "@/components/admin/expandable-admin-form-panel";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import DangerZone from "@/components/ui/danger-zone";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import Textarea from "@/components/ui/textarea";

const pageNavItems = [
  { id: "dashboard-panels", label: "Dashboard panels" },
  { id: "expandable-forms", label: "Expandable forms" },
  { id: "feedback-confirmation", label: "Feedback + confirmation" },
  { id: "danger-zones", label: "Danger zones" },
  { id: "question-authoring", label: "Questions" },
  { id: "admin-sidebar", label: "Admin sidebar" },
  { id: "operational-exclusions", label: "Operational" },
  { id: "future-components", label: "Future" },
];

async function previewQuestionAction() {
  "use server";
}

export default async function AdminUiAdminPatternsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Admin Patterns"
      description="Reference patterns for CMS dashboards, expandable forms, destructive actions, confirmation buttons, and admin-only workflow utilities."
      currentPath="/admin/ui/admin-patterns"
    >
      <UiLabPageNav items={pageNavItems} />

      <UiLabSection
        id="dashboard-panels"
        title="Dashboard panels"
        description="Admin dashboards need dense but calm panels that help editors resume work quickly."
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="grid gap-4 md:grid-cols-3">
            <SummaryStatCard
              title="Draft lessons"
              value="7"
              icon="edit"
              tone="warning"
              description="Need review before students can see them."
              compact
            />
            <SummaryStatCard
              title="Question sets"
              value="42"
              icon="question"
              tone="brand"
              description="Available across practice flows."
              compact
            />
            <SummaryStatCard
              title="Open reviews"
              value="12"
              icon="pending"
              tone="danger"
              description="Teacher-facing submissions waiting."
              compact
            />
          </div>

          <ContinueWhereLeftOffPanel />
        </div>
      </UiLabSection>

      <UiLabSection
        id="expandable-forms"
        title="Expandable admin forms"
        description="Use this pattern when create forms should be available without dominating an index page."
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
          <ExpandableAdminFormPanel
            title="Add module"
            description="Create a new module inside the Higher course variant."
            collapsedDescription="Open this form only when you are ready to add a module."
            closedLabel="Add module"
            defaultOpen
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <FormField label="Module title" required>
                <Input defaultValue="Theme 3: School" />
              </FormField>
              <FormField label="Slug" required success="Slug format looks valid.">
                <Input defaultValue="theme-3-school" />
              </FormField>
            </div>

            <FormField label="Internal description">
              <Textarea
                rows={4}
                defaultValue="Core school vocabulary, opinions, routines, and exam-style practice."
              />
            </FormField>

            <InlineActions>
              <Button variant="primary" icon="create">
                Create module
              </Button>
              <Button variant="secondary" icon="preview">
                Preview structure
              </Button>
            </InlineActions>
          </ExpandableAdminFormPanel>

          <PanelCard
            title="When to use"
            description="Expandable forms should reduce clutter without hiding the primary path."
            tone="admin"
            contentClassName="space-y-3"
          >
            <p className="text-sm app-text-muted">
              Best for create panels on admin index and detail pages. Avoid using it for
              critical edit forms where users expect fields to be immediately visible.
            </p>
            <Badge tone="info">Index-page create pattern</Badge>
          </PanelCard>
        </div>
      </UiLabSection>

      <UiLabSection
        id="feedback-confirmation"
        title="Feedback and confirmation"
        description="Admin mutation flows need clear result feedback and explicit confirmation for high-impact actions."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <SectionCard
            title="Save feedback"
            description="Use AdminFeedbackBanner for ordinary admin success and error messages."
            tone="admin"
          >
            <div className="space-y-4">
              <AdminFeedbackBanner success="Lesson metadata saved successfully." />
              <AdminFeedbackBanner error="Canonical section key is already used in this variant." />
              <AdminFeedbackBanner
                success="Draft saved."
                error="Audio URL still needs checking before publishing."
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Confirm submit actions"
            description="Use confirmation buttons for destructive or high-impact form submissions."
            tone="muted"
          >
            <div className="space-y-4">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge tone="warning" icon="warning">
                    Browser confirm
                  </Badge>
                  <Badge tone="muted">Temporary pattern</Badge>
                </div>
                <p className="mb-4 text-sm app-text-muted">
                  Good enough for simple admin safeguards. Complex archive/delete flows
                  should eventually move to a custom confirm dialog.
                </p>
                <InlineActions>
                  <AdminConfirmButton confirmMessage="Archive this lesson?">
                    Archive lesson
                  </AdminConfirmButton>
                  <AdminConfirmButton
                    variant="warning"
                    icon="pending"
                    confirmMessage="Unpublish this section?"
                  >
                    Unpublish section
                  </AdminConfirmButton>
                </InlineActions>
              </div>
            </div>
          </SectionCard>
        </div>
      </UiLabSection>

      <UiLabSection
        id="danger-zones"
        title="Danger zones"
        description="Destructive actions should be visually separated from normal edit controls."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <DangerZone
            title="Archive module"
            description="Archive this module when it should no longer appear in course structure."
            action={
              <AdminConfirmButton confirmMessage="Archive this module?">
                Archive module
              </AdminConfirmButton>
            }
          >
            <p>
              Keep destructive copy short, specific, and connected to the exact object
              affected.
            </p>
          </DangerZone>

          <DangerZone
            title="Delete draft lesson"
            description="Only use this when the action cannot be safely represented as an ordinary edit."
            action={
              <Button variant="danger" icon="delete">
                Delete draft
              </Button>
            }
          />
        </div>
      </UiLabSection>

      <UiLabSection
        id="question-authoring"
        title="Question authoring form"
        description="The existing AdminQuestionForm is shown here as a current admin component, but it should be treated as a refactor target because it still uses older raw field styling."
      >
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
                  "Я изучаю русский, потому что это интересно.\nЯ учу русский, потому что это интересно.",
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
                Keep it visible in UI Lab so styling gaps are easy to inspect during the
                next admin form pass.
              </p>
              <p>
                Do not copy its raw input classes into new forms; prefer FormField, Input,
                Textarea, Select, CheckboxField, PanelCard, and SectionCard.
              </p>
              <Badge tone="warning">Existing component, not future potential</Badge>
            </div>
          </PanelCard>
        </div>
      </UiLabSection>

      <UiLabSection
        id="admin-sidebar"
        title="Admin sidebar"
        description="The production sidebar is the source of truth for admin route grouping and UI Lab navigation."
      >
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
              {[
                "Keep UI Lab visible as an internal design section.",
                "Keep content, questions, teaching, and users visually separated.",
                "Put logout and utility actions below the main work navigation.",
                "Use one active state per navigation family.",
              ].map((item) => (
                <Card key={item}>
                  <CardBody className="p-4 text-sm app-text-muted">{item}</CardBody>
                </Card>
              ))}
            </div>
          </PanelCard>
        </div>
      </UiLabSection>

      <UiLabSection
        id="operational-exclusions"
        title="Operational components not visually showcased"
        description="These are current components, but they should remain documented separately from future components because rendering them in UI Lab would duplicate app boundaries or query live user data."
      >
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
                Reads live billing and access data for a user. Keep it out of visual UI
                Lab examples to avoid slow, user-specific, or misleading snapshots.
              </p>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>

      <UiLabFutureSection
        items={[
          "ConfirmDialog for destructive flows that need richer explanation than browser confirm.",
          "InspectorPanel for recurring CMS metadata and settings sidebars.",
          "PublishStatusControl for draft, published, and unpublished admin states.",
          "MetadataGrid for dense but readable course, module, lesson, and user details.",
          "AuditTrailPanel for future admin history and moderation workflows.",
          "AdminEmptyWorkspace for first-run CMS areas with guided next actions.",
        ]}
      />
    </UiLabShell>
  );
}

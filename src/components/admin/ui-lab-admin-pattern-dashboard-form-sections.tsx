import UiLabSection from "@/components/admin/ui-lab-section";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import AdminFeedbackBanner from "@/components/admin/admin-feedback-banner";
import ContinueWhereLeftOffPanel from "@/components/admin/continue-where-left-off-panel";
import ExpandableAdminFormPanel from "@/components/admin/expandable-admin-form-panel";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DangerZone from "@/components/ui/danger-zone";
import FormField from "@/components/ui/form-field";
import InlineActions from "@/components/ui/inline-actions";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import Textarea from "@/components/ui/textarea";

function DemoDashboardPanels() {
  return (
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
  );
}

function DemoExpandableForms() {
  return (
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
  );
}

function DemoFeedbackAndConfirmation() {
  return (
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
              Good enough for simple admin safeguards. Complex archive/delete flows should
              eventually move to a custom confirm dialog.
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
  );
}

function DemoDangerZones() {
  return (
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
  );
}

export function UiLabAdminPatternDashboardFormSections() {
  return (
    <>
      <UiLabSection
        id="dashboard-panels"
        title="Dashboard panels"
        description="Admin dashboards need dense but calm panels that help editors resume work quickly."
      >
        <DemoDashboardPanels />
      </UiLabSection>

      <UiLabSection
        id="expandable-forms"
        title="Expandable admin forms"
        description="Use this pattern when create forms should be available without dominating an index page."
      >
        <DemoExpandableForms />
      </UiLabSection>

      <UiLabSection
        id="feedback-confirmation"
        title="Feedback and confirmation"
        description="Admin mutation flows need clear result feedback and explicit confirmation for high-impact actions."
      >
        <DemoFeedbackAndConfirmation />
      </UiLabSection>

      <UiLabSection
        id="danger-zones"
        title="Danger zones"
        description="Destructive actions should be visually separated from normal edit controls."
      >
        <DemoDangerZones />
      </UiLabSection>
    </>
  );
}

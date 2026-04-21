import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import CheckboxField from "@/components/ui/checkbox-field";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Card, { CardBody } from "@/components/ui/card";
import AppIcon from "@/components/ui/app-icon";

function DemoBasicFields() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FormField
        label="Course title"
        required
        description="Public-facing name students should see across dashboards and overview pages."
        hint="Keep it short, clear, and consistent with the landing site."
      >
        <Input placeholder="GCSE Russian" />
      </FormField>

      <FormField
        label="Slug"
        required
        description="Used in routing and internal linking."
        hint="Lowercase words with hyphens only."
      >
        <Input placeholder="gcse-russian" />
      </FormField>

      <FormField
        label="Variant"
        required
        description="Choose the product experience this content belongs to."
        hint="This should match the access-aware platform structure."
      >
        <Select defaultValue="higher">
          <option value="foundation">Foundation</option>
          <option value="higher">Higher</option>
          <option value="volna">Volna</option>
        </Select>
      </FormField>

      <FormField
        label="Teacher note"
        description="Optional staff-only guidance."
        hint="This is never shown to students."
      >
        <Input placeholder="Optional note for internal use" />
      </FormField>
    </div>
  );
}

function DemoLongText() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FormField
        label="Short description"
        description="Usually shown on overview pages and preview cards."
        hint="Aim for 1–3 sentences."
      >
        <Textarea
          rows={5}
          placeholder="Write a short summary that appears in previews and overview cards."
        />
      </FormField>

      <FormField
        label="Internal guidance"
        description="Useful for drafting notes and admin-only reminders."
        hint="This can be more practical and process-focused."
      >
        <Textarea
          rows={5}
          placeholder="Use this for admin-only notes, reminders, or drafting guidance."
        />
      </FormField>
    </div>
  );
}

function DemoChecks() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardBody className="space-y-3 p-4">
          <div className="font-semibold text-[var(--text-primary)]">Simple toggles</div>

          <CheckboxField
            name="active"
            label="Active"
            description="Makes the course visible in internal admin lists."
            defaultChecked
          />

          <CheckboxField
            name="published"
            label="Published"
            description="Students can access the content once visibility rules allow it."
          />

          <CheckboxField
            name="featured"
            label="Featured on dashboard"
            description="Use sparingly for highlighted student-facing items."
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-3 p-4">
          <div className="font-semibold text-[var(--text-primary)]">
            Recommended usage
          </div>

          <div className="space-y-2 text-sm app-text-muted">
            <p>
              Use checkboxes for binary settings that are easy to understand at a glance.
            </p>
            <p>Avoid stacking too many without grouping or section context.</p>
            <p>
              Pair publishing and visibility settings with short helper copy where needed.
            </p>
          </div>

          <div className="pt-2">
            <Badge tone="warning">Use grouped settings in real admin forms</Badge>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function DemoValidationStates() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardBody className="space-y-4 p-4">
          <div className="font-semibold text-[var(--text-primary)]">Default field</div>

          <FormField
            label="Normal state"
            hint="Default fields should feel calm, readable, and not over-styled."
          >
            <Input placeholder="Normal state" />
          </FormField>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4 p-4">
          <div className="font-semibold text-[var(--text-primary)]">Helpful guidance</div>

          <FormField label="Slug" success="Looks good — this format is valid.">
            <Input placeholder="gcse-russian-higher" defaultValue="gcse-russian-higher" />
          </FormField>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4 p-4">
          <div className="font-semibold text-[var(--text-primary)]">
            Error state example
          </div>

          <FormField
            label="Slug"
            error="Slug must use lowercase letters, numbers, and hyphens only."
          >
            <Input aria-invalid="true" defaultValue="Bad Slug!" />
          </FormField>
        </CardBody>
      </Card>
    </div>
  );
}

function DemoDenseInspector() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.9fr)]">
      <Card>
        <CardBody className="space-y-4">
          <div>
            <h3 className="app-card-title">Toolbar and filter controls</h3>
            <p className="app-card-desc">
              Useful for builder screens, lesson lists, and admin search panels.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_180px]">
            <FormField label="Search content">
              <Input placeholder="Search lessons, modules, or notes" />
            </FormField>

            <FormField label="Variant">
              <Select defaultValue="higher">
                <option value="all">All variants</option>
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
                <option value="volna">Volna</option>
              </Select>
            </FormField>

            <FormField label="Status">
              <Select defaultValue="draft">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="review">Needs review</option>
              </Select>
            </FormField>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button variant="secondary" icon="filter">
              Apply filters
            </Button>
            <Button variant="quiet" icon="refresh">
              Reset
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4">
          <div>
            <h3 className="app-card-title">Dense inspector controls</h3>
            <p className="app-card-desc">
              Better for side panels and compact edit contexts.
            </p>
          </div>

          <CheckboxField
            name="inspectorPublished"
            label="Published"
            description="Visible to students once released."
            defaultChecked
          />

          <CheckboxField
            name="inspectorLocked"
            label="Locked"
            description="Keep hidden until access or progress requirements are met."
          />

          <FormField label="Order">
            <Input placeholder="1" />
          </FormField>

          <FormField label="Block type">
            <Select defaultValue="content">
              <option value="content">content</option>
              <option value="practice">practice</option>
              <option value="summary">summary</option>
            </Select>
          </FormField>
        </CardBody>
      </Card>
    </div>
  );
}

function DemoFormLayouts() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.85fr)]">
      <Card>
        <CardBody className="space-y-4">
          <div>
            <h3 className="app-card-title">Standard edit form</h3>
            <p className="app-card-desc">
              Good for course, variant, module, and lesson edit pages.
            </p>
          </div>

          <DemoBasicFields />

          <FormField
            label="Description"
            description="Student-facing summary shown in key overview areas."
            hint="Keep this concise and skimmable."
          >
            <Textarea
              rows={5}
              placeholder="This form layout works well when editing one main entity at a time."
            />
          </FormField>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="primary" icon="completed">
              Save changes
            </Button>
            <Button variant="secondary" icon="back">
              Cancel
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4">
          <div>
            <h3 className="app-card-title">Sidebar settings panel</h3>
            <p className="app-card-desc">
              Useful for compact configuration or inspector-style editing.
            </p>
          </div>

          <CheckboxField
            name="publishedSidebar"
            label="Published"
            description="Makes this visible once routing and release conditions are met."
            defaultChecked
          />

          <CheckboxField
            name="lockedSidebar"
            label="Locked"
            description="Hide until the learner reaches the required step."
          />

          <FormField label="Position" hint="Use a simple numeric order value.">
            <Input placeholder="1" />
          </FormField>

          <FormField label="Kind" hint="Keep option labels short and scannable.">
            <Select defaultValue="content">
              <option value="content">content</option>
              <option value="practice">practice</option>
              <option value="summary">summary</option>
            </Select>
          </FormField>
        </CardBody>
      </Card>
    </div>
  );
}

function DemoDarkSurfaceFormCheck() {
  return (
    <div
      data-theme="dark"
      className="rounded-[1.75rem] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(135deg,#0b1a30_0%,#142742_100%)] p-5 shadow-[0_16px_34px_rgba(16,32,51,0.24)]"
    >
      <div className="mb-4">
        <div className="text-sm font-semibold text-white">Dark-surface form check</div>
        <p className="mt-1 text-sm text-[rgba(255,255,255,0.72)]">
          Validate contrast and clarity when forms appear inside stronger admin or premium
          surfaces.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <FormField
          label="Lesson title"
          hint="This should remain easy to read against dark emphasis surfaces."
        >
          <Input placeholder="Speaking exam prep" />
        </FormField>

        <FormField label="Status" success="Selected status is valid for this workflow.">
          <Select defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="review">In review</option>
            <option value="published">Published</option>
          </Select>
        </FormField>
      </div>
    </div>
  );
}

export default async function AdminUiFormsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Forms"
      description="Compare field styles, validation cues, grouped layouts, and patterns used across admin editing screens."
      currentPath="/admin/ui/forms"
    >
      <UiLabSection
        title="Field basics"
        description="These are the default input patterns the platform should reuse across edit pages and internal tools."
      >
        <DemoBasicFields />
      </UiLabSection>

      <UiLabSection
        title="Long-form content"
        description="Use textareas for descriptions, notes, and instructional content where structure matters."
      >
        <DemoLongText />
      </UiLabSection>

      <UiLabSection
        title="Checkbox and settings patterns"
        description="Keep binary settings grouped and easy to scan."
      >
        <DemoChecks />
      </UiLabSection>

      <UiLabSection
        title="Validation and helper states"
        description="Use helper text and error text consistently so forms feel trustworthy and easy to use."
      >
        <DemoValidationStates />
      </UiLabSection>

      <UiLabSection
        title="Dense admin controls"
        description="These patterns are useful for filters, inspector sidebars, and compact builder interfaces."
      >
        <DemoDenseInspector />
      </UiLabSection>

      <UiLabSection
        title="Layout examples"
        description="These are the two most common form layouts likely to appear across admin content and builder screens."
      >
        <DemoFormLayouts />
      </UiLabSection>

      <UiLabSection
        title="Dark-surface contrast check"
        description="This section helps validate that fields still feel clean and readable in stronger emphasis areas."
      >
        <DemoDarkSurfaceFormCheck />
      </UiLabSection>

      <UiLabSection
        title="Readiness"
        description="A quick summary of what is already strong and what still needs more refinement."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardBody className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand-blue-soft)] text-[var(--brand-blue)]">
                  <AppIcon icon="completed" size={16} />
                </span>
                <div className="font-semibold text-[var(--text-primary)]">
                  Strong already
                </div>
              </div>

              <div className="space-y-1 text-sm app-text-muted">
                <p>Inputs and textareas</p>
                <p>Checkbox fields</p>
                <p>Basic edit-form layout</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-2">
                <Badge tone="warning">Needs refinement</Badge>
              </div>

              <div className="space-y-1 text-sm app-text-muted">
                <p>Grouped section wrappers</p>
                <p>Inline validation density</p>
                <p>Advanced form flows</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-2">
                <Badge tone="muted">Future additions</Badge>
              </div>

              <div className="space-y-1 text-sm app-text-muted">
                <p>Autosave indicators</p>
                <p>Radio groups and toggles</p>
                <p>Form-specific empty states</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}

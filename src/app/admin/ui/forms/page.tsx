import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
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

const pageNavItems = [
  { id: "field-basics", label: "Field basics" },
  { id: "validation", label: "Validation" },
  { id: "dense-controls", label: "Dense controls" },
  { id: "builder-rows", label: "Builder rows" },
  { id: "sectioned-form", label: "Sectioned form" },
  { id: "states", label: "States" },
  { id: "future-components", label: "Future" },
];

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

function DemoBuilderRows() {
  return (
    <div className="space-y-4">
      <Card>
        <CardBody className="space-y-4">
          <div>
            <h3 className="app-card-title">Lesson-builder row pattern</h3>
            <p className="app-card-desc">
              Useful for repeatable content rows where structure, order, and status need
              to be visible at once.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_180px_120px]">
            <FormField label="Block title">
              <Input defaultValue="Speaking starter task" />
            </FormField>

            <FormField label="Type">
              <Select defaultValue="practice">
                <option value="content">content</option>
                <option value="practice">practice</option>
                <option value="summary">summary</option>
              </Select>
            </FormField>

            <FormField label="Order">
              <Input defaultValue="3" />
            </FormField>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(240px,0.8fr)]">
            <CheckboxField
              name="builderPublished"
              label="Published"
              description="Visible once this lesson version is released."
              defaultChecked
            />

            <div className="flex flex-wrap items-end gap-3 xl:justify-end">
              <Button variant="secondary" size="sm" icon="preview">
                Preview
              </Button>
              <Button variant="quiet" size="sm" icon="edit">
                Duplicate
              </Button>
              <Button variant="danger" size="sm" icon="delete">
                Remove row
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4">
          <div>
            <h3 className="app-card-title">Compact table-toolbar filter row</h3>
            <p className="app-card-desc">
              A denser version for list screens where filters need to sit above results.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
            <Input placeholder="Search by title or slug" />

            <Select defaultValue="all-variants">
              <option value="all-variants">All variants</option>
              <option value="foundation">Foundation</option>
              <option value="higher">Higher</option>
              <option value="volna">Volna</option>
            </Select>

            <Select defaultValue="all-statuses">
              <option value="all-statuses">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="review">Needs review</option>
            </Select>

            <div className="flex gap-3">
              <Button variant="secondary" icon="filter">
                Filter
              </Button>
              <Button variant="quiet" icon="refresh">
                Reset
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function DemoStateVariants() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardBody className="space-y-4">
          <div>
            <h3 className="app-card-title">Disabled and read-only states</h3>
            <p className="app-card-desc">
              These help verify that unavailable controls still feel intentional rather
              than broken.
            </p>
          </div>

          <div className="grid gap-4">
            <FormField
              label="Read-only slug"
              hint="Useful when the field is generated elsewhere but still needs to be visible."
            >
              <Input value="gcse-russian-higher" readOnly />
            </FormField>

            <FormField
              label="Locked variant"
              hint="Disabled controls should still remain readable."
            >
              <Select disabled defaultValue="higher">
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
                <option value="volna">Volna</option>
              </Select>
            </FormField>

            <CheckboxField
              name="disabledPublished"
              label="Published"
              description="Temporarily unavailable because release permissions are restricted."
              disabled
              defaultChecked
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4">
          <div>
            <h3 className="app-card-title">Action and save states</h3>
            <p className="app-card-desc">
              Good forms also need a clear action hierarchy when saving, cancelling, or
              deleting.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/45 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="info" icon="save">
                Draft open
              </Badge>
              <Badge tone="warning" icon="pending">
                Unsaved changes
              </Badge>
            </div>

            <p className="text-sm app-text-muted">
              Use this when the user has made edits but has not saved them yet.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button variant="primary" icon="completed">
                Save changes
              </Button>
              <Button variant="soft" icon="save">
                Save draft
              </Button>
              <Button variant="secondary" icon="back">
                Cancel
              </Button>
              <Button variant="danger" icon="delete">
                Delete
              </Button>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/45 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="success" icon="completed">
                Saved
              </Badge>
            </div>

            <p className="text-sm app-text-muted">
              A quieter state once the save action is complete.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button variant="primary" disabled icon="pending">
                Saving...
              </Button>
              <Button variant="quiet" icon="preview">
                Preview
              </Button>
            </div>
          </div>
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

function DemoSectionedEditForm() {
  return (
    <Card>
      <CardBody className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="app-card-title">Sectioned content editor</h3>
            <p className="app-card-desc">
              A more realistic admin form where content details, access rules, and
              internal notes are grouped into clear sections.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge tone="info" icon="preview">
              Higher only
            </Badge>
            <Badge tone="warning" icon="pending">
              Draft
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.85fr)]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/35 p-4">
              <div className="mb-4">
                <div className="font-semibold text-[var(--text-primary)]">
                  Content details
                </div>
                <p className="mt-1 text-sm app-text-muted">
                  Core student-facing information for the lesson or module.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <FormField label="Title" required>
                  <Input defaultValue="Speaking exam introduction" />
                </FormField>

                <FormField label="Slug" required success="Valid slug format.">
                  <Input defaultValue="speaking-exam-introduction" />
                </FormField>
              </div>

              <div className="mt-4">
                <FormField
                  label="Summary"
                  hint="Used on preview cards and overview screens."
                >
                  <Textarea
                    rows={4}
                    defaultValue="A short orientation lesson introducing the structure and expectations of the GCSE Russian speaking exam."
                  />
                </FormField>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/35 p-4">
              <div className="mb-4">
                <div className="font-semibold text-[var(--text-primary)]">
                  Internal notes
                </div>
                <p className="mt-1 text-sm app-text-muted">
                  Staff-facing details that help with editing, moderation, or teaching.
                </p>
              </div>

              <FormField label="Teacher guidance" hint="Not visible to students.">
                <Textarea
                  rows={4}
                  defaultValue="Use this lesson before the first assessed speaking practice. Follow up with a timed response task."
                />
              </FormField>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/35 p-4">
              <div className="mb-4">
                <div className="font-semibold text-[var(--text-primary)]">
                  Visibility and access
                </div>
                <p className="mt-1 text-sm app-text-muted">
                  Controls for release status and learner access.
                </p>
              </div>

              <div className="space-y-4">
                <FormField label="Variant">
                  <Select defaultValue="higher">
                    <option value="foundation">Foundation</option>
                    <option value="higher">Higher</option>
                    <option value="volna">Volna</option>
                  </Select>
                </FormField>

                <FormField label="Status">
                  <Select defaultValue="draft">
                    <option value="draft">Draft</option>
                    <option value="review">In review</option>
                    <option value="published">Published</option>
                  </Select>
                </FormField>

                <CheckboxField
                  name="sectionedPublished"
                  label="Published"
                  description="Visible once release conditions are met."
                />

                <CheckboxField
                  name="sectionedLocked"
                  label="Locked behind access"
                  description="Show upgrade or progression gating where relevant."
                  defaultChecked
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/35 p-4">
              <div className="mb-4">
                <div className="font-semibold text-[var(--text-primary)]">Action row</div>
                <p className="mt-1 text-sm app-text-muted">
                  Keep the primary action obvious, with supportive and destructive actions
                  clearly separated.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="primary" icon="completed">
                  Save lesson
                </Button>
                <Button variant="soft" icon="save">
                  Save draft
                </Button>
                <Button variant="secondary" icon="preview">
                  Preview
                </Button>
                <Button variant="danger" icon="delete">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
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

        <FormField
          label="Internal guidance"
          hint="Dark surfaces should still support longer text comfortably."
        >
          <Textarea
            rows={4}
            placeholder="Add internal guidance for teachers or editors."
          />
        </FormField>

        <div className="space-y-3 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4">
          <div className="text-sm font-semibold text-white">Settings on dark surface</div>

          <CheckboxField
            name="darkPublished"
            label="Published"
            description="Should still feel readable and properly separated."
            defaultChecked
          />

          <CheckboxField
            name="darkLocked"
            label="Locked"
            description="Use when access or progression gating applies."
          />
        </div>
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
      <UiLabPageNav items={pageNavItems} />

      <UiLabSection
        id="field-basics"
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
        id="validation"
        title="Validation and helper states"
        description="Use helper text and error text consistently so forms feel trustworthy and easy to use."
      >
        <DemoValidationStates />
      </UiLabSection>

      <UiLabSection
        id="dense-controls"
        title="Dense admin controls"
        description="These patterns are useful for filters, inspector sidebars, and compact builder interfaces."
      >
        <DemoDenseInspector />
      </UiLabSection>

      <UiLabSection
        id="builder-rows"
        title="Builder row patterns"
        description="These patterns help you test repeatable lesson-builder and list-toolbar rows before applying them across real admin screens."
      >
        <DemoBuilderRows />
      </UiLabSection>

      <UiLabSection
        title="Layout examples"
        description="These are the two most common form layouts likely to appear across admin content and builder screens."
      >
        <DemoFormLayouts />
      </UiLabSection>

      <UiLabSection
        id="sectioned-form"
        title="Sectioned real-world form"
        description="This is a closer representation of a full admin editing screen, where multiple kinds of content and settings need to work together."
      >
        <DemoSectionedEditForm />
      </UiLabSection>

      <UiLabSection
        id="states"
        title="Disabled, read-only, and save states"
        description="A polished form system also needs clear inactive, protected, and in-progress states."
      >
        <DemoStateVariants />
      </UiLabSection>

      <UiLabSection
        title="Dark-surface contrast check"
        description="This section helps validate that fields still feel clean and readable in stronger emphasis areas."
      >
        <DemoDarkSurfaceFormCheck />
      </UiLabSection>

      <UiLabSection
        title="Usage guidance"
        description="These rules help keep the form system consistent as you reuse it across admin pages, builders, and future platform flows."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardBody className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand-blue-soft)] text-[var(--brand-blue)]">
                  <AppIcon icon="completed" size={16} />
                </span>
                <div className="font-semibold text-[var(--text-primary)]">
                  Reuse shared fields first
                </div>
              </div>

              <div className="space-y-1 text-sm app-text-muted">
                <p>Keep spacing and labels consistent.</p>
                <p>Do not rebuild raw field styles page by page.</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-2">
                <Badge tone="warning">Validation matters</Badge>
              </div>

              <div className="space-y-1 text-sm app-text-muted">
                <p>Helper, success, and error messaging should feel related.</p>
                <p>Do not mix different validation styles across screens.</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-2">
                <Badge tone="info">Use grouped sections</Badge>
              </div>

              <div className="space-y-1 text-sm app-text-muted">
                <p>Large edit pages should separate content, access, and notes.</p>
                <p>This keeps longer forms easier to scan.</p>
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

      <UiLabFutureSection
        items={[
          "RadioGroupField for tier, plan, and visibility choices.",
          "ToggleField for binary settings that need switch-style affordance.",
          "FileUploadField for images, audio, and assignment submissions.",
          "DateTimeField for assignments, exam windows, and scheduling.",
          "FormValidationSummary for large admin edit screens.",
          "AutosaveStatus for future lesson-builder editing flows.",
        ]}
      />
    </UiLabShell>
  );
}

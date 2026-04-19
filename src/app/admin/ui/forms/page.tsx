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
import { appIcons } from "@/lib/shared/icons";

function DemoBasicFields() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FormField label="Course title">
        <Input placeholder="GCSE Russian" />
      </FormField>

      <FormField label="Slug">
        <Input placeholder="gcse-russian" />
      </FormField>

      <FormField label="Variant">
        <Select defaultValue="higher">
          <option value="foundation">Foundation</option>
          <option value="higher">Higher</option>
          <option value="volna">Volna</option>
        </Select>
      </FormField>

      <FormField label="Teacher note">
        <Input placeholder="Optional note for internal use" />
      </FormField>
    </div>
  );
}

function DemoLongText() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FormField label="Short description">
        <Textarea
          rows={4}
          placeholder="Write a short summary that appears in previews and overview cards."
        />
      </FormField>

      <FormField label="Internal guidance">
        <Textarea
          rows={4}
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
          <CheckboxField name="active" label="Active" defaultChecked />
          <CheckboxField name="published" label="Published" />
          <CheckboxField name="featured" label="Featured on dashboard" />
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
        </CardBody>
      </Card>
    </div>
  );
}

function DemoValidationStates() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardBody className="space-y-3 p-4">
          <div className="font-semibold text-[var(--text-primary)]">Default field</div>
          <Input placeholder="Normal state" />
          <p className="text-sm app-text-muted">
            Default fields should feel calm, readable, and not over-styled.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-3 p-4">
          <div className="font-semibold text-[var(--text-primary)]">Helpful guidance</div>
          <Input placeholder="With helper context" />
          <p className="text-sm text-[var(--brand-blue)]">
            Use lowercase slugs with hyphens only.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-3 p-4">
          <div className="font-semibold text-[var(--text-primary)]">
            Error state example
          </div>
          <input
            defaultValue="Bad Slug!"
            className="w-full rounded-xl border border-[var(--danger)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
          />
          <p className="text-sm text-[var(--danger)]">
            Slug must use lowercase letters, numbers, and hyphens only.
          </p>
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

          <FormField label="Description">
            <Textarea
              rows={5}
              placeholder="This form layout works well when editing one main entity at a time."
            />
          </FormField>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="primary" icon={appIcons.completed}>
              Save changes
            </Button>
            <Button variant="secondary" icon={appIcons.back}>
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

          <CheckboxField name="publishedSidebar" label="Published" defaultChecked />
          <CheckboxField name="lockedSidebar" label="Locked" />
          <FormField label="Position">
            <Input placeholder="1" />
          </FormField>
          <FormField label="Kind">
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
        title="Layout examples"
        description="These are the two most common form layouts likely to appear across admin content and builder screens."
      >
        <DemoFormLayouts />
      </UiLabSection>

      <UiLabSection
        title="Readiness"
        description="A quick summary of what is already strong and what still needs more refinement."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardBody className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <AppIconOrFallback />
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
                <p>Helper and validation consistency</p>
                <p>Grouped form section titles</p>
                <p>Dense inspector controls</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-2">
                <Badge tone="muted">Future additions</Badge>
              </div>
              <div className="space-y-1 text-sm app-text-muted">
                <p>Inline errors and success states</p>
                <p>Autosave indicators</p>
                <p>Form-specific empty states</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}

function AppIconOrFallback() {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-blue-soft)] text-[var(--brand-blue)]">
      ✓
    </span>
  );
}

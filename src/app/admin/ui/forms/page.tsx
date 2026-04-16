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
      <div className="app-card p-4 space-y-3">
        <div className="font-semibold">Simple toggles</div>
        <CheckboxField name="active" label="Active" defaultChecked />
        <CheckboxField name="published" label="Published" />
        <CheckboxField name="featured" label="Featured on dashboard" />
      </div>

      <div className="app-card p-4 space-y-3">
        <div className="font-semibold">Recommended usage</div>
        <div className="space-y-2 text-sm app-text-muted">
          <p>
            Use checkboxes for binary settings that are easy to understand at a glance.
          </p>
          <p>Avoid stacking too many without grouping or section context.</p>
          <p>
            Pair publishing and visibility settings with short helper copy where needed.
          </p>
        </div>
      </div>
    </div>
  );
}

function DemoValidationStates() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="app-card p-4 space-y-3">
        <div className="font-semibold">Default field</div>
        <Input placeholder="Normal state" />
        <p className="text-sm app-text-muted">
          Default fields should feel calm, readable, and not over-styled.
        </p>
      </div>

      <div className="app-card p-4 space-y-3">
        <div className="font-semibold">Helpful guidance</div>
        <Input placeholder="With helper context" />
        <p className="text-sm text-[var(--brand-blue)]">
          Use lowercase slugs with hyphens only.
        </p>
      </div>

      <div className="app-card p-4 space-y-3">
        <div className="font-semibold">Error state example</div>
        <input
          defaultValue="Bad Slug!"
          className="w-full rounded-xl border border-[var(--danger)] px-3 py-2 text-sm outline-none"
        />
        <p className="text-sm text-[var(--danger)]">
          Slug must use lowercase letters, numbers, and hyphens only.
        </p>
      </div>
    </div>
  );
}

function DemoFormLayouts() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.85fr)]">
      <div className="app-card p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">Standard edit form</h3>
          <p className="mt-1 text-sm app-text-muted">
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
      </div>

      <div className="app-card p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">
            Sidebar settings panel
          </h3>
          <p className="mt-1 text-sm app-text-muted">
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
          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIconOrFallback />
              <div className="font-semibold">Strong already</div>
            </div>
            <div className="space-y-1 text-sm app-text-muted">
              <p>Inputs and textareas</p>
              <p>Checkbox fields</p>
              <p>Basic edit-form layout</p>
            </div>
          </div>

          <div className="app-card p-4">
            <div className="mb-2">
              <Badge tone="warning">Needs refinement</Badge>
            </div>
            <div className="space-y-1 text-sm app-text-muted">
              <p>Helper and validation consistency</p>
              <p>Grouped form section titles</p>
              <p>Dense inspector controls</p>
            </div>
          </div>

          <div className="app-card p-4">
            <div className="mb-2">
              <Badge tone="muted">Future additions</Badge>
            </div>
            <div className="space-y-1 text-sm app-text-muted">
              <p>Inline errors and success states</p>
              <p>Autosave indicators</p>
              <p>Form-specific empty states</p>
            </div>
          </div>
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}

/**
 * Small local helper so the readiness section has a visual cue
 * without adding unnecessary complexity to the rest of the page.
 */
function AppIconOrFallback() {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-blue-soft)] text-[var(--brand-blue)]">
      ✓
    </span>
  );
}

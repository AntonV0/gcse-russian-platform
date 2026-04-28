import {
  COURSE_VARIANT_OPTIONS,
} from "@/components/admin/ui-lab-forms-data";
import { UiLabFormsSelectOptions } from "@/components/admin/ui-lab-forms-select-options";
import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import Card, { CardBody } from "@/components/ui/card";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";

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
          <UiLabFormsSelectOptions options={COURSE_VARIANT_OPTIONS} />
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

export function UiLabFormsFieldSections() {
  return (
    <>
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
    </>
  );
}

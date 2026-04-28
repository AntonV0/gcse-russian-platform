import {
  BLOCK_TYPE_OPTIONS,
  COURSE_VARIANT_OPTIONS,
  SECTIONED_STATUS_OPTIONS,
} from "@/components/admin/ui-lab/forms/ui-lab-forms-data";
import { UiLabFormsSelectOptions } from "@/components/admin/ui-lab/forms/ui-lab-forms-select-options";
import UiLabSection from "@/components/admin/ui-lab/shell/ui-lab-section";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";

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

          <div className="app-mobile-action-stack flex flex-wrap gap-3 pt-2">
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
              <UiLabFormsSelectOptions options={BLOCK_TYPE_OPTIONS} />
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
                    <UiLabFormsSelectOptions options={COURSE_VARIANT_OPTIONS} />
                  </Select>
                </FormField>

                <FormField label="Status">
                  <Select defaultValue="draft">
                    <UiLabFormsSelectOptions options={SECTIONED_STATUS_OPTIONS} />
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

              <div className="app-mobile-action-stack flex flex-wrap gap-3">
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
      className="rounded-[1.75rem] border border-[var(--border)] bg-[linear-gradient(135deg,var(--dark-surface-elevated)_0%,var(--dark-surface-muted)_100%)] p-5 shadow-[0_16px_34px_rgba(16,32,51,0.24)]"
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
            <UiLabFormsSelectOptions options={SECTIONED_STATUS_OPTIONS} />
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

export function UiLabFormsLayoutSections() {
  return (
    <>
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
        title="Dark-surface contrast check"
        description="This section helps validate that fields still feel clean and readable in stronger emphasis areas."
      >
        <DemoDarkSurfaceFormCheck />
      </UiLabSection>
    </>
  );
}

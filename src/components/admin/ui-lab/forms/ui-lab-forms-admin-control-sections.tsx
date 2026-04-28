import {
  ALL_STATUS_FILTER_OPTIONS,
  ALL_VARIANT_FILTER_OPTIONS,
  BLOCK_TYPE_OPTIONS,
  CONTENT_STATUS_OPTIONS,
  COURSE_VARIANT_OPTIONS,
  VARIANT_FILTER_OPTIONS,
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
                <UiLabFormsSelectOptions options={VARIANT_FILTER_OPTIONS} />
              </Select>
            </FormField>

            <FormField label="Status">
              <Select defaultValue="draft">
                <UiLabFormsSelectOptions options={CONTENT_STATUS_OPTIONS} />
              </Select>
            </FormField>
          </div>

          <div className="app-mobile-action-stack flex flex-wrap gap-3 pt-1">
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
              <UiLabFormsSelectOptions options={BLOCK_TYPE_OPTIONS} />
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
                <UiLabFormsSelectOptions options={BLOCK_TYPE_OPTIONS} />
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

            <div className="app-mobile-action-stack flex flex-wrap items-end gap-3 xl:justify-end">
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
              <UiLabFormsSelectOptions options={ALL_VARIANT_FILTER_OPTIONS} />
            </Select>

            <Select defaultValue="all-statuses">
              <UiLabFormsSelectOptions options={ALL_STATUS_FILTER_OPTIONS} />
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
                <UiLabFormsSelectOptions options={COURSE_VARIANT_OPTIONS} />
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

            <div className="app-mobile-action-stack flex flex-wrap gap-3 pt-1">
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

            <div className="app-mobile-action-stack flex flex-wrap gap-3 pt-1">
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

export function UiLabFormsAdminControlSections() {
  return (
    <>
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
        id="states"
        title="Disabled, read-only, and save states"
        description="A polished form system also needs clear inactive, protected, and in-progress states."
      >
        <DemoStateVariants />
      </UiLabSection>
    </>
  );
}

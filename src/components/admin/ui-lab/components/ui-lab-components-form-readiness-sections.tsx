import { COMPONENTS_FUTURE_ITEMS } from "@/components/admin/ui-lab/components/ui-lab-components-data";
import UiLabFutureSection from "@/components/admin/ui-lab/shell/ui-lab-future-section";
import UiLabSection from "@/components/admin/ui-lab/shell/ui-lab-section";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import InlineActions from "@/components/ui/inline-actions";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";

function DemoForms() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.85fr)]">
      <div className="app-card p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">Standard edit form</h3>
          <p className="mt-1 text-sm app-text-muted">
            Works well for courses, variants, modules, and lesson settings.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <FormField label="Title">
            <Input placeholder="GCSE Russian" />
          </FormField>

          <FormField label="Slug">
            <Input placeholder="gcse-russian" />
          </FormField>
        </div>

        <FormField label="Description">
          <Textarea
            rows={4}
            placeholder="Write a short description for cards, previews, and page headers."
          />
        </FormField>

        <div className="grid gap-4 lg:grid-cols-2">
          <FormField label="Variant">
            <Select defaultValue="higher">
              <option value="foundation">Foundation</option>
              <option value="higher">Higher</option>
              <option value="volna">Volna</option>
            </Select>
          </FormField>

          <FormField label="Theme">
            <Input placeholder="Theme 1: Identity and culture" />
          </FormField>
        </div>

        <div className="flex flex-wrap gap-4">
          <CheckboxField name="active" label="Active" defaultChecked />
          <CheckboxField name="published" label="Published" />
        </div>

        <InlineActions>
          <Button variant="primary" icon="completed">
            Save changes
          </Button>
          <Button variant="secondary" icon="back">
            Cancel
          </Button>
        </InlineActions>
      </div>

      <div className="app-card p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">
            Compact settings panel
          </h3>
          <p className="mt-1 text-sm app-text-muted">
            Useful for dense builder or inspector-style controls.
          </p>
        </div>

        <CheckboxField name="locked" label="Locked" />
        <CheckboxField name="visible" label="Visible" defaultChecked />

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

        <Button variant="secondary" icon="save">
          Update panel
        </Button>
      </div>
    </div>
  );
}

function DemoReadiness() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="app-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge tone="success">Strong already</Badge>
        </div>
        <div className="space-y-1 text-sm app-text-muted">
          <p>Buttons and inline actions</p>
          <p>Cards and list items</p>
          <p>Basic form composition</p>
        </div>
      </div>

      <div className="app-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge tone="warning">Needs refinement</Badge>
        </div>
        <div className="space-y-1 text-sm app-text-muted">
          <p>Inspector density patterns</p>
          <p>Metadata display consistency</p>
          <p>Empty-state copy standards</p>
        </div>
      </div>

      <div className="app-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge tone="muted">Future additions</Badge>
        </div>
        <div className="space-y-1 text-sm app-text-muted">
          <p>Table patterns</p>
          <p>Modal and dialog previews</p>
          <p>Autosave/loading micro-states</p>
        </div>
      </div>
    </div>
  );
}

export function UiLabComponentsFormReadinessSections() {
  return (
    <>
      <UiLabSection
        id="forms"
        title="Forms and field composition"
        description="The goal is calm, readable forms with consistent field spacing and action placement."
      >
        <DemoForms />
      </UiLabSection>

      <UiLabSection
        title="Readiness"
        description="A quick summary of which component areas already feel stable and which still need tightening."
      >
        <DemoReadiness />
      </UiLabSection>

      <UiLabFutureSection items={COMPONENTS_FUTURE_ITEMS} />
    </>
  );
}

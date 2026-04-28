import { FORMS_FUTURE_ITEMS } from "@/components/admin/ui-lab-forms-data";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabSection from "@/components/admin/ui-lab-section";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Card, { CardBody } from "@/components/ui/card";

function DemoUsageGuidance() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardBody className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl [background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
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
  );
}

export function UiLabFormsGuidanceSections() {
  return (
    <>
      <UiLabSection
        title="Usage guidance"
        description="These rules help keep the form system consistent as you reuse it across admin pages, builders, and future platform flows."
      >
        <DemoUsageGuidance />
      </UiLabSection>

      <UiLabFutureSection items={FORMS_FUTURE_ITEMS} />
    </>
  );
}

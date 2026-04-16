import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import CardListItem from "@/components/ui/card-list-item";
import DashboardCard from "@/components/ui/dashboard-card";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import CheckboxField from "@/components/ui/checkbox-field";
import { appIcons } from "@/lib/shared/icons";

export default async function AdminUiComponentsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Components"
      description="Preview reusable building blocks before applying them across app and admin screens."
      currentPath="/admin/ui/components"
    >
      <UiLabSection
        title="Badges"
        description="Badges are useful for statuses, metadata, and compact labels."
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="muted" icon={appIcons.file}>
            Draft
          </Badge>
          <Badge tone="info" icon={appIcons.preview}>
            Published
          </Badge>
          <Badge tone="success" icon={appIcons.completed}>
            Complete
          </Badge>
          <Badge tone="warning" icon={appIcons.pending}>
            In progress
          </Badge>
          <Badge tone="danger" icon={appIcons.userX}>
            Destructive
          </Badge>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Cards"
        description="Cards should stay visually consistent across dashboards, settings, and previews."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <DashboardCard title="Course progress">
            <p className="app-text-muted">
              Reusable for student-facing dashboard summaries and admin overviews.
            </p>
          </DashboardCard>

          <DashboardCard title="Assignments">
            <p className="app-text-muted">
              Good for compact summary content with strong internal hierarchy.
            </p>
          </DashboardCard>
        </div>
      </UiLabSection>

      <UiLabSection
        title="List items"
        description="Use list items for content navigation, overview cards, and admin index pages."
      >
        <div className="space-y-3">
          <CardListItem
            title="Introduction to the course"
            subtitle="GCSE Russian / Intro module"
            badges={
              <>
                <Badge tone="info" icon={appIcons.preview}>
                  Published
                </Badge>
                <Badge tone="muted" icon={appIcons.file}>
                  4 sections
                </Badge>
              </>
            }
          />

          <CardListItem
            title="School and daily routine"
            subtitle="Theme-based lesson"
            badges={
              <>
                <Badge tone="warning" icon={appIcons.pending}>
                  Draft
                </Badge>
              </>
            }
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Forms"
        description="Forms should feel calm, readable, and easy to scan."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <FormField label="Title">
              <Input placeholder="Course title" />
            </FormField>

            <FormField label="Description">
              <Textarea rows={4} placeholder="Write a short description..." />
            </FormField>

            <FormField label="Variant">
              <Select defaultValue="higher">
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
              </Select>
            </FormField>
          </div>

          <div className="space-y-4">
            <CheckboxField name="active" label="Active" defaultChecked />
            <CheckboxField name="published" label="Published" />
          </div>
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}

import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { appIcons } from "@/lib/shared/icons";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import DashboardCard from "@/components/ui/dashboard-card";
import DetailList from "@/components/ui/detail-list";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import InfoRow from "@/components/ui/info-row";
import InlineActions from "@/components/ui/inline-actions";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import SectionHeader from "@/components/ui/section-header";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import CheckboxField from "@/components/ui/checkbox-field";

export default async function AdminUiComponentsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Components"
      description="Preview the reusable building blocks that should shape admin and platform pages before applying one-off styling."
      currentPath="/admin/ui/components"
    >
      <UiLabSection
        title="Page and section headers"
        description="Use shared header patterns so pages keep a consistent hierarchy and action placement."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="app-card p-5">
            <SectionHeader
              title="Modules"
              description="Manage modules, lesson counts, and ordering for this variant."
              actions={
                <InlineActions>
                  <Button variant="secondary" icon={appIcons.filter}>
                    Filter
                  </Button>
                  <Button variant="primary" icon={appIcons.create}>
                    Add module
                  </Button>
                </InlineActions>
              }
            />
          </div>

          <div className="app-card p-5">
            <div className="space-y-2">
              <div className="app-label">Usage guidance</div>
              <div className="space-y-2 text-sm app-text-muted">
                <p>Use SectionHeader for page tops, section blocks, and edit screens.</p>
                <p>Keep actions on the right and avoid one-off alignment rules.</p>
                <p>Use concise descriptions rather than long paragraphs.</p>
              </div>
            </div>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Cards and list items"
        description="These are core patterns for dashboards, overviews, and content index pages."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <DashboardCard title="Course progress">
            <div className="space-y-2">
              <p className="app-text-muted">
                Reusable for student-facing summaries and admin overviews.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge tone="info" icon={appIcons.preview}>
                  Published
                </Badge>
                <Badge tone="muted" icon={appIcons.file}>
                  8 lessons
                </Badge>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Assignments">
            <div className="space-y-2">
              <p className="app-text-muted">
                Good for dense summaries with strong hierarchy and compact metadata.
              </p>
              <InlineActions>
                <Button variant="secondary" size="sm" icon={appIcons.search}>
                  Review
                </Button>
                <Button variant="primary" size="sm" icon={appIcons.create}>
                  New assignment
                </Button>
              </InlineActions>
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-3">
          <CardListItem
            title="Introduction to GCSE Russian"
            subtitle="Foundation / Overview module"
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
            actions={
              <InlineActions>
                <Button variant="secondary" size="sm" icon={appIcons.edit}>
                  Edit
                </Button>
                <Button variant="quiet" size="sm" icon={appIcons.next}>
                  Open
                </Button>
              </InlineActions>
            }
          />

          <CardListItem
            title="School and daily routine"
            subtitle="Higher / Theme-based lesson"
            badges={
              <>
                <Badge tone="warning" icon={appIcons.pending}>
                  Draft
                </Badge>
                <Badge tone="muted" icon={appIcons.file}>
                  6 blocks
                </Badge>
              </>
            }
            actions={
              <InlineActions>
                <Button variant="secondary" size="sm" icon={appIcons.edit}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" icon={appIcons.delete}>
                  Delete
                </Button>
              </InlineActions>
            }
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Panel and detail patterns"
        description="Use these for edit screens, metadata views, settings pages, and content detail summaries."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <PanelCard title="Course details">
            <div className="space-y-3">
              <DetailList
                items={[
                  { label: "Title", value: "GCSE Russian" },
                  { label: "Slug", value: "gcse-russian" },
                  { label: "Variants", value: "Foundation, Higher, Volna" },
                  { label: "Status", value: "Published" },
                ]}
              />

              <div className="pt-2">
                <InlineActions>
                  <Button variant="secondary" icon={appIcons.edit}>
                    Edit
                  </Button>
                  <Button variant="primary" icon={appIcons.next}>
                    Open course
                  </Button>
                </InlineActions>
              </div>
            </div>
          </PanelCard>

          <PanelCard title="Inspector example">
            <div className="space-y-3">
              <InfoRow label="Section kind" value="content" />
              <InfoRow label="Position" value="2" />
              <InfoRow label="Published" value="Yes" />
              <InfoRow label="Blocks" value="8" />

              <div className="pt-2 text-sm app-text-muted">
                Good for side panels, builder inspectors, and compact admin metadata.
              </div>
            </div>
          </PanelCard>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Forms and field composition"
        description="The goal is calm, readable forms with consistent field spacing and action placement."
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.85fr)]">
          <div className="app-card p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">
                Standard edit form
              </h3>
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
              <Button variant="primary" icon={appIcons.completed}>
                Save changes
              </Button>
              <Button variant="secondary" icon={appIcons.back}>
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

            <Button variant="secondary" icon={appIcons.save}>
              Update panel
            </Button>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Empty-state patterns"
        description="Empty states should be useful and action-oriented rather than feeling unfinished."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <EmptyState
            title="No lessons yet"
            description="Create your first lesson to start building out this module."
            action={
              <Button variant="primary" icon={appIcons.create}>
                Add lesson
              </Button>
            }
          />

          <EmptyState
            title="No results match your filters"
            description="Try broadening your search or resetting the active filters."
            action={
              <Button variant="secondary" icon={appIcons.refresh}>
                Reset filters
              </Button>
            }
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Readiness"
        description="A quick summary of which component areas already feel stable and which still need tightening."
      >
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
      </UiLabSection>
    </UiLabShell>
  );
}

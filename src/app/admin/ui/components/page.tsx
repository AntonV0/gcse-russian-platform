import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
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
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import SectionHeader from "@/components/ui/section-header";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import CheckboxField from "@/components/ui/checkbox-field";

const pageNavItems = [
  { id: "inspection", label: "Inspection" },
  { id: "intro-panels", label: "Intro panels" },
  { id: "headers", label: "Headers" },
  { id: "stats", label: "Stats" },
  { id: "panels", label: "Panels" },
  { id: "lists", label: "Lists" },
  { id: "forms", label: "Forms" },
  { id: "future-components", label: "Future" },
];

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
      <UiLabPageNav items={pageNavItems} />

      <UiLabSection
        id="inspection"
        title="Shared component inspection"
        description="Use this area to verify which elements are coming from shared UI primitives and to test the dev marker behaviour in realistic grouped layouts."
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <div className="app-card p-5 space-y-4">
            <div className="space-y-1">
              <div className="app-label">Marker test cluster</div>
              <p className="text-sm app-text-muted">
                Buttons and badges should now expose a subtle dev-only corner marker that
                can be opened without covering the component itself. This section keeps
                them together so shared primitives are easy to inspect side by side.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary" icon="create">
                Primary action
              </Button>
              <Button variant="secondary" icon="edit">
                Secondary action
              </Button>
              <Button variant="quiet" icon="search">
                Quiet action
              </Button>
              <Button variant="secondary" icon="settings" iconOnly ariaLabel="Settings" />
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="preview">
                Shared badge
              </Badge>
              <Badge tone="success" icon="completed">
                Stable pattern
              </Badge>
              <Badge tone="warning" icon="pending">
                Still refining
              </Badge>
              <Badge tone="muted" icon="file">
                Reusable primitive
              </Badge>
            </div>
          </div>

          <div className="app-card p-5 space-y-3">
            <div className="app-label">Why this matters</div>
            <div className="space-y-2 text-sm app-text-muted">
              <p>Helps distinguish shared components from one-off page markup.</p>
              <p>Makes reuse gaps easier to spot during admin UI refinement.</p>
              <p>
                Gives the UI Lab a stronger role as the internal design reference area.
              </p>
            </div>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        id="intro-panels"
        title="Page intro panels"
        description="This is the preferred premium top-of-page pattern for admin overviews, student course screens, and access or upgrade entry points."
      >
        <div className="space-y-4">
          <PageIntroPanel
            tone="admin"
            eyebrow="Content management"
            title="GCSE Russian course"
            description="Manage variants, modules, lessons, publishing state, and internal structure from one shared content area."
            badges={
              <>
                <Badge tone="info">Admin view</Badge>
                <Badge tone="muted">3 variants</Badge>
                <Badge tone="success">Published</Badge>
              </>
            }
            actions={
              <>
                <Button variant="secondary" icon="edit">
                  Edit details
                </Button>
                <Button variant="primary" icon="create">
                  Add module
                </Button>
              </>
            }
          >
            <div className="grid gap-3 md:grid-cols-3">
              <SummaryStatCard
                title="Modules"
                value="8"
                icon="layout"
                compact
                description="Structured and visible."
              />
              <SummaryStatCard
                title="Lessons"
                value="42"
                icon="lessons"
                compact
                description="Across all variants."
              />
              <SummaryStatCard
                title="Draft items"
                value="5"
                icon="edit"
                tone="warning"
                compact
                description="Need review before publishing."
              />
            </div>
          </PageIntroPanel>

          <PageIntroPanel
            tone="student"
            eyebrow="Continue learning"
            title="Theme 2: Local area, holiday and travel"
            description="Build confidence with vocabulary, listening, and exam-style practice through structured lessons and clear next steps."
            badges={
              <>
                <Badge tone="info">Higher tier</Badge>
                <Badge tone="success">18 lessons completed</Badge>
              </>
            }
            actions={
              <>
                <Button variant="secondary" icon="preview">
                  Review overview
                </Button>
                <Button variant="primary" icon="next" iconPosition="right">
                  Continue lesson
                </Button>
              </>
            }
          />

          <PageIntroPanel
            tone="brand"
            eyebrow="Full access"
            title="Unlock the complete GCSE Russian experience"
            description="Get structured lesson paths, progress tracking, premium revision support, and the full higher-tier learning journey."
            badges={
              <>
                <Badge tone="warning">Upgrade available</Badge>
                <Badge tone="muted">Trial currently active</Badge>
              </>
            }
            actions={
              <>
                <Button variant="inverse" icon="next" iconPosition="right">
                  Unlock full course
                </Button>
                <Button variant="secondary" icon="preview">
                  Compare access
                </Button>
              </>
            }
          />
        </div>
      </UiLabSection>

      <UiLabSection
        id="headers"
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
                  <Button variant="secondary" icon="filter">
                    Filter
                  </Button>
                  <Button variant="primary" icon="create">
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
        id="stats"
        title="Summary stat cards"
        description="This is the preferred premium metric pattern for dashboards, admin overviews, review queues, and student progress."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          <SummaryStatCard
            title="Completed lessons"
            value="18"
            icon="completed"
            tone="brand"
            description="Across all active modules in the current course."
            badge={<Badge tone="success">+3 this week</Badge>}
          />

          <SummaryStatCard
            title="Submissions to review"
            value="12"
            icon="pending"
            tone="warning"
            description="Teacher queue for written and speaking assignments."
            badge={<Badge tone="warning">Needs attention</Badge>}
          />

          <SummaryStatCard
            title="Locked higher content"
            value="24"
            icon="locked"
            tone="danger"
            description="Visible upgrade-aware lessons and premium practice areas."
            badge={<Badge tone="muted">Trial view</Badge>}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <PanelCard
            title="Compact use"
            description="Use the compact variant for tighter admin overviews or narrower columns."
            contentClassName="space-y-4"
          >
            <div className="grid gap-3 md:grid-cols-2">
              <SummaryStatCard
                title="Draft lessons"
                value="6"
                icon="edit"
                tone="default"
                compact
                description="Still unpublished."
              />

              <SummaryStatCard
                title="Question sets"
                value="42"
                icon="help"
                tone="success"
                compact
                description="Available to assign."
              />
            </div>
          </PanelCard>

          <PanelCard
            title="Pattern guidance"
            description="Why this should become the shared metric block."
            contentClassName="space-y-2"
          >
            <p className="text-sm app-text-muted">
              Replaces flatter dashboard-style metric cards with a clearer premium
              pattern.
            </p>
            <p className="text-sm app-text-muted">
              Supports admin, student, and teacher experiences without changing the design
              language.
            </p>
            <p className="text-sm app-text-muted">
              Keeps icon, value, description, and status in one predictable structure.
            </p>
          </PanelCard>
        </div>
      </UiLabSection>

      <UiLabSection
        id="panels"
        title="Premium section / inspector panels"
        description="This is the preferred container pattern for admin sections, side panels, metadata groups, and calmer student support panels."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          <PanelCard
            title="Admin section panel"
            description="Best default for admin editing and grouped page content."
            tone="admin"
            actions={
              <InlineActions>
                <Button variant="secondary" size="sm" icon="filter">
                  Filter
                </Button>
                <Button variant="primary" size="sm" icon="create">
                  Add block
                </Button>
              </InlineActions>
            }
            contentClassName="space-y-3"
          >
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-medium text-[var(--text-primary)]">
                Section settings
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Use for durable admin structures where actions and description both
                matter.
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
              <div className="text-sm font-medium text-[var(--text-primary)]">
                Publishing controls
              </div>
              <div className="mt-1 text-sm app-text-soft">
                draft · scheduled · published
              </div>
            </div>
          </PanelCard>

          <PanelCard
            title="Compact inspector panel"
            description="Preferred for builder sidebars and denser metadata areas."
            tone="muted"
            density="compact"
            actions={
              <Button variant="quiet" size="sm" icon="settings">
                Options
              </Button>
            }
            contentClassName="space-y-3"
          >
            <InfoRow label="Kind" value="content" />
            <InfoRow label="Position" value="2" />
            <InfoRow label="Published" value="Yes" />
            <InfoRow label="Blocks" value="8" />

            <div className="pt-1 text-sm app-text-muted">
              Compact density should still feel structured, not cramped.
            </div>
          </PanelCard>

          <PanelCard
            title="Student support panel"
            description="A softer section card for learning support and motivation."
            tone="student"
            contentClassName="space-y-3"
          >
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-medium text-[var(--text-primary)]">
                Exam reminder
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Keep your answer in full sentences and include a clear time reference.
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-medium text-[var(--text-primary)]">
                Suggested next step
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Review the new vocabulary before starting the translation practice.
              </div>
            </div>
          </PanelCard>
        </div>
      </UiLabSection>

      <UiLabSection
        id="lists"
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
                <Badge tone="info" icon="preview">
                  Published
                </Badge>
                <Badge tone="muted" icon="file">
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
                <Button variant="secondary" size="sm" icon="search">
                  Review
                </Button>
                <Button variant="primary" size="sm" icon="create">
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
                <Badge tone="info" icon="preview">
                  Published
                </Badge>
                <Badge tone="muted" icon="file">
                  4 sections
                </Badge>
              </>
            }
            actions={
              <InlineActions>
                <Button variant="secondary" size="sm" icon="edit">
                  Edit
                </Button>
                <Button variant="quiet" size="sm" icon="next">
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
                <Badge tone="warning" icon="pending">
                  Draft
                </Badge>
                <Badge tone="muted" icon="file">
                  6 blocks
                </Badge>
              </>
            }
            actions={
              <InlineActions>
                <Button variant="secondary" size="sm" icon="edit">
                  Edit
                </Button>
                <Button variant="danger" size="sm" icon="delete">
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
                  <Button variant="secondary" icon="edit">
                    Edit
                  </Button>
                  <Button variant="primary" icon="next">
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
        id="forms"
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
              <Button variant="primary" icon="create">
                Add lesson
              </Button>
            }
          />

          <EmptyState
            title="No results match your filters"
            description="Try broadening your search or resetting the active filters."
            action={
              <Button variant="secondary" icon="refresh">
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

      <UiLabFutureSection
        items={[
          "ActivityItem for dashboard history and recent admin work.",
          "ProgressCard for student module and lesson completion summaries.",
          "ReviewQueueCard for teacher submissions and marking workflows.",
          "SettingsPanel for account and admin configuration screens.",
          "MetadataGrid for dense details without ad-hoc rows.",
          "Timeline for future progress, audit, and feedback history.",
        ]}
      />
    </UiLabShell>
  );
}

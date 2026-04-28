import UiLabSection from "@/components/admin/ui-lab/shell/ui-lab-section";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import DashboardCard from "@/components/ui/dashboard-card";
import DetailList from "@/components/ui/detail-list";
import EmptyState from "@/components/ui/empty-state";
import InfoRow from "@/components/ui/info-row";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";

function DemoCardsAndLists() {
  return (
    <>
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
    </>
  );
}

function DemoPanelDetails() {
  return (
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
  );
}

function DemoEmptyStates() {
  return (
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
  );
}

export function UiLabComponentsListSections() {
  return (
    <>
      <UiLabSection
        id="lists"
        title="Cards and list items"
        description="These are core patterns for dashboards, overviews, and content index pages."
      >
        <DemoCardsAndLists />
      </UiLabSection>

      <UiLabSection
        title="Panel and detail patterns"
        description="Use these for edit screens, metadata views, settings pages, and content detail summaries."
      >
        <DemoPanelDetails />
      </UiLabSection>

      <UiLabSection
        title="Empty-state patterns"
        description="Empty states should be useful and action-oriented rather than feeling unfinished."
      >
        <DemoEmptyStates />
      </UiLabSection>
    </>
  );
}

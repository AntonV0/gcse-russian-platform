import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import FeedbackBanner from "@/components/ui/feedback-banner";
import OperationsWorkspace, {
  OperationsHeader,
  OperationsSection,
} from "@/components/ui/operations-workspace";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import { getLessonTemplateOverviewDb } from "@/lib/lessons/lesson-template-helpers-db";

export default async function AdminLessonTemplatesPage() {
  const overview = await getLessonTemplateOverviewDb();

  return (
    <main>
      <OperationsWorkspace>
        <OperationsHeader
          eyebrow="Admin content"
          title="Lesson Templates"
          description="Manage reusable block presets, section templates, and full lesson templates."
          actions={
            <Button href="/admin/content" variant="secondary" icon="courses">
              Back to content
            </Button>
          }
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <SummaryStatCard
              title="Block presets"
              value={overview.counts.blockPresets}
              icon="blocks"
              tone="brand"
              compact
            />
            <SummaryStatCard
              title="Section templates"
              value={overview.counts.sectionTemplates}
              icon="layers"
              compact
            />
            <SummaryStatCard
              title="Lesson templates"
              value={overview.counts.lessonTemplates}
              icon="lesson"
              tone="success"
              compact
            />
          </div>
        </OperationsHeader>

        <OperationsSection>
          <div className="grid gap-3 xl:grid-cols-3">
            <CardListItem
              href="/admin/lesson-templates/block-presets"
              title="Block Presets"
              subtitle="Reusable starter block groups such as teaching explanation or vocabulary practice."
              icon={
                <Badge tone="info" icon="blocks">
                  Blocks
                </Badge>
              }
              badges={
                <Badge tone="muted" icon="help">
                  {overview.counts.presetBlocks} preset block rows
                </Badge>
              }
            />

            <CardListItem
              href="/admin/lesson-templates/section-templates"
              title="Section Templates"
              subtitle="Reusable section blueprints that compose one or more block presets."
              icon={
                <Badge tone="info" icon="layers">
                  Sections
                </Badge>
              }
              badges={
                <Badge tone="muted" icon="help">
                  {overview.counts.sectionTemplatePresetLinks} preset links
                </Badge>
              }
            />

            <CardListItem
              href="/admin/lesson-templates/lesson-templates"
              title="Lesson Templates"
              subtitle="Full lesson scaffolds built from ordered section templates."
              icon={
                <Badge tone="info" icon="lesson">
                  Lessons
                </Badge>
              }
              badges={
                <Badge tone="muted" icon="help">
                  {overview.counts.lessonTemplateSections} template section rows
                </Badge>
              }
            />
          </div>
        </OperationsSection>

        <OperationsSection muted>
          <div className="mb-3">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Current state
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              This batch sets up the database-backed template foundation and read-only
              management area.
            </p>
          </div>
          <div className="space-y-3">
            <FeedbackBanner
              tone="info"
              title="Management foundation"
              description="CRUD is not added yet. The next batch should create create/edit pages and actions."
            />
            <FeedbackBanner
              tone="warning"
              title="Builder wiring pending"
              description="The lesson builder is still using code-backed templates until the DB wiring pass is completed."
            />
          </div>
        </OperationsSection>
      </OperationsWorkspace>
    </main>
  );
}

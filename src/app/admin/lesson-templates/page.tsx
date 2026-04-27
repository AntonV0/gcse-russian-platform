import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import FeedbackBanner from "@/components/ui/feedback-banner";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import { getLessonTemplateOverviewDb } from "@/lib/lessons/lesson-template-helpers-db";
import SectionCard from "@/components/ui/section-card";

export default async function AdminLessonTemplatesPage() {
  const overview = await getLessonTemplateOverviewDb();

  return (
    <main className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Lesson Templates"
          description="Manage reusable block presets, section templates, and full lesson templates."
        />

        <Button href="/admin/content" variant="secondary" icon="courses">
          Back to content
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
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
      </section>

      <SectionCard
        title="Current state"
        description="This batch sets up the database-backed template foundation and read-only management area."
      >
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
      </SectionCard>
    </main>
  );
}

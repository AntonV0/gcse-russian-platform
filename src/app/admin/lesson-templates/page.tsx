import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import AppIcon from "@/components/ui/app-icon";
import { appIcons } from "@/lib/icons";
import { getLessonTemplateOverviewDb } from "@/lib/lesson-template-helpers-db";

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-4 py-4">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-gray-600">{description}</p> : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
    </div>
  );
}

export default async function AdminLessonTemplatesPage() {
  const overview = await getLessonTemplateOverviewDb();

  return (
    <main className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Lesson Templates"
          description="Manage reusable block presets, section templates, and full lesson templates."
        />

        <Button href="/admin/content" variant="secondary" icon={appIcons.courses}>
          Back to content
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Block presets" value={overview.counts.blockPresets} />
        <StatCard label="Section templates" value={overview.counts.sectionTemplates} />
        <StatCard label="Lesson templates" value={overview.counts.lessonTemplates} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Link
          href="/admin/lesson-templates/block-presets"
          className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <AppIcon icon={appIcons.file} size={18} className="text-gray-700" />
            <div className="font-semibold text-gray-900">Block Presets</div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Reusable starter block groups such as teaching explanation or vocabulary
            practice.
          </p>
          <div className="mt-3">
            <Badge tone="muted" icon={appIcons.help}>
              {overview.counts.presetBlocks} preset block rows
            </Badge>
          </div>
        </Link>

        <Link
          href="/admin/lesson-templates/section-templates"
          className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <AppIcon icon={appIcons.file} size={18} className="text-gray-700" />
            <div className="font-semibold text-gray-900">Section Templates</div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Reusable section blueprints that compose one or more block presets.
          </p>
          <div className="mt-3">
            <Badge tone="muted" icon={appIcons.help}>
              {overview.counts.sectionTemplatePresetLinks} preset links
            </Badge>
          </div>
        </Link>

        <Link
          href="/admin/lesson-templates/lesson-templates"
          className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <AppIcon icon={appIcons.file} size={18} className="text-gray-700" />
            <div className="font-semibold text-gray-900">Lesson Templates</div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Full lesson scaffolds built from ordered section templates.
          </p>
          <div className="mt-3">
            <Badge tone="muted" icon={appIcons.help}>
              {overview.counts.lessonTemplateSections} template section rows
            </Badge>
          </div>
        </Link>
      </section>

      <SectionCard
        title="Current state"
        description="This batch sets up the database-backed template foundation and read-only management area."
      >
        <div className="space-y-3 text-sm text-gray-600">
          <div className="rounded-xl border bg-gray-50 p-4">
            CRUD is not added yet. The next batch should create create/edit pages and
            actions.
          </div>
          <div className="rounded-xl border bg-gray-50 p-4">
            The lesson builder is still using code-backed templates until the DB wiring
            pass is completed.
          </div>
        </div>
      </SectionCard>
    </main>
  );
}

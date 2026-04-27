import type { LessonSection } from "@/components/admin/lesson-builder/lesson-builder-types";
import { Badge } from "@/components/admin/lesson-builder/lesson-builder-ui";
import { Heading } from "@/components/ui/heading";
import { getLessonBlockPreview } from "@/lib/lessons/lesson-blocks";

function getSectionCounts(sections: LessonSection[]) {
  let publishedSections = 0;
  let totalBlocks = 0;
  let publishedBlocks = 0;

  for (const section of sections) {
    if (section.is_published) publishedSections += 1;
    totalBlocks += section.blocks.length;

    for (const block of section.blocks) {
      if (block.is_published) publishedBlocks += 1;
    }
  }

  return {
    publishedSections,
    totalSections: sections.length,
    publishedBlocks,
    totalBlocks,
  };
}

function CompactBuilderStat(props: { label: string; published: number; total: number }) {
  return (
    <div className="app-card px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide app-text-soft">
        {props.label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
          {props.published}
        </span>
        <span className="text-sm app-text-muted">/ {props.total}</span>
      </div>
    </div>
  );
}

function getContentHealthChecks(sections: LessonSection[]) {
  const emptyTitleSections = sections.filter(
    (section) => section.title.trim().length === 0
  ).length;
  const draftSections = sections.filter((section) => !section.is_published).length;
  const emptySections = sections.filter((section) => section.blocks.length === 0).length;
  const draftBlocks = sections.reduce(
    (count, section) =>
      count + section.blocks.filter((block) => !block.is_published).length,
    0
  );
  const thinBlocks = sections.reduce(
    (count, section) =>
      count +
      section.blocks.filter((block) => getLessonBlockPreview(block).trim().length === 0)
        .length,
    0
  );

  return [
    {
      label: "Sections",
      value: sections.length === 0 ? "No sections yet" : `${sections.length} total`,
      tone: sections.length === 0 ? "warning" : "success",
    },
    {
      label: "Draft sections",
      value: draftSections === 0 ? "All published" : `${draftSections} draft`,
      tone: draftSections === 0 ? "success" : "warning",
    },
    {
      label: "Empty sections",
      value: emptySections === 0 ? "None" : `${emptySections} need blocks`,
      tone: emptySections === 0 ? "success" : "warning",
    },
    {
      label: "Draft blocks",
      value: draftBlocks === 0 ? "All published" : `${draftBlocks} draft`,
      tone: draftBlocks === 0 ? "success" : "warning",
    },
    {
      label: "Missing titles",
      value: emptyTitleSections === 0 ? "None" : `${emptyTitleSections} section`,
      tone: emptyTitleSections === 0 ? "success" : "warning",
    },
    {
      label: "Thin previews",
      value: thinBlocks === 0 ? "None" : `${thinBlocks} block`,
      tone: thinBlocks === 0 ? "success" : "warning",
    },
  ] as const;
}

function MobileAuthoringWarning() {
  return (
    <section className="app-card border-[var(--warning-border)] bg-[var(--warning-surface)] p-4 lg:hidden">
      <div className="space-y-2">
        <Badge tone="warning" icon="warning">
          Best on tablet or desktop
        </Badge>
        <div>
          <Heading
            level={2}
            className="text-sm font-semibold text-[var(--warning-text-strong)]"
          >
            Lesson authoring needs extra room
          </Heading>
          <p className="mt-1 text-sm text-[var(--warning-text)]">
            The builder remains available on this screen, but section ordering,
            block editing, and inspector controls are easier with a wider workspace.
          </p>
        </div>
      </div>
    </section>
  );
}

function BuilderStats({ sections }: { sections: LessonSection[] }) {
  const { publishedSections, totalSections, publishedBlocks, totalBlocks } =
    getSectionCounts(sections);

  return (
    <section className="grid gap-3 md:grid-cols-2">
      <CompactBuilderStat
        label="Sections"
        published={publishedSections}
        total={totalSections}
      />
      <CompactBuilderStat
        label="Blocks"
        published={publishedBlocks}
        total={totalBlocks}
      />
    </section>
  );
}

function ContentHealthPanel({ sections }: { sections: LessonSection[] }) {
  const contentHealthChecks = getContentHealthChecks(sections);
  const isReady = contentHealthChecks.every((check) => check.tone === "success");

  return (
    <section className="app-card p-4">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide app-text-soft">Publish checks</p>
          <Heading level={2} className="text-sm font-semibold text-[var(--text-primary)]">
            Content health
          </Heading>
        </div>
        <Badge tone={isReady ? "success" : "warning"} icon={isReady ? "success" : "warning"}>
          {isReady ? "Ready" : "Needs review"}
        </Badge>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {contentHealthChecks.map((check) => (
          <div
            key={check.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-3 py-2"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wide app-text-soft">
              {check.label}
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {check.value}
              </span>
              <Badge tone={check.tone}>{check.tone === "success" ? "OK" : "Check"}</Badge>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function LessonBuilderWorkspaceOverview({
  sections,
}: {
  sections: LessonSection[];
}) {
  return (
    <>
      <MobileAuthoringWarning />
      <BuilderStats sections={sections} />
      <ContentHealthPanel sections={sections} />
    </>
  );
}

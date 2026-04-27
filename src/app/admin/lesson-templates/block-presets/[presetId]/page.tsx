import { notFound } from "next/navigation";
import { BlockPresetAddBlockPanel } from "@/components/admin/lesson-templates/block-presets/block-preset-add-block-panel";
import { BlockPresetBlocksPanel } from "@/components/admin/lesson-templates/block-presets/block-preset-blocks-panel";
import { BlockPresetDetailsPanel } from "@/components/admin/lesson-templates/block-presets/block-preset-details-panel";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import { getLessonBlockPresetDetailDb } from "@/lib/lessons/lesson-template-helpers-db";

export default async function AdminLessonBlockPresetDetailPage({
  params,
}: {
  params: Promise<{ presetId: string }>;
}) {
  const { presetId } = await params;
  const detail = await getLessonBlockPresetDetailDb(presetId);

  if (!detail.preset) {
    notFound();
  }

  return (
    <main className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title={detail.preset.title}
          description="Edit block preset metadata and manage the ordered preset blocks."
        />

        <Button
          href="/admin/lesson-templates/block-presets"
          variant="secondary"
          icon="back"
        >
          Back
        </Button>
      </div>

      <BlockPresetDetailsPanel
        preset={detail.preset}
        blockCount={detail.blocks.length}
      />

      <BlockPresetAddBlockPanel presetId={detail.preset.id} />

      <BlockPresetBlocksPanel presetId={detail.preset.id} blocks={detail.blocks} />
    </main>
  );
}

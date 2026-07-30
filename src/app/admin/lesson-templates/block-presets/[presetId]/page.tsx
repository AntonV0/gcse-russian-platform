import { notFound } from "next/navigation";
import { BlockPresetAddBlockPanel } from "@/components/admin/lesson-templates/block-presets/block-preset-add-block-panel";
import { BlockPresetBlocksPanel } from "@/components/admin/lesson-templates/block-presets/block-preset-blocks-panel";
import { BlockPresetDetailsPanel } from "@/components/admin/lesson-templates/block-presets/block-preset-details-panel";
import Button from "@/components/ui/button";
import OperationsWorkspace, {
  OperationsHeader,
  OperationsSection,
} from "@/components/ui/operations-workspace";
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
    <main>
      <OperationsWorkspace>
        <OperationsHeader
          eyebrow="Admin lesson templates"
          title={detail.preset.title}
          description="Edit block preset metadata and manage the ordered preset blocks."
          actions={
            <Button
              href="/admin/lesson-templates/block-presets"
              variant="secondary"
              icon="back"
            >
              Back
            </Button>
          }
        />

        <OperationsSection>
          <BlockPresetDetailsPanel
            preset={detail.preset}
            blockCount={detail.blocks.length}
          />
        </OperationsSection>

        <OperationsSection>
          <BlockPresetAddBlockPanel presetId={detail.preset.id} />
        </OperationsSection>

        <OperationsSection>
          <BlockPresetBlocksPanel presetId={detail.preset.id} blocks={detail.blocks} />
        </OperationsSection>
      </OperationsWorkspace>
    </main>
  );
}

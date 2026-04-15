import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { appIcons } from "@/lib/icons";
import {
  getLessonBlockPresetBlocksDb,
  getLessonBlockPresetsDb,
} from "@/lib/lesson-template-helpers-db";

export default async function AdminLessonBlockPresetsPage() {
  const presets = await getLessonBlockPresetsDb();
  const presetBlocks = await getLessonBlockPresetBlocksDb(presets.map((item) => item.id));

  const blockCountByPresetId = new Map<string, number>();

  for (const block of presetBlocks) {
    blockCountByPresetId.set(
      block.lesson_block_preset_id,
      (blockCountByPresetId.get(block.lesson_block_preset_id) ?? 0) + 1
    );
  }

  return (
    <main className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Block Presets"
          description="Reusable starter block groups for lesson authoring."
        />

        <div className="flex gap-2">
          <Button href="/admin/lesson-templates" variant="secondary" icon={appIcons.back}>
            Back
          </Button>
          <Button href="#" variant="primary" icon={appIcons.create}>
            Create preset
          </Button>
        </div>
      </div>

      {presets.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white px-4 py-8 text-sm text-gray-500">
          No block presets found yet.
        </div>
      ) : (
        <div className="space-y-3">
          {presets.map((preset) => (
            <Link
              key={preset.id}
              href={`/admin/lesson-templates/block-presets/${preset.id}`}
              className="block rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900">{preset.title}</div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge tone="muted" icon={appIcons.file}>
                      {preset.slug}
                    </Badge>

                    {preset.is_active ? (
                      <Badge tone="success" icon={appIcons.completed}>
                        Active
                      </Badge>
                    ) : (
                      <Badge tone="warning" icon={appIcons.pending}>
                        Inactive
                      </Badge>
                    )}

                    <Badge tone="muted" icon={appIcons.help}>
                      {blockCountByPresetId.get(preset.id) ?? 0} block(s)
                    </Badge>
                  </div>

                  {preset.description ? (
                    <p className="mt-3 text-sm text-gray-600">{preset.description}</p>
                  ) : null}
                </div>

                <div className="text-sm text-gray-500">Open</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

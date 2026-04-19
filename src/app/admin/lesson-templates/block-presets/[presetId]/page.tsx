import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import {
  createLessonBlockPresetBlockAction,
  deleteLessonBlockPresetAction,
  deleteLessonBlockPresetBlockAction,
  reorderLessonBlockPresetBlocksAction,
  updateLessonBlockPresetAction,
  updateLessonBlockPresetBlockAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import { getLessonBlockPresetDetailDb } from "@/lib/lessons/lesson-template-helpers-db";
import {
  getLessonBlockAccentClass,
  getLessonBlockGroupLabel,
  getLessonBlockLabel,
  getLessonBlockPreview,
} from "@/lib/lessons/lesson-blocks";

const templateBlockTypes = [
  "header",
  "subheader",
  "divider",
  "text",
  "note",
  "callout",
  "exam-tip",
  "vocabulary",
  "image",
  "audio",
  "question-set",
  "vocabulary-set",
] as const;

function BlockFields({
  blockType,
  data,
  prefix = "",
}: {
  blockType: string;
  data?: Record<string, unknown>;
  prefix?: string;
}) {
  const name = (field: string) => `${prefix}${field}`;

  switch (blockType) {
    case "header":
    case "subheader":
    case "text":
      return (
        <textarea
          name={name("content")}
          required
          rows={3}
          defaultValue={typeof data?.content === "string" ? data.content : ""}
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
      );

    case "note":
      return (
        <div className="space-y-2">
          <input
            name={name("title")}
            required
            defaultValue={typeof data?.title === "string" ? data.title : ""}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <textarea
            name={name("content")}
            required
            rows={4}
            defaultValue={typeof data?.content === "string" ? data.content : ""}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
        </div>
      );

    case "callout":
    case "exam-tip":
      return (
        <div className="space-y-2">
          <input
            name={name("title")}
            defaultValue={typeof data?.title === "string" ? data.title : ""}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <textarea
            name={name("content")}
            required
            rows={4}
            defaultValue={typeof data?.content === "string" ? data.content : ""}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
        </div>
      );

    case "image":
      return (
        <div className="space-y-2">
          <input
            name={name("src")}
            required
            placeholder="https://..."
            defaultValue={typeof data?.src === "string" ? data.src : ""}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <input
            name={name("alt")}
            placeholder="Alt text"
            defaultValue={typeof data?.alt === "string" ? data.alt : ""}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <input
            name={name("caption")}
            placeholder="Optional caption"
            defaultValue={typeof data?.caption === "string" ? data.caption : ""}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
        </div>
      );

    case "audio":
      return (
        <div className="space-y-2">
          <input
            name={name("title")}
            placeholder="Optional title"
            defaultValue={typeof data?.title === "string" ? data.title : ""}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <input
            name={name("src")}
            required
            placeholder="https://..."
            defaultValue={typeof data?.src === "string" ? data.src : ""}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <input
            name={name("caption")}
            placeholder="Optional caption"
            defaultValue={typeof data?.caption === "string" ? data.caption : ""}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name={name("autoPlay")}
              value="true"
              defaultChecked={data?.autoPlay === true}
            />
            Auto play
          </label>
        </div>
      );

    case "vocabulary":
      return (
        <div className="space-y-2">
          <input
            name={name("title")}
            required
            defaultValue={typeof data?.title === "string" ? data.title : ""}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <textarea
            name={name("items")}
            required
            rows={6}
            defaultValue={
              Array.isArray(data?.items)
                ? data.items
                    .map((item) => {
                      if (!item || typeof item !== "object") return "";
                      const record = item as Record<string, unknown>;
                      const russian =
                        typeof record.russian === "string" ? record.russian : "";
                      const english =
                        typeof record.english === "string" ? record.english : "";
                      return russian && english ? `${russian} | ${english}` : "";
                    })
                    .filter(Boolean)
                    .join("\n")
                : ""
            }
            className="w-full rounded-xl border px-3 py-2 font-mono text-sm"
          />
        </div>
      );

    case "question-set":
      return (
        <div className="space-y-2">
          <input
            name={name("title")}
            placeholder="Optional heading"
            defaultValue={typeof data?.title === "string" ? data.title : ""}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <input
            name={name("questionSetSlug")}
            required
            defaultValue={
              typeof data?.questionSetSlug === "string" ? data.questionSetSlug : ""
            }
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
        </div>
      );

    case "vocabulary-set":
      return (
        <div className="space-y-2">
          <input
            name={name("title")}
            placeholder="Optional heading"
            defaultValue={typeof data?.title === "string" ? data.title : ""}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <input
            name={name("vocabularySetSlug")}
            required
            defaultValue={
              typeof data?.vocabularySetSlug === "string" ? data.vocabularySetSlug : ""
            }
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
        </div>
      );

    case "divider":
      return <div className="text-sm text-gray-500">No fields required for divider.</div>;

    default:
      return <div className="text-sm text-gray-500">Unsupported block type form.</div>;
  }
}

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

        <div className="flex gap-2">
          <Button
            href="/admin/lesson-templates/block-presets"
            variant="secondary"
            icon="back"
          >
            Back
          </Button>
        </div>
      </div>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge tone="muted" icon="file">
            {detail.preset.slug}
          </Badge>

          {detail.preset.is_active ? (
            <Badge tone="success" icon="completed">
              Active
            </Badge>
          ) : (
            <Badge tone="warning" icon="pending">
              Inactive
            </Badge>
          )}

          <Badge tone="muted" icon="help">
            {detail.blocks.length} block(s)
          </Badge>
        </div>

        <form
          action={updateLessonBlockPresetAction}
          className="grid gap-3 md:grid-cols-2"
        >
          <input type="hidden" name="presetId" value={detail.preset.id} />

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">Title</label>
            <input
              name="title"
              required
              defaultValue={detail.preset.title}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">Slug</label>
            <input
              name="slug"
              required
              defaultValue={detail.preset.slug}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-900">Description</label>
            <input
              name="description"
              defaultValue={detail.preset.description ?? ""}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="isActive"
                value="true"
                defaultChecked={detail.preset.is_active}
              />
              Active
            </label>
          </div>

          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Save preset
            </button>
          </div>
        </form>

        <form action={deleteLessonBlockPresetAction} className="mt-4">
          <input type="hidden" name="presetId" value={detail.preset.id} />
          <button
            type="submit"
            className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
          >
            Delete preset
          </button>
        </form>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4">
          <div className="font-medium text-gray-900">Add preset block</div>
          <div className="text-sm text-gray-500">
            Add a new starter block to this preset.
          </div>
        </div>

        <div className="grid gap-4">
          {templateBlockTypes.map((blockType) => (
            <form
              key={blockType}
              action={createLessonBlockPresetBlockAction}
              className="rounded-xl border p-4"
            >
              <input type="hidden" name="presetId" value={detail.preset!.id} />
              <input type="hidden" name="blockType" value={blockType} />

              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${getLessonBlockAccentClass(
                    blockType
                  )}`}
                >
                  {getLessonBlockGroupLabel(blockType)}
                </span>
                <span className="font-medium text-gray-900">
                  {getLessonBlockLabel(blockType)}
                </span>
              </div>

              <BlockFields blockType={blockType} />

              <div className="mt-3">
                <button
                  type="submit"
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Add {getLessonBlockLabel(blockType).toLowerCase()}
                </button>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4">
          <div className="font-medium text-gray-900">Preset blocks</div>
          <div className="text-sm text-gray-500">
            Current blocks inside this preset. Reordering is done by ordered ids for now.
          </div>
        </div>

        {detail.blocks.length === 0 ? (
          <div className="rounded-xl border border-dashed px-4 py-8 text-sm text-gray-500">
            No blocks in this preset yet.
          </div>
        ) : (
          <div className="space-y-4">
            <form
              action={reorderLessonBlockPresetBlocksAction}
              className="rounded-xl border bg-gray-50 p-4"
            >
              <input type="hidden" name="presetId" value={detail.preset.id} />
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Ordered preset block ids
              </label>
              <textarea
                name="orderedPresetBlockIds"
                rows={3}
                defaultValue={detail.blocks.map((block) => block.id).join(",")}
                className="w-full rounded-xl border px-3 py-2 font-mono text-sm"
              />
              <button
                type="submit"
                className="mt-3 rounded-lg border px-3 py-2 text-sm hover:bg-white"
              >
                Save block order
              </button>
            </form>

            {detail.blocks.map((block) => (
              <section key={block.id} className="rounded-xl border p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${getLessonBlockAccentClass(
                      block.block_type
                    )}`}
                  >
                    {getLessonBlockGroupLabel(block.block_type)}
                  </span>

                  <span className="font-medium text-gray-900">
                    {getLessonBlockLabel(block.block_type)}
                  </span>

                  <Badge tone="muted" icon="help">
                    Position {block.position}
                  </Badge>

                  {block.is_active ? (
                    <Badge tone="success" icon="completed">
                      Active
                    </Badge>
                  ) : (
                    <Badge tone="warning" icon="pending">
                      Inactive
                    </Badge>
                  )}
                </div>

                <div className="mb-3 rounded-xl border bg-gray-50 px-3 py-2 text-sm text-gray-600">
                  {getLessonBlockPreview({
                    block_type: block.block_type,
                    data: block.data,
                  })}
                </div>

                <form action={updateLessonBlockPresetBlockAction} className="space-y-3">
                  <input type="hidden" name="presetId" value={detail.preset!.id} />
                  <input type="hidden" name="presetBlockId" value={block.id} />
                  <input type="hidden" name="blockType" value={block.block_type} />

                  <BlockFields blockType={block.block_type} data={block.data} />

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="isActive"
                      value="true"
                      defaultChecked={block.is_active}
                    />
                    Active
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="submit"
                      className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      Save block
                    </button>
                  </div>
                </form>

                <form action={deleteLessonBlockPresetBlockAction} className="mt-3">
                  <input type="hidden" name="presetId" value={detail.preset!.id} />
                  <input type="hidden" name="presetBlockId" value={block.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    Delete block
                  </button>
                </form>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

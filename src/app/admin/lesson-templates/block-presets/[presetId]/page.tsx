import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import CheckboxField from "@/components/ui/checkbox-field";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import InlineActions from "@/components/ui/inline-actions";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import Textarea from "@/components/ui/textarea";
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
        <FormField label="Content" required>
          <Textarea
            name={name("content")}
            required
            rows={3}
            defaultValue={typeof data?.content === "string" ? data.content : ""}
          />
        </FormField>
      );

    case "note":
      return (
        <div className="space-y-2">
          <FormField label="Title" required>
            <Input
              name={name("title")}
              required
              defaultValue={typeof data?.title === "string" ? data.title : ""}
            />
          </FormField>
          <FormField label="Content" required>
            <Textarea
              name={name("content")}
              required
              rows={4}
              defaultValue={typeof data?.content === "string" ? data.content : ""}
            />
          </FormField>
        </div>
      );

    case "callout":
    case "exam-tip":
      return (
        <div className="space-y-2">
          <FormField label="Title">
            <Input
              name={name("title")}
              defaultValue={typeof data?.title === "string" ? data.title : ""}
            />
          </FormField>
          <FormField label="Content" required>
            <Textarea
              name={name("content")}
              required
              rows={4}
              defaultValue={typeof data?.content === "string" ? data.content : ""}
            />
          </FormField>
        </div>
      );

    case "image":
      return (
        <div className="space-y-2">
          <FormField label="Image URL" required>
            <Input
              name={name("src")}
              required
              placeholder="https://..."
              defaultValue={typeof data?.src === "string" ? data.src : ""}
            />
          </FormField>
          <FormField label="Alt text">
            <Input
              name={name("alt")}
              placeholder="Alt text"
              defaultValue={typeof data?.alt === "string" ? data.alt : ""}
            />
          </FormField>
          <FormField label="Caption">
            <Input
              name={name("caption")}
              placeholder="Optional caption"
              defaultValue={typeof data?.caption === "string" ? data.caption : ""}
            />
          </FormField>
        </div>
      );

    case "audio":
      return (
        <div className="space-y-2">
          <FormField label="Title">
            <Input
              name={name("title")}
              placeholder="Optional title"
              defaultValue={typeof data?.title === "string" ? data.title : ""}
            />
          </FormField>
          <FormField label="Audio URL" required>
            <Input
              name={name("src")}
              required
              placeholder="https://..."
              defaultValue={typeof data?.src === "string" ? data.src : ""}
            />
          </FormField>
          <FormField label="Caption">
            <Input
              name={name("caption")}
              placeholder="Optional caption"
              defaultValue={typeof data?.caption === "string" ? data.caption : ""}
            />
          </FormField>
          <CheckboxField
            name={name("autoPlay")}
            label="Auto play"
            defaultChecked={data?.autoPlay === true}
          />
        </div>
      );

    case "vocabulary":
      return (
        <div className="space-y-2">
          <FormField label="Title" required>
            <Input
              name={name("title")}
              required
              defaultValue={typeof data?.title === "string" ? data.title : ""}
            />
          </FormField>
          <FormField label="Vocabulary items" required>
            <Textarea
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
              className="font-mono"
            />
          </FormField>
        </div>
      );

    case "question-set":
      return (
        <div className="space-y-2">
          <FormField label="Heading">
            <Input
              name={name("title")}
              placeholder="Optional heading"
              defaultValue={typeof data?.title === "string" ? data.title : ""}
            />
          </FormField>
          <FormField label="Question set slug" required>
            <Input
              name={name("questionSetSlug")}
              required
              defaultValue={
                typeof data?.questionSetSlug === "string" ? data.questionSetSlug : ""
              }
            />
          </FormField>
        </div>
      );

    case "vocabulary-set":
      return (
        <div className="space-y-2">
          <FormField label="Heading">
            <Input
              name={name("title")}
              placeholder="Optional heading"
              defaultValue={typeof data?.title === "string" ? data.title : ""}
            />
          </FormField>
          <FormField label="Vocabulary set slug" required>
            <Input
              name={name("vocabularySetSlug")}
              required
              defaultValue={
                typeof data?.vocabularySetSlug === "string"
                  ? data.vocabularySetSlug
                  : ""
              }
            />
          </FormField>
        </div>
      );

    case "divider":
      return (
        <EmptyState
          icon="blocks"
          title="No fields required"
          description="Divider blocks only need their block type and position."
        />
      );

    default:
      return (
        <EmptyState
          icon="warning"
          iconTone="warning"
          title="Unsupported block type"
          description="This block type does not have an editor form yet."
        />
      );
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

      <PanelCard
        title="Block preset details"
        tone="admin"
        actions={
          <>
            <Badge tone="muted" icon="file">
              {detail.preset.slug}
            </Badge>
            <Badge
              tone={detail.preset.is_active ? "success" : "warning"}
              icon={detail.preset.is_active ? "completed" : "pending"}
            >
              {detail.preset.is_active ? "Active" : "Inactive"}
            </Badge>
            <Badge tone="muted" icon="help">
              {detail.blocks.length} block(s)
            </Badge>
          </>
        }
      >
        <form
          action={updateLessonBlockPresetAction}
          className="grid gap-4 md:grid-cols-2"
        >
          <input type="hidden" name="presetId" value={detail.preset.id} />

          <FormField label="Title" required>
            <Input name="title" required defaultValue={detail.preset.title} />
          </FormField>

          <FormField label="Slug" required>
            <Input name="slug" required defaultValue={detail.preset.slug} />
          </FormField>

          <FormField label="Description" className="md:col-span-2">
            <Input
              name="description"
              defaultValue={detail.preset.description ?? ""}
            />
          </FormField>

          <CheckboxField
            className="md:col-span-2"
            name="isActive"
            label="Active"
            defaultChecked={detail.preset.is_active}
          />

          <InlineActions className="md:col-span-2">
            <Button type="submit" variant="primary" icon="save">
              Save preset
            </Button>
          </InlineActions>
        </form>

        <form action={deleteLessonBlockPresetAction} className="mt-4">
          <input type="hidden" name="presetId" value={detail.preset.id} />
          <Button type="submit" variant="danger" icon="delete">
            Delete preset
          </Button>
        </form>
      </PanelCard>

      <PanelCard
        title="Add preset block"
        description="Add a new starter block to this preset."
        tone="admin"
      >
        <div className="grid gap-4">
          {templateBlockTypes.map((blockType) => (
            <form
              key={blockType}
              action={createLessonBlockPresetBlockAction}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/55 p-4"
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
                <span className="font-medium text-[var(--text-primary)]">
                  {getLessonBlockLabel(blockType)}
                </span>
              </div>

              <BlockFields blockType={blockType} />

              <div className="mt-3">
                <Button type="submit" variant="secondary" size="sm" icon="create">
                  Add {getLessonBlockLabel(blockType).toLowerCase()}
                </Button>
              </div>
            </form>
          ))}
        </div>
      </PanelCard>

      <PanelCard
        title="Preset blocks"
        description="Current blocks inside this preset. Reordering is done by ordered ids for now."
        tone="admin"
        contentClassName="space-y-4"
      >
        {detail.blocks.length === 0 ? (
          <EmptyState
            icon="blocks"
            title="No blocks in this preset yet"
            description="Add a starter block above to begin composing this preset."
          />
        ) : (
          <div className="space-y-4">
            <PanelCard title="Block order" tone="muted" density="compact">
              <form action={reorderLessonBlockPresetBlocksAction} className="space-y-3">
                <input type="hidden" name="presetId" value={detail.preset.id} />
                <FormField label="Ordered preset block ids">
                  <Textarea
                    name="orderedPresetBlockIds"
                    rows={3}
                    defaultValue={detail.blocks.map((block) => block.id).join(",")}
                    className="font-mono"
                  />
                </FormField>
                <Button type="submit" variant="secondary" icon="save">
                  Save block order
                </Button>
              </form>
            </PanelCard>

            {detail.blocks.map((block) => (
              <PanelCard
                key={block.id}
                title={getLessonBlockLabel(block.block_type)}
                tone="default"
                density="compact"
                contentClassName="space-y-4"
                actions={
                  <>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${getLessonBlockAccentClass(
                        block.block_type
                      )}`}
                    >
                      {getLessonBlockGroupLabel(block.block_type)}
                    </span>
                    <Badge tone="muted" icon="help">
                      Position {block.position}
                    </Badge>
                    <Badge
                      tone={block.is_active ? "success" : "warning"}
                      icon={block.is_active ? "completed" : "pending"}
                    >
                      {block.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </>
                }
              >
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/60 px-3 py-2 text-sm app-text-muted">
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

                  <CheckboxField
                    name="isActive"
                    label="Active"
                    defaultChecked={block.is_active}
                  />

                  <InlineActions>
                    <Button type="submit" variant="secondary" icon="save">
                      Save block
                    </Button>
                  </InlineActions>
                </form>

                <form action={deleteLessonBlockPresetBlockAction} className="mt-3">
                  <input type="hidden" name="presetId" value={detail.preset!.id} />
                  <input type="hidden" name="presetBlockId" value={block.id} />
                  <Button type="submit" variant="danger" icon="delete">
                    Delete block
                  </Button>
                </form>
              </PanelCard>
            ))}
          </div>
        )}
      </PanelCard>
    </main>
  );
}

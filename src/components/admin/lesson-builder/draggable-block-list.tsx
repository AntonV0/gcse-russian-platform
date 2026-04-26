"use client";

import { useState, useTransition } from "react";
import {
  duplicateBlockAction,
  moveBlockAction,
  reorderBlocksAction,
  toggleBlockPublishedAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import type {
  DragBlockState,
  LessonBlock,
  LessonSection,
  RouteFields,
} from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  Badge,
  BuilderHiddenFields,
  buildLessonBuilderRouteFormData,
  BUILDER_MUTED_INFO_BOX_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import {
  getLessonBlockGroupLabel,
  getLessonBlockLabel,
  getLessonBlockPreview,
} from "@/lib/lessons/lesson-blocks";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import AppIcon from "@/components/ui/app-icon";
import IconButton from "@/components/ui/icon-button";
import type { AppIconKey } from "@/lib/shared/icons";

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getBlockGroupTone(
  blockType: string
): "default" | "success" | "muted" | "warning" | "info" {
  const groupLabel = getLessonBlockGroupLabel(blockType).toLowerCase();

  if (groupLabel.includes("practice")) return "warning";
  if (groupLabel.includes("media")) return "muted";
  if (groupLabel.includes("structure")) return "muted";
  if (groupLabel.includes("teaching")) return "info";

  return "default";
}

function BlockIconButton({
  icon,
  ariaLabel,
  title,
  disabled,
}: {
  icon: AppIconKey;
  ariaLabel: string;
  title: string;
  disabled?: boolean;
}) {
  return (
    <IconButton
      type="submit"
      icon={icon}
      label={ariaLabel}
      title={title}
      disabled={disabled}
      variant="secondary"
      size="sm"
      className="h-10 w-10 rounded-lg sm:h-8 sm:w-8"
    />
  );
}

export default function DraggableBlockList(props: {
  section: LessonSection;
  filteredBlocks: LessonBlock[];
  routeFields: RouteFields;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  onBlockDragStart: (payload: { blockId: string; sourceSectionId: string }) => void;
  onBlockDragEnd: () => void;
}) {
  const [dragBlock, setDragBlock] = useState<DragBlockState>(null);
  const [dropTargetBlockId, setDropTargetBlockId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submitBlockOrder(sourceBlockId: string, targetBlockId: string) {
    if (sourceBlockId === targetBlockId) return;

    const reordered = [...props.section.blocks];
    const sourceIndex = reordered.findIndex((block) => block.id === sourceBlockId);
    const targetIndex = reordered.findIndex((block) => block.id === targetBlockId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const formData = buildLessonBuilderRouteFormData(props.routeFields, {
      sectionId: props.section.id,
      orderedBlockIds: reordered.map((block) => block.id).join(","),
    });

    startTransition(async () => {
      await reorderBlocksAction(formData);
    });
  }

  return (
    <div className="dev-marker-host relative space-y-2">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="DraggableBlockList"
          filePath="src/components/admin/lesson-builder/draggable-block-list.tsx"
          tier="semantic"
          componentRole="Sortable lesson block list with selection, duplicate, publish, and move controls"
          bestFor="Admin lesson builder sections where existing blocks need ordering and quick block-level actions."
          usageExamples={[
            "Admin lesson builder",
            "Reordering lesson blocks",
            "Selecting blocks for inspector editing",
            "Publishing draft block content",
          ]}
          notes="Use for block ordering inside a selected lesson section. Do not use it for section ordering or generic sortable lists."
        />
      ) : null}

      {isPending ? (
        <div className={BUILDER_MUTED_INFO_BOX_CLASS}>Saving block order...</div>
      ) : null}

      {props.filteredBlocks.map((block) => {
        const blockIndex = props.section.blocks.findIndex((item) => item.id === block.id);
        const isSelected = block.id === props.selectedBlockId;
        const isDropTarget = dropTargetBlockId === block.id;

        return (
          <div
            key={block.id}
            draggable={!isPending}
            onDragStart={() => {
              setDragBlock({ blockId: block.id });
              props.onBlockDragStart({
                blockId: block.id,
                sourceSectionId: props.section.id,
              });
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDropTargetBlockId(block.id);
            }}
            onDragLeave={() => {
              if (dropTargetBlockId === block.id) {
                setDropTargetBlockId(null);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();

              if (dragBlock?.blockId) {
                submitBlockOrder(dragBlock.blockId, block.id);
              }

              setDragBlock(null);
              setDropTargetBlockId(null);
              props.onBlockDragEnd();
            }}
            onDragEnd={() => {
              setDragBlock(null);
              setDropTargetBlockId(null);
              props.onBlockDragEnd();
            }}
            className={[
              "overflow-hidden rounded-[1rem] border transition-[border-color,box-shadow,background-color,transform]",
              isSelected
                ? "border-[var(--accent-selected-border)] [background:var(--accent-gradient-selected)] shadow-[0_10px_24px_color-mix(in_srgb,var(--accent)_16%,transparent)]"
                : "border-[var(--border)] bg-[var(--background-elevated)] shadow-[0_1px_2px_rgba(16,32,51,0.04)] hover:-translate-y-[1px] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)]/35 hover:shadow-[0_8px_18px_rgba(16,32,51,0.06)]",
              isDropTarget
                ? "ring-2 ring-[color-mix(in_srgb,var(--accent)_36%,transparent)]"
                : "",
              isPending ? "opacity-70" : "",
            ].join(" ")}
          >
            <div className="flex flex-col items-start gap-3 px-3 py-3 sm:flex-row sm:gap-2 sm:py-2.5">
              <button
                type="button"
                onClick={() => props.onSelectBlock(isSelected ? null : block.id)}
                className="min-w-0 flex-1 text-left"
              >
                <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center text-[var(--text-muted)]"
                    aria-hidden="true"
                  >
                    <AppIcon icon="reorder" size={14} />
                  </span>

                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {block.position}. {getLessonBlockLabel(block.block_type)}
                  </span>

                  <Badge tone={getBlockGroupTone(block.block_type)}>
                    {getLessonBlockGroupLabel(block.block_type)}
                  </Badge>

                  <Badge
                    tone={block.is_published ? "success" : "warning"}
                    icon={block.is_published ? "published" : "draft"}
                  >
                    {block.is_published ? "Published" : "Draft"}
                  </Badge>

                  {isSelected ? <Badge tone="default">Selected</Badge> : null}
                </div>

                <div className="line-clamp-2 break-words text-sm leading-relaxed app-text-muted">
                  {getLessonBlockPreview(block)}
                </div>
              </button>

              <div className="grid w-full shrink-0 grid-cols-4 gap-1.5 self-start sm:w-auto sm:grid-cols-2">
                <form action={duplicateBlockAction}>
                  <BuilderHiddenFields {...props.routeFields} />
                  <input type="hidden" name="sectionId" value={props.section.id} />
                  <input type="hidden" name="blockId" value={block.id} />
                  <BlockIconButton
                    icon="duplicate"
                    ariaLabel="Duplicate block"
                    title="Duplicate block"
                    disabled={isPending}
                  />
                </form>

                <form action={moveBlockAction}>
                  <BuilderHiddenFields {...props.routeFields} />
                  <input type="hidden" name="sectionId" value={props.section.id} />
                  <input type="hidden" name="blockId" value={block.id} />
                  <input type="hidden" name="direction" value="up" />
                  <BlockIconButton
                    icon="up"
                    ariaLabel="Move block up"
                    title="Move block up"
                    disabled={blockIndex === 0 || isPending}
                  />
                </form>

                <form action={toggleBlockPublishedAction}>
                  <BuilderHiddenFields {...props.routeFields} />
                  <input type="hidden" name="blockId" value={block.id} />
                  <input
                    type="hidden"
                    name="nextState"
                    value={block.is_published ? "draft" : "published"}
                  />
                  <BlockIconButton
                    icon={block.is_published ? "hidden" : "preview"}
                    ariaLabel={block.is_published ? "Unpublish block" : "Publish block"}
                    title={block.is_published ? "Unpublish block" : "Publish block"}
                    disabled={isPending}
                  />
                </form>

                <form action={moveBlockAction}>
                  <BuilderHiddenFields {...props.routeFields} />
                  <input type="hidden" name="sectionId" value={props.section.id} />
                  <input type="hidden" name="blockId" value={block.id} />
                  <input type="hidden" name="direction" value="down" />
                  <BlockIconButton
                    icon="down"
                    ariaLabel="Move block down"
                    title="Move block down"
                    disabled={blockIndex === props.section.blocks.length - 1 || isPending}
                  />
                </form>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

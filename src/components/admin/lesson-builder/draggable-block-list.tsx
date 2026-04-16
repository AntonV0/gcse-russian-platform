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
  DragHandle,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import {
  getLessonBlockAccentClass,
  getLessonBlockGroupLabel,
  getLessonBlockLabel,
  getLessonBlockPreview,
} from "@/lib/lesson-blocks";

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

    const formData = new FormData();
    formData.set("courseId", props.routeFields.courseId);
    formData.set("variantId", props.routeFields.variantId);
    formData.set("moduleId", props.routeFields.moduleId);
    formData.set("lessonId", props.routeFields.lessonId);
    formData.set("courseSlug", props.routeFields.courseSlug);
    formData.set("variantSlug", props.routeFields.variantSlug);
    formData.set("moduleSlug", props.routeFields.moduleSlug);
    formData.set("lessonSlug", props.routeFields.lessonSlug);
    formData.set("sectionId", props.section.id);
    formData.set("orderedBlockIds", reordered.map((block) => block.id).join(","));

    startTransition(async () => {
      await reorderBlocksAction(formData);
    });
  }

  return (
    <div className="space-y-3">
      {isPending ? (
        <div className="rounded-xl border bg-blue-50 px-3 py-2 text-sm text-blue-700">
          Saving block order...
        </div>
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
            className={`rounded-xl border transition-shadow transition-colors ${
              isSelected ? "border-black bg-gray-50" : "bg-white"
            } ${isDropTarget ? "ring-2 ring-blue-300 shadow-md" : ""} ${
              isPending ? "opacity-70" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => props.onSelectBlock(isSelected ? null : block.id)}
              className="w-full px-4 py-4 text-left"
            >
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 space-y-2">
                  <DragHandle
                    label="Drag block"
                    tone={isDropTarget ? "active" : "default"}
                  />

                  <div className="flex flex-wrap items-center gap-2">
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

                    <Badge tone={block.is_published ? "success" : "warning"}>
                      {block.is_published ? "Published" : "Draft"}
                    </Badge>

                    <Badge tone="muted">Position {block.position}</Badge>

                    {isSelected ? <Badge tone="default">Selected</Badge> : null}
                  </div>

                  <div className="text-sm text-gray-600 line-clamp-2 break-words">
                    {getLessonBlockPreview(block)}
                  </div>
                </div>
              </div>
            </button>

            {isSelected ? (
              <div className="border-t px-3 py-3">
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <form action={moveBlockAction}>
                    <BuilderHiddenFields {...props.routeFields} />
                    <input type="hidden" name="sectionId" value={props.section.id} />
                    <input type="hidden" name="blockId" value={block.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={blockIndex === 0 || isPending}
                      className="w-full rounded-lg border px-2 py-2 text-xs disabled:opacity-50 hover:bg-white"
                    >
                      Move up
                    </button>
                  </form>

                  <form action={moveBlockAction}>
                    <BuilderHiddenFields {...props.routeFields} />
                    <input type="hidden" name="sectionId" value={props.section.id} />
                    <input type="hidden" name="blockId" value={block.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={
                        blockIndex === props.section.blocks.length - 1 || isPending
                      }
                      className="w-full rounded-lg border px-2 py-2 text-xs disabled:opacity-50 hover:bg-white"
                    >
                      Move down
                    </button>
                  </form>

                  <form action={duplicateBlockAction}>
                    <BuilderHiddenFields {...props.routeFields} />
                    <input type="hidden" name="sectionId" value={props.section.id} />
                    <input type="hidden" name="blockId" value={block.id} />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full rounded-lg border px-2 py-2 text-xs hover:bg-white"
                    >
                      Duplicate
                    </button>
                  </form>

                  <form action={toggleBlockPublishedAction}>
                    <BuilderHiddenFields {...props.routeFields} />
                    <input type="hidden" name="blockId" value={block.id} />
                    <input
                      type="hidden"
                      name="nextState"
                      value={block.is_published ? "draft" : "published"}
                    />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full rounded-lg border px-2 py-2 text-xs hover:bg-white"
                    >
                      {block.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

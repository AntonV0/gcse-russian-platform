"use client";

import { useEffect, useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Copy, Eye, EyeOff, GripVertical } from "lucide-react";
import {
  duplicateSectionAction,
  moveBlockToSectionAction,
  moveSectionAction,
  reorderSectionsAction,
  toggleSectionPublishedAction,
} from "@/app/actions/admin/admin-lesson-builder-actions";
import type {
  DragSectionState,
  DraggedBlockContext,
  LessonSection,
  RouteFields,
} from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  Badge,
  BuilderHiddenFields,
  BUILDER_DASHED_EMPTY_STATE_CLASS,
  BUILDER_FIELD_CLASS,
  buildLessonBuilderRouteFormData,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import {
  getVariantVisibilityMeta,
  SidebarIconButton,
} from "./sidebar-primitives";

type SectionListProps = {
  sections: LessonSection[];
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  routeFields: RouteFields;
  sectionSearch: string;
  onSectionSearchChange: (value: string) => void;
  draggedBlockContext: DraggedBlockContext;
  onBlockDropComplete: () => void;
};

export function SectionList(props: SectionListProps) {
  const normalizedQuery = props.sectionSearch.trim().toLowerCase();
  const [dragSection, setDragSection] = useState<DragSectionState>(null);
  const [dropTargetSectionId, setDropTargetSectionId] = useState<string | null>(null);
  const [blockDropTargetSectionId, setBlockDropTargetSectionId] = useState<string | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const filteredSections = props.sections.filter((section) => {
    if (!normalizedQuery) return true;

    return (
      section.title.toLowerCase().includes(normalizedQuery) ||
      section.section_kind.toLowerCase().includes(normalizedQuery) ||
      String(section.position).includes(normalizedQuery) ||
      getVariantVisibilityMeta(section.variant_visibility)
        .label.toLowerCase()
        .includes(normalizedQuery)
    );
  });

  useEffect(() => {
    if (!props.selectedSectionId) return;
    const element = document.getElementById(`sidebar-section-${props.selectedSectionId}`);
    element?.scrollIntoView({ block: "nearest" });
  }, [props.selectedSectionId]);

  function submitSectionOrder(sourceSectionId: string, targetSectionId: string) {
    if (sourceSectionId === targetSectionId) return;

    const reordered = [...props.sections];
    const sourceIndex = reordered.findIndex((section) => section.id === sourceSectionId);
    const targetIndex = reordered.findIndex((section) => section.id === targetSectionId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const formData = buildLessonBuilderRouteFormData(props.routeFields, {
      orderedSectionIds: reordered.map((section) => section.id).join(","),
    });

    startTransition(async () => {
      await reorderSectionsAction(formData);
    });
  }

  function submitBlockMove(targetSectionId: string) {
    if (!props.draggedBlockContext) return;
    if (props.draggedBlockContext.sourceSectionId === targetSectionId) return;

    const formData = buildLessonBuilderRouteFormData(props.routeFields, {
      blockId: props.draggedBlockContext.blockId,
      sourceSectionId: props.draggedBlockContext.sourceSectionId,
      targetSectionId,
    });

    startTransition(async () => {
      await moveBlockToSectionAction(formData);
      props.onBlockDropComplete();
    });
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <input
          value={props.sectionSearch}
          onChange={(event) => props.onSectionSearchChange(event.target.value)}
          placeholder="Search sections..."
          className={BUILDER_FIELD_CLASS}
        />

        <div className="text-xs app-text-soft">
          Showing {filteredSections.length} of {props.sections.length} section
          {props.sections.length === 1 ? "" : "s"}
          {isPending ? " - Saving..." : ""}
        </div>
      </div>

      {props.sections.length === 0 ? (
        <div className={BUILDER_DASHED_EMPTY_STATE_CLASS}>No sections yet.</div>
      ) : filteredSections.length === 0 ? (
        <div className={BUILDER_DASHED_EMPTY_STATE_CLASS}>
          No sections match your search.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSections.map((section) => {
            const actualIndex = props.sections.findIndex(
              (item) => item.id === section.id
            );
            const isSelected = section.id === props.selectedSectionId;
            const isSectionDropTarget = dropTargetSectionId === section.id;
            const isBlockDropTarget = blockDropTargetSectionId === section.id;
            const canAcceptDraggedBlock =
              !!props.draggedBlockContext &&
              props.draggedBlockContext.sourceSectionId !== section.id;

            const visibilityMeta = getVariantVisibilityMeta(section.variant_visibility);

            return (
              <div
                key={section.id}
                id={`sidebar-section-${section.id}`}
                draggable={!isPending && !props.draggedBlockContext}
                onDragStart={() => {
                  if (!props.draggedBlockContext) {
                    setDragSection({ sectionId: section.id });
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault();

                  if (props.draggedBlockContext) {
                    if (canAcceptDraggedBlock) {
                      setBlockDropTargetSectionId(section.id);
                    }
                  } else {
                    setDropTargetSectionId(section.id);
                  }
                }}
                onDragLeave={() => {
                  if (dropTargetSectionId === section.id) {
                    setDropTargetSectionId(null);
                  }
                  if (blockDropTargetSectionId === section.id) {
                    setBlockDropTargetSectionId(null);
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();

                  if (props.draggedBlockContext) {
                    if (canAcceptDraggedBlock) {
                      submitBlockMove(section.id);
                    }
                  } else if (dragSection?.sectionId) {
                    submitSectionOrder(dragSection.sectionId, section.id);
                  }

                  setDragSection(null);
                  setDropTargetSectionId(null);
                  setBlockDropTargetSectionId(null);
                }}
                onDragEnd={() => {
                  setDragSection(null);
                  setDropTargetSectionId(null);
                  setBlockDropTargetSectionId(null);
                }}
                className={[
                  "overflow-hidden rounded-[1rem] border transition-[border-color,box-shadow,background-color,transform]",
                  isSelected
                    ? "border-[var(--brand-blue)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand-blue)_18%,transparent)_0%,var(--background-elevated)_100%)] shadow-[0_8px_18px_color-mix(in_srgb,var(--brand-blue)_18%,transparent)]"
                    : "border-[var(--border)] bg-[var(--background-elevated)] shadow-[0_1px_2px_rgba(16,32,51,0.04)] hover:-translate-y-[1px] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)]/35 hover:shadow-[0_8px_18px_rgba(16,32,51,0.06)]",
                  isSectionDropTarget
                    ? "ring-2 ring-[color-mix(in_srgb,var(--accent)_36%,transparent)]"
                    : "",
                  isBlockDropTarget ? "ring-2 ring-green-300" : "",
                  isPending ? "opacity-70" : "",
                ].join(" ")}
              >
                <div className="flex items-start gap-2 px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => props.onSelectSection(section.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                      <span
                        className="inline-flex h-5 w-5 items-center justify-center text-[var(--text-muted)]"
                        aria-hidden="true"
                      >
                        <GripVertical size={14} />
                      </span>

                      <Badge tone={section.is_published ? "success" : "warning"}>
                        {section.is_published ? "Published" : "Draft"}
                      </Badge>

                      <Badge tone={visibilityMeta.tone}>{visibilityMeta.short}</Badge>
                    </div>

                    <div className="min-h-[2.5rem] flex items-start gap-1 text-sm font-semibold text-[var(--text-primary)]">
                      <span className="shrink-0">{section.position}.</span>
                      <span className="line-clamp-2 min-w-0">{section.title}</span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--background-muted)] px-2 py-0.5 text-[var(--text-secondary)]">
                        {section.blocks.length} block
                        {section.blocks.length === 1 ? "" : "s"}
                      </span>
                      <span className="rounded-full border border-[var(--border)] bg-[var(--background-muted)] px-2 py-0.5 text-[var(--text-secondary)] break-words">
                        {section.section_kind}
                      </span>
                    </div>

                    {isSelected && section.canonical_section_key ? (
                      <div className="mt-1.5 text-[11px] app-text-soft">
                        Key: {section.canonical_section_key}
                      </div>
                    ) : null}

                    {isBlockDropTarget ? (
                      <div className="mt-1.5 text-xs font-medium text-green-700">
                        Drop block here
                      </div>
                    ) : null}
                  </button>

                  <div className="flex shrink-0 flex-col items-end gap-1.5 self-start">
                    <div className="mb-1 flex items-center gap-1.5">
                      <form action={duplicateSectionAction} className="block">
                        <BuilderHiddenFields {...props.routeFields} />
                        <input type="hidden" name="sectionId" value={section.id} />
                        <SidebarIconButton
                          ariaLabel="Duplicate section"
                          title="Duplicate section"
                          disabled={isPending || !!props.draggedBlockContext}
                        >
                          <Copy size={13} />
                        </SidebarIconButton>
                      </form>

                      <form action={toggleSectionPublishedAction} className="block">
                        <BuilderHiddenFields {...props.routeFields} />
                        <input type="hidden" name="sectionId" value={section.id} />
                        <input
                          type="hidden"
                          name="nextState"
                          value={section.is_published ? "draft" : "published"}
                        />
                        <SidebarIconButton
                          ariaLabel={
                            section.is_published
                              ? "Unpublish section"
                              : "Publish section"
                          }
                          title={
                            section.is_published
                              ? "Unpublish section"
                              : "Publish section"
                          }
                          disabled={isPending || !!props.draggedBlockContext}
                        >
                          {section.is_published ? (
                            <EyeOff size={13} />
                          ) : (
                            <Eye size={13} />
                          )}
                        </SidebarIconButton>
                      </form>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <form action={moveSectionAction} className="block">
                        <BuilderHiddenFields {...props.routeFields} />
                        <input type="hidden" name="sectionId" value={section.id} />
                        <input type="hidden" name="direction" value="up" />
                        <SidebarIconButton
                          ariaLabel="Move section up"
                          title="Move section up"
                          disabled={
                            actualIndex === 0 ||
                            isPending ||
                            !!props.draggedBlockContext
                          }
                        >
                          <ChevronUp size={14} />
                        </SidebarIconButton>
                      </form>

                      <form action={moveSectionAction} className="block">
                        <BuilderHiddenFields {...props.routeFields} />
                        <input type="hidden" name="sectionId" value={section.id} />
                        <input type="hidden" name="direction" value="down" />
                        <SidebarIconButton
                          ariaLabel="Move section down"
                          title="Move section down"
                          disabled={
                            actualIndex === props.sections.length - 1 ||
                            isPending ||
                            !!props.draggedBlockContext
                          }
                        >
                          <ChevronDown size={14} />
                        </SidebarIconButton>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

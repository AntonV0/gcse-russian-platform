"use client";

import { useEffect, useState, useTransition } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  createSectionAction,
  duplicateSectionAction,
  insertSectionTemplateAction,
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
import { SECTION_KIND_OPTIONS } from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  Badge,
  BuilderHiddenFields,
  DragHandle,
  Panel,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_DASHED_EMPTY_STATE_CLASS,
  BUILDER_FIELD_CLASS,
  BUILDER_PRIMARY_BUTTON_CLASS,
  BUILDER_SECONDARY_BUTTON_CLASS,
  BUILDER_SELECT_CLASS,
  buildLessonBuilderRouteFormData,
} from "@/components/admin/lesson-builder/lesson-builder-ui";

const VARIANT_VISIBILITY_OPTIONS = [
  { value: "shared", label: "Shared" },
  { value: "foundation_only", label: "Foundation only" },
  { value: "higher_only", label: "Higher only" },
  { value: "volna_only", label: "Volna only" },
] as const;

function formatVariantVisibility(value: LessonSection["variant_visibility"]) {
  return (
    VARIANT_VISIBILITY_OPTIONS.find((option) => option.value === value)?.label ?? value
  );
}

export default function LessonSectionSidebar(props: {
  sections: LessonSection[];
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  routeFields: RouteFields;
  sectionSearch: string;
  onSectionSearchChange: (value: string) => void;
  draggedBlockContext: DraggedBlockContext;
  onBlockDropComplete: () => void;
  sectionTemplateOptions: {
    id: string;
    label: string;
    description: string;
    defaultSectionTitle: string;
    defaultSectionKind: string;
    presetCount: number;
  }[];
}) {
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
      formatVariantVisibility(section.variant_visibility)
        .toLowerCase()
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
    <div className="space-y-4">
      <Panel title="Sections" description="Select a section to focus the editor.">
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
              {isPending ? " · Saving..." : ""}
            </div>
          </div>

          {props.sections.length === 0 ? (
            <div className={BUILDER_DASHED_EMPTY_STATE_CLASS}>No sections yet.</div>
          ) : filteredSections.length === 0 ? (
            <div className={BUILDER_DASHED_EMPTY_STATE_CLASS}>
              No sections match your search.
            </div>
          ) : (
            filteredSections.map((section) => {
              const actualIndex = props.sections.findIndex(
                (item) => item.id === section.id
              );
              const isSelected = section.id === props.selectedSectionId;
              const isSectionDropTarget = dropTargetSectionId === section.id;
              const isBlockDropTarget = blockDropTargetSectionId === section.id;
              const canAcceptDraggedBlock =
                !!props.draggedBlockContext &&
                props.draggedBlockContext.sourceSectionId !== section.id;

              const publishedBlockCount = section.blocks.filter(
                (block) => block.is_published
              ).length;

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
                    "overflow-hidden rounded-[1.25rem] border transition-[border-color,box-shadow,background-color,transform]",
                    isSelected
                      ? "border-[var(--brand-blue)] bg-[linear-gradient(135deg,rgba(37,99,235,0.08)_0%,rgba(255,255,255,0.98)_100%)] shadow-[0_14px_28px_rgba(37,99,235,0.12)]"
                      : "border-[var(--border)] bg-[var(--background-elevated)] shadow-[0_1px_2px_rgba(16,32,51,0.04)] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)]/35 hover:shadow-[0_12px_24px_rgba(16,32,51,0.08)]",
                    isSectionDropTarget ? "ring-2 ring-blue-300" : "",
                    isBlockDropTarget ? "ring-2 ring-green-300" : "",
                    isPending ? "opacity-70" : "",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3 px-4 py-4">
                    <button
                      type="button"
                      onClick={() => props.onSelectSection(section.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <DragHandle
                          label={
                            props.draggedBlockContext ? "Drop block here" : "Drag section"
                          }
                          tone={
                            isBlockDropTarget || isSectionDropTarget
                              ? "active"
                              : "default"
                          }
                        />

                        <Badge tone={section.is_published ? "success" : "warning"}>
                          {section.is_published ? "Published" : "Draft"}
                        </Badge>

                        <Badge tone="muted">
                          {formatVariantVisibility(section.variant_visibility)}
                        </Badge>
                      </div>

                      <div className="font-semibold text-[var(--text-primary)]">
                        {section.position}. {section.title}
                      </div>

                      <div className="mt-1 text-xs app-text-soft">
                        {section.section_kind}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                        <span className="rounded-full border border-[var(--border)] bg-[var(--background-muted)] px-2.5 py-1 text-[var(--text-secondary)]">
                          {publishedBlockCount}/{section.blocks.length} block(s) published
                        </span>
                        {section.canonical_section_key ? (
                          <span className="rounded-full border border-[var(--border)] bg-[var(--background-muted)] px-2.5 py-1 text-[var(--text-secondary)]">
                            Shared key
                          </span>
                        ) : null}
                      </div>

                      {section.canonical_section_key ? (
                        <div className="mt-2 text-[11px] app-text-soft">
                          {section.canonical_section_key}
                        </div>
                      ) : null}

                      {isBlockDropTarget ? (
                        <div className="mt-2 text-xs font-medium text-green-700">
                          Drop block here to move it into this section
                        </div>
                      ) : null}
                    </button>

                    <div className="flex flex-col gap-2">
                      <form action={moveSectionAction}>
                        <BuilderHiddenFields {...props.routeFields} />
                        <input type="hidden" name="sectionId" value={section.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button
                          type="submit"
                          disabled={
                            actualIndex === 0 || isPending || !!props.draggedBlockContext
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-primary)] shadow-[0_1px_2px_rgba(16,32,51,0.04)] hover:bg-[var(--background-muted)] disabled:opacity-50"
                          aria-label="Move section up"
                          title="Move section up"
                        >
                          <ChevronUp size={16} />
                        </button>
                      </form>

                      <form action={moveSectionAction}>
                        <BuilderHiddenFields {...props.routeFields} />
                        <input type="hidden" name="sectionId" value={section.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button
                          type="submit"
                          disabled={
                            actualIndex === props.sections.length - 1 ||
                            isPending ||
                            !!props.draggedBlockContext
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-primary)] shadow-[0_1px_2px_rgba(16,32,51,0.04)] hover:bg-[var(--background-muted)] disabled:opacity-50"
                          aria-label="Move section down"
                          title="Move section down"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="border-t border-[var(--border)] px-3 py-3">
                    <div className="grid grid-cols-2 gap-2">
                      <form action={duplicateSectionAction}>
                        <BuilderHiddenFields {...props.routeFields} />
                        <input type="hidden" name="sectionId" value={section.id} />
                        <button
                          type="submit"
                          disabled={isPending || !!props.draggedBlockContext}
                          className={`w-full ${BUILDER_SECONDARY_BUTTON_CLASS} text-xs`}
                        >
                          Duplicate
                        </button>
                      </form>

                      <form action={toggleSectionPublishedAction}>
                        <BuilderHiddenFields {...props.routeFields} />
                        <input type="hidden" name="sectionId" value={section.id} />
                        <input
                          type="hidden"
                          name="nextState"
                          value={section.is_published ? "draft" : "published"}
                        />
                        <button
                          type="submit"
                          disabled={isPending || !!props.draggedBlockContext}
                          className={`w-full ${BUILDER_SECONDARY_BUTTON_CLASS} text-xs`}
                        >
                          {section.is_published ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Panel>

      <Panel
        title="Section templates"
        description="Insert a ready-made section with starter blocks."
      >
        <div className="grid gap-3">
          {props.sectionTemplateOptions.length === 0 ? (
            <div className={BUILDER_DASHED_EMPTY_STATE_CLASS}>
              No DB section templates found yet.
            </div>
          ) : (
            props.sectionTemplateOptions.map((template) => (
              <form
                key={template.id}
                action={insertSectionTemplateAction}
                className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/45 p-4"
              >
                <BuilderHiddenFields {...props.routeFields} />
                <input type="hidden" name="templateId" value={template.id} />

                <div className="mb-2">
                  <div className="font-semibold text-[var(--text-primary)]">
                    {template.label}
                  </div>
                  <div className="text-sm app-text-muted">{template.description}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs app-text-soft">
                    <span>{template.defaultSectionTitle}</span>
                    <span>·</span>
                    <span>{template.defaultSectionKind}</span>
                    <span>·</span>
                    <span>
                      {template.presetCount} preset{template.presetCount === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <PendingSubmitButton
                    idleLabel="Insert section template"
                    pendingLabel="Inserting section template..."
                    className={BUILDER_SECONDARY_BUTTON_CLASS}
                  />
                  <PendingStatusText pendingText="Creating the section and starter blocks..." />
                </div>
              </form>
            ))
          )}
        </div>
      </Panel>

      <Panel title="Add section" description="Create a section first, then add blocks.">
        <form action={createSectionAction} className="space-y-3">
          <BuilderHiddenFields {...props.routeFields} />

          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--text-primary)]">
              Section title
            </label>
            <input
              name="title"
              required
              placeholder="Introduction"
              className={BUILDER_FIELD_CLASS}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--text-primary)]">
              Description
            </label>
            <input
              name="description"
              placeholder="Optional short description"
              className={BUILDER_FIELD_CLASS}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--text-primary)]">
              Section kind
            </label>
            <select
              name="sectionKind"
              defaultValue="content"
              className={BUILDER_SELECT_CLASS}
            >
              {SECTION_KIND_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--text-primary)]">
              Variant visibility
            </label>
            <select
              name="variantVisibility"
              defaultValue="shared"
              className={BUILDER_SELECT_CLASS}
            >
              {VARIANT_VISIBILITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--text-primary)]">
              Canonical section key
            </label>
            <input
              name="canonicalSectionKey"
              placeholder="Optional shared progress key"
              className={BUILDER_FIELD_CLASS}
            />
          </div>

          <div className="space-y-2">
            <PendingSubmitButton
              idleLabel="Add section"
              pendingLabel="Adding section..."
              className={`w-full ${BUILDER_PRIMARY_BUTTON_CLASS}`}
            />
            <PendingStatusText pendingText="Creating section..." />
          </div>
        </form>
      </Panel>
    </div>
  );
}

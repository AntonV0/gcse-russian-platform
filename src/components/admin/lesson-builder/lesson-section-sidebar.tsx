"use client";

import { useEffect, useState, useTransition } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";
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
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_DASHED_EMPTY_STATE_CLASS,
  BUILDER_FIELD_CLASS,
  BUILDER_PRIMARY_BUTTON_CLASS,
  BUILDER_SELECT_CLASS,
  buildLessonBuilderRouteFormData,
} from "@/components/admin/lesson-builder/lesson-builder-ui";

const VARIANT_VISIBILITY_OPTIONS = [
  { value: "shared", label: "Shared", short: "S", tone: "muted" as const },
  {
    value: "foundation_only",
    label: "Foundation only",
    short: "F",
    tone: "info" as const,
  },
  {
    value: "higher_only",
    label: "Higher only",
    short: "H",
    tone: "warning" as const,
  },
  {
    value: "volna_only",
    label: "Volna only",
    short: "V",
    tone: "success" as const,
  },
] as const;

function getVariantVisibilityMeta(value: LessonSection["variant_visibility"]) {
  return (
    VARIANT_VISIBILITY_OPTIONS.find((option) => option.value === value) ?? {
      value,
      label: value,
      short: value,
      tone: "muted" as const,
    }
  );
}

function SidebarIconButton(props: {
  children: React.ReactNode;
  ariaLabel: string;
  title: string;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={props.type ?? "submit"}
      aria-label={props.ariaLabel}
      title={props.title}
      disabled={props.disabled}
      className={[
        "flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-primary)] shadow-[0_1px_2px_rgba(16,32,51,0.04)] transition-[background-color,border-color,box-shadow] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)] disabled:opacity-50",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {props.children}
    </button>
  );
}

function SidebarDisclosure(props: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  count?: number;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(props.defaultOpen ?? false);

  return (
    <div className="overflow-hidden rounded-[1rem] border border-[var(--border)] bg-[var(--background-elevated)] shadow-[0_1px_2px_rgba(16,32,51,0.04)]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-start justify-between gap-3 px-3 py-3 text-left transition hover:bg-[var(--background-muted)]/45"
        aria-expanded={isOpen}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {props.title}
            </span>
            {typeof props.count === "number" ? (
              <span className="rounded-full border border-[var(--border)] bg-[var(--background-muted)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">
                {props.count}
              </span>
            ) : null}
          </div>

          {props.description ? (
            <div className="mt-1 text-xs app-text-muted">{props.description}</div>
          ) : null}
        </div>

        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-secondary)]">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>

      {isOpen ? (
        <div className="border-t border-[var(--border)] px-3 pb-3 pt-3">
          {props.children}
        </div>
      ) : null}
    </div>
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
      <SidebarDisclosure
        title="Sections"
        description="Select a section to focus the editor."
        defaultOpen
        count={props.sections.length}
      >
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

                const visibilityMeta = getVariantVisibilityMeta(
                  section.variant_visibility
                );

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
                        ? "border-[var(--brand-blue)] bg-[linear-gradient(135deg,rgba(37,99,235,0.18)_0%,var(--background-elevated)_100%)] shadow-[0_8px_18px_rgba(37,99,235,0.18)]"
                        : "border-[var(--border)] bg-[var(--background-elevated)] shadow-[0_1px_2px_rgba(16,32,51,0.04)] hover:-translate-y-[1px] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)]/35 hover:shadow-[0_8px_18px_rgba(16,32,51,0.06)]",
                      isSectionDropTarget ? "ring-2 ring-blue-300" : "",
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
      </SidebarDisclosure>

      <SidebarDisclosure
        title="Section templates"
        description="Insert a ready-made section with starter blocks."
        count={props.sectionTemplateOptions.length}
        defaultOpen={false}
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
                    className="w-full inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2 text-sm font-medium text-[var(--text-primary)] shadow-[0_1px_2px_rgba(16,32,51,0.04)] transition-[background-color,border-color,box-shadow] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)] disabled:opacity-60"
                  />
                  <PendingStatusText pendingText="Creating the section and starter blocks..." />
                </div>
              </form>
            ))
          )}
        </div>
      </SidebarDisclosure>

      <SidebarDisclosure
        title="Add section"
        description="Create a section first, then add blocks."
        defaultOpen={false}
      >
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
      </SidebarDisclosure>
    </div>
  );
}

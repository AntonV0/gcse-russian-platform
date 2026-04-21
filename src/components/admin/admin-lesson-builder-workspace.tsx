"use client";

import { useEffect, useMemo, useState } from "react";
import { insertLessonTemplateAction } from "@/app/actions/admin/admin-lesson-builder-actions";
import LessonInspectorPanel from "@/components/admin/lesson-builder/lesson-inspector-panel";
import LessonSectionEditor from "@/components/admin/lesson-builder/lesson-section-editor";
import LessonSectionSidebar from "@/components/admin/lesson-builder/lesson-section-sidebar";
import type {
  AdminLessonBuilderProps,
  DraggedBlockContext,
  LessonSection,
  RouteFields,
} from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  getLessonBuilderStorageKey,
  Panel,
  PendingStatusText,
  PendingSubmitButton,
  StatCard,
  ToolbarButton,
  usePersistentBoolean,
  BuilderHiddenFields,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import { getLessonBlockLabel } from "@/lib/lessons/lesson-blocks";

function getSectionCounts(sections: LessonSection[]) {
  let publishedSections = 0;
  let totalBlocks = 0;
  let publishedBlocks = 0;

  for (const section of sections) {
    if (section.is_published) publishedSections += 1;
    totalBlocks += section.blocks.length;

    for (const block of section.blocks) {
      if (block.is_published) publishedBlocks += 1;
    }
  }

  return { publishedSections, totalBlocks, publishedBlocks };
}

function getInitialSelectedSectionId(lessonId: string, sections: LessonSection[]) {
  if (typeof window === "undefined") {
    return sections[0]?.id ?? null;
  }

  const storedSectionId = window.localStorage.getItem(
    getLessonBuilderStorageKey(lessonId, "selected-section-id")
  );

  if (storedSectionId && sections.some((section) => section.id === storedSectionId)) {
    return storedSectionId;
  }

  return sections[0]?.id ?? null;
}

export default function AdminLessonBuilderWorkspace({
  lessonId,
  courseId,
  variantId,
  moduleId,
  lessonSlug,
  courseSlug,
  variantSlug,
  moduleSlug,
  sections,
  templateOptions,
  vocabularySetOptions,
}: AdminLessonBuilderProps) {
  const routeFields: RouteFields = {
    courseId,
    variantId,
    moduleId,
    lessonId,
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug,
  };

  const { publishedSections, totalBlocks, publishedBlocks } = useMemo(
    () => getSectionCounts(sections),
    [sections]
  );

  const [storedSelectedSectionId, setStoredSelectedSectionId] = useState<string | null>(
    () => getInitialSelectedSectionId(lessonId, sections)
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [sectionSearch, setSectionSearch] = useState("");
  const [blockSearch, setBlockSearch] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = usePersistentBoolean(
    getLessonBuilderStorageKey(lessonId, "sidebar-open"),
    true
  );
  const [isInspectorOpen, setIsInspectorOpen] = usePersistentBoolean(
    getLessonBuilderStorageKey(lessonId, "inspector-open"),
    true
  );

  const [draggedBlockContext, setDraggedBlockContext] =
    useState<DraggedBlockContext>(null);

  const selectedSectionId =
    storedSelectedSectionId &&
    sections.some((section) => section.id === storedSelectedSectionId)
      ? storedSelectedSectionId
      : (sections[0]?.id ?? null);

  const selectedSection =
    sections.find((section) => section.id === selectedSectionId) ?? null;

  const selectedBlock =
    selectedSection && selectedBlockId
      ? (selectedSection.blocks.find((block) => block.id === selectedBlockId) ?? null)
      : null;

  const sectionIndex = selectedSection
    ? sections.findIndex((section) => section.id === selectedSection.id)
    : -1;

  const blockIndex = selectedBlock
    ? (selectedSection?.blocks.findIndex((block) => block.id === selectedBlock.id) ?? -1)
    : -1;

  useEffect(() => {
    if (!selectedSectionId) return;

    window.localStorage.setItem(
      getLessonBuilderStorageKey(lessonId, "selected-section-id"),
      selectedSectionId
    );
  }, [lessonId, selectedSectionId]);

  function handleSelectSection(sectionId: string) {
    setStoredSelectedSectionId(sectionId);
    setSelectedBlockId(null);
    setBlockSearch("");
  }

  function handleSelectBlock(blockId: string | null) {
    setSelectedBlockId(blockId);
  }

  function handleJumpToAddBlock() {
    document
      .getElementById("add-block-composer")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const layoutClass = (() => {
    if (isSidebarOpen && isInspectorOpen) {
      return "2xl:grid-cols-[340px_minmax(0,1fr)_340px] xl:grid-cols-[320px_minmax(0,1fr)_320px]";
    }

    if (isSidebarOpen && !isInspectorOpen) {
      return "xl:grid-cols-[340px_minmax(0,1fr)]";
    }

    if (!isSidebarOpen && isInspectorOpen) {
      return "xl:grid-cols-[minmax(0,1fr)_340px]";
    }

    return "xl:grid-cols-[minmax(0,1fr)]";
  })();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <StatCard label="Sections" value={sections.length} />
        <StatCard label="Blocks" value={totalBlocks} />
        <StatCard label="Published sections" value={publishedSections} />
        <StatCard label="Published blocks" value={publishedBlocks} />
      </section>

      <Panel
        title="Lesson templates"
        description="Create several structured sections at once for faster lesson setup."
      >
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {templateOptions.lessonTemplates.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-white px-4 py-8 text-sm text-gray-500">
              No DB lesson templates found yet.
            </div>
          ) : (
            templateOptions.lessonTemplates.map((template) => (
              <form
                key={template.id}
                action={insertLessonTemplateAction}
                className="rounded-xl border p-4"
              >
                <BuilderHiddenFields {...routeFields} />
                <input type="hidden" name="templateId" value={template.id} />

                <div className="mb-2">
                  <div className="font-medium text-gray-900">{template.label}</div>
                  <div className="text-sm text-gray-500">{template.description}</div>
                </div>

                <div className="mb-3 text-xs text-gray-500">
                  {template.sectionsCount} section
                  {template.sectionsCount === 1 ? "" : "s"}
                </div>

                <div className="space-y-2">
                  <PendingSubmitButton
                    idleLabel="Insert lesson template"
                    pendingLabel="Inserting lesson template..."
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                  />
                  <PendingStatusText pendingText="Creating sections and starter blocks..." />
                </div>
              </form>
            ))
          )}
        </div>
      </Panel>

      <section className="sticky top-4 z-10 rounded-2xl border bg-white/95 p-3 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {selectedSection ? `Editing: ${selectedSection.title}` : "Lesson builder"}
            </div>

            <div className="text-xs text-gray-500">
              {selectedSection
                ? `${selectedSection.blocks.length} block(s)${
                    selectedBlock
                      ? ` · Selected block: ${getLessonBlockLabel(selectedBlock.block_type)}`
                      : ""
                  }`
                : "Select a section to begin."}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <ToolbarButton
              onClick={() => setIsSidebarOpen((value) => !value)}
              isActive={isSidebarOpen}
            >
              {isSidebarOpen ? "Hide sections" : "Show sections"}
            </ToolbarButton>

            <ToolbarButton
              onClick={() => setIsInspectorOpen((value) => !value)}
              isActive={isInspectorOpen}
            >
              {isInspectorOpen ? "Hide inspector" : "Show inspector"}
            </ToolbarButton>

            <ToolbarButton
              onClick={() => {
                setSelectedBlockId(null);
                setBlockSearch("");
              }}
            >
              Clear block selection
            </ToolbarButton>

            <ToolbarButton onClick={handleJumpToAddBlock}>
              Jump to add block
            </ToolbarButton>
          </div>
        </div>
      </section>

      <section className={`grid items-start gap-6 ${layoutClass}`}>
        {isSidebarOpen ? (
          <aside className="min-w-0 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 shadow-sm">
              <div className="mb-3">
                <p className="text-xs uppercase tracking-wide app-text-soft">Sections</p>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Lesson structure
                </h3>
              </div>

              <LessonSectionSidebar
                sections={sections}
                selectedSectionId={selectedSectionId}
                onSelectSection={handleSelectSection}
                routeFields={routeFields}
                sectionSearch={sectionSearch}
                onSectionSearchChange={setSectionSearch}
                draggedBlockContext={draggedBlockContext}
                onBlockDropComplete={() => setDraggedBlockContext(null)}
                sectionTemplateOptions={templateOptions.sectionTemplates}
              />
            </div>
          </aside>
        ) : null}

        <div className="min-w-0 space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/30 p-4 md:p-5 xl:p-6">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wide app-text-soft">Builder</p>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Lesson content
              </h2>
            </div>

            <LessonSectionEditor
              section={selectedSection}
              routeFields={routeFields}
              selectedBlockId={selectedBlock?.id ?? null}
              onSelectBlock={handleSelectBlock}
              blockSearch={blockSearch}
              onBlockSearchChange={setBlockSearch}
              onJumpToAddBlock={handleJumpToAddBlock}
              onBlockDragStart={(payload) => setDraggedBlockContext(payload)}
              onBlockDragEnd={() => setDraggedBlockContext(null)}
              templateOptions={templateOptions}
              vocabularySetOptions={vocabularySetOptions}
            />
          </div>
        </div>

        {isInspectorOpen ? (
          <aside className="min-w-0 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 shadow-sm">
              <div className="mb-3">
                <p className="text-xs uppercase tracking-wide app-text-soft">Inspector</p>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Settings
                </h3>
              </div>

              <LessonInspectorPanel
                section={selectedSection}
                block={selectedBlock}
                sections={sections}
                routeFields={routeFields}
                sectionIndex={sectionIndex}
                totalSections={sections.length}
                blockIndex={blockIndex}
                vocabularySetOptions={vocabularySetOptions}
              />
            </div>
          </aside>
        ) : null}
      </section>
    </div>
  );
}

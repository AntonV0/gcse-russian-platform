"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import LessonInspectorPanel from "@/components/admin/lesson-builder/lesson-inspector-panel";
import LessonSectionEditor from "@/components/admin/lesson-builder/lesson-section-editor";
import LessonSectionSidebar from "@/components/admin/lesson-builder/lesson-section-sidebar";
import LessonBuilderWorkspaceOverview from "@/components/admin/lesson-builder/workspace-overview";
import LessonTemplateInserter from "@/components/admin/lesson-builder/workspace-template-inserter";
import LessonBuilderWorkspaceToolbar, {
  getLessonBuilderLayoutClass,
} from "@/components/admin/lesson-builder/workspace-toolbar";
import type {
  AdminLessonBuilderProps,
  DraggedBlockContext,
  RouteFields,
} from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  usePersistentBoolean,
  getLessonBuilderStorageKey,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import { Heading } from "@/components/ui/heading";

const LESSON_BUILDER_STORAGE_EVENT = "gcse-russian-lesson-builder-storage";
const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

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

  const selectedSectionStorageKey = getLessonBuilderStorageKey(
    lessonId,
    "selected-section-id"
  );
  const subscribeToSelectedSectionStorage = useCallback((callback: () => void) => {
    window.addEventListener("storage", callback);
    window.addEventListener(LESSON_BUILDER_STORAGE_EVENT, callback);

    return () => {
      window.removeEventListener("storage", callback);
      window.removeEventListener(LESSON_BUILDER_STORAGE_EVENT, callback);
    };
  }, []);
  const readSelectedSectionStorage = useCallback(() => {
    return window.localStorage.getItem(selectedSectionStorageKey);
  }, [selectedSectionStorageKey]);
  const storedSelectedSectionId = useSyncExternalStore(
    subscribeToSelectedSectionStorage,
    readSelectedSectionStorage,
    () => null
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

  function handleSelectSection(sectionId: string) {
    window.localStorage.setItem(selectedSectionStorageKey, sectionId);
    window.dispatchEvent(new Event(LESSON_BUILDER_STORAGE_EVENT));
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

  const layoutClass = getLessonBuilderLayoutClass({
    isSidebarOpen,
    isInspectorOpen,
  });

  return (
    <div className="dev-marker-host relative space-y-4">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="AdminLessonBuilderWorkspace"
          filePath="src/components/admin/admin-lesson-builder-workspace.tsx"
          tier="layout"
          componentRole="Three-column admin lesson builder workspace with section navigation, content editing, and inspector regions"
          bestFor="CMS lesson authoring where admins need section structure, block editing, templates, and contextual settings in one workspace."
          usageExamples={[
            "Admin lesson builder",
            "Course/module/lesson management",
            "Variant-aware section editing",
            "DB-driven lesson content authoring",
          ]}
          notes="Use as the main lesson builder surface only. Do not reuse it for simple admin forms or read-only lesson previews."
        />
      ) : null}

      <LessonBuilderWorkspaceOverview sections={sections} />

      <LessonTemplateInserter
        routeFields={routeFields}
        lessonTemplates={templateOptions.lessonTemplates}
      />

      <LessonBuilderWorkspaceToolbar
        selectedSection={selectedSection}
        selectedBlock={selectedBlock}
        isSidebarOpen={isSidebarOpen}
        isInspectorOpen={isInspectorOpen}
        onToggleSidebar={() => setIsSidebarOpen((value) => !value)}
        onToggleInspector={() => setIsInspectorOpen((value) => !value)}
        onClearBlockSelection={() => {
          setSelectedBlockId(null);
          setBlockSearch("");
        }}
        onJumpToAddBlock={handleJumpToAddBlock}
      />

      <section className={`grid items-start gap-4 ${layoutClass}`}>
        {isSidebarOpen ? (
          <aside className="min-w-0 lg:sticky lg:top-[calc(var(--site-header-height)+84px)] lg:self-start">
            <div className="app-card p-4">
              <div className="mb-3">
                <p className="text-xs uppercase tracking-wide app-text-soft">Sections</p>
                <Heading level={3} className="text-sm font-semibold text-[var(--text-primary)]">
                  Lesson structure
                </Heading>
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

        <div className="min-w-0">
          <div className="app-surface-strong p-4 md:p-5 xl:p-6">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wide app-text-soft">Builder</p>
              <Heading level={2} className="text-xl font-semibold text-[var(--text-primary)]">
                Lesson content
              </Heading>
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
          <aside
            className={[
              "min-w-0 lg:sticky lg:top-[calc(var(--site-header-height)+84px)] lg:self-start",
              isSidebarOpen && isInspectorOpen ? "lg:col-span-2 xl:col-span-1" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="app-card p-4">
              <div className="mb-3">
                <p className="text-xs uppercase tracking-wide app-text-soft">Inspector</p>
                <Heading level={3} className="text-sm font-semibold text-[var(--text-primary)]">
                  Settings
                </Heading>
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
